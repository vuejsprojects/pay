import { getDomManager } from './domManager.js'


const startButton = {
    domMgr: getDomManager(),

    enable: function() {
        this.domMgr.enable("start-button");
    },
    setValue: function(label) {
        this.domMgr.setValue("start-button", label);
    },
    disable: function() {
        this.domMgr.disable("start-button");
    },
    setFocus: function() {
        this.domMgr.setFocus("start-button");
    },
    on: function(event, handler) {
        this.domMgr.addEventListener(event, handler, "start-button");
    }
};

export { startButton}