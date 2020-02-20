const CANVAS_CENTER = {
    posX: 200,
    posY:200
}

/*
* point represent a point in a Cartesian coordinate system
* where 0,0 is at the ceneter of the canvas
*/
const point = function(x, y) {
    const that = {};
    that.init = function (x, y) {
        this.x = x;
        this.y = y;
    };
    // returns the x coordinate equivalent in the canvas
    // ex: 0 returns (CANVAS_WIDTH - CANVAS_WIDTH_ORIG) / 2
    // canvas 400,400 x => 200
    that.getX = function() {
        return CANVAS_CENTER.posX + this.x;
    };
    // returns the y coordinate equivalent in the canvas
    // ex: 0 returns (CANVAS_HEIGHT - CANVAS_HEIGHT_ORIG) / 2
    // canvas 400,400 y => 200
    that.getY =function () {
        return CANVAS_CENTER.posY - this.y;
    };
    that.init(x, y);
    return that;
};

export {point, CANVAS_CENTER};