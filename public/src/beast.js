import { getPac } from './pacman.js'
import { parcours } from './parcours.js'
import {
    VERTICAL,
    HORIZONTAL
} from './settings.js';

const getBeast = function(context, prizes, pac) {

    const beast = getPac(context, prizes, pac);

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

    beast.beastActive = true;

    beast.isTimeToChangeDirection = isTimeToChangeDirection();

    beast.chooseLine = function(parcours) {
        while (true) {
            this.walkingLine = parcours.layout[
                Math.floor(Math.random() * parcours.layout.length)
            ];
            if (!this.walkingLine.noBeastStart) {
                return;
            }
        }
    };

    beast.walkTheLine = function() {
        if (this.beastActive) {
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

export {getBeast};