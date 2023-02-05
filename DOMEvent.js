class DOMEvent {
  #stop = false
  #stopImmediately = false

  constructor(type) {
    this.type = type
    this.target = null
  }

  get stop() {return this.#stop}
  get stopImmediately() {return this.#stopImmediately}

  stopPropagation() {this.#stop = true}
  stopImmediatePropagation() {
    this.#stop = true
    this.#stopImmediately = true
  }
}

export default DOMEvent