import {
	enumerate, zip,
} from '../libs/es6/core.js'

import {
	NUM_NOTES_IN_OCTAVE,
	normalize_octave,
	text_to_note,
} from '../libs/es6/music.js'


const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(text_to_note).map(normalize_octave);
const BLACK_NOTES = ['C#', 'D#', 'F#', 'G#', 'A#'].map(text_to_note).map(normalize_octave);

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
	//context.fillStyle = "#FF0000";
	//context.strokeStyle = context.fillStyle;

	const blackNoteColor = "#000000";
	const whiteNoteColor = "#FFFFFF"
	const activeNoteColor = "#FF0000";
	const noteBorderColor = blackNoteColor;

	const NOTE_WIDTH = context.canvas.width/WHITE_NOTES.length;
	const NOTE_WIDTH_BLACK = NOTE_WIDTH * 0.5;

	// White notes
	context.strokeStyle = noteBorderColor;
	for (let [i, note] of enumerate(WHITE_NOTES)) {
		const NOTE_ACTIVE = notes.indexOf(note) >= 0;
		context.fillStyle = NOTE_ACTIVE ? activeNoteColor : whiteNoteColor;
		const rectangle_params = [NOTE_WIDTH * i, 0, NOTE_WIDTH, context.canvas.height];
		context.fillRect(...rectangle_params);
		context.strokeRect(...rectangle_params);
	}
	// Black Notes
	for (let [i, note] of zip([0, 1, 3, 4, 5], BLACK_NOTES)) {
		const NOTE_ACTIVE = notes.indexOf(note) >= 0;
		context.fillStyle = NOTE_ACTIVE ? activeNoteColor : blackNoteColor;
		const rectangle_params = [(NOTE_WIDTH * i) + (NOTE_WIDTH/2) + (NOTE_WIDTH_BLACK/2), 0, NOTE_WIDTH_BLACK, context.canvas.height * 0.6];
		context.fillRect(...rectangle_params);
		context.strokeRect(...rectangle_params);
	}



	//context.fillRect(0, 0, 200, 200)
}

export default {
	drawPiano,
}