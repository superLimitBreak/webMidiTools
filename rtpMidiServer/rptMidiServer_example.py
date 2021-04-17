from pymidi import server

# Example from
# https://github.com/mik3y/pymid

class MyHandler(server.Handler):
    def on_peer_connected(self, peer):
        print('Peer connected: {}'.format(peer))

    def on_peer_disconnected(self, peer):
        print('Peer disconnected: {}'.format(peer))

    def on_midi_commands(self, peer, command_list):
        for command in command_list:
            print(command)  # my addition
            if command.command == 'note_on':
                key = command.params.key
                velocity = command.params.velocity
                print('Someone hit the key {} with velocity {}'.format(key, velocity))

print("Start rtp midi server on 5051")  # my addition
myServer = server.Server([('0.0.0.0', 5051)])
myServer.add_handler(MyHandler())
myServer.serve_forever()
