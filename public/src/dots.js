import { point } from './point.js';
import {
    PAC_WIDTH,
    INC,
    HORIZONTAL,
    VERTICAL
} from './settings.js'

const dots = function (context, gameManager) {
    const dotImage = document.getElementById('dot');

    const dotSet = {
        bag: {
            location: []
        },

        isHorizontal: function (line) {
            return (line.end.x - line.start.x) ? true : false;
        },
        sprinkle: function (parcours) {
            for (let i = 0; i < parcours.layout.length; i++) {
                if (this.isHorizontal(parcours.layout[i])) {
                    this.addDots(INC, parcours.layout[i], HORIZONTAL);
                }
                else {
                    this.addDots(INC, parcours.layout[i], VERTICAL);
                }

            }
            // TODO clen that up
            for (let i=0; i < this.bag.location.length; i++ ) {
                console.log(i, ': ',
                    this.bag.location[i].point.getX(),
                    ', ',  
                    this.bag.location[i].point.getY());
            }
            for (let i=0; i < this.bag.location.length; i++ ) {
                if (this.bag.location[i].active) {
                    for (let j=i+1; j < this.bag.location.length; j++ ) {
                        if (this.bag.location[j].active) {
                            if (this.bag.location[i].point.getX() === this.bag.location[j].point.getX() &&
                            this.bag.location[i].point.getY() === this.bag.location[j].point.getY()) {
                                console.log(i,' = ',j);
                                this.bag.location[j].active = false;
                                this.bag.location[j].duplicate = true;
                            }
                        }
                    }
                    this.bag.location[i].active = false;
                }
            }
            const removeDuplicate = function(location) {
                for (let i=0; i < location.length; i++ ) {
                    if (location[i].duplicate === true) {
                        location.splice(i, 1);
                        removeDuplicate(location);
                    }
                }
            }
            removeDuplicate(this.bag.location);
            console.log('New length: ', this.bag.location.length);
            for (let i=0; i < this.bag.location.length; i++ ) {
                this.bag.location[i].active = true;
            }

            return this;
        },
        addDots: function(every, line, direction) {
            if (direction === HORIZONTAL) {
                const l = this.getStartEnd(line.start.x, line.end.x);
                for (let where = l.start; where < l.end; where += every) {
                    this.bag.location.push(
                        {
                            point: point( where, line.start.y),
                            line: line,
                            active: true,
                            image: dotImage
                        }
                    );
                }
            }
            else {
                const l = this.getStartEnd(line.start.y, line.end.y);
                for (let where = l.start; where < l.end; where += every) {
                    this.bag.location.push(
                        {
                            point: point(line.start.x, where),
                            line: line,
                            active: true,
                            image: dotImage
                        }
                    );
                }
            }
        },
        getStartEnd: function( start, end) {
            return {
                start: start < end ? start : end,
                end: start < end ? end : start 
            }
        },
        display: function() {
            this.bag.location.forEach(dot => {
                dot.active = true;
                context.beginPath();
                context.drawImage(dot.image, dot.point.getX() - 5, dot.point.getY()- 5);
                context.closePath();        
            });
        },
        isDotLocation: function(x, y, beast) {
            for (let i = 0; i < this.bag.location.length; i++) {
                if (this.bag.location[i].active &&
                    x === this.bag.location[i].point.x && 
                    y === this.bag.location[i].point.y ) {

                    if (!beast) {
                        // console.log('Inactivating dot[', i,'] on x:y', x, ':', y)
                        this.bag.location[i].active = false;
                    }
                    return i;
                }
            }
        },
        redrawDot: function(dotIndex){
            context.beginPath();
            context.drawImage(this.bag.location[dotIndex].image, 
                this.bag.location[dotIndex].point.getX() - 5, 
                this.bag.location[dotIndex].point.getY()- 5);
            context.closePath();        
        },
        areAllLocationsInactive: function() {
            for (let i = 0; i < this.bag.location.length; i++) {
                if (this.bag.location[i].active) {
                    // console.log('Dot inactive: ', i)
                    return false;
                }
            }
            return true;
        }
    };
    return dotSet;
}

export { dots };