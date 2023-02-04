class EventInterface {
  #events = {
    capture: {},
    bubble: {},
  }

  addEventListener(eventName, callback, capture = false) {
    if (typeof callback !== "function" || typeof eventName !== "string") return;
    const phase = capture ? 'capture' : 'bubble'
    if (!this.#events[phase][eventName]) this.#events[phase][eventName] = [];
    this.#events[phase][eventName].push(callback);
  }

  removeEventListener(eventName, callbackToRemove, capture = false) {
    const phase = capture ? 'capture' : 'bubble'
    if (typeof callbackToRemove !== "function" || typeof eventName !== "string" || !this.#events[phase][eventName]) return;
    const indexOfCallback = this.#events[phase][eventName].indexOf(callbackToRemove);
    if (indexOfCallback !== -1) this.#events[phase][eventName].splice(indexOfCallback, 1);
    if (this.#events[phase][eventName].length === 0) delete this.#events[phase][eventName];
  }

  dispatchEvent(eventName, data, phase = 'bubble') {
    if (typeof eventName !== "string") return;
    const stopImmediatePropagation = () => {
      data.stopPropagation()
      stop = true
    }

    // only add this if original event had a stopPropogation method.
    if(data.stopPropagation) data.stopImmediatePropagation = stopImmediatePropagation

    let stop = false
    if (this.#events[phase][eventName]) {
      for(let i = 0; i < this.#events[phase][eventName].length; i++) {
        if(stop) break
        this.#events[phase][eventName][i](data)
      }
    }
  }
}

export default EventInterface