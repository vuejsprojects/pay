const getDomManager = function() {
    const domMgr = {
        getElementById: function(id) {
            return document.getElementById(id);
        },
        createCanvas: function(name, id) {
            const canvas = document.createElement("canvas");
            canvas.setAttribute("id", id);
            document.getElementById (name).appendChild(canvas);
            return canvas;
        },
        addEventListener: function(event, handler, entity) {
            if (entity) {
                document.getElementById (entity).addEventListener(event, handler, true);
            }
            else {
                document.addEventListener(event, handler, true);
            }
        },
        removeEventListener: function(event, handler) {
            document.removeEventListener(event, handler, true);
        },
        setFocus: function(entity) {
            document.getElementById (entity).focus();
        },
        setValue: function(entity, val) {
            document.getElementById(entity).innerText=val;
        },
        getValue: function(entity) {
            return document.getElementById(entity).innerText;
        },
        getIntValue: function(entity) {
            return parseInt(document.getElementById(entity).innerText);
        },
        disable: function(entity) {
            document.getElementById(entity).disabled = true;
        },
        enable: function(entity) {
            document.getElementById(entity).disabled = false;
        }
    };

    return domMgr;
}

export { getDomManager };