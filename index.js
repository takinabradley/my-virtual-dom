import FakeDocument from './FakeDocument.js'
const fakeDocument = new FakeDocument()

const p = fakeDocument.createElement('p')
fakeDocument.body.appendChild(p)
p.appendChild(fakeDocument.createElement('em'))
const div = fakeDocument.createElement('div')
div.appendChild(fakeDocument.createElement('section')).appendChild(fakeDocument.createElement('article'))
fakeDocument.body.appendChild(div)
fakeDocument.body.appendChild(fakeDocument.createElement('div'))
console.log(div)


const article = fakeDocument.querySelector('article')

article.addEventListener('click', (e) => {
  console.log('at target...', e)
})

article.parentElement.addEventListener('click', (e) => {
  console.log('capturing...', e)
}, true)
article.parentElement.parentElement.addEventListener('click', (e) => {
  console.log('capturing...', e)
}, true)

article.parentElement.addEventListener('click', (e) => {
  console.log('bubbling...', e)
})
article.parentElement.parentElement.addEventListener('click', (e) => {
  console.log('bubbling...', e)
})

article.click()