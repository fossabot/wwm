CDIR = $(dir $(realpath $(firstword $(MAKEFILE_LIST))))
DOCKER = docker run --rm -it -v $(CDIR):/certs --entrypoint='' -w /certs cfssl/cfssl
SERVERS = vault localMinio cloudMinio localNats localStatusReporter cloudStatusReporter postgres
PEERS = localAuth cloudAuth traefik localStorage cloudStorage waitlist storageSync localDiscovery cloudDiscovery
CLIENTS = localAuthSync localNatsStreaming localPrometheus cloudPrometheus batchStorageSync
TYPE := test

.PRECIOUS: %.pem certs/%.pem

ALL: ca.pem $(addprefix server/,$(SERVERS)) $(addprefix peer/,$(PEERS)) $(addprefix client/,$(CLIENTS))

clean:
	@find . -type f \( -name '*.pem' -o -name '*.csr' \) -not -name "ca*" -delete

ca.pem:
	$(DOCKER) ./createCert.sh

%.pem: %.json
	$(DOCKER) ./createProfileCert.sh $(TYPE) $*

certs/%.pem:
	mkdir -p $(CDIR)/certs
	cp $(CDIR)/$*.pem $(CDIR)/certs/

server/%: TYPE=server
server/%: %.pem certs/%.pem ;

peer/%: TYPE=peer
peer/%: %.pem certs/%.pem ;

client/%: TYPE=client
client/%: %.pem certs/%.pem ;
