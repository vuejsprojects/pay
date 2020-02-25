import { point } from './point.js';
import {
    BORDER_COLOR,
    LINE_WIDTH,
    LINE_COLOR
} from './settings.js';

const line = function(start, end, nobeast) {
    return {
        start: start,
        end: end,
        noBeastStart: nobeast  // a beast can't appear on this line
    }
};

const parcours = {
    layout: [
        line(point(0, 0), point(0, 190), true),
        line(point(0, 190), point(190, 190)),
        line(point(190, 0), point(190, 190)),
        line(point(150, 120), point(150, 190)),
        line(point(100, 120), point(190, 120)),
        line(point(100, 120), point(100, 190)),
        line(point(0, 120), point(100, 120)),
        line(point(100, 20), point(100, 120)),
        line(point(40, 80), point(160, 80)),
        line(point(0, 0), point(190, 0), true),
        line(point(50, 0), point(50, 30)),
        line(point(0, 30), point(50, 30))
    ],
    build: function() {
        const mirrorPoints = function(aLine) {
            return [
                line(point(aLine.start.x, -aLine.start.y), point(aLine.end.x, -aLine.end.y), aLine.noBeastStart),
                line(point(-aLine.start.x, -aLine.start.y), point(-aLine.end.x, -aLine.end.y), aLine.noBeastStart),
                line(point(-aLine.start.x, aLine.start.y), point(-aLine.end.x, aLine.end.y), aLine.noBeastStart)
            ];
        }
        const layoutLen = this.layout.length;
        for (let i = 0; i < layoutLen; i++) {
            this.layout.push.apply(this.layout, mirrorPoints(this.layout[i]));
        }
    },
    isOnTrack: function(position) {
        const x = position.posX;
        const y = position.posY;
        let within = false;
        for (let i = 0; i < this.layout.length; i++) {
            const condX = x >= 0 ? x >= this.layout[i].start.x && x <= this.layout[i].end.x
                                : x <= this.layout[i].start.x && x >= this.layout[i].end.x;
            const condY = y >= 0 ? y >= this.layout[i].start.y && y <= this.layout[i].end.y
                                : y <= this.layout[i].start.y && y >= this.layout[i].end.y;

            if (condX && condY) {
                within = true;
                break;
            }
        };
        return within;
    },
    displayToFix: function(context) {
        this.drawBorders(context); // need to fix the border and remove the fudge in display(): tip see pb by not showing parcours
        context.beginPath();
        context.lineWidth = 2
        context.setLineDash([2,2]);
        context.strokeStyle = LINE_COLOR;
        this.layout.forEach(line => {
            context.moveTo(line.start.getX(), line.start.getY());
            context.lineTo(line.end.getX(), line.end.getY());
            context.stroke();
        });
    },
    display: function(context) {
        this.drawBorders(context);
        this.layout.forEach(line => {
            context.beginPath();
            context.lineWidth = LINE_WIDTH;
            context.setLineDash([]);
            context.strokeStyle = 'green';  // TODO
            context.moveTo(line.start.getX(), line.start.getY());
            context.lineTo(line.end.getX(), line.end.getY());
            context.stroke();

            context.beginPath();
            context.lineWidth = 2;  // TODO
            context.setLineDash([2,2]);  // TODO
            context.strokeStyle = LINE_COLOR;
            context.moveTo(line.start.getX(), line.start.getY());
            context.lineTo(line.end.getX(), line.end.getY());
            context.stroke();
        });
    },
    drawBorders: function(context) {
        context.beginPath();
        context.strokeStyle = BORDER_COLOR;
        context.lineWidth = LINE_WIDTH;
        this.layout.forEach(line => {
            if (line.start.getY() === line.end.getY()) {
                // horizontal borders
                context.moveTo(line.start.getX() + ((line.end.x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line.start.getY() - LINE_WIDTH);
                context.lineTo(line.end.getX() + ((line.end.x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line.end.getY() - LINE_WIDTH);

                context.moveTo(line.start.getX() + ((line.end.x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line.start.getY() + LINE_WIDTH);
                context.lineTo(line.end.getX() + ((line.end.x < 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2), line.end.getY() + LINE_WIDTH);
                context.stroke();
            }
            else {
                // vertical border
                context.moveTo(line.start.getX() - LINE_WIDTH, line.start.getY() + ((line.end.y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));
                context.lineTo(line.end.getX() - LINE_WIDTH, line.end.getY() + ((line.end.y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));

                context.moveTo(line.start.getX() + LINE_WIDTH, line.start.getY() + ((line.end.y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));
                context.lineTo(line.end.getX() + LINE_WIDTH, line.end.getY() + ((line.end.y > 0) ? LINE_WIDTH * -0.5 : LINE_WIDTH / 2));
                context.stroke();
            }
        });
    }
};

export {parcours};