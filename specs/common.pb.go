// Code generated by protoc-gen-go.
// source: common.proto
// DO NOT EDIT!

package specs

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

type ErrorCode int32

const (
	ErrorCode_OK ErrorCode = 0
)

var ErrorCode_name = map[int32]string{
	0: "OK",
}
var ErrorCode_value = map[string]int32{
	"OK": 0,
}

func (x ErrorCode) String() string {
	return proto.EnumName(ErrorCode_name, int32(x))
}
func (ErrorCode) EnumDescriptor() ([]byte, []int) { return fileDescriptor2, []int{0} }

type Empty struct {
	Error ErrorCode `protobuf:"varint,1,opt,name=error,enum=specs.ErrorCode" json:"error,omitempty"`
}

func (m *Empty) Reset()                    { *m = Empty{} }
func (m *Empty) String() string            { return proto.CompactTextString(m) }
func (*Empty) ProtoMessage()               {}
func (*Empty) Descriptor() ([]byte, []int) { return fileDescriptor2, []int{0} }

func (m *Empty) GetError() ErrorCode {
	if m != nil {
		return m.Error
	}
	return ErrorCode_OK
}

type ErrorResponse struct {
	Error string `protobuf:"bytes,1,opt,name=error" json:"error,omitempty"`
}

func (m *ErrorResponse) Reset()                    { *m = ErrorResponse{} }
func (m *ErrorResponse) String() string            { return proto.CompactTextString(m) }
func (*ErrorResponse) ProtoMessage()               {}
func (*ErrorResponse) Descriptor() ([]byte, []int) { return fileDescriptor2, []int{1} }

func (m *ErrorResponse) GetError() string {
	if m != nil {
		return m.Error
	}
	return ""
}

func init() {
	proto.RegisterType((*Empty)(nil), "specs.Empty")
	proto.RegisterType((*ErrorResponse)(nil), "specs.ErrorResponse")
	proto.RegisterEnum("specs.ErrorCode", ErrorCode_name, ErrorCode_value)
}

func init() { proto.RegisterFile("common.proto", fileDescriptor2) }

var fileDescriptor2 = []byte{
	// 125 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x09, 0x6e, 0x88, 0x02, 0xff, 0xe2, 0xe2, 0x49, 0xce, 0xcf, 0xcd,
	0xcd, 0xcf, 0xd3, 0x2b, 0x28, 0xca, 0x2f, 0xc9, 0x17, 0x62, 0x2d, 0x2e, 0x48, 0x4d, 0x2e, 0x56,
	0xd2, 0xe7, 0x62, 0x75, 0xcd, 0x2d, 0x28, 0xa9, 0x14, 0x52, 0xe3, 0x62, 0x4d, 0x2d, 0x2a, 0xca,
	0x2f, 0x92, 0x60, 0x54, 0x60, 0xd4, 0xe0, 0x33, 0x12, 0xd0, 0x03, 0xcb, 0xeb, 0xb9, 0x82, 0xc4,
	0x9c, 0xf3, 0x53, 0x52, 0x83, 0x20, 0xd2, 0x4a, 0xaa, 0x5c, 0xbc, 0x60, 0xb1, 0xa0, 0xd4, 0xe2,
	0x82, 0xfc, 0xbc, 0xe2, 0x54, 0x21, 0x11, 0x64, 0x8d, 0x9c, 0x50, 0x65, 0x5a, 0xc2, 0x5c, 0x9c,
	0x70, 0xad, 0x42, 0x6c, 0x5c, 0x4c, 0xfe, 0xde, 0x02, 0x0c, 0x49, 0x6c, 0x60, 0xab, 0x8d, 0x01,
	0x01, 0x00, 0x00, 0xff, 0xff, 0xed, 0x45, 0x22, 0x47, 0x8a, 0x00, 0x00, 0x00,
}
