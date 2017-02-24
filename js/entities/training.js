class Training {
    constructor(name) {
        this.name = name;
    }

    static add() {
        let newTraining = new Training(prompt('Введите название тренировки'));
        newTraining.render();
        Training.saveProgram();
    }

    static addExcercise(e, excercise, excerciseInfo) {
        let excerciseName = utils.createElement('li', 'training_item', null),
            sets = utils.createElement('ul', 'sets', excerciseInfo.innerHTML);

        excerciseName.appendChild(excercise);
        excerciseName.appendChild(sets);

        document.querySelector('.trainings_item:nth-child(' + utils.index(e) + ') .trainings_excercises').appendChild(excerciseName);
        trainingsPopup.classList.remove('trainings-popup__visible');

        Training.saveProgram();
    } 

    static showExcercises(e) {
        training.innerHTML = document.querySelector('.trainings_item:nth-child(' + utils.index(e.target.parentNode) + ') .trainings_excercises').innerHTML;
        
        let trainingItems = document.querySelectorAll('.training .training_item');
        for (let i = 0; i < trainingItems.length; i++){
            trainingItems[i].addEventListener('click', Excercise.show);
        }
    }

    static saveProgram() {
        /*
        $.ajax({
            url: '/Training/SaveTraining',
            type: 'POST',
            data: { content: trainingsBlock.innerHTML.replace(/</g, '&lt;') },
            dataType: 'json',
            error: function () { console.error('Error!'); }
        });
        */
        let elements = document.querySelectorAll('#trainings *');
        
        for (let i = 0; i < elements.length; i++) {
            if (typeof elements[i].onclick == "function") {
                elements[i].dataset.handler = 'Training.' + elements[i].onclick.name;
            }
        }

        localStorage.trainingProgram = trainingsBlock.innerHTML;
    }

    static loadProgram() {
        if (localStorage.trainingProgram !== undefined) {
            trainingsBlock.innerHTML = localStorage.trainingProgram;

            let elements = document.querySelectorAll('#trainings *');
        
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].dataset.handler) {
                    elements[i].addEventListener('click', eval(elements[i].dataset.handler));
                }
            }
        }

        /*            
        $.ajax({
            url: '/Training/LoadTraining',
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if(data != "") {
                    trainingsBlock.innerHTML = data.replace(/(&lt;)/g, '<');
                }
            },
            error: function () { console.error('Error!'); }
        });

        */
    }

    render() {
        let newTraining = utils.createElement('li', 'trainings_item'),
            trainingLink = utils.createElement('a', 'trainings_name', this.name, "#", Training.showExcercises),
            trainingContent = utils.createElement('ul', 'trainings_excercises');

        //newTraining.classList.add('droppable');
        //newTraining.classList.add('new');
        
        newTraining.appendChild(trainingLink);
        newTraining.appendChild(trainingContent);

        document.querySelector(".trainings").appendChild(newTraining);
        //trainings.push(newTraining);
    }
}