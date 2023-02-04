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
  e.stopPropagation()                // stopped progogation here!
  console.log('parent click capture')
}, true)

// target listeners
span.addEventListener('click', e => {
  console.log('click capture')
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