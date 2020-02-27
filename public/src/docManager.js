const getDocManager = function() {
    const docMgr = {};

    docMgr.addEventListener = function(entity, event, handler) {

    };
    docMgr.setFocus = function(entity) {

    };
    docMgr.setValue = function(entity, val) {
        document.getElementById(entity).innerText=val;
    };
    docMgr.getValue = function(entity) {
        return document.getElementById(entity).innerText;
    }

    return docMgr;
}

export { getDocManager };