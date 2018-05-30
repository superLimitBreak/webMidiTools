import {
	NUM_NOTES_IN_OCTAVE,
	normalize_octave,
	circle_of_fifths_notes,
	circle_of_fifths_text
} from '../libs/es6/music.js'


const TEMP_circle_of_fifths_notes = [...circle_of_fifths_notes()];
const TEMP_circle_of_fifths_text = [...circle_of_fifths_text()];


export function drawCircleOfFifths(context, notes, options={
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

	context.fillStyle = "#000000";
	context.strokeStyle = context.fillStyle;

	// Circle
	context.beginPath();
	context.lineWidth = _options.lineWidth
	context.arc(
		context.canvas.width/2,
		context.canvas.height/2,
		Math.min(context.canvas.width, context.canvas.height)/2 - _options.lineWidth - _options.borderSize,
		(Math.PI/180)*0,
		(Math.PI/180)*360,
		false
	);
	context.stroke();
	context.closePath();

	// Ticks
	//context.strokeStyle = "black";
	//context.lineWidth  = 10;
	context.lineJoin = 'bevel';
	context.lineCap  = 'round';
	function* tickGenerator(ticks=NUM_NOTES_IN_OCTAVE) {
		for (let index=0 ; index < ticks ; index++) {
			yield [
				index,
				TEMP_circle_of_fifths_notes[index],
				TEMP_circle_of_fifths_text[index],
				(index/ticks) * Math.PI * 2,
			];
		}
	}
	for (let [index, note, text, angle] of tickGenerator()) {
		context.setTransform(1,0,0,1,0,0); // Reset translations (why is there not a convenience call for this?)
		context.translate(context.canvas.width/2, context.canvas.height/2);
		context.rotate(angle);

		context.fillStyle = notes.lastIndexOf(note) >= 0 ? "#FF0000":"#000000";
		context.strokeStyle = context.fillStyle;

		context.beginPath();
		context.moveTo(0, -radius);
		context.lineTo(0, -radius + _options.lineWidth * 3);
		context.stroke();
		context.closePath();
		context.fillText(text, -context.measureText(text).width/2, -context.canvas.height/2 + _options.borderSize);
	}

	// Chord path
	context.fillStyle = '#f00'
	context.beginPath();
	for (let [index, note, text, angle] of tickGenerator()) {
		context.setTransform(1,0,0,1,0,0); // Reset translations (why is there not a convenience call for this?)
		context.translate(context.canvas.width/2, context.canvas.height/2);
		context.rotate(angle);
		if (notes.lastIndexOf(note) >= 0) {
			context.lineTo(0, -radius);
		}
	}
	context.closePath();
	context.fill();
}

export default {
	drawCircleOfFifths,
}