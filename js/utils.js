const utils = {
    createElement: function (type, className, content, href, onClick) {
        let el = document.createElement(type);

        if (className) {
            el.classList.add(className);
        }
        if (content) {
            el.innerHTML = content;
        }        
        if (href) {
            el.href = href;
        }
        if (onClick) {
            el.onclick = onClick;
        }

        return el;
    },

    index: function(el) {
        let children = el.parentNode.childNodes;
        
        for (let i = 0; i < children.length; i++) {
            if (children[i] === el) {
                return i + 1;
            }
        }

        return -1;
    },

    addEvent: function (el, events, handler) {
        for (let i = 0; i < events.length; i++) {
            el.addEventListener(events[i], handler);
        }
    },

    removeEvent: function (el, events, handler) {
        for (let i = 0; i < events.length; i++) {
            el.removeEventListener(events[i], handler);
        }
    },

    addClassToElements: function (elements, className) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add(className);
        }
    },

    removeClassFromElements: function (elements, className) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove(className);
        }
    },

    isSet: function (obj) {
        return typeof obj !== 'undefined' && obj !== null;
    }
}