class TreeNode {
  constructor() {
    this.childNodes = []
  }

  appendChild(child) {
    this.childNodes.push(child)
    return child
  }
}

class TreeNodeWithParent extends TreeNode {
  constructor() {
    super()
    this.parentNode = null
  }

  appendChild(child) {
    super.appendChild(child)
    child.parentNode = this
    return child
  }
}

class TreeEventNode extends TreeNodeWithParent {
  #events = {
    capture: {},
    bubble: {},
  }

  #bubble(path, event) {
    event.eventPhase = 3
    //dispatch bubble events on each element in path until aborted
    for(let i = 0; i < path.length; i++) {
      if(event.stop) break
      event.currentTarget = path[i]
      path[i].#triggerEvent(event)
    }
  }

  #capture(path, event) {
    //dispatch capture events on each element in path until aborted
    event.eventPhase = 1
    for(let i = 0; i < path.length; i++) {
      if(event.stop) break
      event.currentTarget = path[i]
      path[i].#triggerEvent(event, 'capture')
    }
  }

  #getPathToHead(node = this, array = []) {
    if(node === null) return array
    array.push(node)
    return this.#getPathToHead(node.parentNode, array)
  }

  #getBubbleAndCapturePaths(element = this) {
    // find paths that events should propogate through
    const bubblePath = this.#getPathToHead()
    bubblePath.splice(0, 1)
    const capturePath = [...bubblePath].reverse()
    return [bubblePath, capturePath]
  }

  #triggerEvent(event, phase = 'bubble') {
    if (this.#events[phase][event.type]) {
      for(let i = 0; i < this.#events[phase][event.type].length; i++) {
        if(event.stopImmediately) break
        this.#events[phase][event.type][i].call(this, event)
      }
    }
  }

  constructor() {
    super()
  }

  addEventListener(eventName, callback, capture = false) {
    if (typeof callback !== "function" || typeof eventName !== "string") return;
    /* add the event to the bubble phase by default */
    const phase = capture ? 'capture' : 'bubble'
    if (!this.#events[phase][eventName]) this.#events[phase][eventName] = [];
    this.#events[phase][eventName].push(callback);
  }

  removeEventListener(eventName, callbackToRemove, capture = false) {
    const phase = capture ? 'capture' : 'bubble'
    if (typeof callbackToRemove !== "function" || typeof eventName !== "string" || !this.#events[phase][eventName]) return;
    /* Find the index of the callback and remove it under 
    this.#events[phase][eventName] and remove it from the array if it exists.*/
    const indexOfCallback = this.#events[phase][eventName].indexOf(callbackToRemove);
    if (indexOfCallback !== -1) this.#events[phase][eventName].splice(indexOfCallback, 1);
    /* If the array of callbacks under that eventName entry is afterwards, 
    delete it */
    if (this.#events[phase][eventName].length === 0) delete this.#events[phase][eventName];
  }

  dispatchEvent(event) {
    event.target = this

    const [bubblePath, capturePath] = this.#getBubbleAndCapturePaths()

    // capture phase
    this.#capture(capturePath, event)

    // target phase - dispatch capture events first then bubble events. 
    // Don't dispatch them if stopPropogation has been called.
    event.currentTarget = this
    event.eventPhase = 2
    if(!event.stop) {
      this.#triggerEvent(event, 'capture');
    }
    
    if(!event.stop) {
      this.#triggerEvent(event);
    }
    
    // bubble phase
    this.#bubble(bubblePath, event)

    // after the event is over, set these.
    event.eventPhase = 0
    event.currentTarget = null
  }
}

export {
  TreeNode as Node, 
  TreeNodeWithParent as NodeWithParent, 
  TreeEventNode as EventNode
}