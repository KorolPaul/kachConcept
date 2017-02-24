const kach = {

    calculateComplexity: function(training, complexity) {
        training.dataset.complexity = parseInt(training.dataset.complexity) + parseInt(complexity);
        training.className = 'training droppable';

        if (training.dataset.complexity > 20)
            training.classList.add("easy");
        if (training.dataset.complexity > 40)
            training.classList.add("normal");
        if (training.dataset.complexity > 50)
            training.classList.add("hard");
        if (training.dataset.complexity > 60)
            training.classList.add("insane");
    },

    validateSets: function(e) {
        if (/[0-9]/.test(e.key)) {
            Training.saveProgram();
        } else if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) {
            e.preventDefault();
        }
    },

    selectTraining: function (html) {
        let newExcerciseName = utils.createElement('span', 'training_excercise', html.querySelector('.excercise-name').innerText),
            newExcerciseInfo = utils.createElement('div', '', html.querySelector('.sets').innerHTML),    
            trainingsList = document.querySelectorAll('.trainings_name');

        for (let i = 0; i < trainingsList.length; i++) {
            let li = utils.createElement('li', 'trainings-popup_item', trainingsList[i].innerText, null, function(){let newExcercise = new Excercise(li, newExcerciseName, newExcerciseInfo)})
            trainingsPopup.appendChild(li)
        }
        trainingsPopup.classList.add('trainings-popup__visible');
    }
}