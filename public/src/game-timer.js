function setincrementGameTimer() {
    counter = 0;
    return function() {
        counter +=1;
        document.getElementById('game-timer').innerText = this.counter;
    }
}

const setGameTimer = function() {
    return function() {
        const theGameTimer = setInterval(setincrementGameTimer(), 1000);
        return theGameTimer;
    }
};
export { setGameTimer};