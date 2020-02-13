const CANVAS_WIDTH_ORIG = 0;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT_ORIG = 0;
const CANVAS_HEIGHT = 400;
const BACKGROUND = 'blue';
const PAC_COLOR = 'white';
const LINE_WIDTH = 10;
const LINE_COLOR = 'orange'
const HORIZONTAL = 0;
const VERTICAL = 1;

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
        return CANVAS_CENTER.posY - this.y;
    };
    that.init(x, y);
    return that;
};

const parcours = {
    layout: [
        [point(0, 0), point(-50, 0)],
        [point(0, 0), point(0, 70)],
        [point(0, 0), point(0, -70)],
        [point(0, 0), point(50, 0)],
        [point(50, 0), point(50, 30)],
        [point(50, 0), point(50, -30)],
        [point(20, 30), point(50, 30)] // [point(50, 30), point(20, 30)] need strating point < ending point
    ],
    isOnTrack: function(position) {
        const x = position.posX;
        const y = position.posY;
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
        this.layout.forEach(line => {
            context.moveTo(line[0].getX(), line[0].getY());
            context.lineTo(line[1].getX(), line[1].getY());
            context.stroke();
        });
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

    const getRelativePosition = function( position) {
        const relativePosition = {
            posX: (position.posX + (PAC_WIDTH / 2))- (CANVAS_WIDTH - CANVAS_WIDTH_ORIG) / 2,
            posY: ((CANVAS_HEIGHT - CANVAS_HEIGHT_ORIG) / 2) - (position.posY + (PAC_HEIGHT / 2))
        }
        return relativePosition;
    };

    const isInCanvasWidth = function(posX) {
        return posX > CANVAS_WIDTH_ORIG && posX < CANVAS_WIDTH;
    };

    const canMoveHorizontally = function(posX, posY, parcours) {
        if (isInCanvasWidth(posX)) {
            return parcours.isOnTrack(getRelativePosition( {
                posX: posX,
                posY: posY
            }));
        }
        return false;
    };

    const isInCanvasHeight = function(posY) {
        return posY > CANVAS_HEIGHT_ORIG && posY < CANVAS_HEIGHT;
    };

    const canMoveVertically = function(posX, posY, parcours) {
        if (isInCanvasHeight(posY)) {
            return parcours.isOnTrack(getRelativePosition( {
                posX: posX,
                posY: posY
            }));
        }
        return false;
    };

    const isMoveValid = function (wishedPosition, parcours) {
        if (wishedPosition.axis === HORIZONTAL) {
            return canMoveHorizontally(wishedPosition.position.posX, wishedPosition.position.posY, parcours);
        }
        else {
            return canMoveVertically(wishedPosition.position.posX, wishedPosition.position.posY, parcours);
        }
    };
    const getWishedPosition = function(that, direction) {
        const axis = (direction === LEFT || direction === RIGHT) ? HORIZONTAL : VERTICAL;
        const newPosX = (direction === LEFT) ? that.posX - INC : (direction === RIGHT) ? that.posX + INC : that.posX;
        const newPosY = (direction === UP) ? that.posY - INC : (direction === DOWN) ? that.posY + INC : that.posY;
        return {
            axis: axis,
            position: {
                posX: newPosX,
                posY: newPosY
            }
        }

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
            const wishedPosition = getWishedPosition(that, direction);
            if (isMoveValid(wishedPosition, parcours)) {
                this.posX = wishedPosition.position.posX;
                this.posY = wishedPosition.position.posY;
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

