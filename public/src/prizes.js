import {point} from './point.js';
import {
    PAC_WIDTH,
    INC
} from './settings.js'

const prizes = function(context, gameManager) {
    const colors = ['yellow', 'DarkTurquoise', 'blue'];
    const images = [
        document.getElementById('sherries'),
        document.getElementById('duck'),
        document.getElementById('boat'),
    ];
    
    const getRandomInt = function(min, max) {
        if (max) {
            let r = Math.floor(Math.random() * max);
            while (r < min ) {
                r = Math.floor(Math.random() * max);
            }
            return r;
        }
        else {
            return Math.floor(Math.random() * min);
        }
    };

    const prizesSet = {
        pickAndDisplayTimer: undefined,
        bag: {
            location: [],
            displayedPrizesCounter: -1
        },
        isHorizontal: function(line) {
            return (line.end.x - line.start.x) ? true : false;
        },
        incRounded: function(start, end) {
            let mid = start + (end - start) / 2;
            mid = Math.floor(mid / INC) * INC;
            return mid;
        },
        sprinkle: function(parcours) {
            // for (let i=0; i < 10 /*parcours.layout.length*/; i+=2) {
            for (let i=0; i < parcours.layout.length; i+=2) {
                if (!parcours.layout[i].noBeastStart) {
                    if (this.isHorizontal(parcours.layout[i])) {
                        this.bag.location.push(
                            {
                                point: point(
                                    this.incRounded(parcours.layout[i].start.x, parcours.layout[i].end.x),
                                    parcours.layout[i].start.y
                                ),
                                color: colors[i % colors.length],
                                line: parcours.layout[i],
                                active: true,
                                toDisplay: true,
                                image: images[getRandomInt(images.length)]
                            }
                        );
                    }
                    else {
                        this.bag.location.push(
                            {
                                point: point(
                                    parcours.layout[i].start.x, 
                                    this.incRounded(parcours.layout[i].start.y, parcours.layout[i].end.y)
                                ),
                                color: colors[i % colors.length],
                                line: parcours.layout[i],
                                active: true,
                                toDisplay: true,
                                image: images[getRandomInt(images.length)]
                            }
                        );
                    }
                }
            }
            return this;
        },
        display: function() {
            this.bag.location.forEach(prize => {
                prize.active = true;
                prize.toDisplay = true;
                // context.beginPath();
                // console.log('Draw ', prize.image.getAttribute("id"));
                // context.drawImage(prize.image, prize.point.getX() -10, prize.point.getY()-10);
                // context.closePath();        
            });
        },
        randomTimeDisplay: function() {
            const that = this;
            const nsec = getRandomInt(5, 10);
            console.log("Display prize every ", nsec);
            this.pickAndDisplayTimer = setInterval(this.pickPrizeAndDisplay(that), nsec * 1000);
        },
        pickPrizeAndDisplay: function(that) {
            return function () {
                if (gameManager.isGameOn()) {
                    if (that.stillPrizesToDisplay()) {
                        that.displayPrize(that.pickPrize());
                    }
                }
            }
        },
        stillPrizesToDisplay: function() {
            console.log('Displayed ', (this.bag.displayedPrizesCounter + 1), ' out of ', this.bag.location.length)
            return this.bag.displayedPrizesCounter == (this.bag.location.length - 1)
            ? false
            : true;
        },
        displayPrize: function(prize) {
            if (prize) {
                prize.active = true;
                context.beginPath();
                console.log('Draw ', prize.image.getAttribute("id"));
                context.drawImage(prize.image, prize.point.getX() -10, prize.point.getY()-10);
                context.closePath();
            }
        },
        pickPrize: function() {
            while (this.stillPrizesToDisplay()) {
                let n = getRandomInt(this.bag.location.length);
                if (this.bag.location[n].toDisplay) {
                    this.bag.location[n].toDisplay = false;
                    this.bag.displayedPrizesCounter += 1;      
                    return this.bag.location[n];
                }
            }
        },
        isPrizeLocation: function(x, y, beast) {
            for (let i = 0; i < this.bag.location.length; i++) {
                if (x === this.bag.location[i].point.x && 
                    y === this.bag.location[i].point.y && 
                    this.bag.location[i].active &&
                    this.bag.location[i].toDisplay === false) {

                    if (!beast) {
                        this.bag.location[i].active = false;
                    }
                    return i;
                }
            }
        },
        redrawPrize: function(prizeIndex){
            context.beginPath();
            context.drawImage(this.bag.location[prizeIndex].image, 
                this.bag.location[prizeIndex].point.getX() -10, 
                this.bag.location[prizeIndex].point.getY()-10);
            context.closePath();        
        },
        areAllLocationsInactive: function() {
            for (let i = 0; i < this.bag.location.length; i++) {
                if (this.bag.location[i].active) {
                    return false;
                }
            }
            return true;
        }
    };
    return prizesSet;
}

export {prizes};