

const canvas = document.createElement("canvas");
canvas.setAttribute("id", "my-canvas");
canvas.width = 1000;
canvas.height = 750;
canvas.style.width = "500px";
canvas.style.height = "375px";
canvas.style.backgroundColor = "aqua";
// const context = canvas.getContext("2d");

document.getElementById ('output').appendChild(canvas);

const changeScale = function() {
    canvas.getContext("2d").scale(2, 2);
}