export default kach = {
    addExcersice: function(training, excercise) {
        var complexity = parseInt(excercise.dataset["complexity"]),
            sets = excercise.querySelector('.sets'),
            deleteButton = document.createElement('a');

        deleteButton.innerHTML = '&#x2715;';
        deleteButton.classList.add('delete');
        deleteButton.onclick = deleteExcersice;
        excercise.appendChild(deleteButton);

        sets.addEventListener('input', validateSets, false);

        training.appendChild(excercise);
        
        if (typeof(training.dataset.complexity) === 'undefined') {
            training.dataset.complexity = parseInt(complexity);
        } else {
            calculateComplexity(training, complexity);
        }

        
        saveProgram();
    },

    deleteExcersice: function(e) {
        var training = e.target.parentNode.parentNode;
        training.removeChild(e.target.parentNode);
        calculateComplexity(training, - parseInt(e.target.parentNode.dataset["complexity"]));
        saveProgram();
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
            saveProgram();
        } else if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) {
            e.preventDefault();
        }
    }
}














