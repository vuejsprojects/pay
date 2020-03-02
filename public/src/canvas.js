import {
    CANVAS_WIDTH_ORIG,
    CANVAS_WIDTH,
    CANVAS_HEIGHT_ORIG,
    CANVAS_HEIGHT,
    BACKGROUND,
    LINE_WIDTH,
    LINE_COLOR
} from './settings.js';


const getCanvas = function (domManager) {
    const canvas = {};
    canvas.initCanvas = function () {
        this.canvas = domManager.createCanvas( 'board', 'board-game');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = BACKGROUND;
        this.context.fillRect(CANVAS_WIDTH_ORIG, CANVAS_HEIGHT_ORIG, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.context.lineWidth = LINE_WIDTH;
        this.context.strokeStyle = LINE_COLOR;
        return this.context;
    };
    canvas.redrawBackground = function() {
        this.context.fillStyle = BACKGROUND;
        this.context.fillRect(CANVAS_WIDTH_ORIG, CANVAS_HEIGHT_ORIG, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.context.lineWidth = LINE_WIDTH;
        this.context.strokeStyle = LINE_COLOR;
    };
    canvas.getFocus = function() {
        this.canvas.setAttribute('tabindex','0');
        this.canvas.focus();
    };

    return canvas;
}
export {getCanvas};