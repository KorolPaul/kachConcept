const FRAMES_COUNT = 11; //document.querySelector('.muscles_side').lenght

let motionFrame = 0,
    motionDelay = 85,    
    musclesMap,
    musculeTitles;

class Body {
    constructor() {
        let musclesElement = document.querySelector('.muscles'),
            hammerMap = new Hammer(musclesElement);

        musclesMap = document.getElementById('map');
        musculeTitles = document.querySelectorAll('.muscles_title');
        
        musclesElement.addEventListener('wheel', Body.scroll);
        hammerMap.on('swipe', Body.swipe);
    }

    static scroll(e) {
        const isScrollUp = (e.deltaY || e.detail || e.wheelDelta) > 0;
        
        if (isScrollUp) {
            motionFrame < FRAMES_COUNT ? motionFrame++ : motionFrame = 0;
        } else {
            motionFrame > 0 ? motionFrame-- : motionFrame = FRAMES_COUNT;
        }

        Body.rotateBody();
    }

    static rotateBody() {
        musclesMap.style.backgroundPositionX = motionFrame * 9 + "%";

        utils.removeClassFromElements(musculeTitles, 'muscles_title__visible');
        utils.addClassToElements(document.querySelectorAll('[data-layer="'+ motionFrame +'"]'), 'muscles_title__visible');

        utils.removeClassFromElements(musculesSides, 'active');
        musculesSides[motionFrame].classList.add('active');
    }

    static swipe(e) {
        switch (e.direction) {
            case 2:  //left
                motionFrame < FRAMES_COUNT ? motionFrame++ : motionFrame = 0;
                break;

            case 4:  //right
                motionFrame > 0 ? motionFrame-- : motionFrame = FRAMES_COUNT;
                break;
        }

        Body.rotateBody();
        if (!document.querySelector('.muscles_title__visible[data-layer]')) {
            setTimeout(function () { Body.swipe(e); }, motionDelay);
        }
    }
}