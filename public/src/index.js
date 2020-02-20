import { initCanvas} from './canvas.js';
import { getPac } from './pacman.js';
import { parcours } from './parcours.js';
import { getBeast } from './beast.js';
import { CANVAS_CENTER } from './point.js';


const getKeypressHandler = function (pac, parcours) {
    const func = function () {
        pac.move(event, parcours);
    }
    return func;
}

const context = initCanvas();
const pac = getPac(context);
parcours.build();
parcours.display(context);
pac.initialPosition(CANVAS_CENTER);

const beasts = [
    getBeast(context)
];
beasts.forEach(beast => {
    beast.chooseLine(parcours);
    beast.initialPosition(beast.fromUpperLeftCorner(beast.walkingLine.start));
});

setInterval(function() {
    beasts.forEach(beast => {
        beast.walkTheLine();
    });
},50);


const keypressHandler = getKeypressHandler(pac, parcours);

window.addEventListener("keydown", keypressHandler, true);

