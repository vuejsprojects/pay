import {
    CANVAS_WIDTH_ORIG,
    CANVAS_WIDTH,
    CANVAS_HEIGHT_ORIG,
    CANVAS_HEIGHT,
    BACKGROUND,
    PAC_COLOR,
    BEAST_COLOR,
    PAC_HEIGHT,
    PAC_WIDTH,
    LEFT,
    RIGHT,
    UP,
    DOWN,
    HORIZONTAL,
    VERTICAL,
    INC,
    LINE_WIDTH,
    LINE_COLOR
} from './settings.js';

const getPac = function (context) {

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
        beast: false,
        color: PAC_COLOR,
        iAmBeast: function() {
            this.beast = true;
            this.color = BEAST_COLOR;
        },
        initialPosition: function (position) {
            const center = centerPacCoordinates(position);
            this.posX = center.posX;
            this.posY = center.posY;
            context.fillStyle = this.color;
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
        draw: function(direction) {
            const that = this;
            const drawLine = function(that, width, color, dashed) {
                context.beginPath();
                context.lineWidth = width;
                context.setLineDash(dashed || []);
                context.strokeStyle = color; 
                const c = getLineCoordinateFromTo(that, direction);
                context.moveTo(c.from.x, c.from.y);
                context.lineTo(c.to.x, c.to.y);
                context.stroke();
            };
            const getLineCoordinateFromTo = function(that, direction) {
                return {
                    from: {
                        x: direction === RIGHT ? that.prevPosX : direction === LEFT ? that.prevPosX + PAC_WIDTH : 
                        direction === UP ? that.prevPosX + (PAC_WIDTH/2) : that.prevPosX + (PAC_WIDTH/2),
                        y: that.prevPosY +(PAC_HEIGHT/2)
                    },
                    to: {
                        x: direction === RIGHT ? that.posX : direction === LEFT ? that.posX + PAC_WIDTH:
                        direction === UP ? that.posX + (PAC_WIDTH/2) : that.posX + (PAC_WIDTH/2),
                        y: that.posY +(PAC_HEIGHT/2)
                    }
                }
            };
            if (this.beast) {
                context.fillStyle = this.color;
                context.fillRect(this.posX, this.posY, PAC_WIDTH, PAC_HEIGHT);

                // context.fillStyle = BACKGROUND;
                // context.fillRect(this.prevPosX, this.prevPosY, PAC_WIDTH, PAC_HEIGHT);

                drawLine(that, LINE_WIDTH, 'green', []);
    
                drawLine(that, 2, LINE_COLOR, [2,2]);
            }
            else {
                context.fillStyle = this.color;
                context.fillRect(this.posX, this.posY, PAC_WIDTH, PAC_HEIGHT);
                context.fillStyle = BACKGROUND;
                context.fillRect(this.prevPosX, this.prevPosY, PAC_WIDTH, PAC_HEIGHT);
            }
        }
    }
}

export {getPac};