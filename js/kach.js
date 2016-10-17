window.onload = function () {

    var kachManager = (function () {
        var dragExcercise,
            dragExcerciseNext,
            mouseOffset,
            trainings = [],
            xml, 
            info = document.getElementById('info'),
            infoClose = document.getElementById('info_close'),
            trainingsBlock = document.getElementById('trainings'),
            addTrainingButton = document.getElementById('addTraining'),
            droppable = document.getElementsByClassName('droppable'),
            shedule = document.getElementById('shedule'),
            muscules = document.getElementsByTagName('g'),
            excercises = document.getElementById('excercises'), 
            isInfoShown = false;

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
            if (e.pageX == 0) {
                e = e.touches[0] || e.changedTouches[0];
            }

            return e
        }

        function getPosition(e) {
            var left = 0,
                top = 0;

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

                excercise.addEventListener('click', showInfo);
                excercise.addEventListener('mousedown', moveExcerciseStart);
                excercise.addEventListener('touchstart', moveExcerciseStart);

                excercises.appendChild(excercise);
            }
        }

        function moveExcerciseStart(e) {
            e.preventDefault();
            e = fixEvent(e);

            dragExcercise = this.cloneNode(true);
            dragExcercise.classList.add('temp');

            document.addEventListener('mousemove', moveExcercise);
            document.addEventListener('mouseup', moveExcerciseEnd);
            document.addEventListener('touchmove', moveExcercise);
            document.addEventListener('touchend', moveExcerciseEnd);

            document.body.appendChild(dragExcercise);

            var pos = getPosition(this);
            mouseOffset = {
                x: e.pageX - pos.x,
                y: e.pageY - pos.y
            }
            //document.body.onselectstart = function () { return false };
            return false;
        }

        function moveExcercise(e) {
            e = fixEvent(e);
            
            dragExcercise.style.left = e.pageX - mouseOffset.x + 'px';
            dragExcercise.style.top = e.pageY - mouseOffset.y + 'px';
            if (dragExcerciseNext) {
                dragExcerciseNext = dragExcercise.nextSibling.nextSibling;
                dragExcerciseNext.style.marginTop = dragExcercise.offsetHeight + 'px';
                dragExcerciseNext.className += 'animated';
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
                    dragExcercise.classList.remove('temp');
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
            document.removeEventListener('mousemove', moveExcercise);
            document.removeEventListener('mouseup', moveExcerciseEnd);
            document.removeEventListener('touchmove', moveExcercise);
            document.removeEventListener('touchend', moveExcerciseEnd);
        }

        function addExcersice(training, excercise) {
            var complexity = parseInt(excercise.dataset["complexity"]),
                sets = excercise.querySelector('.sets'),
                deleteButton = document.createElement('a');

            deleteButton.innerHTML = '&#x2715;';
            deleteButton.classList.add('delete');
            deleteButton.onclick = deleteExcersice;
            excercise.appendChild(deleteButton);

            sets.addEventListener('input', validateSets, false);

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
            var html = this.innerHTML;

            if (isInfoShown) {
                hideInfo();
            } else {
                isInfoShown = true;
                info.classList.add('opened');
                info.querySelector('.info_content').innerHTML = html;
            }
            
            info.querySelector('.info_content').innerHTML = html;
            info.nextElementSibling.classList.remove('visible');
        }

        function hideInfo(e) {
            info.nextElementSibling.querySelector('.info_content').innerHTML = info.querySelector('.info_content').innerHTML;
            info.nextElementSibling.classList.add('visible');
            info.nextElementSibling.classList.add('info__focus');
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
            $.ajax({
                url: '/Training/SaveTraining',
                type: 'POST',
                data: { content: trainingsBlock.innerHTML.replace(/</g, '&lt;') },
                dataType: 'json',
                error: function () { console.error('Error!'); }
            });

            localStorage.trainingProgramm = trainingsBlock.innerHTML;
        }

        function loadProgram() {
            if (localStorage.trainingProgramm !== undefined) {
                trainingsBlock.innerHTML = localStorage.trainingProgramm;
            }

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
        }

        function validateSets(e) {
            if (/[0-9]/.test(e.key)) {
                saveProgram();
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
               
                loadProgram();

                infoClose.onclick = function (e) {
                    e.preventDefault();
                    info.classList.remove('opened');
                    info.nextElementSibling.classList.remove('visible');
                    isInfoShown = false;
                }

                document.onkeydown = clearLocalStorage; //remove after release
                addTrainingButton.onclick = addTraining;
                loadExcercises();
            }
        }

    }());
        
    kachManager.init();
}














