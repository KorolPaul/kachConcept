
let trainings = [],
    xml;

let info,
    infoClose,
    trainingsBlock,
    addTrainingButton,
    droppable,
    shedule,
    body,
    muscules,
    musculesSides,
    musculesList,
    sheduleToggle,
    excercises;

const UI = {

    showInfo: function(e) {
        var html = xml.getElementsByClassName(this.dataset['name'])[this.dataset['origin']].innerHTML;
        info.classList.add('opened');
        info.querySelector('.info_holder').innerHTML = html;
        info.querySelector('.add-button').addEventListener('click', function () { 
            addExcersiceToTraining(info);
        });
    },


    loadExcercises: function() {
        const ajax = new XMLHttpRequest();

        ajax.open('get', 'excercises.xml', true);
        ajax.onreadystatechange = function (e) {
            if (ajax.readyState == 4) {
                xml = ajax.responseXML;
            }
        }
        ajax.onerror = function () {
            console.log('Cant load xml');
            setTimeout(UI.loadExcercises, 5000);
        }
        ajax.send(null);
        
    },

    showExcercises: function(e) {
        var musculeName = this.className['baseVal'] || this.className,
            html = xml.getElementsByClassName(musculeName);

        excercises.innerHTML = '';

        for (var i = 0; i < html.length; i++) {
            var excercise = utils.createElement('li', 'excercise-name', html[i].querySelector('.excercise-name').innerHTML, null, UI.showInfo);
            excercise.dataset['complexity'] = html[i].getAttribute('data-complexity');
            excercise.dataset['origin'] = i;
            excercise.dataset['name'] = musculeName;

            //excercise.addEventListener('mousedown', touch.moveExcerciseStart);
            //excercise.addEventListener('touchstart', touch.moveExcerciseStart);

            excercises.appendChild(excercise);
        }
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
            muscules[i].addEventListener('click', UI.showExcercises);
            muscules[i].addEventListener('touchend', UI.showExcercises);
        }
        for (var i = 0; i < musculesList.length; i++) {
            musculesList[i].addEventListener('click', UI.showExcercises);
            musculesList[i].addEventListener('touchend', UI.showExcercises);
        }

        for (var i = 0; i < droppable.length; i++) {
            trainings.push(droppable[i]);
        }

        for (var i = 0; i < document.getElementsByClassName('delete').length; i++) {
            document.getElementsByClassName('delete')[i].onclick = kach.deleteExcersice
        }

        var sets = trainingsBlock.querySelectorAll('.sets');
        for (var i = 0; i < sets.length; i++) {
            sets[i].addEventListener('input', kach.validateSets, false);
        }
    },


    clearLocalStorage: function(e) {
        if (e.keyCode == 76) {
            localStorage.clear();
            location.reload(false);
        }
    }
}