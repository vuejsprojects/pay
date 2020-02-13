const CANVAS_WIDTH_ORIG = 0;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT_ORIG = 0;
const CANVAS_HEIGHT = 400;
const BACKGROUND = 'blue';
const PAC_COLOR = 'white';
const LINE_WIDTH = 10;
const LINE_COLOR = 'orange';
const BORDER_COLOR = 'red';
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
        // upper right
        [point(0, 0), point(0, 190)],
        [point(0, 190), point(190, 190)],
        [point(190, 0), point(190, 190)],
        // vertical to upper right
        [point(150, 120), point(150, 190)],
        // crossroad
        [point(100, 120), point(190, 120)],
        [point(100, 120), point(100, 190)],
        [point(0, 120), point(100, 120)],
        [point(100, 20), point(100, 120)],
        // horizontal in crossroad
        [point(40, 80), point(160, 80)],
        [point(0, 0), point(190, 0)],
        [point(50, 0), point(50, 30)],
        [point(0, 30), point(50, 30)] // [point(50, 30), point(20, 30)] need strating point < ending point


        // // lower right
        // [point(0, 0), point(0, -190)],
        // [point(0, -190), point(190, -190)],
        // [point(190, 0), point(190, -190)],
        // // vertical to lower right
        // [point(150, -120), point(150, -1190)],
        // // crossroad
        // [point(100, -120), point(190, -120)],
        // [point(100, -120), point(100, -190)],
        // [point(0, -120), point(100, -120)],
        // [point(100, -20), point(100, -120)],
        // // horizontal in crossroad
        // [point(40, -80), point(160, -80)],
        // [point(0, 0), point(190, 0)],
        // [point(50, 0), point(50, -30)],
        // [point(0, -30), point(50, -30)], // [point(50, 30), point(20, 30)] need strating point < ending point
    ],
    build: function() {
        const mirrorPoints = function(line) {
            return [
                [point(line[0].x, -line[0].y), point(line[1].x, -line[1].y)],
                [point(-line[0].x, -line[0].y), point(-line[1].x, -line[1].y)],
                [point(-line[0].x, line[0].y), point(-line[1].x, line[1].y)],
            ];
        }
        const layoutLen = this.layout.length;
        for (let i=0; i< layoutLen; i++) {
            this.layout.push.apply(this.layout, mirrorPoints(this.layout[i]));
        }
    },
    isOnTrack: function(position) {
        const x = position.posX;
        const y = position.posY;
        let within = false;
        for (let i = 0; i < this.layout.length; i++) {
            const condX = x >= 0 ? x >= this.layout[i][0].x && x <= this.layout[i][1].x
                                : x <= this.layout[i][0].x && x >= this.layout[i][1].x;
            const condY = y >= 0 ? y >= this.layout[i][0].y && y <= this.layout[i][1].y
                                : y <= this.layout[i][0].y && y >= this.layout[i][1].y;

            if (condX && condY) {
                within = true;
                break;
            }
        };
        return within;
    },
    display: function(context) {
        this.drawBorders(context);
        context.beginPath();
        context.strokeStyle = LINE_COLOR;
        this.layout.forEach(line => {
            context.moveTo(line[0].getX(), line[0].getY());
            context.lineTo(line[1].getX(), line[1].getY());
            context.stroke();
        });
    },
    drawBorders: function(context) {
        context.beginPath();
        context.strokeStyle = BORDER_COLOR;
        context.lineWidth = LINE_WIDTH;
        this.layout.forEach(line => {
            if (line[0].getY() === line[1].getY()) {
                // horizontal borders
                context.moveTo(line[0].getX() + ((line[1].x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line[0].getY() - LINE_WIDTH);
                context.lineTo(line[1].getX() + ((line[1].x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line[1].getY() - LINE_WIDTH);

                context.moveTo(line[0].getX() + ((line[1].x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line[0].getY() + LINE_WIDTH);
                context.lineTo(line[1].getX() + ((line[1].x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line[1].getY() + LINE_WIDTH);
                context.stroke();
            }
            else {
                // vertical border
                // context.moveTo(line[0].getX() - LINE_WIDTH, line[0].getY() + (line[0].y > 0) ? (LINE_WIDTH / - 2) : (LINE_WIDTH / 2));
                // context.lineTo(line[1].getX() - LINE_WIDTH, line[1].getY() + (line[0].y > 0) ? (LINE_WIDTH / - 2) : (LINE_WIDTH / 2));
                context.moveTo(line[0].getX() - LINE_WIDTH, line[0].getY() + ((line[1].y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));
                context.lineTo(line[1].getX() - LINE_WIDTH, line[1].getY() + ((line[1].y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));

                context.moveTo(line[0].getX() + LINE_WIDTH, line[0].getY() + ((line[1].y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));
                context.lineTo(line[1].getX() + LINE_WIDTH, line[1].getY() + ((line[1].y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));
                context.stroke();
            }
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

    const canMoveHorizontally = function(position, parcours) {
        if (isInCanvasWidth(position.posX)) {
            return parcours.isOnTrack(getRelativePosition( {
                posX: position.posX,
                posY: position.posY
            }));
        }
        return false;
    };

    const isInCanvasHeight = function(posY) {
        return posY > CANVAS_HEIGHT_ORIG && posY < CANVAS_HEIGHT;
    };

    const canMoveVertically = function(position, parcours) {
        if (isInCanvasHeight(position.posY)) {
            return parcours.isOnTrack(getRelativePosition( {
                posX: position.posX,
                posY: position.posY
            }));
        }
        return false;
    };

    const isMoveValid = function (wishedPosition, parcours) {
        if (wishedPosition.axis === HORIZONTAL) {
            return canMoveHorizontally(wishedPosition.position, parcours);
        }
        else {
            return canMoveVertically(wishedPosition.position, parcours);
        }
    };
    const getWishedPosition = function(currentPosition, direction) {
        const axis = (direction === LEFT || direction === RIGHT) ? HORIZONTAL : VERTICAL;
        const newPosX = (direction === LEFT) ? currentPosition.posX - INC : (direction === RIGHT) ? currentPosition.posX + INC : currentPosition.posX;
        const newPosY = (direction === UP) ? currentPosition.posY - INC : (direction === DOWN) ? currentPosition.posY + INC : currentPosition.posY;
        return {
            axis: axis,
            position: {
                posX: newPosX,
                posY: newPosY
            }
        }

    };
    const centerPacCoordinates = function(coordinates) {
        const center = {
            posX: coordinates.posX - (PAC_WIDTH / 2),
            posY: coordinates.posY - (PAC_HEIGHT / 2)
        }
        return center
    };

    return {
        posX: 0,
        posY: 0,
        initialPosition: function (spec) {
            center = centerPacCoordinates(spec);
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
                this.setNewPosition(wishedPosition);
                this.draw();
            }
        },
        setNewPosition: function(newPosition) {
            this.posX = newPosition.position.posX;
            this.posY = newPosition.position.posY;
    },
        draw: function() {
            context.fillStyle = PAC_COLOR;
            context.fillRect(this.posX, this.posY, PAC_WIDTH, PAC_HEIGHT);
            context.fillStyle = BACKGROUND;
            context.fillRect(this.prevPosX, this.prevPosY, PAC_WIDTH, PAC_HEIGHT);
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
parcours.build();
parcours.display(context);

const keypressHandler = getKeypressHandler(pac, parcours);

window.addEventListener("keydown", keypressHandler, true);

