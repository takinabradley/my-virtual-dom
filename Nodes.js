class Node {
  constructor() {
    this.children = []
  }

  appendChild(child) {
    this.children.push(child)
    return child
  }
}

class NodeWithParent extends Node {
  constructor() {
    super()
    this.parentNode = null
  }

  appendChild(child) {
    child.parentNode = this
    this.children.push(child)
    return child
  }
}



class EventNode extends NodeWithParent {
  #events = {
    capture: {},
    bubble: {},
  }

  #bubble(path, event) {
    //dispatch bubble events on each element in path until aborted
    for(let i = 0; i < path.length; i++) {
      if(event.stop) break
      
      path[i].#triggerEvent(
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
      path[i].#triggerEvent(
        event, 
        {
          currentTarget: path[i],
          eventPhase: 3
        },
        'capture'
      )
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

  #triggerEvent(event, additionalData = null, phase = 'bubble') {
    if (this.#events[phase][event.type]) {
      for(let i = 0; i < this.#events[phase][event.type].length; i++) {
        if(event.stopImmediately) break
        this.#events[phase][event.type][i](event)
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
    if(!event.stop) {
      this.#triggerEvent(event, {
        currentTarget: this,
        eventPhase: 2
      }, 'capture');
    }
    
    if(!event.stop) {
      this.#triggerEvent(event, {
        currentTarget: this,
        eventPhase: 2
      });
    }
    
    // bubble phase
    this.#bubble(bubblePath, event)
  }
}

export {Node, NodeWithParent, EventNode}