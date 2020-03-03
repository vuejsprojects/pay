import { point } from './point.js';
import {
    BORDER_COLOR,
    DASH_LINE_WIDTH,
    DASH_LINE_COLOR,
    DASH_SIZE,
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
        line(point(0, 0), point(0, 180), true),
        line(point(0, 180), point(180, 180)),
        line(point(180, 0), point(180, 180)),
        line(point(140, 120), point(140, 180)),
        line(point(100, 120), point(180, 120)),
        line(point(100, 120), point(100, 180)),
        line(point(0, 120), point(100, 120)),
        line(point(100, 20), point(100, 120)),
        line(point(40, 80), point(160, 80)),
        line(point(0, 0), point(180, 0), true),
        line(point(40, 0), point(40, 40), true),
        line(point(0, 40), point(40, 40), true)
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
        context.lineWidth = DASH_LINE_WIDTH
        context.setLineDash(DASH_SIZE);
        context.strokeStyle = DASH_LINE_COLOR;
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
            context.strokeStyle = LINE_COLOR;
            context.moveTo(line.start.getX(), line.start.getY());
            context.lineTo(line.end.getX(), line.end.getY());
            context.stroke();

            context.beginPath();
            context.lineWidth = DASH_LINE_WIDTH;
            context.setLineDash(DASH_SIZE);
            context.strokeStyle = DASH_LINE_COLOR;
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