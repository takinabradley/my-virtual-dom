import FakeElement from './FakeElement.js'

class FakeDocument {
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
    if(tagName.toUpperCase() === 'HTML') return this.children[0]
    return this.children[0].querySelector(tagName)
  }

  getElementsByTagName(tagName) {
    if(tagName.toUpperCase() === 'HTML') {
      return [this.children[0], ...this.children[0].getElementsByTagName(tagName)]
    } else {
      return this.children[0].getElementsByTagName(tagName)
    }
  }

}

export default FakeDocument