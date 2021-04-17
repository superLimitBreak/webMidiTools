DOCKER_IMAGE := rtpmidi

default: build run

build:
	docker build \
		--tag ${DOCKER_IMAGE} \
		.

run:
	docker run \
		--rm \
		-it \
		-p 5051:5051/udp \
		-p 5052:5052/udp \
		${DOCKER_IMAGE}

