import { getDomManager } from './domManager.js';


const domMgr = getDomManager();

function setincrementGameTimer(from) {
    let counter = from;
    return function() {
        counter +=1;
        domMgr.setValue('game-timer', counter);
    }
};

const getElasedTime = function() {
    return domMgr.getIntValue('game-timer');
};

const setGameTimer = function(from) {
    const theGameTimer = setInterval(setincrementGameTimer(from), 1000);
    return theGameTimer;
};

export { setGameTimer, getElasedTime};