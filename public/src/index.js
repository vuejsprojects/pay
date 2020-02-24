import { initCanvas} from './canvas.js';
import { getPac } from './pacman.js';
import { parcours } from './parcours.js';
import { getBeast } from './beast.js';
import { CANVAS_CENTER } from './point.js';
import { prizes } from './prizes.js'
import { setGameTimer} from './game-timer.js'


const getKeypressHandler = function (pac, parcours) {
    const func = function () {
        pac.move(event, parcours);
    }
    return func;
}

const context = initCanvas();
const prizesSet = prizes(context);

const pac = getPac(context, prizesSet);

parcours.build();
parcours.display(context);

pac.initialPosition(CANVAS_CENTER);

const beasts = [
    getBeast(context, prizesSet, pac)
];
beasts.forEach(beast => {
    beast.chooseLine(parcours);
    beast.iAmBeast();
    beast.initialPosition(beast.fromUpperLeftCorner(beast.walkingLine.start));
});

prizesSet.sprinkle(parcours).display();

const setBeastWalkTimer = function () {
    return function() {
        const beastWalkTimer = setInterval(function() {
            beasts.forEach(beast => {
                beast.walkTheLine();
            });
        },50);
        return beastWalkTimer;
    }
}

const beastTimer = setBeastWalkTimer();
pac.startBeastTimer(beastTimer);

pac.startGameTimer(setGameTimer());

const keypressHandler = getKeypressHandler(pac, parcours);
window.addEventListener("keydown", keypressHandler, true);
pac.saveKeyDownEventHandler("keydown", keypressHandler);

