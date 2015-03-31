window.onload = function () {

    var kachManager = (function () {

        var dragExcercise,
            dragExcerciseNext,
            mouseOffset,
            trainings = [],
            timer = 0,
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

        function moveExcerciseStart(e) {
            e = fixEvent(e);
            dragExcercise = this.cloneNode(true);
            dragExcercise.classList.add("temp");
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
            if (dragExcercise) {
                e = fixEvent(e);
                dragExcercise.style.left = e.pageX - mouseOffset.x + "px";
                dragExcercise.style.top = e.pageY - mouseOffset.y + "px";
                if (dragExcerciseNext) {
                    dragExcerciseNext = dragExcercise.nextSibling.nextSibling;
                    dragExcerciseNext.style.marginTop = dragExcercise.offsetHeight + "px";
                    dragExcerciseNext.className += "animated";
                }
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
        }

        function showExcercises(e) {
            var musculeName = this.id,
                ajax = new XMLHttpRequest();

            excercises.innerHTML = '';

            ajax.open('get', 'excercises.xml', true);
            ajax.onreadystatechange = function (e) {
                if (ajax.readyState == 4) {
                    var html = ajax.responseXML.getElementsByClassName(musculeName);

                    for (var i = 0; i < html.length; i++) {
                        var excercise = document.createElement('li');
                        excercise.innerHTML = html[i].innerHTML;
                        excercises.appendChild(excercise);

                        excercise.onmouseover = showInfo;
                        excercise.onmouseout = hideInfo;

                        excercise.onmousedown = moveExcerciseStart;
                        
                    }
                }
            }
            ajax.send(null);
        }

        function addExcersice(training, excercise) {
            var complexity = 0,
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
            saveProgram();

            if (training.dataset["complexity"] !== undefined) {
                complexity += parseInt(training.dataset["complexity"]);
            } else {
                complexity = parseInt(excercise.dataset["complexity"]);
            }
                
            training.dataset.complexity = complexity;

            if (complexity > 10)
                training.classList.add("easy");
            if (complexity > 30)
                training.classList.add("normal");
            if (complexity > 40)
                training.classList.add("hard");
            if (complexity > 50)
                training.classList.add("insane");
        }

        function deleteExcersice(e) {
            var training = e.target.parentNode.parentNode;
            training.removeChild(e.target.parentNode);
            saveProgramm();
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
                document.onmousemove = moveExcercise;
                document.onmouseup = moveExcerciseEnd;
                switcher.onclick = rotateBody;

                /*if (localStorage.trainingProgramm !== undefined)
                    shedule.innerHTML = localStorage.trainingProgramm;*/

                for (var i = 0; i < muscules.length; i++)
                    muscules[i].onclick = showExcercises;

                for (var i = 0; i < droppable.length; i++)
                    trainings.push(droppable[i]);

                addTrainingButton.onclick = addTraining;
            }
        }

    }());
        
    kachManager.init();
}














