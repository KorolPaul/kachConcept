const kach = {
    addExcersice: function(training, excercise) {
        let complexity = parseInt(excercise.dataset["complexity"]),
            sets = excercise.querySelector('.sets'),
            deleteButton = utils.createElement('a', 'delete', '&#x2715;', null, kach.deleteExcersice);

        excercise.appendChild(deleteButton);

        sets.addEventListener('input', kach.validateSets, false);

        training.appendChild(excercise);
        
        if (typeof(training.dataset.complexity) === 'undefined') {
            training.dataset.complexity = parseInt(complexity);
        } else {
            calculateComplexity(training, complexity);
        }

        
    },

    deleteExcersice: function(e) {
        var training = e.target.parentNode.parentNode;
        training.removeChild(e.target.parentNode);
        calculateComplexity(training, - parseInt(e.target.parentNode.dataset["complexity"]));
    },

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
            UI.saveProgram();
        } else if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) {
            e.preventDefault();
        }
    },

    selectTraining: function (html) {
        let newExcercise = utils.createElement('li', '', html.querySelector('.excercise-name').innerText),
            trainingsList = document.querySelectorAll('.trainings_item');
        
        for (let i = 0; i < trainingsList.length; i++) {
            let li = utils.createElement('li', 'trainings-popup_item', trainingsList[i].innerText, null, function(){kach.addExcersiceToTraining(li, newExcercise)})
            trainingsPopup.appendChild(li)
        }
        trainingsPopup.classList.add('trainings-popup__visible');
    },

    addExcersiceToTraining: function (e, excercise) {
        alert(1)
        document.querySelector('.trainings_item:nth-child(' + utils.index(e) + ') .trainings_excercises').appendChild(excercise);
        trainingsPopup.classList.remove('trainings-popup__visible');
        UI.saveProgram();
    }
}














