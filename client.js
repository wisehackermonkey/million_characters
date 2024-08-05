import './style.css'
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

  //write a function that adds
 }
function insertChar(yDoc, index, char) { 
  if(yDoc.toString().length === 0) {
    console.log('yDoc is empty')
    return
  }
  yDoc.delete(index,1)
  yDoc.insert(index, char)
}
main() 