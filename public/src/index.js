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
import { setMotionEventHandler} from './motionEventHandler.js';
import { getGameManager } from './gameManager.js';

(function() {
    // lock screen orientation to portrait in theory
    if ('orientation' in screen) {
        try {
            screen.orientation.lock("portrait-primary");
        }
        catch(e) {
            console.log('Error locking the screen orientation: ', e);
        }
    }
})();

const domManager = getDomManager();

const start = Date.now();

Promise.all(getImagePromises()).then(arImages => {
    console.log('Got all the images in ', (Date.now() - start), ' ms');
    attachImagesToDiv(arImages);

    const canvas = getCanvas(domManager);
    const context = canvas.initCanvas();
    const gameManager = getGameManager(context);

    const prizesSet = prizes(context, gameManager);

    const pac = getPac(context, prizesSet);

    parcours.build();
    parcours.display(context);

    const beastsManager = getBeastsManager(gameManager);
    beastsManager.addBeast(context, prizesSet, pac, parcours);
    pac.setBeastsManager(beastsManager);

    pac.setGameManager(gameManager);
    pac.initialPosition(CANVAS_CENTER);

    prizesSet.sprinkle(parcours).display();

    const boardLoader = function() {
        let gameLevel = 0;
        gameManager.displayCounter();

        return function() {
            gameLevel += 1;
            let isNewGameTimer = true;
            let gameTimerStartingTime = 0;

            gameManager.setGameStarted();
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
                    gameManager.resetCounter();
                    isNewGameTimer = true;
                }
                gameManager.resetRoundOver();
                beastsManager.activateAllBeasts();
                canvas.redrawBackground();
                parcours.display(context);
                // reactivate prizes
                prizesSet.display();
                pac.reactivatePac();
                gameManager.displayCounter();
            }

            domManager.setValue("board-counter", gameLevel);
            startButton.disable();
            canvas.getFocus();

            const beastTimer = beastsManager.setBeastWalkTimer();
            gameManager.startBeastTimer(beastTimer);

            if (!isNewGameTimer) {
                gameTimerStartingTime = getElasedTime();
            }
            gameManager.startGameTimer(setGameTimer, gameTimerStartingTime);

            setMotionEventHandler(domManager, gameManager, pac, parcours);

        }
    }

    const loader = boardLoader();
    startButton.setFocus();
    startButton.on("click", loader);
}).catch(error => console.error("Error loading resources: ", error));