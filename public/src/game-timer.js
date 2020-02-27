function setincrementGameTimer(from) {
    counter = from;
    return function() {
        counter +=1;
        document.getElementById('game-timer').innerText = this.counter;
    }
};

const getElasedTime = function() {
    return parseInt(document.getElementById('game-timer').innerText);
};

const setGameTimer = function(from) {
    const theGameTimer = setInterval(setincrementGameTimer(from), 1000);
    return theGameTimer;
};

export { setGameTimer, getElasedTime};