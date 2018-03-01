package waitlist

import (
	"bytes"
	"testing"

	"github.com/boltdb/bolt"
	"github.com/go-openapi/swag"
	"github.com/iryonetwork/wwm/gen/waitlist/models"
	uuid "github.com/satori/go.uuid"
)

func initWaitlist(name string) ([]byte, *testStorage) {
	storage := newTestStorage(nil)
	list, err := storage.AddList(name)
	if err != nil {
		panic(err)
	}

	id, _ := uuid.FromString(list.ID)

	return id.Bytes(), storage
}

func TestAddItem(t *testing.T) {
	waitlistID, storage := initWaitlist("room 1")
	defer storage.Close()

	item1 := &models.Item{
		Priority: swag.Int64(1),
	}

	item1, err := storage.AddItem(waitlistID, item1)
	if err != nil {
		t.Fatalf("Expected error to be nil; got '%v'", err)
	}
	if item1.ID == "" {
		t.Fatalf("Expected ID to be set, got an empty string")
	}

	item2 := &models.Item{
		Priority: swag.Int64(1),
	}

	item2, err = storage.AddItem(waitlistID, item2)
	if err != nil {
		t.Fatalf("Expected error to be nil; got '%v'", err)
	}
	if item2.ID == "" {
		t.Fatalf("Expected ID to be set, got an empty string")
	}

	storage.db.View(func(tx *bolt.Tx) error {
		var q [32]byte
		copy(q[:], tx.Bucket(bucketCurrent).Bucket(waitlistID).Get(append(keyQueue, byte(1))))

		id1, _ := uuid.FromString(item1.ID)
		id2, _ := uuid.FromString(item2.ID)

		var expectedQ [32]byte

		copy(expectedQ[:16], id1.Bytes())
		copy(expectedQ[16:], id2.Bytes())

		if q != expectedQ {
			t.Fatalf("Expected queue to be '%v'; got '%v'", expectedQ, q)
		}

		if tx.Bucket(bucketCurrent).Bucket(waitlistID).Get(id1.Bytes()) == nil {
			t.Fatalf("Expected database to have %s stored; got nil", item1.ID)
		}

		if tx.Bucket(bucketCurrent).Bucket(waitlistID).Get(id2.Bytes()) == nil {
			t.Fatalf("Expected database to have %s stored; got nil", item2.ID)
		}

		return nil
	})

	_, err = storage.AddItem(waitlistID, &models.Item{Priority: swag.Int64(0)})
	if err == nil {
		t.Fatalf("Expected error; got nil")
	}
}

func TestListItem(t *testing.T) {
	waitlistID, storage := initWaitlist("room 1")
	defer storage.Close()

	item1, _ := storage.AddItem(waitlistID, &models.Item{Priority: swag.Int64(4)})

	list, err := storage.ListItems(waitlistID)
	if err != nil {
		t.Fatalf("Expected error to be nil; got '%v'", err)
	}
	if list[0].ID != item1.ID {
		t.Fatalf("Expected list item 0 ID to be '%s', got '%s'", item1.ID, list[0].ID)
	}

	// add high priority item
	item2, _ := storage.AddItem(waitlistID, &models.Item{Priority: swag.Int64(1)})

	list, err = storage.ListItems(waitlistID)
	if err != nil {
		t.Fatalf("Expected error to be nil; got '%v'", err)
	}
	if list[0].ID != item2.ID {
		t.Fatalf("Expected list item 0 ID to be '%s', got '%s'", item2.ID, list[0].ID)
	}
	if list[1].ID != item1.ID {
		t.Fatalf("Expected list item 0 ID to be '%s', got '%s'", item1.ID, list[1].ID)
	}
}

func TestUpdateItem(t *testing.T) {
	waitlistID, storage := initWaitlist("room 1")
	defer storage.Close()

	item1, _ := storage.AddItem(waitlistID, &models.Item{Priority: swag.Int64(4)})
	id1, _ := uuid.FromString(item1.ID)

	storage.db.View(func(tx *bolt.Tx) error {
		q := tx.Bucket(bucketCurrent).Bucket(waitlistID).Get(append(keyQueue, byte(4)))
		if !bytes.Equal(q, id1.Bytes()) {
			t.Fatalf("Expected queue 4 to be have '%v'; got '%v'", id1.Bytes(), q)
		}

		return nil
	})

	item1.Priority = swag.Int64(1)
	updatedItem, err := storage.UpdateItem(waitlistID, item1)
	if err != nil {
		t.Fatalf("Expected error to be nil; got '%v'", err)
	}
	if *updatedItem.Priority != 1 {
		t.Fatalf("Expected item priority to be 1, got %d", *updatedItem.Priority)
	}

	storage.db.View(func(tx *bolt.Tx) error {
		q := tx.Bucket(bucketCurrent).Bucket(waitlistID).Get(append(keyQueue, byte(4)))
		if len(q) != 0 {
			t.Fatalf("Expected queue 4 to be empty; got '%v'", q)
		}

		q = tx.Bucket(bucketCurrent).Bucket(waitlistID).Get(append(keyQueue, byte(1)))
		if !bytes.Equal(q, id1.Bytes()) {
			t.Fatalf("Expected queue 1 to be have '%v'; got '%v'", id1.Bytes(), q)
		}

		return nil
	})

	id2, _ := uuid.NewV4()
	_, err = storage.UpdateItem(waitlistID, &models.Item{ID: id2.String(), Priority: swag.Int64(1)})
	if err == nil {
		t.Fatalf("Expected error; got nil")
	}

}

func TestDeleteItem(t *testing.T) {
	waitlistID, storage := initWaitlist("room 1")
	defer storage.Close()

	item1, _ := storage.AddItem(waitlistID, &models.Item{Priority: swag.Int64(4)})
	item2, _ := storage.AddItem(waitlistID, &models.Item{Priority: swag.Int64(4)})
	item3, _ := storage.AddItem(waitlistID, &models.Item{Priority: swag.Int64(4)})

	id1, _ := uuid.FromString(item1.ID)
	id2, _ := uuid.FromString(item2.ID)
	id3, _ := uuid.FromString(item3.ID)

	storage.db.View(func(tx *bolt.Tx) error {
		q := tx.Bucket(bucketCurrent).Bucket(waitlistID).Get(append(keyQueue, byte(4)))
		expectedQ := append(id1.Bytes(), append(id2.Bytes(), id3.Bytes()...)...)

		if !bytes.Equal(q, expectedQ) {
			t.Fatalf("Expected queue to be '%v'; got '%v'", q, expectedQ)
		}

		return nil
	})

	err := storage.DeleteItem(waitlistID, id2.Bytes(), models.ItemStatusCanceled)
	if err != nil {
		t.Fatalf("Expected error to be nil; got '%v'", err)
	}

	storage.db.View(func(tx *bolt.Tx) error {
		q := tx.Bucket(bucketCurrent).Bucket(waitlistID).Get(append(keyQueue, byte(4)))
		expectedQ := append(id1.Bytes(), id3.Bytes()...)

		if !bytes.Equal(q, expectedQ) {
			t.Fatalf("Expected queue to be '%v'; got '%v'", q, expectedQ)
		}

		return nil
	})

	err = storage.DeleteItem(waitlistID, id1.Bytes(), models.ItemStatusCanceled)
	if err != nil {
		t.Fatalf("Expected error to be nil; got '%v'", err)
	}

	storage.db.View(func(tx *bolt.Tx) error {
		q := tx.Bucket(bucketCurrent).Bucket(waitlistID).Get(append(keyQueue, byte(4)))
		expectedQ := id3.Bytes()

		if !bytes.Equal(q, expectedQ) {
			t.Fatalf("Expected queue to be '%v'; got '%v'", q, expectedQ)
		}

		return nil
	})

	err = storage.DeleteItem(waitlistID, id3.Bytes(), models.ItemStatusCanceled)
	if err != nil {
		t.Fatalf("Expected error to be nil; got '%v'", err)
	}

	storage.db.View(func(tx *bolt.Tx) error {
		q := tx.Bucket(bucketCurrent).Bucket(waitlistID).Get(append(keyQueue, byte(4)))
		expectedQ := []byte{}

		if !bytes.Equal(q, expectedQ) {
			t.Fatalf("Expected queue to be '%v'; got '%v'", q, expectedQ)
		}

		return nil
	})
}