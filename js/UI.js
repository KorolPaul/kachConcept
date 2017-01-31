const FRAMES_COUNT = 11,
      FRAMES_INTERVAL = 20;  
      
let motionFrame = 0,
    trainings = [],
    xml;

let info = document.getElementById('info'),
    infoClose = document.getElementById('info_close'),
    trainingsBlock = document.getElementById('trainings'),
    addTrainingButton = document.getElementById('addTraining'),
    droppable = document.getElementsByClassName('droppable'),
    shedule = document.getElementById('shedule'),
    body = document.getElementById('body'),
    muscules = document.getElementsByTagName('path'),
    musculesSides = document.querySelectorAll('.muscles_side'),
    musculesList = document.querySelectorAll('.muscles-list a'),
    sheduleToggle = document.querySelector('#shedule-toggle'),
    excercises = document.getElementById('excercises');

export default UI = {

    addTraining: function() {
        var newTraining = document.createElement('li');
        newTraining.classList.add('training');

        var trainingLink = document.createElement('a');
        var name = prompt('Введите название тренировки');            
        trainingLink.attributes.href = "#";
        trainingLink.classList.add('training_name');
        trainingLink.innerText = name;            

        var trainingContent = document.createElement('ul');
        trainingContent.classList.add('training_excercises');
        
        //newTraining.classList.add('droppable');
        //newTraining.classList.add('new');
        newTraining.appendChild(trainingLink);
        newTraining.appendChild(trainingContent);
        trainings.push(newTraining);
        document.querySelector(".trainings").appendChild(newTraining);
    },

    showInfo: function(e) {
        var html = xml.getElementsByClassName(this.dataset['name'])[this.dataset['origin']].innerHTML;
        info.classList.add('opened');
        info.querySelector('.info_holder').innerHTML = html;
        info.querySelector('.add-button').addEventListener('click', function () { 
            addExcersiceToTraining(info);
        });
    },

    addExcersiceToTraining: function(html) {
        console.log(html)
        var newExcercise = document.createElement('li');
        newExcercise.innerHTML = html.querySelector('.excercise-name').innerText;
        document.querySelector('.training_excercises').appendChild(newExcercise);
    },

    loadExcercises: function() {
        ajax = new XMLHttpRequest();

        ajax.open('get', 'excercises.xml', true);
        ajax.onreadystatechange = function (e) {
            if (ajax.readyState == 4) {
                xml = ajax.responseXML;
            }
        }
        ajax.onerror = function () {
            console.log('Cant load xml');
            setTimeout(loadExcercises, 5000);
        }
        ajax.send(null);
        
    },

    saveProgram: function() {
        /*
        $.ajax({
            url: '/Training/SaveTraining',
            type: 'POST',
            data: { content: trainingsBlock.innerHTML.replace(/</g, '&lt;') },
            dataType: 'json',
            error: function () { console.error('Error!'); }
        });
        */
        localStorage.trainingProgramm = trainingsBlock.innerHTML;
    },

    loadProgram: function() {
        if (localStorage.trainingProgramm !== undefined) {
            trainingsBlock.innerHTML = localStorage.trainingProgramm;
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

                for (var i = 0; i < muscules.length; i++) {
                    muscules[i].addEventListener('click', showExcercises);
                    muscules[i].addEventListener('touchend', showExcercises);
                }
                for (var i = 0; i < musculesList.length; i++) {
                    musculesList[i].addEventListener('click', showExcercises);
                    musculesList[i].addEventListener('touchend', showExcercises);
                }

                for (var i = 0; i < droppable.length; i++) {
                    trainings.push(droppable[i]);
                }

                for (var i = 0; i < document.getElementsByClassName('delete').length; i++) {
                    document.getElementsByClassName('delete')[i].onclick = deleteExcersice
                }

                var sets = trainingsBlock.querySelectorAll('.sets');
                for (var i = 0; i < sets.length; i++) {
                    sets[i].addEventListener('input', validateSets, false);
                }
            },
            error: function () { console.error('Error!'); }
        });

        */

        for (var i = 0; i < muscules.length; i++) {
            muscules[i].addEventListener('click', showExcercises);
            muscules[i].addEventListener('touchend', showExcercises);
        }
        for (var i = 0; i < musculesList.length; i++) {
            musculesList[i].addEventListener('click', showExcercises);
            musculesList[i].addEventListener('touchend', showExcercises);
        }

        for (var i = 0; i < droppable.length; i++) {
            trainings.push(droppable[i]);
        }

        for (var i = 0; i < document.getElementsByClassName('delete').length; i++) {
            document.getElementsByClassName('delete')[i].onclick = deleteExcersice
        }

        var sets = trainingsBlock.querySelectorAll('.sets');
        for (var i = 0; i < sets.length; i++) {
            sets[i].addEventListener('input', validateSets, false);
        }
    },

    startRotateBody: function(e) {
        rotateStart = e.clientX;
        document.addEventListener("mousemove", rotateBody);
        document.addEventListener("mouseup", endRotateBody);
    },

    rotateBody: function(e) {
        rotateOffset = rotateStart - e.clientX;
        if (rotateOffset > FRAMES_INTERVAL || rotateOffset < -FRAMES_INTERVAL) {
            if (rotateOffset > 0) {
                motionFrame < FRAMES_COUNT ? motionFrame++ : motionFrame = 0;
            } else {
                motionFrame > 0 ? motionFrame-- : motionFrame = FRAMES_COUNT;
            }

            rotateStart = e.clientX;
            body.style.backgroundPositionX = motionFrame * 9 + "%";

            for (var i = 0; i < musculesSides.length; i++) {
                musculesSides[i].classList.remove('active');
            }
            musculesSides[motionFrame].classList.add('active');
        }            
    },

    endRotateBody: function (e) {
        document.removeEventListener("mousemove", rotateBody);
        document.removeEventListener("mouseup", endRotateBody);
    },

    clearLocalStorage: function(e) {
        if (e.keyCode == 76) {
            localStorage.clear();
            location.reload(false);
        }
    }
}