class Training {
    constructor(name) {
        this.name = name;
    }

    static add() {
        let newTraining = new Training(prompt('Введите название тренировки'));
        newTraining.render();
        newTraining.saveProgram();
    }

    showExcercises(e) {
        alert(1)
    }

    saveProgram() {
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
                elements[i].dataset.handler = elements[i].onclick.name;
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
                    eval(elements[i].dataset.handler)()
                    elements[i].addEventListener('click', eval('this.' + elements[i].dataset.handler)());
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
            trainingLink = utils.createElement('a', 'trainings_name', this.name, "#", this.showExcercises),
            trainingContent = utils.createElement('ul', 'trainings_excercises');

        //newTraining.classList.add('droppable');
        //newTraining.classList.add('new');
        
        newTraining.appendChild(trainingLink);
        newTraining.appendChild(trainingContent);

        document.querySelector(".trainings").appendChild(newTraining);
        //trainings.push(newTraining);
    }
}