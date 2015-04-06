window.onload = function () {

    var kachManager = (function () {

        var dragExcercise,
            dragExcerciseNext,
            mouseOffset,
            trainings = [],
            timerShow = 0,
            timerHide = 0,
            xml, 
            info = document.getElementById('info'),
            trainingsBlock = document.getElementById('trainings'),
            addTrainingButton = document.getElementById('addTraining'),
            droppable = document.getElementsByClassName('droppable'),
            shedule = document.getElementById('shedule'),
            muscules = document.getElementsByTagName('g'),
            excercises = document.getElementById('excercises'), 
            switcher = document.getElementById('muscles_switcher');

        function fixEvent(e) {
            e = e || window.event;

            if (e.pageX == null && e.clientX != null) {
                var html = document.documentElement
                var body = document.body
                e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0)
                e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
            }

            if (!e.which && e.button) {
                e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0))
            }
            return e
        }

        function getPosition(e) {
            var left = 0;
            var top = 0;
            while (e.offsetParent) {
                left += e.offsetLeft;
                top += e.offsetTop;
                e = e.offsetParent;
            }

            left += e.offsetLeft
            top += e.offsetTop

            return { x: left, y: top }
        }

        function showExcercises(e) {
            var musculeName = this.className['baseVal'];

            excercises.innerHTML = '';

            var html = xml.getElementsByClassName(musculeName);

            for (var i = 0; i < html.length; i++) {
                var excercise = document.createElement('li');
                excercise.innerHTML = html[i].innerHTML;
                excercise.dataset['complexity'] = html[i].getAttribute('data-complexity');

                excercise.addEventListener('mouseenter', showInfo);
                excercise.addEventListener('mouseleave', hideInfo);
                excercise.addEventListener('mousedown', moveExcerciseStart);

                info.nextElementSibling.onmouseenter = function () {clearTimeout(timerHide)};
                info.nextElementSibling.onmouseout = hideInfo;

                excercises.appendChild(excercise);
            }
        }

        function moveExcerciseStart(e) {
            e.preventDefault();
            e = fixEvent(e);

            dragExcercise = this.cloneNode(true);
            dragExcercise.classList.add('temp');

            document.onmousemove = moveExcercise;
            document.onmouseup = moveExcerciseEnd;

            document.body.appendChild(dragExcercise);

            var pos = getPosition(this);
            mouseOffset = {
                x: e.pageX - pos.x,
                y: e.pageY - pos.y
            }
            document.body.onselectstart = function () { return false };
            return false;
        }

        function moveExcercise(e) {
            e = fixEvent(e);
            dragExcercise.style.left = e.pageX - mouseOffset.x + "px";
            dragExcercise.style.top = e.pageY - mouseOffset.y + "px";
            if (dragExcerciseNext) {
                dragExcerciseNext = dragExcercise.nextSibling.nextSibling;
                dragExcerciseNext.style.marginTop = dragExcercise.offsetHeight + "px";
                dragExcerciseNext.className += "animated";
            }
        }

        function moveExcerciseEnd(e) {
            e = fixEvent(e)
            var isDropped = false;

            for (var i = 0; i < trainings.length; i++) {
                var targ = trainings[i];
                var targPos = getPosition(targ);
                var targWidth = parseInt(targ.offsetWidth);
                var targHeight = parseInt(targ.offsetHeight);

                if ((e.pageX > targPos.x) && (e.pageX < (targPos.x + targWidth)) && (e.pageY > targPos.y) && (e.pageY < (targPos.y + targHeight))) {
                    dragExcercise.classList.remove("temp");
                    addExcersice(targ, dragExcercise);
                    isDropped = true;
                }
            }
            if (!isDropped && dragExcercise)
                dragExcercise.parentNode.removeChild(dragExcercise);

            if (dragExcerciseNext)
                dragExcerciseNext.style.marginTop = 0;

            dragExcercise = null;
            dragExcerciseNext = null;
            document.onmousemove = null;
            document.onmouseup = null;
        }

        function addExcersice(training, excercise) {
            var complexity = parseInt(excercise.dataset["complexity"]),
                sets = excercise.querySelector('.sets'),
                deleteButton = document.createElement('a');

            deleteButton.innerHTML = '&#x2715;';
            deleteButton.classList.add('delete');
            deleteButton.onclick = deleteExcersice;
            excercise.appendChild(deleteButton);

            sets.addEventListener('keydown', validateSets, false);


            training.appendChild(excercise);
            
            if (typeof(training.dataset.complexity) === 'undefined') {
                training.dataset.complexity = parseInt(complexity);
            } else {
                calculateComplexity(training, complexity);
            }

            saveProgram();
        }

        function deleteExcersice(e) {
            var training = e.target.parentNode.parentNode;
            training.removeChild(e.target.parentNode);
            calculateComplexity(training, - parseInt(e.target.parentNode.dataset["complexity"]));
            saveProgram();
        }

        function calculateComplexity(training, complexity) {
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
        }

        function addTraining() {
            var newTraining = document.createElement('ul');
            newTraining.classList.add('training');
            newTraining.classList.add('droppable');
            newTraining.classList.add('new');
            trainings.push(newTraining);
            document.getElementsByClassName("trainings")[0].appendChild(newTraining);
            setTimeout(function () { newTraining.classList.remove('new'); }, 100);
        }

        function showInfo(e) {
            clearTimeout(timerShow);
            var html = this.innerHTML;

            timerShow = setTimeout(function () {
                info.innerHTML = html;
                info.classList.add("opened");
                clearTimeout(timerHide);
            }, 250);
        }

        function hideInfo(e) {
            info.nextElementSibling.innerHTML = info.innerHTML;
            info.nextElementSibling.classList.add("opened");
            timerHide = setTimeout(function () {
                info.classList.remove("opened");
                info.nextElementSibling.classList.remove("opened");
            }, 250); 
        }

        function loadExcercises() {
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
            
        }

        function saveProgram() {
            localStorage.trainingProgramm = trainingsBlock.innerHTML;
        }

        function validateSets(e) {
            if (/[0-9]/.test(e.key)) {
                setTimeout(function () { saveProgram() }, 1000);
            } else if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) {
                e.preventDefault();
            }
        }

        function rotateBody() {
            var body = document.getElementsByTagName('svg');

            for (var i = 0; i < body.length; i++) {
                body[i].classList.toggle('active');
            }
        }

        function clearLocalStorage(e) {
            if (e.keyCode == 76) {
                localStorage.clear();
                location.reload(false);
            }
        }

        return {
            init: function () {
                switcher.onclick = rotateBody;
               
                if (localStorage.trainingProgramm !== undefined) {
                    trainingsBlock.innerHTML = localStorage.trainingProgramm;
                }
                
                for (var i = 0; i < muscules.length; i++) {
                    muscules[i].onclick = showExcercises;
                }

                for (var i = 0; i < droppable.length; i++) {
                    trainings.push(droppable[i]);
                }

                for (var i = 0; i < document.getElementsByClassName('delete').length; i++) {
                    document.getElementsByClassName('delete')[i].onclick = deleteExcersice
                }

                var sets = trainingsBlock.querySelectorAll('.sets');
                for (var i = 0; i < sets.length; i++) {
                    sets[i].addEventListener('keydown', validateSets, false);
                }

                document.onkeydown = clearLocalStorage; //remove after release
                addTrainingButton.onclick = addTraining;
                loadExcercises();
            }
        }

    }());
        
    kachManager.init();
}














