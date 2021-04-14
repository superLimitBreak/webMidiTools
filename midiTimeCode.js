// https://en.wikipedia.org/wiki/MIDI_timecode
import {
	assertEquals,
} from './core.js'

let midiOutputs;


onmessage = function(event) {  // This function must be defined like this ... don't ask questions
	if (event.data.message == 'init') {
		midiOutputs = event.data.midiOutputs;
		console.log("init with %d midi devices", midiOutputs.length);
	}
}

const milliseconds_in_second = 1000;
const milliseconds_in_minuet = 60 * milliseconds_in_second;
const milliseconds_in_hour = 60 * milliseconds_in_minuet;
const milliseconds_in_day = 24 * milliseconds_in_hour;
const MTCFullRateLookup = {
	24: 0b00,
	25: 0b01,
	29.97: 0b10,
	30: 0b11,
};
function timecode_to_components(timecode_milliseconds, {fps=30}) {
	return {
		ff: Math.floor(((timecode_milliseconds % milliseconds_in_second)/milliseconds_in_second)*fps),
		ss: Math.floor(((timecode_milliseconds % milliseconds_in_minuet)/milliseconds_in_second)),
		mm: Math.floor(((timecode_milliseconds % milliseconds_in_hour)/milliseconds_in_minuet)),
		hh: Math.floor(((timecode_milliseconds % milliseconds_in_day)/milliseconds_in_hour)),
	};
}
function MTCFull(timecode_milliseconds, {fps=30}) {
	const rr = MTCFullRateLookup[fps] * 0b100000;
	const {hh, mm, ss, ff} = timecode_to_components(timecode_milliseconds, {fps});
	return [0xF0, 0x7F, 0x7F, 0x01, 0x01, rr+hh, mm, ss, ff, 0xF7]
}


function MTCQuarter(timecode_milliseconds, {fps=30}) {
	const lower_4_bits = 0b00001111;
	const upper_2_bits = 0b00110000;
	function _piece(i, nibble) {
		console.assert(nibble <= lower_4_bits);
		console.assert(i <= 8);
		return (i * 0b10000) + nibble;
	}

	const rr = MTCFullRateLookup[fps] * 0b10;
	const {hh, mm, ss, ff} = timecode_to_components(timecode_milliseconds, {fps});
	return [
		_piece(0, (ff & lower_4_bits)),
		_piece(1, (ff & upper_2_bits) >> 4),
		_piece(2, (ss & lower_4_bits)),
		_piece(3, (ss & upper_2_bits) >> 4),
		_piece(4, (mm & lower_4_bits)),
		_piece(5, (mm & upper_2_bits) >> 4),
		_piece(6, (hh & lower_4_bits)),
		_piece(7, (hh & upper_2_bits) >> 4) + rr,
	]
}

// Tests -----------------------------------------------------------------------
function _to_hex_string(bytes) {return bytes.map(x=>x.toString(16).padStart(2,'0')).join('');}
const MTCFullHexTemplate = 'f07f7f0101hhmmssfff7';
assertEquals([
	[_to_hex_string(MTCFull(0,{fps:24})), MTCFullHexTemplate.replace('hhmmssff', '00000000')],
	[_to_hex_string(MTCFull(0,{fps:30})), MTCFullHexTemplate.replace('hhmmssff', '60000000')],
	[_to_hex_string(MTCFull(100,{fps:24})), MTCFullHexTemplate.replace('hhmmssff', '00000002')],
	[_to_hex_string(MTCFull(100,{fps:30})), MTCFullHexTemplate.replace('hhmmssff', '60000003')],
	[_to_hex_string(MTCFull(20000,{fps:30})), MTCFullHexTemplate.replace('hhmmssff', '60001400')],
	[_to_hex_string(MTCFull(20100,{fps:30})), MTCFullHexTemplate.replace('hhmmssff', '60001403')],
	[_to_hex_string(MTCFull(320100,{fps:30})), MTCFullHexTemplate.replace('hhmmssff', '60051403')],
	[_to_hex_string(MTCFull(320100+milliseconds_in_hour,{fps:30})), MTCFullHexTemplate.replace('hhmmssff', '61051403')],
]);
assertEquals([
	[_to_hex_string(MTCQuarter(0,{fps:24})), '00 10 20 30 40 50 60 70'.replaceAll(' ','')],
	[_to_hex_string(MTCQuarter(100,{fps:24})), '02 10 20 30 40 50 60 70'.replaceAll(' ','')],
	[_to_hex_string(MTCQuarter(100,{fps:30})), '03 10 20 30 40 50 60 76'.replaceAll(' ','')],
	[_to_hex_string(MTCQuarter(20100,{fps:30})), '03 10 24 31 40 50 60 76'.replaceAll(' ','')],
]);




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

Midi bit order
https://stackoverflow.com/questions/27826667/midi-and-bit-order


https://medium.com/@kulak/web-midi-api-sending-notes-from-javascript-to-your-synth-1dfee9c57645

*/