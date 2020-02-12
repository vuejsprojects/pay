const CANVAS_WIDTH_ORIG = 0;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT_ORIG = 0;
const CANVAS_HEIGHT = 400;
const BACKGROUND = 'blue';
const PAC_COLOR = 'white';
const LINE_WIDTH = 10;
const LINE_COLOR = 'orange'

const intCanvas = function (height, width) {
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


const CANVAS_CENTER = {
    posX: (CANVAS_WIDTH - CANVAS_WIDTH_ORIG) / 2,
    posY: (CANVAS_HEIGHT - CANVAS_HEIGHT_ORIG) / 2
}

const point = function(x, y) {
    const that = {};
    that.init = function (x, y) {
        this.x = x;
        this.y = y;
    };
    that.getX = function() {
        return CANVAS_CENTER.posX + this.x;
    };
    that.getY =function () {
        return CANVAS_CENTER.posY + this.y;
    };
    that.isPacWithin = function(pointOrigin, pac) {
        let canMove = false;
        const distX = this.x - pointOrigin.x;
        const distY = this.y - pointOrigin.y;
        if (distY === 0) {
            if (pac.posX < distX) {
                canMove = true;
            }
        }
        if (distX === 0) {
            if (pac.posY < distY) {
                canMove = true;
            }
        }
    }
    that.init(x, y);
    return that;
};

const parcours = {
    layout2: [
        [point(0, 0), point(50, 0)],
        [point(50, 0), point(50, 30)],
        [point(50, 0), point(50, -30)],
        [point(50, 30), point(20, 30)]
    ],
    layout: [
        [point(0, 0), point(-50, 0)],
        [point(0, 0), point(0, 70)],
        [point(0, 0), point(0, -70)],
        [point(0, 0), point(50, 0)],
        [point(50, 0), point(50, 30)],
        [point(50, 0), point(50, -30)],
        [point(50, 30), point(20, 30)]
    ],
    isIn: function(x, y) {
        let within = false;
        for (let i = 0; i < this.layout.length; i++) {
            const condX = x > 0 ? x >= this.layout[i][0].x && x <= this.layout[i][1].x
                                : x <= this.layout[i][0].x && x >= this.layout[i][1].x;
            const condY = y > 0 ? y >= this.layout[i][0].y && y <= this.layout[i][1].y
                                : y <= this.layout[i][0].y && y >= this.layout[i][1].y;

            if (condX && condY) {
                within = true;
                break;
            }
        };
        return within;
    },
    display: function(context) {
        for (let i = 0; i < this.layout.length; i++) {
            context.moveTo(this.layout[i][0].getX(), this.layout[i][0].getY());
            context.lineTo(this.layout[i][1].getX(), this.layout[i][1].getY());
            context.stroke();
        }
    }
}

const getPac = function (context) {
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;
    const INC = 10;
    const PAC_WIDTH = 10;
    const PAC_HEIGHT = 10;

    const isXinCanvasAndOnParours = function(posX, posY, parcours) {
        let rc = false;
        if (posX > CANVAS_WIDTH_ORIG && posX < CANVAS_WIDTH) {
            relative = getRelativePosition( {
                posX: posX,
                posY: posY
            });
            if (parcours.isIn(relative.posX, relative.posY)) {
                rc = true;
            }
        }
        return rc;
    };

    const getRelativePosition = function( position) {
        const relativePosition = {
            posX: (position.posX + (PAC_WIDTH / 2))- (CANVAS_WIDTH - CANVAS_WIDTH_ORIG) / 2,
            posY: ((CANVAS_HEIGHT - CANVAS_HEIGHT_ORIG) / 2) - (position.posY + (PAC_HEIGHT / 2))
        }
        return relativePosition;
    };

    const setPosition = function (that, direction, parcours) {
        let isNewPosition = false;
        switch (direction) {
            case LEFT:
                const posX = that.posX - INC;
                if (isXinCanvasAndOnParours(posX, that.posY, parcours)) {
                    that.posX = posX;
                    isNewPosition = true;
                }
                // if (that.posX - INC > CANVAS_WIDTH_ORIG) {
                //     that.posX -= INC;
                //     isNewPosition = true;
                // }
                break;

            case UP:
                if (that.posY - INC > CANVAS_HEIGHT_ORIG) {
                    that.posY -= INC;
                    isNewPosition = true;
                }
                break;

            case RIGHT:
                if (isXinCanvasAndOnParours(that.posX + INC, that.posY, parcours)) {
                    that.posX = that.posX + INC;
                    isNewPosition = true;
                }
                // if (that.posX + INC < CANVAS_WIDTH - PAC_WIDTH) {
                //     that.posX += INC;
                //     isNewPosition = true;
                // }
                break;

            case DOWN:
                if (that.posY + INC < CANVAS_HEIGHT - PAC_HEIGHT) {
                    that.posY += INC;
                    isNewPosition = true;
                }
                break;
        }
        return isNewPosition;
    };
    const centerPacCoordinate = function(coordinate) {
        const center = {
            posX: coordinate.posX - (PAC_WIDTH / 2),
            posY: coordinate.posY - (PAC_HEIGHT / 2)
        }
        return center
    };
    return {
        posX: 0,
        posY: 0,
        initialPosition: function (spec) {
            center = centerPacCoordinate(spec);
            this.posX = center.posX;
            this.posY = center.posY;
            context.fillStyle = PAC_COLOR;
            context.fillRect(this.posX, this.posY, PAC_WIDTH, PAC_HEIGHT);
        },
        move: function (event, parcours) {
            const direction = event.keyCode;
            this.prevPosX = this.posX;
            this.prevPosY = this.posY;
            const that = this;
            if (setPosition(that, direction, parcours)) {
                context.fillStyle = PAC_COLOR;
                context.fillRect(this.posX, this.posY, PAC_WIDTH, PAC_HEIGHT);
                context.fillStyle = BACKGROUND;
                context.fillRect(this.prevPosX, this.prevPosY, PAC_WIDTH, PAC_HEIGHT);
            }
        }
    }
}

const getKeypressHandler = function (pac, parcours) {
    const func = function () {
        pac.move(event, parcours);
    }
    return func;
}

const context = intCanvas();
const pac = getPac(context);
pac.initialPosition(CANVAS_CENTER);
parcours.display(context);

const keypressHandler = getKeypressHandler(pac, parcours);

window.addEventListener("keydown", keypressHandler, true);

