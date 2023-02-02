import EventInterface from './EventInterface.js'

class FakeElement extends EventInterface {
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

}

export default FakeElement