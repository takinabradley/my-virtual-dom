import FakeElement from './FakeElement.js'

class FakeDocument {
  #findElement(elem, tagName) {
    if(elem.tagName === tagName) return elem
    let elementFound = null;
    for (let i = 0; i < elem.children.length; i++) {
      elementFound = this.#findElement(elem.children[i], tagName)
      if(elementFound) return elementFound
      //if (this.#findElement(elem.children[i], tagName)) return this.#findElement(elem.children[i], tagName)
    }
    return elementFound
  }

  constructor() {
    const html = new FakeElement('html')
    html.appendChild(new FakeElement('head'))
    html.appendChild(new FakeElement('body'))
    this.children = [html]
    this.body = html.children[1]
  }

  createElement(tagName) {
    return new FakeElement(tagName)
  }

  querySelector(tagName) {
    tagName = tagName.toUpperCase()
    return this.#findElement(this.body.parentElement, tagName)
  }

}

export default FakeDocument