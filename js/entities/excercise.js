class Excercise {
    constructor(e, excercise, excerciseInfo) {
        let newExcerciseItem = utils.createElement('li', 'training_item', null),
            sets = utils.createElement('ul', 'sets', excerciseInfo.innerHTML);

        newExcerciseItem.appendChild(excercise);
        newExcerciseItem.appendChild(sets);
        newExcerciseItem.dataset.id = 'training' + Math.random() * 10;
        
        document.querySelector('.trainings_item:nth-child(' + utils.index(e) + ') .trainings_excercises').appendChild(newExcerciseItem);
        trainingsPopup.classList.remove('trainings-popup__visible');
        
        Training.saveProgram();
    }

    static show(e) {
        excercise.classList.add('excercise__visible');
        excerciseSetsHolder.innerHTML = e.currentTarget.innerHTML;
        
        let excerciseRanges = excerciseSetsHolder.querySelectorAll('input[type="range"]');
        for (let i = 0; i < excerciseRanges.length; i++){
            excerciseRanges[i].addEventListener('input', Excercise.changeValue);
        }
        
        deleteExcercise.dataset.id = e.currentTarget.dataset.id;
    }

    static delete() {
        let trainingElements = document.querySelectorAll('.training_item[data-id="' + deleteExcercise.dataset.id + '"]');
        
        for (let i = 0; i < trainingElements.length; i++){
            trainingElements[i].remove();
        }

        Excercise.close();
        Training.saveProgram();
    }

    static close() {
        excercise.classList.remove('excercise__visible');

        let sets = document.querySelectorAll('.training_item[data-id="' + deleteExcercise.dataset.id + '"] .sets'),
            html = excerciseSetsHolder.querySelector('.sets').innerHTML    ;
        for (let i = 0; i < sets.length; i++) {
            sets[i].innerHTML = html;
        }
        Training.saveProgram();
        
    }

    static changeValue(e) {
        let input = e.target.name;
        excerciseSetsHolder.querySelector('span[name="'+input+'"]').innerText = e.target.value;
    }
}