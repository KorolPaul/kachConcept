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

        
        UI.saveProgram();
    },

    deleteExcersice: function(e) {
        var training = e.target.parentNode.parentNode;
        training.removeChild(e.target.parentNode);
        calculateComplexity(training, - parseInt(e.target.parentNode.dataset["complexity"]));
        UI.saveProgram();
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

    addTraining: function () {
        let newTraining = new Training(prompt('Введите название тренировки'));
        newTraining.render();
    },

    addExcersiceToTraining: function(html) {
        var newExcercise = utils.createElement('li', '', html.querySelector('.excercise-name').innerText);
        document.querySelector('.training_excercises').appendChild(newExcercise);
    }
}














