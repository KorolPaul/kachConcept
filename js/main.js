window.onload = function () {

    info = document.getElementById('info'),
    infoClose = document.getElementById('info_close'),
    trainingsBlock = document.getElementById('trainings'),
    trainingsPopup = document.getElementById('trainings-popup'),
    addTrainingButton = document.getElementById('addTraining'),
    droppable = document.getElementsByClassName('droppable'),
    shedule = document.getElementById('shedule'),
    body = document.getElementById('body'),
    muscules = document.getElementsByTagName('path'),
    musculesSides = document.querySelectorAll('.muscles_side'),
    musculesList = document.querySelectorAll('.muscles-list a'),
    sheduleToggle = document.querySelector('#shedule-toggle'),
    excercises = document.getElementById('excercises');
               
    Training.loadProgram();

    infoClose.onclick = function (e) {
        e.preventDefault();
        info.classList.remove('opened');
    }

    for (var i = 0; i < muscules.length; i++) {
        muscules[i].addEventListener('click', UI.showExcercises);
        muscules[i].addEventListener('touchend', UI.showExcercises);
    }
    for (var i = 0; i < musculesList.length; i++) {
        musculesList[i].addEventListener('click', UI.showExcercises);
        musculesList[i].addEventListener('touchend', UI.showExcercises);
    }

    for (var i = 0; i < droppable.length; i++) {
        trainings.push(droppable[i]);
    }

    for (var i = 0; i < document.getElementsByClassName('delete').length; i++) {
        document.getElementsByClassName('delete')[i].onclick = kach.deleteExcersice
    }

    var sets = trainingsBlock.querySelectorAll('.sets');
    for (var i = 0; i < sets.length; i++) {
        sets[i].addEventListener('input', kach.validateSets, false);
    }

    document.onkeydown = UI.clearLocalStorage; //remove after release

    document.querySelector('.muscles').addEventListener("mousedown", touch.startRotateBody);
    addTrainingButton.onmousedown = Training.add;

    sheduleToggle.onclick = function (e) {
        e.preventDefault();
        shedule.classList.toggle('shedule__opened')
    };

    UI.loadExcercises();       
}