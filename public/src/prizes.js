import {point} from './point.js';
import {
    PAC_WIDTH,
    INC
} from './settings.js'

const prizes = function(context) {
    const colors = ['yellow', 'DarkTurquoise', 'brown'];

    const prizesSet = {
        location: [],
        isHorizontal: function(line) {
            return (line.end.x - line.start.x) ? true : false;
        },
        incRounded: function(start, end) {
            let mid = start + (end - start) / 2;
            mid = Math.floor(mid / INC) * INC;
            console.log(mid)
            return mid;
        },
        sprinkle: function(parcours) {
            for (let i=0; i < parcours.layout.length; i++) {
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
                                line: parcours.layout[i]
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
                                line: parcours.layout[i]
                            }
                        );
                    }
                }
            }
            return this;
        },
        display: function() {
            this.location.forEach(prize => {
                context.beginPath();
                context.fillStyle = prize.color;
                context.arc(prize.point.getX(), prize.point.getY(), PAC_WIDTH / 2, 0, 2 * Math.PI);
                context.fill();
                context.closePath();        
            });
        },
        isPrizeLocation: function(x, y) {
            for (let i = 0; i < this.location.length; i++) {
                if (x === this.location[i].point.x && y === this.location[i].point.y) {
                    const that = this;
                    return function() {
                        context.beginPath();
                        context.fillStyle = that.location[i].color;
                        context.arc(
                            that.location[i].point.getX(), 
                            that.location[i].point.getY(), 
                            PAC_WIDTH / 2, 0, 2 * Math.PI
                        );
                        context.fill();
                        context.closePath();        
                    };
                }
            }
        }
    };
    return prizesSet;
}

export {prizes};