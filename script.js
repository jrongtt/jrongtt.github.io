// import { upload_midi } from './upload.js'


const WHITE_KEYS = ['','','','','','','','','','','','','','','','','','','','','','','','a','s','d','f','g','h','j','k','l',';',"'", "Enter"]
const BLACK_KEYS = ['','','','','','','','','','','','','','','','','w','e','t','y','u','o','p']


const keys = document.querySelectorAll('.key')

const whiteKeys = document.querySelectorAll('.key.white')
const blackKeys = document.querySelectorAll('.key.black')


window.AudioContext = window.AudioContext || window.webkitAudioContext;
let ctx;
//const startButton = document.querySelector('button');
const oscillators = {};


var notes_on = []


zoom();



function zoom() {
    document.body.style.height = 1850  + "px"
    document.body.style.width =2980  + "px"
    document.body.style.zoom = "40%" 
    
}

function buttonClicked(){
    var btn = document.querySelector('button')
    btn.addEventListener('click', () => {
        ctx = new AudioContext();
        console.log(ctx)
    })
}

window.onload=function(){
    //var btn = document.getElementById("go-button");
    var btn = document.querySelector('button')
    btn.addEventListener("click", buttonClicked, true);
  }

  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(success, failure);
}
  
function success(midiAccess) {
    midiAccess.addEventListener('statechange', updateDevices);

    const inputs = midiAccess.inputs;


    inputs.forEach((input) => {
        input.addEventListener('midimessage', handleInput);
    })

    
}

function handleInput(input) {
    const command = input.data[0];
    const note = input.data[1];
    const velocity = input.data[2];
    // command 144 means on, 128 means off

    switch (command) {
        case 144: //noteOn
        
        if (velocity > 0) {
            playNote(keys[note-21], velocity)
        } else {
            
            endNote(keys[note-21], velocity);
        }
        break;
        case 128:
            endNote(keys[note-21]);
        break;
    }
}

function setValue(event) {

  let root = document.documentElement;
  root.style.setProperty('--blur', 'blur(' + event.path[0].value + "px"+ ')');
}


keys.forEach(key => {
    key.addEventListener('mousedown', () => playNote(key))
    key.addEventListener('mouseup', () => endNote(key))
})



document.addEventListener('keydown', e => {
    if (e.repeat) return
    const key = e.key
    const whiteKeyIndex = WHITE_KEYS.indexOf(key)
    const blackKeyIndex = BLACK_KEYS.indexOf(key)

    if (whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex])
    if (blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex])
})

document.addEventListener('keyup', e => {

    if (e.repeat) return
    const key = e.key
    const whiteKeyIndex = WHITE_KEYS.indexOf(key)
    const blackKeyIndex = BLACK_KEYS.indexOf(key)

    if (whiteKeyIndex > -1) endNote(whiteKeys[whiteKeyIndex])
    if (blackKeyIndex > -1) endNote(blackKeys[blackKeyIndex])
})


function playNote(key, velocity=30) {

    var outerDiv = document.createElement('div') ;
    var element;

    element = initializeNote(key)
    document.body.insertBefore(outerDiv, document.body.firstChild);
    outerDiv.appendChild(element) ;

    element.style.height = 0 + 'px'
    let x = (element.getBoundingClientRect());
    element.style.transition =  "height 2.9s linear";
    element.style.height = (1450 + 'px');
    key.classList.add('active')

   

    var audio = new Audio('Emotional_2.0/'+ key.id.toLowerCase() + '.mp3')
    audio.volume = velocity/300;
    console.log(audio.volume)
    audio.play();
}






function endNote(key) {
    
    element = document.getElementById(findNote(key, 'off'));
    let obj_height = key.getBoundingClientRect().top - element.getBoundingClientRect().top
    element.style.height =  obj_height + "px";
    element.style.bottom = 280 + 'px';

    key.classList.remove('active')
    element= trans(element)
    
}




function trans(element) {
    element.style.transition =  "bottom 5s linear";
    element.style.bottom = 2900 + 'px';

    setTimeout(() => {
        element.remove();
      }, 4000)

}

function initializeNote(key) {
    let elem_temp = document.createElement('div');
    elem_temp.className = "color_notes"; 
    elem_temp.id  = findNote(key, 'on')

    elem_temp.style.position = "absolute";
    elem_temp.style.bottom = 290 + 'px'
    elem_temp.style.left = key.getBoundingClientRect().left  +"px";

    let styles = getComputedStyle(document.documentElement);
    let bgColor = styles.getPropertyValue('--col');

    //elem_temp.style.background= bgColor;
    elem_temp.style.width = 35 + "px";

    if (key.classList.contains('white')) elem_temp.style.width = 55 + "px";
    
   elem_temp.style.filter = "blur(4px)";
   elem_temp.style.opacity = 1.0;
   elem_temp.style.border = '3px solid ' + bgColor;
   elem_temp.style.borderRadius = '20 px';

   elem_temp.backgroundImage = "linear-gradient(green, red)";
    return elem_temp;


}

function findNote(key, occasion) {
    return key.id;
}


function updateDevices(event) {
    console.log(`Name: ${event.port.name}, Brand: ${event.port.manufacturer}, State: ${event.port.state}, Type: ${event.port.type}`);
}

function failure() {
    console.log("Could not connect Midi")
}

function noteToKey(note) {
    var name = ['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B']
    let octave = Math.floor(note/12)
    let note_name = name[(Math.round(((note/12) - octave)*12))]
  
    return (note_name + octave)
}



function printColor(ev) {
    const color = ev.target.value
    const r = parseInt(color.substr(1,2), 16)
    const g = parseInt(color.substr(3,2), 16)
    const b = parseInt(color.substr(5,2), 16)
    var rgb = "rgb(" + r + ',' + g + ',' + b  + ')';
    let root = document.documentElement;
    root.style.setProperty('--col', rgb);

  }

  function printColor2(ev) {
    const color = ev.target.value
    const r = parseInt(color.substr(1,2), 16)
    const g = parseInt(color.substr(3,2), 16)
    const b = parseInt(color.substr(5,2), 16)
    var rgb = "rgb(" + r + ',' + g + ',' + b  + ')';
    let root = document.documentElement;
    root.style.setProperty('--col2', rgb);

  }





var isSetTimmeoutRunning = false;
  
function startCountUp(json){
  console.log(json)
  const obj = JSON.parse(json);
  let obj_tracks = obj.tracks;
  forEachTrack(obj_tracks)
}

function forEachTrack (obj_tracks) {
  var notes_json = [];

  for (let i = 0; i < obj_tracks.length; i++) {
    notes_json = notes_json.concat(obj_tracks[i].notes);
  }

  var array_notes = [];
  var array_times = [];
  var array_duration_time = [];
  notes_json.forEach((element) => {
    
    if (element.name.indexOf('#') >-1) element.name = element.name.charAt(0) + 's' + element.name.charAt(2)

    //console.log(element);
    array_notes.push({
        duration: Math.round((element.duration) * 100),
        name: element.name,
        velocity: Math.round((element.velocity) * 100), 
        time: Math.round((element.time) * 100),
        midi: element.midi
    });    
    array_times.push(Math.round((element.time) * 100)) 
    array_duration_time.push((Math.round((element.time) * 100))  + Math.round((element.duration) * 100));
  });
  
    
    let max_duration_time = 0;
    array_duration_time.forEach((element) => {
      if (max_duration_time < element) {
        max_duration_time = element
      }
    })

  if( isSetTimmeoutRunning == false ){
    isSetTimmeoutRunning = true;
    var counter = array_times[0]-200;

    document.getElementById("countup-text").innerHTML = "<b>" + 0 + "</b>";

    var interval = setInterval(function(){
      counter++;
      if (counter %200 == 0) console.log(counter)

      document.getElementById("countup-text").innerHTML = "<b>" + counter + "</b>";

      for (let i = 0; i < array_times.length; i ++) {
        if (array_times[i]===counter) {
     
          let note_id = (array_notes[i]).name
          let midi_note = (array_notes[i]).midi

          console.log(midiNoteConvert(note_id))
          let elem = document.getElementById(midiNoteConvert(note_id));


          if(keys[midi_note-21].className.indexOf('active') > -1) {
            endNote(keys[midi_note-21])
          }
          playNote(keys[midi_note-21], array_notes[i].velocity)
 
        }
      }
      
      for (let i = 0; i < array_duration_time.length; i ++) {
        if (array_duration_time[i]===counter) {
          
          let note_id = (array_notes[i]).name;
          let midi_note = (array_notes[i]).midi

          endNote(keys[midi_note-21])
        }
      }
    }, document.getElementById('speedRange').value);
  }
}

if (
  !(
    window.File &&
    window.FileReader &&
    window.FileList &&
    window.Blob
  )
) {
  document.querySelector("#FileDrop #Text").textContent =
    "Reading files not supported by this browser";
} else {
  const fileDrop = document.querySelector("#FileDrop");

  // fileDrop.addEventListener("dragenter", () =>
  //   fileDrop.classList.add("Hover")
  // );

  // fileDrop.addEventListener("dragleave", () =>
  //   fileDrop.classList.remove("Hover")
  // );

  // fileDrop.addEventListener("drop", () =>
  //   fileDrop.classList.remove("Hover")
  // );

  document
    .querySelector("#FileDrop input")
    .addEventListener("change", (e) => {
      //get the files
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        document.querySelector(
          "#FileDrop #Text"
        ).textContent = file.name;

        parseFile(file, e);
      }
    });

   
}

let currentMidi = null;

function parseFile(file, ee) {
  let currentMidi = null; 
  const reader = new FileReader();
  reader.readAsArrayBuffer(file)

  reader.onload = function (e) {
    console.log(e)
    const midi = new Midi(e.target.result);
    currentMidi = midi;
    startCountUp(JSON.stringify(midi, undefined, 2))
   
  };
  console.log(reader)
  
}

function midiNoteConvert(note_name) {
  if (note_name.indexOf('#') >-1) {
    note_name = note_name.charAt(0) + 's' + (parseInt(note_name.charAt(2)) - 1).toString()
  } else {
    note_name = note_name.charAt(0) + (parseInt(note_name.charAt(1)) - 1).toString()
  }

  return note_name;
}