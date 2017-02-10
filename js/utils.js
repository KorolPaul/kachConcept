const utils = {
    createElement: function (type, className, content, href, onClick) {
        let el = document.createElement(type);
        el.classList.add(className);

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
    }
}