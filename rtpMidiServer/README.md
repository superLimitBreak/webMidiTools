# RTP Midi server container - proof of concept

Received MTC over UDP using
https://www.tobias-erichsen.de/software/rtpmidi.html


```
calaldees@c605CD021FP3C /mnt/c/Users/ac954/code/webMidiTools/rtpMidiServer (master)$ make run
docker run \
        --rm \
        -it \
        -p 5051:5051/udp \
        -p 5052:5052/udp \
        rtpmidi
Start rtp midi server on 5051
Peer connected: c605CD021FP3C (ssrc=3051939821, addr=('172.17.0.1', 36066))
Container:
    delta_time = None
    command_byte = 241
    command = (enum) (unknown) 240
    channel = 1
    params = Container:
        unknown = b')' (total 1)
Container:
    delta_time = None
    command_byte = 241
    command = (enum) (unknown) 240
    channel = 1
    params = Container:
        unknown = b'2' (total 1)
Container:
    delta_time = None
    command_byte = 241
    command = (enum) (unknown) 240
    channel = 1
    params = Container:
        unknown = b'@' (total 1)
```