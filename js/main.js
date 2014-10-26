window.onload = function () {

    var dragAndDrop = (function () {

        var dragExcercise,
            dragExcerciseNext,
            mouseOffset,
            trainings = [];

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
            var left = 0,
                top = 0;

        	while (e.offsetParent){
        	    left += e.offsetLeft;
        	    top += e.offsetTop;
        	    e = e.offsetParent;
        	}

        	left += e.offsetLeft;
            top  += e.offsetTop;

            return { x: left, y: top };
        }

        function moveExcerciseStart(e) {
            e = fixEvent(e);
            dragExcercise = this.parentNode.insertBefore(this.cloneNode(true), this);
            dragExcercise.classList.add("temp");

            var pos = getPosition(this);
            mouseOffset= { 
                x: e.pageX - pos.x, 
                y: e.pageY - pos.y 
            }
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
                    if (dragExcercise) {
                        dragExcercise.classList.remove("temp");
                        kach.addExcersice(targ, dragExcercise);
                        isDropped = true;
                    }
                }
            }
            if (!isDropped && dragExcercise)
                dragExcercise.parentNode.removeChild(dragExcercise);

            if (dragExcerciseNext)
                dragExcerciseNext.style.marginTop = 0;

            dragExcercise = null;
            dragExcerciseNext = null;
        }

        return {
            init: function () {
                document.onmousemove = moveExcercise;
                document.onmouseup = moveExcerciseEnd;
            },
            makeDraggable: function (e) {
                e.onmousedown = moveExcerciseStart;
            }, 
            addDropTarget: function(dropTarget){
                trainings.push(dropTarget)
            }
        }

    }());
    

    var kach = {
        timer: null,

        showExcercises: function (e) {
            var musculeName = this.id,
                ajax = new XMLHttpRequest();

            ajax.open('get', 'excercises.xml', true);
            ajax.onreadystatechange = function (e) {
                if (ajax.readyState == 4) {
                    var html = ajax.responseXML.getElementsByTagName(musculeName)[0];
                    document.getElementById("excercises").innerHTML = html.innerHTML;

                    for (var i = 0; i < excercises.length; i++) {
                        if (excercises[i].className === musculeName) {
                            excercises[i].style.display = "block";
                            excercises[i].onmouseover = kach.showInfo;
                            excercises[i].onmouseout = kach.hideInfo;
                        }
                        else {
                            excercises[i].style.display = "none";
                        }
                        dragAndDrop.makeDraggable(excercises[i]);
                    }
                }
            }
            ajax.send(null);
        },

        addExcersice: function (training, excercise) {
            var complexity = parseInt(excercise.dataset["complexity"]);

            training.appendChild(excercise);
            localStorage.trainingProgramm = shedule.innerHTML;

            if (training.dataset["complexity"] !== undefined)
                complexity += parseInt(training.dataset["complexity"]);

            training.dataset.complexity = complexity;

            if (complexity > 0)
                training.classList.add("easy");
            if (complexity > 5)
                training.classList.add("normal");
            if (complexity > 10)
                training.classList.add("hard");
            if (complexity > 15)
                training.classList.add("insane");
        },

        showInfo: function (e) {
            var html = this.innerHTML;

            clearTimeout(kach.timer);
            setTimeout(function () {
                info.innerHTML = html;
                info.classList.add("opened");
            }, 200);
        },

        hideInfo: function (e) {
            info__temp.innerHTML = info.innerHTML;
            info__temp.classList.add("opened");
            setTimeout(function () {
                info.classList.remove("opened");
                info__temp.classList.remove("opened");
            }, 200);
        },

        init: function () {
            if (localStorage.trainingProgramm !== undefined) {
                shedule.innerHTML = localStorage.trainingProgramm;
            }

            for (var i = 0; i < muscules.length; i++) {
                muscules[i].onclick = this.showExcercises;
            }

            for (var i = 0; i < droppable.length; i++) {
                dragAndDrop.addDropTarget(droppable[i]);
            }

            addTraining.onclick = function () {
                var newTraining = document.createElement('ul');

                newTraining.classList.add('training', 'droppable', 'new');
                dragAndDrop.addDropTarget(newTraining);
                trainings.appendChild(newTraining);
                setTimeout(function () { newTraining.classList.remove('new'); }, 100);
            };
        }
    }

    var info = document.getElementById("info"),
        info__temp = document.getElementById("info__temp"),
        droppable = document.getElementsByClassName('droppable'),
        shedule = document.getElementById("shedule"),
        trainings = document.getElementById("trainings"),
        addTraining = document.getElementById("addTraining"),
        muscules = document.getElementById("body").getElementsByTagName('g'),
        excercises = document.getElementById("excercises").getElementsByTagName('li');

    dragAndDrop.init();
    kach.init();
    
}














