window.onload = function () {

    info = document.getElementById('info'),
    infoClose = document.getElementById('info_close'),
    trainingsBlock = document.getElementById('trainings'),
    addTrainingButton = document.getElementById('addTraining'),
    droppable = document.getElementsByClassName('droppable'),
    shedule = document.getElementById('shedule'),
    body = document.getElementById('body'),
    muscules = document.getElementsByTagName('path'),
    musculesSides = document.querySelectorAll('.muscles_side'),
    musculesList = document.querySelectorAll('.muscles-list a'),
    sheduleToggle = document.querySelector('#shedule-toggle'),
    excercises = document.getElementById('excercises');
               
    UI.loadProgram();

    infoClose.onclick = function (e) {
        e.preventDefault();
        info.classList.remove('opened');
    }

    document.onkeydown = UI.clearLocalStorage; //remove after release

    document.querySelector('.muscles').addEventListener("mousedown", touch.startRotateBody);
    addTrainingButton.onmousedown = UI.addTraining;

    sheduleToggle.onclick = function (e) {
        e.preventDefault();
        shedule.classList.toggle('shedule__opened')
    };

    UI.loadExcercises();       
}