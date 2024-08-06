import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import 'animate.css';
// import npm bootstrap
import * as Y from 'yjs'
import * as awarenessProtocol from 'y-protocols/awareness.js'

import { createYjsProvider } from '@y-sweet/client'
// At the component you want to use confetti
import confetti from 'canvas-confetti';

const QUERY_PARAM = 'doc'
const submit_button = document.querySelector('button[name="submit"]')
const textarea = document.querySelector('textarea[name="sharededitor"]')
const replace_text = document.querySelector('textarea[name="replacetext"]')
const replace_text_button = document.querySelector('button[name="replacetextbutton"]')
const current_char = document.querySelector('input[name="char"]')
const total_char = document.querySelector('#totalCharCounter')
const DEFAULT_DOCUMENT = 'demo'
const DEFAULT_TIMEOUT = 3/*seconds*/ * 1000;//seconds

// write a function that reads a file called test.txt and returns the contents of the file as string, using async await
async function readTextFile(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text
}
var test_sample
function triggerAnimation() {
  const element = document.getElementById('personalCounter');
  element.classList.remove('animate__animated', 'animate__shakeY', "animate__fast");  // Reset the animation

  // Trigger reflow to reset the animation
  void element.offsetWidth;

  element.classList.add('animate__animated', 'animate__shakeY', "animate__fast");  // Add the animation class again
}
function animateTextArea() {
  const element = document.getElementById('sharededitor');
  element.classList.remove('animate__animated', 'animate__swing', "animate__fast");  // Reset the animation

  // Trigger reflow to reset the animation
  void element.offsetWidth;
  element.style.setProperty('--animate-duration', '0.1s');
  element.classList.add('animate__animated', 'animate__swing', "animate__fast");  // Add the animation class again
}

async function main() {
  setPersonalCounter()
  triggerAnimation()
  animateTextArea()
  const clientToken = { url: `ws://${window.location.hostname}:8080/doc/ws`, docId: 'docId' }//await res.json()


  // Create a Yjs document and connect it to the Y-Sweet server.
  const doc = new Y.Doc()
  var awareness = new awarenessProtocol.Awareness(doc)

  createYjsProvider(doc, clientToken, { disableBc: true, awareness: awareness })
  //let us know how many people are connected to the website at one time
  const text = doc.getText("demo")


  // You can think of your own awareness information as a key-value store.
  // We update our "user" field to propagate relevant user information.
  awareness.setLocalStateField('user', {
    // Define a print name that should be displayed
    name: 'Emmanuelle Charpentier',
    // Define a color that should be associated to the user:
    color: '#ffb61e' // should be a hex color
  })
  const usercolors = [
    '#30bced',
    '#6eeb83',
    '#ffbc42',
    '#ecd444',
    '#ee6352',
    '#9ac2c9',
    '#8acb88',
    '#1be7ff'
  ]
  const ANIMAL_NAMES = ['Lion', 'Tiger', 'Elephant', 'Deer', 'Bear', 'Monkey', 'Giraffe', 'Dolphin', 'Whale', 'Penguin', 'Koala', 'Kangaroo', 'Panda', 'Zebra', 'Hippopotamus', 'Rhinoceros', 'Leopard', 'Cheetah', 'Fox', 'Wolf', 'Rabbit', 'Squirrel', 'Raccoon', 'Otter', 'Skunk', 'Beaver', 'Badger', 'Opossum', 'Mouse', 'Rat', 'Hedgehog', 'Bat', 'Sloth', 'Anteater', 'Armadillo', 'Porcupine', 'Platypus', 'Wombat', 'Tasmanian Devil', 'Mole', 'Weasel', 'Ferret', 'Marten', 'Mink', 'Sable', 'Stoat', 'Meerkat', 'Prairie Dog', 'Groundhog', 'Woodchuck', 'Chipmunk', 'Hamster', 'Gerbil', 'Guinea Pig', 'Chinchilla', 'Degu', 'Lemming', 'Vole', 'Muskrat', 'Shrew',]
  const animalName = ANIMAL_NAMES[Math.floor(Math.random() * ANIMAL_NAMES.length)]
  const myColor = usercolors[Math.floor(Math.random() * usercolors.length)]
  const username = `${animalName}:${Math.floor(Math.random() * 10000)}`
  awareness.setLocalStateField('user', { name: username, color: myColor })
  // get user name and color from awareness
  const user = awareness.getLocalState().user
  showPopup(true)

  doc.on('update', () => {
    total_char.innerText = text.toString().length
  })
  // displayAwarenessMousePointer(awareness)
  function createAwarenessPointer(color,x,y) {
    const pointer = document.createElement('div');
    pointer.id = 'awarenessPointer';
    pointer.style.position = 'absolute';
    pointer.style.width = '10px';
    pointer.style.height = '10px';
    pointer.style.borderRadius = '50%';
    pointer.style.backgroundColor = 'red';
    pointer.style.pointerEvents = 'none';
    pointer.style.zIndex = '1000';
    pointer.style.backgroundColor = color;

    pointer.style.left = `${x}px`;
    pointer.style.top = `${y}px`;
    document.body.appendChild(pointer);

    return pointer
  }

  // Call the function with the user object
  //create array of users
   var mouseElements = [createAwarenessPointer(user.color,0,0)];
  var users = {}
  // make a dictionary for each clientID and their mouse pointer
  // for each user in awareness, create a mouse pointer, and store reference in users
  awareness.getStates().values().forEach(state => {
    if (state.mouse) {
      const { x, y } = state.mouse;
      //add createAwarenessPointer(state.user.color,x,y) by client id
      if (users[state.mouse.id.toString()]) {
        users[state.mouse.id.toString()].style.left = `${x}px`;
        users[state.mouse.id.toString()].style.top = `${y}px`;
      } else {
        //create new mouse pointer
      users[state.mouse.id.toString()] = createAwarenessPointer(state.user.color,x,y)
      }
    }
  })
  // add div for each user, use createAwarenessPointer
   
  sendMousePosition(awareness, mouseElements)

  //draw all users mouse pointers

  // write a function that creates a new mouse elment for each user, and on update changes the user's mouse element position


  awareness.on('change', () => {
    // Map each awareness state to a dom-string
     const strings = []

    awareness.getStates().values().forEach(state => {
      //for all mouse in state, draw createAwarenessPointer
      if (state.mouse) {
        const { x, y } = state.mouse;
        // check users[state.mouse.id]  already exists and if so update position
        if (users[state.mouse.id.toString()]) {
          users[state.mouse.id.toString()].style.left = `${x}px`;
          users[state.mouse.id.toString()].style.top = `${y}px`;
        } else {
          //create new mouse pointer
        users[state.mouse.id.toString()] = createAwarenessPointer(state.user.color,x,y)
        }
        // mouseElements.push(createAwarenessPointer(state.user.color,x,y));
      }
    })

      awareness.getStates().values().forEach(state => {
         if (state.user) {
          strings.push(`<div style="color:${state.user.color};">${state.user.name}</div>`)
        }
        document.querySelector('#users').innerHTML = strings.join('')
      })



    })



    awareness.on('update', ({ added, updated, removed }) => {
      //get awarenessPointer div
      var pointer = mouseElements[0]

      const strings = []
      awareness.getStates().values().forEach(state => {
        //if state.mouse is not null
        if (state.mouse) {
          const { x, y } = state.mouse;
          pointer.style.left = `${x}px`;
          pointer.style.top = `${y}px`;
          // console.log('mouse', { x, y });
          console.log(".")
        }

        if (state.user) {
          strings.push(`<div class="floating"style="color:${state.user.color};">User: ${state.user.name}</div>`)
        }
        document.querySelector('#users').innerHTML = strings.join('')
      })


      // const states = awareness.getStates().values();
      // for (const clientId in states) {
      //   const state = states[clientId];

      // }
    })


    awareness.on('change', () => {
      // Map each awareness state to a dom-string
      // console.log("change") 
      const strings = []

      awareness.getStates().values().forEach(state => {
        // console.log(state)
        if (state.user) {
          strings.push(`<div style="color:${state.user.color};">${state.user.name}</div>`)
        }
        document.querySelector('#users').innerHTML = strings.join('')
      })
    })

    //disable delete key for textarea
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
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
    let isPlayConfett = true
    textarea.addEventListener('keypress', (e) => {
      // disable typing in textarea
      e.preventDefault()
      //only play confetti animation once using isPlayConfett
      if (isPlayConfett) {
        playConfetti()
        isPlayConfett = false

      }

      // get current location of text cursor
      const index = e.target.selectionStart;
      e.target.setSelectionRange(index, index + 1)

      if (e.key.length === 1) {
        const index = e.target.selectionStart
        const char = e.key
        insertChar(text, index, char)


      }
      // set cursor location to index
      disableInput(textarea, 3000);

    })

    replace_text_button?.addEventListener('click', () => {
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

        if (counter > 0) {
          counter -= 1000
        }
        element.innerText = `Confirm wait ${counter / 1000} seconds`
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

// create a function that updates personal counter for number of letters typed, stored in localstorage, and loaded one page loads,  element id="personalCounter"
function updatePersonalCounter() {
      let counter = localStorage.getItem('counter') || 0
      counter++
      localStorage.setItem('counter', counter)
      document.getElementById('personalCounter').innerText = counter
}

// create a function for intially setting the personal counter
function setPersonalCounter() {
      let counter = localStorage.getItem('counter') || 0
      document.getElementById('personalCounter').innerText = counter
}


//create a confetti animation using a library like confetti-js
function playConfetti() {
      //create a confetti animation
      // https://www.kirilv.com/canvas-confetti/ for how to mess with the confetti config
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
function showPopup(visable) {
      var popup = document.getElementById("users");
      if (visable === true) {
        popup.style.display = "block";
      } else {
        popup.style.display = "none";
      }
    }

function insertChar(yDoc, offset, char) {
  updatePersonalCounter()
  // animatePersonalCounter()
  triggerAnimation()
      //add confetty animation everytime this function is called
      if (yDoc.toString().length === 0) {
        console.log('yDoc is empty')
        yDoc.insert(offset, 1)
        return
      }
      yDoc.insert(offset, char)
      yDoc.delete(offset + 1, 1)
    }



//write a function that gets the current mouse position and sends it to the server
function sendMousePosition(awareness, mouseElements) {
      document.addEventListener('mousemove', (e) => {
        const { x, y } = e;
        mouseElements[0].style.left = `${x}px`;
        mouseElements[0].style.top = `${y}px`;
        var id = awareness.doc.clientID
        awareness.setLocalStateField("mouse", { x, y, id });
      });
    }

main() 