import EventInterface from './EventInterface.js'
import DOMEvent from './DOMEvent.js'

class FakeElement extends EventInterface {
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

  #bubble(path, event) {
    //dispatch bubble events on each element in path until aborted
    for(let i = 0; i < path.length; i++) {
      if(event.stop) break
      
      path[i].dispatchEvent(
        event, 
        {
          currentTarget: path[i],
          eventPhase: 3
        }
      )
    }
  }

  #capture(path, event) {
    //dispatch capture events on each element in path until aborted
    for(let i = 0; i < path.length; i++) {
      if(event.stop) break
      path[i].dispatchEvent(
        event, 
        {
          currentTarget: path[i],
          eventPhase: 3
        },
        'capture'
      )
    }
  }

  #getPathToHTML(element = this, array = []) {
    // finds a list of all parent elements until an HTML tag is found
    if(element === null) return array
    array.push(element)
    return this.#getPathToHTML(element.parentElement, array)
  }

  #getBubbleAndCapturePaths(element = this) {
    // find paths that events should propogate through
    const bubblePath = this.#getPathToHTML()
    bubblePath.splice(0, 1)
    const capturePath = [...bubblePath].reverse()

    return [bubblePath, capturePath]
  }

  constructor(tagName) {
    // get event functionality
    super()

    // set element props
    this.tagName = tagName ? tagName.toUpperCase() : undefined
    this.textContent = ''
    this.style = {}
    this.parentElement = null
    this.children = []
  }

  // public element methods
  appendChild(domElement) {
    domElement.parentElement = this
    this.children.push(domElement)
    return domElement
  }

  click() {
    const event = new DOMEvent('click')
    event.target = this

    const [bubblePath, capturePath] = this.#getBubbleAndCapturePaths()

    // capture phase
    this.#capture(capturePath, event)

    // target phase - dispatch capture events first then bubble events. 
    // Don't dispatch them if stopPropogation has been called.
    if(!event.stop) {
      this.dispatchEvent(event, {
        currentTarget: this,
        eventPhase: 2
      }, 'capture');
    }
    
    if(!event.stop) {
      this.dispatchEvent(event, {
        currentTarget: this,
        eventPhase: 2
      });
    }
    
    // bubble phase
    this.#bubble(bubblePath, event)
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

export default FakeElement