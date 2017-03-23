window.onload = function () {

    info = document.getElementById('info');
    infoClose = document.getElementById('info_close');
    training = document.getElementById('training');
    trainingsBlock = document.getElementById('trainings');
    trainingsPopup = document.getElementById('trainings-popup');
    addTrainingButton = document.getElementById('addTraining');
    droppable = document.getElementsByClassName('droppable');
    shedule = document.getElementById('shedule');
    body = document.getElementById('body');
    muscules = document.querySelectorAll('path, .muscles_title');
    musculesSides = document.querySelectorAll('.muscles_side');
    musculeTitles = document.querySelectorAll('.muscles_title');
    sheduleToggle = document.querySelector('#shedule-toggle');
    excercise = document.getElementById('excercise');
    excercises = document.getElementById('excercises');
    excerciseSetsHolder = document.getElementById('excercise_sets-holder');
    deleteExcercise = document.getElementById('delete-excercise');
    closeExcercise = document.getElementById('close-excercise');
    
    Training.loadProgram();

    infoClose.onclick = function (e) {
        e.preventDefault();
        info.classList.remove('opened');
    }

    for (var i = 0; i < muscules.length; i++) {
        muscules[i].addEventListener('click', UI.showExcercises);
        muscules[i].addEventListener('touchend', UI.showExcercises);
    }

    for (var i = 0; i < droppable.length; i++) {
        trainings.push(droppable[i]);
    }

    var sets = trainingsBlock.querySelectorAll('.sets');
    for (var i = 0; i < sets.length; i++) {
        sets[i].addEventListener('input', kach.validateSets, false);
    }

    document.onkeydown = UI.clearLocalStorage; //remove after release

    document.querySelector('.muscles').addEventListener("mousedown", touch.startRotateBody);
    addTrainingButton.onmousedown = Training.add;
    closeExcercise.addEventListener('click', Excercise.close);
    deleteExcercise.addEventListener('click', Excercise.delete);

    sheduleToggle.onclick = function (e) {
        e.preventDefault();
        shedule.classList.toggle('shedule__opened')
    };

    UI.loadExcercises();       
}