import UI from 'UI.js';

window.onload = function () {

               
    UI.loadProgram();

    infoClose.onclick = function (e) {
        e.preventDefault();
        info.classList.remove('opened');
    }

    document.onkeydown = clearLocalStorage; //remove after release
    document.querySelector('.muscles').addEventListener("mousedown", startRotateBody);
    addTrainingButton.onmousedown = addTraining;
    sheduleToggle.onclick = function (e) {
        e.preventDefault();
        shedule.classList.toggle('shedule__opened')
    };
    loadExcercises();
            
}