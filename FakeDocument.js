import DOMElement from './DOMElement.js'
import { EventNode } from './TreeNodes.js'

class FakeDocument extends EventNode {

  #findElement(elem, tagName) {
    // recursively search an element and it's children for a tag name
    if(elem.tagName === tagName) return elem
    let elementFound = null;
    for (let i = 0; i < elem.children.length; i++) {
      elementFound = this.#findElement(elem.children[i], tagName)
      if(elementFound) break
    }
    return elementFound
  }

  #findElements(elem, tagName, list = []) {
    // recursively search through an element's children for a tag name
    if(elem.children.length === 0) return list
    
    for(let i = 0; i < elem.children.length; i++) {
      if(elem.children[i].tagName === tagName) list.push(elem.children[i])
      list = [...list, ...this.#findElements(elem.children[i], tagName)]
    }
    return list
  }

  constructor() {
    super()
    this.children = []
    this.parentElement = null
    const htmlElement = new DOMElement('html')
    const headElement = new DOMElement('head')
    const bodyElement = new DOMElement('body')
    htmlElement.appendChild(headElement)
    htmlElement.appendChild(bodyElement)
    this.appendChild(htmlElement)
    this.body = bodyElement
  }

  appendChild(child) {
    if(this.children.length > 0) throw new Error("Only one element on document is allowed")
    super.appendChild(child)
    child.parentElement = null;
    this.children.push(child)
    return child
  }

  createElement(tagName) {
    return new DOMElement(tagName)
  }

  querySelector(tagName) {
    // look at all the children of this element, but not the element itself
    tagName = tagName.toUpperCase()
    let elementFound = null
    for(let i = 0; i < this.children.length; i++) {
      elementFound = this.#findElement(this.children[i], tagName)
      if(elementFound) break
    }
    return elementFound
  }

  getElementsByTagName(tagName) {
    // look at all the children of this element for an element with given tagname
    return this.#findElements(this, tagName.toUpperCase())
  }
}

export default FakeDocument