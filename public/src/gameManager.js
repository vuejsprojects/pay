import { getDomManager } from './domManager.js'
import { startButton } from './startButton.js'
import { sound } from './sound.js'
import {
    GAME_OVER_COLOR,
    CANVAS_HEIGHT_ORIG,
    CANVAS_HEIGHT,
} from './settings.js'


const getGameManager = function(context) {

    const domMgr = getDomManager();

    const game = {
        reaper: sound("src/sounds/reaper.mp3"),
        won: sound("src/sounds/won_subdued.mp3"),
        beastsManager: undefined,


        // 1
        displayCounter: function() {
            domMgr.setValue('counter', this.counter);
        },
        incrementCounter: function(inc) {
            this.counter += inc;
            this.displayCounter();
        },
        resetCounter: function() {
            this.counter = 0;
            this.displayCounter();
        },
        gameOver: function() {
            this.reaper.play();
            this.displayGameOverMessage();
            this.stopGame();
            this.setStartButtonTo('Start New Game');
            this.setRoundOver();
        },
        gameWon:  function() {
            this.won.play();
            this.displayGameWonMessage();
            this.stopGame();
            this.setStartButtonTo('Next Level');
            this.setRoundOver();
        },
        stopGame: function() {
            this.stopBeastTimer();
            this.stopCapturingPacMotion();
            this.stopGameTimer();
        },
        setStartButtonTo: function(label) {
            startButton.enable();
            startButton.setValue(label);
        },
        displayGameOverMessage: function() {
            context.font = '48px serif';
            context.fillStyle = GAME_OVER_COLOR;
            context.fillText('Game Over!!!!', 10, CANVAS_HEIGHT_ORIG + (CANVAS_HEIGHT - CANVAS_HEIGHT_ORIG)/2);
        },
        displayGameWonMessage: function() {
            context.font = '48px serif';
            context.fillStyle = GAME_OVER_COLOR;
            context.fillText('Bravo!!!!', 10, CANVAS_HEIGHT_ORIG + (CANVAS_HEIGHT - CANVAS_HEIGHT_ORIG)/2);
        },
        startBeastTimer: function(beastTimer) {
            this.beastSetInterval = beastTimer();
        },
        stopBeastTimer: function() {
            clearInterval(this.beastSetInterval);
        },
        startGameTimer: function(setGameTimer, from) {
            this.gameTimer = setGameTimer(from);
        },
        stopGameTimer: function() {
            clearInterval(this.gameTimer);
        },
        saveKeyDownEventHandler: function(event, keypressHandler) {
            this.capturedEvent = event;
            this.eventHandler = keypressHandler;
        },
        // 2
        stopCapturingPacMotion: function() {
            domMgr.removeEventListener(this.capturedEvent, this.eventHandler);
        },
        // 3
        setRoundOver: function() {
            this.roundOver = true;
        },
        resetRoundOver: function() {
            this.roundOver = false;
        },
        isRoundOver: function() {
            return this.roundOver;
        },
        // 4
        setGameStarted : function() {
            this.gameStarted = true;
        },
        isGameStarted : function() {
            return this.gameStarted;
        }


    };

    game.counter = 0;
    game.roundOver = false;
    game.gameStarted = false;
    game.gameLevel = 0;
    game.isNewGameTimer = true;
    game.TimerStartingTime = 0;

    return game;
}

export { getGameManager };