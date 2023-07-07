import Vue from 'vue'
Vue.prototype.$notice = (message) => {
    let bodyDom = document.getElementsByTagName("body")[0]
    let docHeight = window.screen.availHeight / 10
    let screenHeight = docHeight > 133.4 ? docHeight : 133.4
    let domParent = document.createElement('div')
    domParent.setAttribute('style', `width: 75rem;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;`
    );
    domParent.style.height = screenHeight + 'rem';
    let domChildren = document.createElement('span')
    domChildren.setAttribute('style', `display: block;
        width: auto;
        height: 8rem;
        padding: 0rem 3rem;
        background:rgba(0,0,0,0.5);
        line-height: 8rem;
        text-align: center;
        font-size: 2.8rem;
        color: #FFFFFF;
        border-radius:1.2rem;`
    );
    let nodetext = document.createTextNode(message)
    domChildren.appendChild(nodetext)
    domParent.appendChild(domChildren)
    bodyDom.appendChild(domParent)
    setTimeout(() => {
        bodyDom.removeChild(domParent)
    },2000)
}