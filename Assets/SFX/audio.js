const SFXPath = "Assets/SFX/light.wav";

const BGM = new Audio("Assets/SFX/M2U-Nemesis.wav");
window.addEventListener("mousedown", () => {
    BGM.play();

});

BGM.addEventListener("ended", () => {
    BGM.pause();
    BGM.currentTime = 0;
    BGM.play();
});