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

const line = function(start, end) {
    return {
        start: start,
        end: end
    }
};

const parcours = {
    layout: [
        line(point(0, 0), point(0, 190)),
        line(point(0, 190), point(190, 190)),
        line(point(190, 0), point(190, 190)),
        line(point(150, 120), point(150, 190)),
        line(point(100, 120), point(190, 120)),
        line(point(100, 120), point(100, 190)),
        line(point(0, 120), point(100, 120)),
        line(point(100, 20), point(100, 120)),
        line(point(40, 80), point(160, 80)),
        line(point(0, 0), point(190, 0)),
        line(point(50, 0), point(50, 30)),
        line(point(0, 30), point(50, 30))
    ],
    build: function() {
        const mirrorPoints = function(aLine) {
            return [
                line(point(aLine.start.x, -aLine.start.y), point(aLine.end.x, -aLine.end.y)),
                line(point(-aLine.start.x, -aLine.start.y), point(-aLine.end.x, -aLine.end.y)),
                line(point(-aLine.start.x, aLine.start.y), point(-aLine.end.x, aLine.end.y))
            ];
        }
        const layoutLen = this.layout.length;
        for (let i = 0; i < layoutLen; i++) {
            this.layout.push.apply(this.layout, mirrorPoints(this.layout[i]));
        }
    },
    isOnTrack: function(position) {
        const x = position.posX;
        const y = position.posY;
        let within = false;
        for (let i = 0; i < this.layout.length; i++) {
            const condX = x >= 0 ? x >= this.layout[i].start.x && x <= this.layout[i].end.x
                                : x <= this.layout[i].start.x && x >= this.layout[i].end.x;
            const condY = y >= 0 ? y >= this.layout[i].start.y && y <= this.layout[i].end.y
                                : y <= this.layout[i].start.y && y >= this.layout[i].end.y;

            if (condX && condY) {
                within = true;
                break;
            }
        };
        return within;
    },
    displayToFix: function(context) {
        this.drawBorders(context); // need to fix the border and remove the fudge in display(): tip see pb by not showing parcours
        context.beginPath();
        context.lineWidth = 2
        context.setLineDash([2,2]);
        context.strokeStyle = LINE_COLOR;
        this.layout.forEach(line => {
            context.moveTo(line.start.getX(), line.start.getY());
            context.lineTo(line.end.getX(), line.end.getY());
            context.stroke();
        });
    },
    display: function(context) {
        this.drawBorders(context);
        this.layout.forEach(line => {
            context.beginPath();
            context.lineWidth = LINE_WIDTH;
            context.setLineDash([]);
            context.strokeStyle = 'green';
            context.moveTo(line.start.getX(), line.start.getY());
            context.lineTo(line.end.getX(), line.end.getY());
            context.stroke();

            context.beginPath();
            context.lineWidth = 2;
            context.setLineDash([2,2]);
            context.strokeStyle = LINE_COLOR;
            context.moveTo(line.start.getX(), line.start.getY());
            context.lineTo(line.end.getX(), line.end.getY());
            context.stroke();
        });
    },
    drawBorders: function(context) {
        context.beginPath();
        context.strokeStyle = BORDER_COLOR;
        context.lineWidth = LINE_WIDTH;
        this.layout.forEach(line => {
            console.log(line);
            if (line.start.getY() === line.end.getY()) {
                // horizontal borders
                context.moveTo(line.start.getX() + ((line.end.x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line.start.getY() - LINE_WIDTH);
                context.lineTo(line.end.getX() + ((line.end.x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line.end.getY() - LINE_WIDTH);

                context.moveTo(line.start.getX() + ((line.end.x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line.start.getY() + LINE_WIDTH);
                context.lineTo(line.end.getX() + ((line.end.x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line.end.getY() + LINE_WIDTH);
                context.stroke();
            }
            else {
                // vertical border
                context.moveTo(line.start.getX() - LINE_WIDTH, line.start.getY() + ((line.end.y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));
                context.lineTo(line.end.getX() - LINE_WIDTH, line.end.getY() + ((line.end.y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));

                context.moveTo(line.start.getX() + LINE_WIDTH, line.start.getY() + ((line.end.y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));
                context.lineTo(line.end.getX() + LINE_WIDTH, line.end.getY() + ((line.end.y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));
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
        LEFT: LEFT,
        RIGHT: RIGHT,
        UP: UP,
        DOWN: DOWN,
        posX: 0,
        posY: 0,
        initialPosition: function (position) {
            center = centerPacCoordinates(position);
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
                return true;
            }
            else {
                return false;
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

const getBeast = function(context) {

    const beast = getPac(context);

    const roundRobinMove = {};
    roundRobinMove[beast.UP] = beast.RIGHT;
    roundRobinMove[beast.DOWN] = beast.LEFT;
    roundRobinMove[beast.RIGHT] = beast.DOWN;
    roundRobinMove[beast.LEFT] = beast.UP;

    const newDirection = {};
    newDirection[beast.RIGHT] = [beast.UP, beast.DOWN];
    newDirection[beast.LEFT] = [beast.DOWN, beast.UP];
    newDirection[beast.UP] = [beast.LEFT, beast.RIGHT];
    newDirection[beast.DOWN] = [beast.RIGHT, beast.LEFT];

    const randomWalk = function() {
        const axis = randomWalkAxis();
        const ra = Math.floor(Math.random() * 2);
        console.log("DWON LEFT or UP RIGHT: ", ra);
        if( ra === 0) {
            return (axis === VERTICAL) ? beast.DOWN : beast.LEFT;
        }
        else {
            return (axis === VERTICAL) ? beast.UP : beast.RIGHT;
        }
    };

    const randomWalkAxis = function() {
        const ra = Math.floor(Math.random() * 2);
        console.log("Random axis: ",ra);
        return ra === 0 ? HORIZONTAL : VERTICAL;
    };

    const nextMove = function(lastMove) {
        return roundRobinMove[lastMove];
    };

    const getNewDirection = function(lastMove) {
        return newDirection[lastMove][getRandomNumber(0,2)];
    };

    // random number [min, max[
    const getRandomNumber = function(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    const isTimeToChangeDirection = function() {
        let counter = 0;
        let randomNumber = getRandomNumber(0, 5);
        return function() {
            counter += 1;
            if (counter > randomNumber) {
                counter = 0;
                randomNumber = getRandomNumber(0, 5);
                return true;
            } 
            else {
                return Math.floor(Math.random() * 15) > 12;
            }
        }
    }

    beast.isTimeToChangeDirection = isTimeToChangeDirection();

    beast.chooseLine = function(parcours) {
        this.walkingLine = parcours.layout[
            Math.floor(Math.random() * parcours.layout.length)
        ];
    };

    beast.walkTheLine = function() {
        if (!this.lastMove) {
            this.lastMove = randomWalk();
        }
        const moved = this.move({keyCode: this.lastMove}, parcours);
        if (!moved) {
            this.lastMove = nextMove(this.lastMove);
        }
        else  {
            if (this.isTimeToChangeDirection()) {
                const newDirection = getNewDirection(this.lastMove);
                const success = this.move({keyCode: newDirection}, parcours);
                if (success) {
                    this.lastMove = newDirection;
                }
            }
        }
    };
    beast.fromUpperLeftCorner = function(point) {
        return {
            posX: point.getX(),
            posY: point.getY()
        }
    };
    return beast;
};

const getKeypressHandler = function (pac, parcours) {
    const func = function () {
        pac.move(event, parcours);
    }
    return func;
}

const context = intCanvas();
const pac = getPac(context);
parcours.build();
parcours.display(context);
pac.initialPosition(CANVAS_CENTER);

const beasts = [
    getBeast(context)
];
beasts.forEach(beast => {
    beast.chooseLine(parcours);
    beast.initialPosition(beast.fromUpperLeftCorner(beast.walkingLine.start));
});

setInterval(function() {
    beasts.forEach(beast => {
        beast.walkTheLine();
    });
},50);


const keypressHandler = getKeypressHandler(pac, parcours);

window.addEventListener("keydown", keypressHandler, true);

