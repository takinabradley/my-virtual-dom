import {EventNode} from './TreeNodes.js'
import DOMEvent from './DOMEvent.js';
const defaultActions = {
  INPUT: {
    keydown: [
      function setInputValue(elem, data) {
        elem.value += data.key; 
        elem.textContent = elem.value
      },
    ]
  }
}

const defaultProps = {
  INPUT: {
    value: '',
  }
}
class DOMElement extends EventNode {
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

  #triggerDefaultAction(event, data) {
    if(defaultActions[this.tagName][event.type] && !event.defaultPrevented) {
      defaultActions[this.tagName][event.type].forEach(fn => fn(this, data))
    }
  }

  constructor(tagName) {
    // get event functionality
    super()
    this.children = []
    // set element props
    this.tagName = tagName
    this.textContent = ''
    this.style = {}
    this.parentElement = null

    if(defaultProps[tagName]) {
      for(const key in defaultProps[tagName]) {
        this[key] = defaultProps[tagName][key]
      }
    }
  }

  // public element methods
  appendChild(child) {
    super.appendChild(child)
    child.parentElement = this
    this.children.push(child)
    return child
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

  click() {
    const event = new DOMEvent('click')
    this.dispatchEvent(event)
  }

  keyDown(key) {
    const event = new DOMEvent('keydown')
    this.dispatchEvent(event)

    this.#triggerDefaultAction(event, {key})
  }
}

export default DOMElement