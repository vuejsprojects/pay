import { getCanvas} from './canvas.js';
import { getPac } from './pacman.js';
import { parcours } from './parcours.js';
import { getBeastsManager } from './beastsManager.js'
import { CANVAS_CENTER } from './point.js';
import { prizes } from './prizes.js'
import { setGameTimer, getElasedTime} from './game-timer.js'
import { getDomManager } from './domManager.js'
import { startButton } from './startButton.js'
import { getImagePromises, attachImagesToDiv } from './images.js';
import { setMotionEventHandler} from './motionEventHandler.js'

(function() {
    // lock screen orientation to portrait in theory
    if ('orientation' in screen) {
        screen.orientation.lock("portrait-primary");
    }
})();

const domManager = getDomManager();

const start = Date.now();

Promise.all(getImagePromises()).then(arImages => {
    console.log('Got all the images in ', (Date.now() - start), ' ms');
    attachImagesToDiv(arImages);

    const canvas = getCanvas(domManager);
    const context = canvas.initCanvas();
    const prizesSet = prizes(context);

    const pac = getPac(context, prizesSet);

    parcours.build();
    parcours.display(context);

    const beastsManager = getBeastsManager();
    beastsManager.addBeast(context, prizesSet, pac, parcours);
    pac.setBeastsManager(beastsManager);

    pac.initialPosition(CANVAS_CENTER);

    prizesSet.sprinkle(parcours).display();

    const boardLoader = function() {
        let gameLevel = 0;
        return function() {
            gameLevel += 1;
            let isNewGameTimer = true;
            let gameTimerStartingTime = 0;

            pac.setGameStarted();
            if (gameLevel > 1) {
                if (pac.isPacAlive()) {
                    // add beast
                    beastsManager.addBeast(context, prizesSet, pac, parcours);
                    // elapsed time should not start from 0
                    isNewGameTimer = false;
                }
                else {
                    gameLevel = 1;
                    beastsManager.removeBeasts();
                    beastsManager.addBeast(context, prizesSet, pac, parcours);
                    pac.resetCounter();
                    isNewGameTimer = true;
                }
                pac.resetRoundOver();
                beastsManager.activateAllBeasts();
                canvas.redrawBackground();
                parcours.display(context);
                // reactivate prizes
                prizesSet.display();
                pac.reactivatePac();
            }

            domManager.setValue("board-counter", gameLevel);
            startButton.disable();
            canvas.getFocus();

            const beastTimer = beastsManager.setBeastWalkTimer();
            pac.startBeastTimer(beastTimer);

            if (!isNewGameTimer) {
                gameTimerStartingTime = getElasedTime();
            }
            pac.startGameTimer(setGameTimer, gameTimerStartingTime);

            setMotionEventHandler(domManager, pac, parcours);

        }
    }

    const loader = boardLoader();
    startButton.setFocus();
    startButton.on("click", loader);
}).catch(error => console.error("Error loading resources: ", e));