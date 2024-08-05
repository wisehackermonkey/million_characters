import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
// import npm bootstrap
import * as Y from 'yjs'
import { createYjsProvider } from '@y-sweet/client'
// At the component you want to use confetti
import confetti  from 'canvas-confetti';

const QUERY_PARAM = 'doc'
const submit_button = document.querySelector('button[name="submit"]')
const textarea = document.querySelector('textarea[name="sharededitor"]')
const replace_text = document.querySelector('textarea[name="replacetext"]')
const replace_text_button = document.querySelector('button[name="replacetextbutton"]')
const current_char = document.querySelector('input[name="char"]')

const DEFAULT_DOCUMENT = 'demo'
const DEFAULT_TIMEOUT = 3/*seconds*/ *1000;//seconds

// on page load run canvas-confetti


async function main() {
  // First, fetch a client token that can access the docId in the URL.
  // Or, if the URL does not contain a docId, get a client token for a new doc.
  const url = new URL(`http://localhost:9090/client-token`)
  var searchParams = new URLSearchParams(window.location.search)
  if (searchParams.size === 0){
    var searchParams = new URLSearchParams(DEFAULT_DOCUMENT)

  }
  const docId = searchParams.get(QUERY_PARAM)
  if (docId) url.searchParams.set(QUERY_PARAM, DEFAULT_DOCUMENT)
  const res = await fetch(url.toString())
  const clientToken = await res.json()

  //TODO make this static
  // Update the URL to include the docId if it was not already present.
  if (!docId) {
    const url = new URL(window.location.href)
    url.searchParams.set(QUERY_PARAM, DEFAULT_DOCUMENT)
    window.history.replaceState({}, '', url.toString())
  }

  // Create a Yjs document and connect it to the Y-Sweet server.
  const doc = new Y.Doc()
  createYjsProvider(doc, clientToken, { disableBc: true })
   // const text = doc.getText("text")
  
  const text = doc.getText("demo")
 
  //disable delete key for textarea
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
      //create pop tooltip for textarea "sorry backspace is deactivated"
      insertChar(text, e.target.selectionStart, ' ')
      disableInput(textarea, DEFAULT_TIMEOUT)
      e.preventDefault()
    }
  })

  text.observe((yEvent) => {
    textarea.value = text.toString()
  })

  // <textarea name="sharededitor" id="" cols="30" rows="10"></textarea>
  // <button type="button"  onclick="setText()">Submit</button>
  // for button onclick add event listener that calls text.set('text', textarea.value)
  //get text from text area sharededitor
  

  submit_button.addEventListener('click', () => {
    let currentChar = document.querySelector('input[name="char"]')
    let charIndex = document.querySelector('input[name="index_insert"]')
    if (text.toString().length === 0 && currentChar.value.length === 1) {
      text.insert(0, currentChar.value)
      return
    }
    insertChar(text, parseInt(charIndex.value), currentChar.value)
    disableInput(submit_button, DEFAULT_TIMEOUT)
    disableInput(textarea, DEFAULT_TIMEOUT)
    disableButton(submit_button, DEFAULT_TIMEOUT)
  })
  //write a function that adds event listener to textarea[ name="sharededitor" ]
  //colors the textarea character at index with color red
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

  // add event listener that disable select all for textarea[name="sharededitor"] 
  textarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'a') {
      alert('Select all is disabled')
      e.preventDefault();
    }
  });

  textarea.addEventListener('keypress', (e) => {
    // disable typing in textarea
    e.preventDefault()
    //disable selectall 

    // get current location of text cursor
    const index = e.target.selectionStart;
    e.target.setSelectionRange(index, index + 1)

    if (e.key.length === 1) {
      const index = e.target.selectionStart
      const char = e.key
      insertChar(text, index, char)
      

    }
    // set cursor location to index
    disableInput(textarea,3000);

  })

  replace_text_button.addEventListener('click', () => {
    text.delete(0, text.toString().length)
    text.insert(0, replace_text.value)
  })


  function disableInput(element, time) {
    //change mouse cursor to waiting cursor
    element.style.cursor = 'wait'
    //disable element
    element.disabled = true
    //change mouse cursor back to default cursor
    setTimeout(() => {
      element.style.cursor = 'default'
      element.disabled = false

    }, 2000)
  }
  let counter = 0;
  //write a function that adds a timer's text to the button format: "Submit wait {} seconds"
  function disableButton(element, time) {
    element.disabled = true
    counter = 0;
    counter = time;
    element.innerText = `Confirm`
    setInterval(() => {

      if (counter > 0){
        counter -= 1000
      }
      element.innerText = `Confirm wait ${counter/1000} seconds`
    }
      , 1000)

    // element.innerText = `Confirm wait ${time} seconds`
    setTimeout(() => {
      element.disabled = false
      element.innerText = 'Confirm'
    }, time)
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

  // <button class="btn btn-secondary btn-sm" name="insert_space" type="button">Insert Space</button>
  // <button class="btn btn-secondary btn-sm" name="insert_return" type="button">Insert Return</button>
   //add event listener that inserts space at cursor location using insertChar function
  document.querySelector('button[name="insert_space"]').addEventListener('click', () => {
    let index = textarea.selectionStart
    text.insert(index, " ")

    disableInput(document.querySelector('button[name="insert_space"]'), DEFAULT_TIMEOUT)
  })

  //add event listener to current_char where it selects all text in input
  current_char.addEventListener('click', (e) => {
    e.target.select()
  })
  //add event listener for current_char on enter key it inserts the value of current_char at cursor location
  current_char.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      let index = textarea.selectionStart
      text.insert(index, current_char.value)

      disableInput(current_char, DEFAULT_TIMEOUT)
      disableInput(textarea, DEFAULT_TIMEOUT)
    }
  })
}

//create a confetti animation using a library like confetti-js
function playConfetti() {
  //create a confetti animation
  var count = 200;
  var defaults = {
    origin: { y: 0.7 }
  };
  
  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }
  
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
  
}


function insertChar(yDoc, offset, char) {
  playConfetti()

  //add confetty animation everytime this function is called
  if (yDoc.toString().length === 0) {
    console.log('yDoc is empty')
    yDoc.insert(offset, 1)
    return
  }
  yDoc.insert(offset, char)
  yDoc.delete(offset + 1, 1)
}
main() 