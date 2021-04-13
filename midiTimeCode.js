let midiOutputs;


onmessage = function(event) {  // This function must be defined like this ... don't ask questions
	if (event.data.message == 'init') {
		midiOutputs = event.data.midiOutputs;
		console.log("init with %d midi devices", midiOutputs.length);
	}
}

/*

MTC - Spec
https://en.wikipedia.org/wiki/MIDI_timecode
https://web.archive.org/web/20110629053759/http://web.media.mit.edu/~meyers/mcgill/multimedia/senior_project/MTC.html

Virtual Midi Network
https://help.ableton.com/hc/en-us/articles/209071169
http://www.tobias-erichsen.de/software/rtpmidi/rtpmidi-tutorial.html
https://github.com/mik3y/pymidi#demo-server

MTC Send from DAWs
https://non-lethal-applications.com/support/knowledge-base/general/209-daw-mtc-mmc-setup#live
MTC Send from standalone app (windows only)
https://cycling74.com/tools/midi-time-code-generator

python3 -m pymidi.server

Javascript Timing for Audio
https://www.html5rocks.com/en/tutorials/audio/scheduling/
https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
https://github.com/CrystalComputerCorp/smpte-timecode

Python Physical Midi port
https://pypi.org/project/py-midi/

Web Workers
https://www.html5rocks.com/en/tutorials/workers/basics/
  covers blobs
https://www.experoinc.com/post/getting-started-with-web-workers-via-webpack

C++ implementation of MTC emmiter
https://gist.github.com/adamski/b42eb8f91910fe28a017458e2edad5d3

https://github.com/hideakitai/MTCParser/blob/master/MTCParser.h


*/