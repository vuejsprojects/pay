import { getCanvas} from './canvas.js';
import { getPac } from './pacman.js';
import { parcours } from './parcours.js';
import { getBeast } from './beast.js';
import { getBeastsManager } from './beastsManager.js'
import { CANVAS_CENTER } from './point.js';
import { prizes } from './prizes.js'
import { setGameTimer} from './game-timer.js'


const getKeypressHandler = function (pac, parcours) {
    const func = function () {
        pac.move(event, parcours);
    }
    return func;
}

const canvas = getCanvas();
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
    let boardCounter = 0;
    return function() {
        boardCounter += 1;
        if (boardCounter > 1) {
            if (pac.isPacAlive()) {
                // add beast
                beastsManager.addBeast(context, prizesSet, pac, parcours);
                // elapsed time should not start from 0
            }
            else {
                beastsManager.removeBeasts();
                beastsManager.addBeast(context, prizesSet, pac, parcours);
                pac.resetCounter();
            }
            beastsManager.activateAllBeasts();
            canvas.redrawBackground();
            parcours.display(context);
            // reactivate prizes
            prizesSet.display();
            pac.reactivatePac();
        }
        document.getElementById("start-button").disabled = true;
        canvas.getFocus();

        const beastTimer = beastsManager.setBeastWalkTimer();
        pac.startBeastTimer(beastTimer);

        pac.startGameTimer(setGameTimer());

        const keypressHandler = getKeypressHandler(pac, parcours);
        document.addEventListener("keydown", keypressHandler, true);
        pac.saveKeyDownEventHandler("keydown", keypressHandler);
    }
}

const startGame = boardLoader();
// TODO regroup all action on start-button in a module
const startButton = document.getElementById ("start-button");
startButton.focus();
startButton.addEventListener("click", startGame, true);
