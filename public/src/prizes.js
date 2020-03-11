import {point} from './point.js';
import {
    PAC_WIDTH,
    INC
} from './settings.js'

const prizes = function(context) {
    const colors = ['yellow', 'DarkTurquoise', 'blue'];
    const images = [
        document.getElementById('sherries'),
        document.getElementById('duck'),
        document.getElementById('boat'),
    ];
    // This would need a promise to work see sleep and waiting below
    const image = function (src) {
        const img = document.createElement("img");
        img.src = src;
        img.setAttribute("preload", "auto");
        img.setAttribute("controls", "none");
        img.style.display = "none";
        document.body.appendChild(img);
        return img;
    };
    const sleep = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
      
    async function waiting(ms) {
        console.log('Taking a break...', ms);
        await sleep(ms);
        console.log(ms, ' miliseconds later...');
    }
    
    const getRandomInt = function(range) {
        return Math.floor(Math.random() * range);
    };

    const prizesSet = {
        location: [],
        sherries: image('src/images/2Sherries.png'),
        isHorizontal: function(line) {
            return (line.end.x - line.start.x) ? true : false;
        },
        incRounded: function(start, end) {
            let mid = start + (end - start) / 2;
            mid = Math.floor(mid / INC) * INC;
            return mid;
        },
        sprinkle: function(parcours) {
            // TODO put back all prizes
            // for (let i=0; i < 10 /*parcours.layout.length*/; i+=2) {
            for (let i=0; i < parcours.layout.length; i+=2) {
                if (!parcours.layout[i].noBeastStart) {
                    if (this.isHorizontal(parcours.layout[i])) {
                        this.location.push(
                            {
                                point: point(
                                    // parcours.layout[i].start.x + (parcours.layout[i].end.x - parcours.layout[i].start.x) / 2,
                                    this.incRounded(parcours.layout[i].start.x, parcours.layout[i].end.x),
                                    parcours.layout[i].start.y
                                ),
                                color: colors[i % colors.length],
                                line: parcours.layout[i],
                                active: true,
                                image: images[getRandomInt(images.length)]
                            }
                        );
                    }
                    else {
                        this.location.push(
                            {
                                point: point(
                                    parcours.layout[i].start.x, 
                                    // parcours.layout[i].start.y + (parcours.layout[i].end.y - parcours.layout[i].start.y) / 2
                                    this.incRounded(parcours.layout[i].start.y, parcours.layout[i].end.y)
                                ),
                                color: colors[i % colors.length],
                                line: parcours.layout[i],
                                active: true,
                                image: images[getRandomInt(images.length)]
                            }
                        );
                    }
                }
            }
            return this;
        },
        display: function() {
            this.location.forEach(prize => {
                prize.active = true;
                context.beginPath();
                // context.fillStyle = prize.color;
                // context.arc(prize.point.getX(), prize.point.getY(), PAC_WIDTH / 2, 0, 2 * Math.PI);
                // context.fill();
                console.log('Draw cherries');
                context.drawImage(prize.image, prize.point.getX() -10, prize.point.getY()-10);
                context.closePath();        
            });
        },
        isPrizeLocation: function(x, y, beast) {
            for (let i = 0; i < this.location.length; i++) {
                if (x === this.location[i].point.x && 
                    y === this.location[i].point.y && 
                    this.location[i].active) {

                    if (!beast) {
                        this.location[i].active = false;
                    }
                    return i;
                }
            }
        },
        redrawPrize: function(prizeIndex){
            context.beginPath();
            // context.fillStyle = this.location[prizeIndex].color;
            // context.arc(
            //     this.location[prizeIndex].point.getX(), 
            //     this.location[prizeIndex].point.getY(), 
            //     PAC_WIDTH / 2, 0, 2 * Math.PI
            // );
            // context.fill();
            context.drawImage(this.location[prizeIndex].image, 
                this.location[prizeIndex].point.getX() -10, 
                this.location[prizeIndex].point.getY()-10);
            context.closePath();        
        },
        areAllLocationsInactive: function() {
            for (let i = 0; i < this.location.length; i++) {
                if (this.location[i].active) {
                    return false;
                }
            }
            return true;
        }
    };
    return prizesSet;
}

export {prizes};