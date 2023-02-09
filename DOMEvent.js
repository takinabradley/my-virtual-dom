class DOMEvent {
  #stop = false
  #stopImmediately = false
  #bubbles = false
  #cancelable = false
  #type = null
  #defaultPrevented = false

  constructor(type, options) {
    if(arguments.length < 1) throw new TypeError("Failed to construct 'DOMEvent': 1 argument required, but only 0 present.")
    this.#type = type
    this.target = null
    this.currentTarget = null
    this.eventPhase = 0

    if(options) {
      if(options.bubbles === true) this.#bubbles = true
      if(options.cancelable === true) this.#cancelable = true
    }
  }

  get stop() {return this.#stop}
  get stopImmediately() {return this.#stopImmediately}
  get bubbles() {return this.#bubbles}
  get cancelable() {return this.#cancelable}
  get type() {return this.#type}
  get defaultPrevented() {return this.#defaultPrevented}

  stopPropagation() {this.#stop = true}
  stopImmediatePropagation() {
    this.#stop = true
    this.#stopImmediately = true
  }
  preventDefault() {
    this.#defaultPrevented = true
  }
}

class CustomDOMEvent extends DOMEvent{
  #detail = null;
  constructor(type, options) {
    if(arguments.length < 1) throw new TypeError("Failed to construct 'CustomDOMEvent': 1 argument required, but only 0 present.")
    super(type, options)
    if(options && options.detail !== undefined)  {
      this.#detail = options.detail
    } else {
      this.#detail = null
    }
  }

  get detail() {return this.#detail}
  set detail(value) {/* don't allow, but don't throw error */}
}

export default DOMEvent
export {CustomDOMEvent}