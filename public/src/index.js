import { getCanvas} from './canvas.js';
import { getPac } from './pacman.js';
import { parcours } from './parcours.js';
import { getBeastsManager } from './beastsManager.js'
import { CANVAS_CENTER } from './point.js';
import { prizes } from './prizes.js'
import { setGameTimer, getElasedTime} from './game-timer.js'
import { getDomManager } from './domManager.js'
import { startButton } from './startButton.js'
import { LEFT, RIGHT, UP, DOWN, WINDOW_ID } from './settings.js';


const domManager = getDomManager();

const images = [
    {id: "sherries", src: 'src/images/2Sherries.png'},
    {id: "duck", src: 'src/images/ducky.png'},
    {id: "boat", src: 'src/images/boat.png'},

    {id: "down", src: 'src/images/down.png'},
    {id: "down-red", src: 'src/images/down-red.png'},
    {id: "up", src: 'src/images/up.png'},
    {id: "up-red", src: 'src/images/up-red.png'},
    {id: "left", src: 'src/images/left.png'},
    {id: "left-red", src: 'src/images/left-red.png'},
    {id: "right", src: 'src/images/right.png'},
    {id: "right-red", src: 'src/images/right-red.png'},
    {id: "full", src: 'src/images/full.png'},
    {id: "full-red", src: 'src/images/full-red.png'},

    {id: "beast", src: 'src/images/beast.png'}
];

const start = Date.now();

const loadImage = function (img) {
    return new  Promise(resolve => {
        const image = new Image();
        image.setAttribute('id', img.id) 
        image.addEventListener('load', () => {
            console.log('loaded ', image.getAttribute('id'), 'in ', (Date.now() - start));
            resolve(image);
        });
        image.src = img.src;
    });
}

const getImagePromises = function() {
    const imagePromises = [];
    for (let i=0; i < images.length; i++) {
        imagePromises.push(loadImage(images[i]));
    }
    return imagePromises;
}

Promise.all(getImagePromises()).then(result => {
    console.log('Got all the images in ', (Date.now() - start), ' ms');
    const imagesDiv = document.getElementById('images');
    for (let i=0; i < result.length; i++) {
        imagesDiv.appendChild(result[i]); 
    }

    const getKeypressHandler = function (pac, parcours) {
        const func = function () {
            pac.move(event, parcours);
        }
        return func;
    }

    const getMotionHandler = function (pac, parcours) {
        let lastInterval = 0;
        const DELAY = 70;  // msec
        const func = function () {
            const motionEvent = {};
            var aX = event.accelerationIncludingGravity.x * 10;
            var aY = event.accelerationIncludingGravity.y * 10;
            var aZ = event.accelerationIncludingGravity.z * 10;
        
            const horizontalAxis = ((aX > 0) ? LEFT : RIGHT);
            const verticalAxis = ((aZ > 90) ? UP : DOWN);
            
            lastInterval += event.interval;
            if (lastInterval > DELAY) {
                lastInterval = 0;
                motionEvent.keyCode = horizontalAxis;
                pac.move(motionEvent, parcours);
                motionEvent.keyCode = verticalAxis;
                pac.move(motionEvent, parcours);
            } 
        }
        return func;
    }

    const canvas = getCanvas(domManager);
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

            pac.setGameStarted();
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

            if (!newTimer) {
                gameTimerStartingTime = getElasedTime();
            }
            pac.startGameTimer(setGameTimer, gameTimerStartingTime);

            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                const motionHandler = getMotionHandler(pac, parcours);
                domManager.addEventListener("devicemotion", motionHandler, WINDOW_ID);
                // window.addEventListener("devicemotion", motionHandler, true);
                pac.saveKeyDownEventHandler("devicemotion", motionHandler);
            }
            else {
                const keypressHandler = getKeypressHandler(pac, parcours);
                domManager.addEventListener("keydown", keypressHandler);
                pac.saveKeyDownEventHandler("keydown", keypressHandler);
            }
        }
    }

    const loader = boardLoader();
    startButton.setFocus();
    startButton.on("click", loader);
}).catch(error => console.error("Error loading resources: ", e));