
let trainings = [],
    xml;

let info,
    infoClose,
    training,
    trainingsBlock,
    trainingsPopup,
    addTrainingButton,
    droppable,
    shedule,
    body,
    map,
    muscules,
    musculesSides,
    musculesList,
    sheduleToggle,
    excercise,
    excercises,
    excerciseSetsHolder,
    closeExcercise,
    deleteExcercise;

const UI = {

    showInfo: function(e) {
        var html = xml.getElementsByClassName(this.dataset['name'])[this.dataset['origin']].innerHTML;
        info.classList.add('opened');
        info.querySelector('.info_holder').innerHTML = html;
        info.querySelector('.add-button').addEventListener('click', function () { 
            kach.selectTraining(info);
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

    clearLocalStorage: function(e) {
        if (e.keyCode == 76) {
            localStorage.clear();
            location.reload(false);
        }
    }
}