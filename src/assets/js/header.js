export default class Header {
    constructor(el) {
        this.el = el
        this.sayHello()
    }

    sayHello() {
        let header = document.createElement('h1')
        header.innerHTML = 'Yooooo!'
        this.el.append(header)
    }
}