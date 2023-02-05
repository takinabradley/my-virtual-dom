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

  dispatchEvent(event, additionalData = null, phase = 'bubble') {
    if (this.#events[phase][event.type]) {
      for(let i = 0; i < this.#events[phase][event.type].length; i++) {
        if(event.stopImmediately) break
        this.#events[phase][event.type][i](event)
      }
    }
  }
}

export default EventInterface