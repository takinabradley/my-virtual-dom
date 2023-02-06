class DOMEvent {
  #stop = false
  #stopImmediately = false
  #bubbles = false
  #cancelable = false

  constructor(type, options) {
    this.type = type
    this.target = null

    if(options) {
      if(options.bubbles === true) this.#bubbles = true
      if(options.cancelable === true) this.#cancelable = true
    }
  }

  get stop() {return this.#stop}
  get stopImmediately() {return this.#stopImmediately}
  get bubbles() {return this.#bubbles}
  get cancelable() {return this.#cancelable}

  stopPropagation() {this.#stop = true}
  stopImmediatePropagation() {
    this.#stop = true
    this.#stopImmediately = true
  }
}

export default DOMEvent