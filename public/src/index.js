import { initCanvas} from './canvas.js';
import { getPac } from './pacman.js';
import { parcours } from './parcours.js';
import { getBeast } from './beast.js';
import { CANVAS_CENTER } from './point.js';
import { prizes } from './prizes.js'


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
    getBeast(context, prizesSet)
];
beasts.forEach(beast => {
    beast.chooseLine(parcours);
    beast.iAmBeast();
    beast.initialPosition(beast.fromUpperLeftCorner(beast.walkingLine.start));
});

prizesSet.sprinkle(parcours).display();

setInterval(function() {
    beasts.forEach(beast => {
        beast.walkTheLine();
    });
},50);


const keypressHandler = getKeypressHandler(pac, parcours);

window.addEventListener("keydown", keypressHandler, true);

