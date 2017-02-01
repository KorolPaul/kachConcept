const FRAMES_COUNT = 11,
      FRAMES_INTERVAL = 20;  
      
let dragExcercise,
    dragExcerciseNext,
    mouseOffset,
    rotateStart,
    rotateOffset,
    motionFrame = 0;
    

const touch = {
    fixEvent: function(e) {
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
    },

    getPosition: function(e) {
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
    },

    moveExcerciseStart: function(e) {
        e.preventDefault();
        e = touch.fixEvent(e);

        dragExcercise = this.cloneNode(true);
        dragExcercise.classList.add('temp');

        document.addEventListener('mousemove', touch.moveExcercise);
        document.addEventListener('mouseup', touch.moveExcerciseEnd);
        document.addEventListener('touchmove', touch.moveExcercise);
        document.addEventListener('touchend', touch.moveExcerciseEnd);

        document.body.appendChild(dragExcercise);

        var pos = getPosition(this);
        mouseOffset = {
            x: e.pageX - pos.x,
            y: e.pageY - pos.y
        }
        //document.body.onselectstart = function () { return false };
        return false;
    },

    moveExcercise: function(e) {
        e = fixEvent(e);
        
        dragExcercise.style.left = e.pageX - mouseOffset.x + 'px';
        dragExcercise.style.top = e.pageY - mouseOffset.y + 'px';
        if (dragExcerciseNext) {
            dragExcerciseNext = dragExcercise.nextSibling.nextSibling;
            dragExcerciseNext.style.marginTop = dragExcercise.offsetHeight + 'px';
            dragExcerciseNext.className += 'animated';
        }
    },

    moveExcerciseEnd: function(e) {
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
        document.removeEventListener('mousemove', touch.moveExcercise);
        document.removeEventListener('mouseup', touch.moveExcerciseEnd);
        document.removeEventListener('touchmove', touch.moveExcercise);
        document.removeEventListener('touchend', touch.moveExcerciseEnd);
    },

    startRotateBody: function(e) {
        rotateStart = e.clientX;
        document.addEventListener("mousemove", touch.rotateBody);
        document.addEventListener("mouseup", touch.endRotateBody);
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
        document.removeEventListener("mousemove", touch.rotateBody);
        document.removeEventListener("mouseup", touch.endRotateBody);
    }
}