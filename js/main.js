window.onload = function () {

    var kachManager = (function () {

        var dragExcercise,
            dragExcerciseNext,
            mouseOffset,
            trainings = [],
            timer = 0,
            xml, 
            info = document.getElementById('info'),
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
            var musculeName = this.id;

            excercises.innerHTML = '';

            var html = xml.getElementsByClassName(musculeName);

            for (var i = 0; i < html.length; i++) {
                var excercise = document.createElement('li');
                excercise.innerHTML = html[i].innerHTML;
                excercise.dataset['complexity'] = html[i].getAttribute('data-complexity');

                excercise.addEventListener('mouseover', showInfo);
                excercise.addEventListener('mouseout', hideInfo);
                excercise.addEventListener('mousedown', moveExcerciseStart);

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

            for (var i = 0; i < sets.childElementCount; i++) {
                sets.children[i].addEventListener("DOMCharacterDataModified", saveProgram, false);
            }

            training.appendChild(excercise);
            
            if (typeof(training.dataset.complexity) === 'undefined') {
                training.dataset.complexity = parseInt(complexity);
            } else {
                training.dataset.complexity = parseInt(training.dataset.complexity) + parseInt(complexity);
            }

            if (training.dataset.complexity > 20)
                training.classList.add("easy");
            if (training.dataset.complexity > 40)
                training.classList.add("normal");
            if (training.dataset.complexity > 50)
                training.classList.add("hard");
            if (training.dataset.complexity > 60)
                training.classList.add("insane");

            saveProgram();
        }

        function deleteExcersice(e) {
            var training = e.target.parentNode.parentNode;
            training.removeChild(e.target.parentNode);
            saveProgram();
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
            clearTimeout(timer);
            var html = this.innerHTML;

            timer = setTimeout(function () {
                info.innerHTML = html;
                info.classList.add("opened");
            }, 200);
        }

        function hideInfo(e) {
            info.nextElementSibling.innerHTML = info.innerHTML;
            info.nextElementSibling.classList.add("opened");
            setTimeout(function () {
                info.classList.remove("opened");
                info.nextElementSibling.classList.remove("opened");
            }, 200);
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
            localStorage.trainingProgramm = shedule.innerHTML;
        }

        function rotateBody() {
            var body = document.getElementsByTagName('svg');

            for (var i = 0; i < body.length; i++) {
                body[i].classList.toggle('active');
            }
        }

        return {
            init: function () {
                switcher.onclick = rotateBody;
               
                if (localStorage.trainingProgramm !== undefined)
                    shedule.innerHTML = localStorage.trainingProgramm;
                
                for (var i = 0; i < muscules.length; i++)
                    muscules[i].onclick = showExcercises;

                for (var i = 0; i < droppable.length; i++)
                    trainings.push(droppable[i]);

                for (var i = 0; i < document.getElementsByClassName('delete').length; i++) {
                    document.getElementsByClassName('delete')[i].onclick = deleteExcersice
                }

                addTrainingButton.onclick = addTraining;
                loadExcercises();
            }
        }

    }());
        
    kachManager.init();
}














