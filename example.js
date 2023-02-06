import DOMEvent from './DOMEvent.js'
import FakeDocument from './FakeDocument.js'

/* fakeDocument stuff */
const fakeDocument = new FakeDocument()
const div = fakeDocument.createElement('div')
const p = fakeDocument.createElement('p')
const span = fakeDocument.createElement('span')
fakeDocument.body.appendChild(div)
div.appendChild(p)
p.appendChild(span)

function divBubbleHandler(e) {
  console.log('grandparent click bubble')
}

// capture listeners
div.addEventListener('click', e => {
  console.log('grandparent click capture')
}, true)

p.addEventListener('click', e => {
  console.log('parent click capture')
}, true)

// target listeners
span.addEventListener('click', function(e) {
  e.stopImmediatePropagation()       // stopped propogation immediately here!
  console.log('click capture')
  console.log("The element tha immediately stopped propogation was", this)
}, true)

span.addEventListener('click', e => {
  console.log('click capture 2')
}, true)

span.addEventListener('click', e => {
  console.log('click bubble')
})

// bubble listeners
p.addEventListener('click', e => {
  console.log('parent click bubble')
})

div.addEventListener('click', divBubbleHandler)
div.removeEventListener('click', divBubbleHandler)

// click 
span.click()
span.dispatchEvent(new DOMEvent('click'))