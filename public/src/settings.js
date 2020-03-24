export const CANVAS_WIDTH_ORIG = 0;
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT_ORIG = 0;
export const CANVAS_HEIGHT = 400;
export const BACKGROUND = 'red';  //'blue';
export const PAC_COLOR = 'white';
export const BOOST_COLOR = 'red';
export const BEAST_COLOR = 'black';
export const PAC_WIDTH = 20;
export const PAC_HEIGHT = 20;
export const LINE_WIDTH = 20;
export const LINE_COLOR = 'green';
export const DASH_LINE_WIDTH = 2;
export const DASH_LINE_COLOR = 'orange';
export const DASH_SIZE = [2, 2];
export const BORDER_COLOR = 'red';
export const HORIZONTAL = 0;
export const VERTICAL = 1;
export const LEFT = 37;
export const RIGHT = 39;
export const UP = 38;
export const DOWN = 40;
export const INC = 20;
export const ARC = 'arc';
export const RECT = 'rect';
export const GAME_OVER_COLOR = 'white';
export const WINDOW_ID = 'PACOMAN_WINDOW_ID';
export const IMAGES = [
    {id: "sherries", src: 'src/images/2Sherries.png'},
    {id: "duck", src: 'src/images/ducky.png'},
    {id: "boat", src: 'src/images/boat.png'},

    {id: "down", src: 'src/images/down.png'},
    {id: "down-red", src: 'src/images/down-red.png'},
    {id: "up", src: 'src/images/up.png'},
    {id: "up-red", src: 'src/images/up-red.png'},
    {id: "left", src: 'src/images/left.png'},
    {id: "left-red", src: 'src/images/left-red.png'},
    {id: "right", src: 'src/images/right.png'},
    {id: "right-red", src: 'src/images/right-red.png'},
    {id: "full", src: 'src/images/full.png'},
    {id: "full-red", src: 'src/images/full-red.png'},

    {id: "beast", src: 'src/images/beast.png'},

    {id: "dot", src: 'src/images/dot.png'}
];


export const CANVAS_CENTER = {
    posX: (CANVAS_WIDTH - CANVAS_WIDTH_ORIG) / 2,
    posY: (CANVAS_HEIGHT - CANVAS_HEIGHT_ORIG) / 2
}
