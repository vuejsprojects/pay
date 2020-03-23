import { getBeast } from './beast.js';


const getBeastsManager = function(gameManager) {
    const beastsManager = {
        beasts: [
        ]
    };

    beastsManager.addBeast = function(context, prizesSet, pac, parcours) {
        const beast = getBeast(context, prizesSet, pac)
        beast.setGameManager(gameManager);
        beast.chooseLine(parcours);
        beast.iAmBeast();
        beast.initialPosition(beast.fromUpperLeftCorner(beast.walkingLine.start));
        this.beasts.push(beast);
    };
    beastsManager.setBeastWalkTimer = function () {
        const that = this;
        return function() {
            const beastWalkTimer = setInterval(function() {
                // TODO should use for loop instead?
                that.beasts.forEach(beast => {
                    beast.walkTheLine();
                });
            },50);
            return beastWalkTimer;
        }
    };
    beastsManager.activateAllBeasts = function() {
        for (let i=0; i < this.beasts.length; i++) {
            this.beasts[i].activeBeast();
        }
    };
    beastsManager.matchBeastPosition = function(pac) {
        for (let i = 0; i < this.beasts.length; i++) {
            if (this.beasts[i].isBeastActive() && this.beasts[i].matchPosition(pac)) {
                return this.beasts[i];
            }
        }
    }
    beastsManager.removeBeasts = function() {
        this.beasts.splice(0, this.beasts.length);
    }

    return beastsManager;
}

export { getBeastsManager };