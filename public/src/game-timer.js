import { getDocManager } from './docManager.js';


const docMgr = getDocManager();

function setincrementGameTimer(from) {
    let counter = from;
    return function() {
        counter +=1;
        docMgr.setValue('game-timer', counter);
    }
};

const getElasedTime = function() {
    return docMgr.getIntValue('game-timer');
};

const setGameTimer = function(from) {
    const theGameTimer = setInterval(setincrementGameTimer(from), 1000);
    return theGameTimer;
};

export { setGameTimer, getElasedTime};