import { LEFT, RIGHT, UP, DOWN, WINDOW_ID } from './settings.js';


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

const setMotionEventHandler = function(domManager, pac, parcours) {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        const motionHandler = getMotionHandler(pac, parcours);
        domManager.addEventListener("devicemotion", motionHandler, WINDOW_ID);
        pac.saveKeyDownEventHandler("devicemotion", motionHandler);
    }
    else {
        const keypressHandler = getKeypressHandler(pac, parcours);
        domManager.addEventListener("keydown", keypressHandler);
        pac.saveKeyDownEventHandler("keydown", keypressHandler);
    }

}

export {setMotionEventHandler};