
const sound = function (src) {
    const audio = document.createElement("audio");
    audio.src = src;
    audio.setAttribute("preload", "auto");
    audio.setAttribute("controls", "none");
    audio.setAttribute("muted", "muted");
    audio.style.display = "none";
    document.body.appendChild(audio);
    return {
        play: function () {
            console.log('Playing: ', audio.src);
            try {
                audio.play();
            }
            catch (e) {
                // swallow: Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first
                console.log('Exception in play: ', e);
            }
        },
        stop: function () {
            audio.pause();
        }
    };
};

export { sound };