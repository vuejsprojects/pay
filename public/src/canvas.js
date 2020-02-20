import {
    CANVAS_WIDTH_ORIG,
    CANVAS_WIDTH,
    CANVAS_HEIGHT_ORIG,
    CANVAS_HEIGHT,
    BACKGROUND,
    LINE_WIDTH,
    LINE_COLOR
} from './settings.js';

const initCanvas = function (height, width) {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    document.body.appendChild(canvas);
    const context = canvas.getContext("2d");
    context.fillStyle = BACKGROUND;
    context.fillRect(CANVAS_WIDTH_ORIG, CANVAS_HEIGHT_ORIG, canvas.width, canvas.height);
    context.lineWidth = LINE_WIDTH;
    context.strokeStyle = LINE_COLOR;
    return context;
}

export {initCanvas};