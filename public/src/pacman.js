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
    LINE_COLOR,
    ARC,
    BOOST_COLOR,
    GAME_OVER_COLOR
} from './settings.js';
import { CANVAS_CENTER } from './point.js';
import { getDocManager } from './docManager.js'


const docMgr = getDocManager();
//
// getPac is called by beast as well in this case it need a reference to pac
//
const getPac = function (context, prizes, pac) {

    // TODO square would have to be recentered before end so (PAC_WIDH / 2) on posX and (PAC_HEIGHT / 2)
    // on posY not needed to readjust position
    const getRelativePosition = function( position) {
        
        const relativePosition = {
            posX: position.posX - (CANVAS_WIDTH - CANVAS_WIDTH_ORIG) / 2,
            posY: ((CANVAS_HEIGHT - CANVAS_HEIGHT_ORIG) / 2) - position.posY
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
    const centerPacCoordinates = function(shape, coordinates) {
        const center = {
            posX: 0,
            posY: 0
        }
        if (shape === ARC) {
            center.posX =  coordinates.posX;
            center.posY = coordinates.posY;
        }
        else {
            center.posX =  coordinates.posX - (PAC_WIDTH / 2);
            center.posY = coordinates.posY - (PAC_HEIGHT / 2);
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
        prevPosX: 0,
        prevPosY: 0,
        beast: false,
        color: PAC_COLOR,
        myShape: ARC,
        specialPower: false,
        counter: 0,
        pacAlive: true,
        powerTimeout: undefined,
        beastsManager: undefined,

        iAmBeast: function() {
            this.beast = true;
            this.color = BEAST_COLOR;
        },
        isBeast: function() {
            return this.beast;
        },
        initialPosition: function (position, shape) {
            this.myShape = shape || this.myShape;
            const center = centerPacCoordinates(this.myShape, position);
            this.posX = center.posX;
            this.posY = center.posY;
            this.prevPosX = this.posX,
            this.prevPosY = this.posY,
            this.drawShape();
            // context.fillStyle = this.color;
            // context.fillRect(this.posX, this.posY, PAC_WIDTH, PAC_HEIGHT);
            this.displayCounter();
        },
        setBeastsManager: function(beastsManager) {
            this.beastsManager = beastsManager;
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
            this.drawShape();
        },
        drawShape: function() {
            if (this.myShape === ARC) {
                if (this.prevPosX && this.prevPosY) {
                    this.drawPreviousPosition();
                    // TODO why previousPos
                    const relativePosition = getRelativePosition({posX: this.prevPosX, posY: this.prevPosY});
                    const prizeIndex = prizes.isPrizeLocation(relativePosition.posX, relativePosition.posY, this.isBeast());
                    if (prizeIndex !== undefined) {
                        if( this.isBeast()) {
                            prizes.redrawPrize(prizeIndex);
                        }
                        else {
                            this.incrementCounter(5);
                            if (prizes.areAllLocationsInactive() && !this.isBeast()) {
                                this.gameWon();
                            }
                            else {
                                this.acquireSpecialPower();
                                this.color = BOOST_COLOR;
                                if (this.powerTimeout) {
                                    clearTimeout(this.powerTimeout);
                                }
                                this.powerTimeout = setTimeout(this.prepareEndOfSpecialPower(), 10000);
                            }
                        }
                    }
                }

                if (this.isBeast()){
                    if (this.posX === pac.posX && this.posY === pac.posY) {
                        if (pac.hasSpecialPower()) {
                            this.deactiveBeast();
                            pac.incrementCounter(10);
                            return;
                        }
                        else {
                            pac.gameOver();
                        }
                    }
                }
                else {
                    const matchingBeast = this.beastsManager.matchBeastPosition(this);
                    if (matchingBeast) {
                        if (this.hasSpecialPower()) {
                            matchingBeast.deactiveBeast();
                            this.incrementCounter(10);
                            return;
                        }
                        else {
                            this.gameOver();
                        }
                    }
                }

                this.drawCurrentPosition()
            }
            else {
                context.fillStyle = this.color;
                context.fillRect(this.posX, this.posY, PAC_WIDTH, PAC_HEIGHT);
                if (this.prevPosX && this.prevPosY) {
                    context.fillStyle = BACKGROUND;
                    context.fillRect(this.prevPosX, this.prevPosY, PAC_WIDTH, PAC_HEIGHT);
                }
            }

        },
        drawCurrentPosition: function() {
            const x = this.posX;
            const y =  this.posY;
            const color = this.color;
            this.drawPosition(x, y, color);
        },
        drawPreviousPosition: function() {
            const x = this.prevPosX;
            const y =  this.prevPosY;
            const color = 'green'; // TODO BACKGROUND;
            this.drawPosition(x, y, color);
        },
        drawPosition: function(x, y, color) {
            context.beginPath();
            context.fillStyle = color;
            context.arc(x, y, PAC_WIDTH / 2, 0, 2 * Math.PI);
            context.fill();
            context.closePath();

        },
        acquireSpecialPower: function() {
            this.specialPower = true;
        },
        hasSpecialPower: function() {
            return this.specialPower;
        },
        prepareEndOfSpecialPower: function() {
            const that = this;
            return function() {
                that.endOfSpecialPower()
            };

        },
        endOfSpecialPower: function() {
            this.color = PAC_COLOR;
            this.drawCurrentPosition();
            this.specialPower = false;
        },
        displayCounter: function() {
            docMgr.setValue('counter', this.counter);
        },
        incrementCounter: function(inc) {
            this.counter += inc;
            this.displayCounter();
        },
        resetCounter: function() {
            this.counter = 0;
            this.displayCounter();
        },
        gameOver: function() {
            this.displayGameOverMessage();
            this.stopGame();
            this.deactivatePac();
            this.setStartButtonTo('Start New Game');
        },
        gameWon:  function() {
            this.displayGameWonMessage();
            this.stopGame();
            this.endOfSpecialPower();
            this.setStartButtonTo('Next Level');
        },
        stopGame: function() {
            this.stopBeastTimer();
            this.stopCapturingPacMotion();
            this.stopGameTimer();
        },
        setStartButtonTo: function(label) {
            docMgr.enable("start-button");
            docMgr.setValue("start-button", label);
        },
        displayGameOverMessage: function() {
            context.font = '48px serif';
            context.fillStyle = GAME_OVER_COLOR;
            context.fillText('Game Over!!!!', 10, CANVAS_HEIGHT_ORIG + (CANVAS_HEIGHT - CANVAS_HEIGHT_ORIG)/2);
        },
        displayGameWonMessage: function() {
            context.font = '48px serif';
            context.fillStyle = GAME_OVER_COLOR;
            context.fillText('Bravo!!!!', 10, CANVAS_HEIGHT_ORIG + (CANVAS_HEIGHT - CANVAS_HEIGHT_ORIG)/2);
        },
        startBeastTimer: function(beastTimer) {
            this.beastSetInterval = beastTimer();
        },
        stopBeastTimer: function() {
            clearInterval(this.beastSetInterval);
        },
        startGameTimer: function(setGameTimer, from) {
            this.gameTimer = setGameTimer(from);
        },
        stopGameTimer: function() {
            clearInterval(this.gameTimer);
        },
        // TODO move all beast method to beast
        saveKeyDownEventHandler: function(event, keypressHandler) {
            this.capturedEvent = event;
            this.eventHandler = keypressHandler;
        },
        deactivatePac: function() {
            this.pacAlive = false;
        },
        stopCapturingPacMotion: function() {
            docMgr.removeEventListener(this.capturedEvent, this.eventHandler);
        },
        reactivatePac: function() {
            this.pacAlive = true;
            this.initialPosition(CANVAS_CENTER);
        },
        isPacAlive: function() {
            return this.pacAlive;
        }
    }
}

export {getPac};