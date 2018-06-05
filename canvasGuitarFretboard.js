import {
	range,
	assertEqualsObject,
	previousValueIterator,
} from '../libs/es6/core.js'

import {
	NUM_NOTES_IN_OCTAVE,
	normalize_octave,
	text_to_note,
} from '../libs/es6/music.js'


function* fretDistance(frets=21, scale_length=648) {
	// https://en.wikipedia.org/wiki/Guitar#Frets
	// https://en.wikipedia.org/wiki/Scale_length_(string_instruments)
	// Distance fron nut to 12th Fret = half the scale_length
	let distance_from_nut = 0;
	for (let i of range(frets)) {
		yield distance_from_nut += ((scale_length - distance_from_nut) / 17.817);
	}
}
//assertEquals([
//	[],
//]);


export function drawGuitarFretboard(context, notes, options={
	lineWidth: 0.03,
	fontFace: 'serif',
	activeNoteColor: "#FF0000",
	tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
}) {
	context = context instanceof String ? document.getElementById(canvas).getContext("2d") : context;
	console.assert(context instanceof CanvasRenderingContext2D, `Unable to draw on ${context}`);

	notes = notes instanceof Set ? [...notes.keys()].map(normalize_octave) : notes;
	notes = notes ? notes : [];
	console.assert(notes instanceof Array, 'notes must be an Array');

	const _options = {
		lineWidth: options.lineWidth * context.canvas.height,
		tuning: options.tuning.map(text_to_note).map(normalize_octave),
	}
	context.font = `${_options.lineWidth}px ${options.fontFace}`;
	context.lineWidth = 1;  //_options.lineWidth

	// Background
	context.setTransform(1,0,0,1,0,0); // Reset translations (why is there not a convenience call for this?)
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	//console.log([...fretDistance()]);

	context.fillStyle = "#000000";
	context.strokeStyle = context.fillStyle;


	for (let [fret_start, fret_end] of previousValueIterator(fretDistance(21, context.canvas.height))) {
		fret_start = fret_start ? fret_start : 0;

		context.beginPath();
		context.moveTo(0, fret_end);
		context.lineTo(context.canvas.width, fret_end);
		context.stroke();
		context.closePath();

		//console.log(fret_start, fret_end);
	}
}

export default {
	drawGuitarFretboard,
}