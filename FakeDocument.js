import DOMElement from './DOMElement.js'

class FakeDocument {
  constructor() {
    const html = new DOMElement('html')
    html.appendChild(new DOMElement('head'))
    html.appendChild(new DOMElement('body'))
    this.children = [html]
    this.body = html.children[1]
  }

  createElement(tagName) {
    return new DOMElement(tagName)
  }

  querySelector(tagName) {
    //query from html - html tag including
    if(tagName.toUpperCase() === 'HTML') return this.children[0]
    return this.children[0].querySelector(tagName)
  }

  getElementsByTagName(tagName) {
    // query from html - html tag including
    if(tagName.toUpperCase() === 'HTML') {
      return [this.children[0], ...this.children[0].getElementsByTagName(tagName)]
    } else {
      return this.children[0].getElementsByTagName(tagName)
    }
  }

}

export default FakeDocument