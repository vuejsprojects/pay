import { getCanvas} from './canvas.js';
import { getPac } from './pacman.js';
import { parcours } from './parcours.js';
import { getBeast } from './beast.js';
import { getBeastsManager } from './beastsManager.js'
import { CANVAS_CENTER } from './point.js';
import { prizes } from './prizes.js'
import { setGameTimer, getElasedTime} from './game-timer.js'
import { getDocManager } from './docManager.js'


const docManager = getDocManager();
const getKeypressHandler = function (pac, parcours) {
    const func = function () {
        pac.move(event, parcours);
    }
    return func;
}

const canvas = getCanvas(docManager);
const context = canvas.initCanvas();
const prizesSet = prizes(context);

const pac = getPac(context, prizesSet);

parcours.build();
parcours.display(context);

const beastsManager = getBeastsManager();
beastsManager.addBeast(context, prizesSet, pac, parcours); // one or more
pac.setBeastsManager(beastsManager);

pac.initialPosition(CANVAS_CENTER);

prizesSet.sprinkle(parcours).display();

const boardLoader = function() {
    let gameLevel = 0;
    return function() {
        gameLevel += 1;
        let newTimer = true;
        let gameTimerStartingTime = 0;

        if (gameLevel > 1) {
            if (pac.isPacAlive()) {
                // add beast
                beastsManager.addBeast(context, prizesSet, pac, parcours);
                // elapsed time should not start from 0
                newTimer = false;
            }
            else {
                gameLevel = 1;
                beastsManager.removeBeasts();
                beastsManager.addBeast(context, prizesSet, pac, parcours);
                pac.resetCounter();
                newTimer = true;
            }
            beastsManager.activateAllBeasts();
            canvas.redrawBackground();
            parcours.display(context);
            // reactivate prizes
            prizesSet.display();
            pac.reactivatePac();
        }

        docManager.setValue("board-counter", gameLevel);
        docManager.disable("start-button");
        canvas.getFocus();

        const beastTimer = beastsManager.setBeastWalkTimer();
        pac.startBeastTimer(beastTimer);

        if (!newTimer) {
            gameTimerStartingTime = getElasedTime();
        }
        pac.startGameTimer(setGameTimer, gameTimerStartingTime);

        const keypressHandler = getKeypressHandler(pac, parcours);
        docManager.addEventListener("keydown", keypressHandler);
        pac.saveKeyDownEventHandler("keydown", keypressHandler);
    }
}

const startGame = boardLoader();
// TODO regroup all action on start-button in a module
docManager.setFocus("start-button");
docManager.addEventListener("click", startGame, "start-button");