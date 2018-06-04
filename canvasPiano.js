import {
	enumerate,
} from '../libs/es6/core.js'

import {
	NUM_NOTES_IN_OCTAVE,
	normalize_octave,
	text_to_note,
} from '../libs/es6/music.js'


export function drawPiano(context, notes, options={
	lineWidth: 0.015,
	borderSize: 0.1,
	fontFace: 'serif',
}) {
	context = context instanceof String ? document.getElementById(canvas).getContext("2d") : context;
	console.assert(context instanceof CanvasRenderingContext2D, `Unable to draw on ${context}`);

	notes = notes instanceof Set ? [...notes.keys()].map(normalize_octave) : notes;
	notes = notes ? notes : [];
	console.assert(notes instanceof Array, 'notes must be an Array');

	const _options = {
		lineWidth: options.lineWidth * context.canvas.height,
		borderSize: options.borderSize * context.canvas.height,
	}
	const radius = context.canvas.height/2 - _options.borderSize;

	context.font = `${_options.borderSize}px ${options.fontFace}`;

	// Background
	context.setTransform(1,0,0,1,0,0); // Reset translations (why is there not a convenience call for this?)
	//context.fillStyle = "#FFFFFF";
	//context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	context.lineWidth = 3;
	context.fillStyle = "#FF0000";
	context.strokeStyle = context.fillStyle;

	// White notes
	const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(text_to_note);
	for (let [i, note] of enumerate(WHITE_NOTES)) {
		const drawKey = notes.indexOf(note) >= 0 ? context.fillRect : context.strokeRect;
		drawKey(context.canvas.width/WHITE_NOTES.length * i, 0, context.canvas.width/WHITE_NOTES.length, context.canvas.height);
	}


	//context.fillRect(0, 0, 200, 200)
}

export default {
	drawPiano,
}