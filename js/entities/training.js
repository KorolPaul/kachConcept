class Training {
    constructor(name) {
        this.name = name;
    }

    render() {
        let newTraining = utils.createElement('li', 'training'),
            trainingLink = utils.createElement('a', 'training_name', this.name, "#"),
            trainingContent = utils.createElement('ul', 'training_excercises');

        //newTraining.classList.add('droppable');
        //newTraining.classList.add('new');
        
        newTraining.appendChild(trainingLink);
        newTraining.appendChild(trainingContent);

        document.querySelector(".trainings").appendChild(newTraining);
        //trainings.push(newTraining);
    }
}