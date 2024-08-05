import './style.css'
// import npm bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import * as Y from 'yjs'
import { createYjsProvider } from '@y-sweet/client'

const QUERY_PARAM = 'doc'

async function main() {
  // First, fetch a client token that can access the docId in the URL.
  // Or, if the URL does not contain a docId, get a client token for a new doc.
  const url = new URL(`http://localhost:9090/client-token`)
  const searchParams = new URLSearchParams(window.location.search)
  const docId = searchParams.get(QUERY_PARAM)
  if (docId) url.searchParams.set(QUERY_PARAM, docId)
  const res = await fetch(url.toString())
  const clientToken = await res.json()

  //TODO make this static
  // Update the URL to include the docId if it was not already present.
  if (!docId) {
    const url = new URL(window.location.href)
    url.searchParams.set(QUERY_PARAM, clientToken.doc)
    window.history.replaceState({}, '', url.toString())
  }

  // Create a Yjs document and connect it to the Y-Sweet server.
  const doc = new Y.Doc()
  createYjsProvider(doc, clientToken, { disableBc: true })
  // const sharedColorMap = doc.getMap('colorgrid')
  const text = doc.getText("text")

  

  text.observe((yEvent) => { 
    let s = text.toString()
     document.querySelector('textarea[name="sharededitor"]').value = s
 
  })

  // <textarea name="sharededitor" id="" cols="30" rows="10"></textarea>
  // <button type="button"  onclick="setText()">Submit</button>
  // for button onclick add event listener that calls text.set('text', textarea.value)
  //get text from text area sharededitor
  let submit_button = document.querySelector('button[name="submit"]')


  submit_button.addEventListener('click', () => {
    let currentChar = document.querySelector('input[name="char"]')
    let charIndex = document.querySelector('input[name="index_insert"]')
    if(text.toString().length === 0 && currentChar.value.length === 1) {
      text.insert(0, currentChar.value)
      return
    }
    insertChar(text,parseInt(charIndex.value), currentChar.value)
    
  })
  //write a function that adds event listener to textarea[ name="sharededitor" ]
  //colors the textarea character at index with color red
  document.querySelector('textarea[name="sharededitor"]').addEventListener('click', (e) => {
    var { index, char } = highlight_selection()
    //when user press a character run the function insertChar
    
  }
  )

  document.querySelector('textarea[name="sharededitor"]').addEventListener('keypress', (e) => {
    // disable typing in textarea
    e.preventDefault()
    // get current location of text cursor
    const index = e.target.selectionStart;
     
    if (e.key.length === 1) {
      const index = e.target.selectionStart
      const char = e.key
      insertChar(text, index, char)
    }
    // set cursor location to index
    e.target.setSelectionRange(index, index)

  })
  function highlight_selection() {
    let textarea = document.querySelector('textarea[name="sharededitor"]')
    textarea.addEventListener('click', (e) => {
      let index = e.target.selectionStart
      let char = text.toString().charAt(index)
      e.target.setSelectionRange(index, index + 1)
      let currentChar = document.querySelector('input[name="char"]')
      let charIndex = document.querySelector('input[name="index_insert"]')
      currentChar.value = char
      charIndex.value = index
      return { index, char }
    })
  }

  //write a function that adds event listener to textarea[ name="sharededitor" ]
  //displays popup next to textarea with index of character and character
  document.querySelector('textarea[name="sharededitor"]').addEventListener('click', (e) => {
    let index = e.target.selectionStart
    let char = text.toString().charAt(index)
    let popup = document.createElement('div')
    popup.style.position = 'absolute'
    popup.style.backgroundColor = 'white'
    popup.style.border = '1px solid black'
    popup.style.padding = '10px'  
    popup.style.top = `${e.clientY + 20}px`
    popup.style.left = `${e.clientX}px`
    popup.innerHTML = `Index: ${index} Char: ${char}`
    document.body.appendChild(popup)
    setTimeout(() => {
      popup.remove()
    }, 1000)


  }
  )
 }
function insertChar(yDoc, offset, char) { 
  if(yDoc.toString().length === 0) {
    console.log('yDoc is empty')
    return
  }
  yDoc.insert(offset, char)
  yDoc.delete(offset+1,1)
}
main() 