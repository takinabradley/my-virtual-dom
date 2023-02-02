import EventInterface from './EventInterface.js'

class FakeElement extends EventInterface {
  #findElement(elem, tagName) {
    if(elem.tagName === tagName) return elem
    let elementFound = null;
    for (let i = 0; i < elem.children.length; i++) {
      elementFound = this.#findElement(elem.children[i], tagName)
      if(elementFound) break
    }
    return elementFound
  }

  #findElements(elem, tagName, list = []) {
    if(elem.children.length === 0) return list
    
    for(let i = 0; i < elem.children.length; i++) {
      if(elem.children[i].tagName === tagName) list.push(elem.children[i])
      list = [...list, ...this.#findElements(elem.children[i], tagName)]
    }
    return list
  }

  #bubble(path, data) {
    path.forEach(elem => 
      elem.dispatchEvent(
        data.type, 
        {
          ...data,
          currentTarget: elem,
          eventPhase: 3
        },
      )
    )
  }

  #capture(path, data) {
    path.forEach(elem => 
      elem.dispatchEvent(
        data.type, 
        {
          ...data,
          currentTarget: elem,
          eventPhase: 1
        },
        'capture'
      )
    )
  }

  #getPathToHTML(element = this, array = []) {
    if(element === null) return array
    array.push(element)
    return this.#getPathToHTML(element.parentElement, array)
  }
  constructor(tagName) {
    super()
    this.tagName = tagName ? tagName.toUpperCase() : undefined
    this.textContent = ''
    this.style = {}
    this.parentElement = null
    this.children = []
  }

  appendChild(domElement) {
    domElement.parentElement = this
    this.children.push(domElement)
    return domElement
  }

  click() {
    const eventData = {
      type: 'click',
      target: this,
    }
    const bubblePath = this.#getPathToHTML()
    bubblePath.splice(0, 1)
    const capturePath = [...bubblePath].reverse()
    this.#capture(capturePath, eventData)
    this.dispatchEvent(eventData.type, {
      ...eventData,
      currentTarget: this,
      eventPhase: 2
    });
    this.#bubble(bubblePath, eventData)
  }

  querySelector(tagName) {
    // look ot all the children of this element, but not the element itself
    tagName = tagName.toUpperCase()
    let elementFound = null
    for(let i = 0; i < this.children.length; i++) {
      elementFound = this.#findElement(this.children[i], tagName)
      if(elementFound) break
    }
    return elementFound
  }

  getElementsByTagName(tagName) {
    return this.#findElements(this, tagName.toUpperCase())
  }
}

export default FakeElement