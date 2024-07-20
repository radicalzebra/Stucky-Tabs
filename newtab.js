//image display 
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomNum = getRandomNumber(1, 12);
document.getElementById("img").src = `./images/pic${randomNum}.jpg`





const userDataDates = () => {
    const timestamp = Date.now();
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    const dateString = `${day}-${month}-${year}`;
    
    return {timestamp , dateString}
}


//note logic
const btn = document.getElementById("btns")
const noteParent = document.getElementById("noteparent")
const noteText = document.getElementById("note")
const time = document.getElementById("time")
const closeNote = document.getElementById("notesubmitbtn")
const allNotes = document.getElementById("all-notes")
const toggleAllNotes = document.getElementById("toggle-notes")


toggleAllNotes.addEventListener("click", () => {
    if(!allNotes.classList.contains("all-notes-hide")) {
        toggleAllNotes.textContent = "<"
    } else {
        toggleAllNotes.textContent = "X"
    }

    allNotes.classList.toggle("all-notes-hide")
})




// function updateTime() {
//   let date = new Date();
//   const hours = date.getHours().toString().padStart(2, '0'); // Padded hours
//   const minutes = date.getMinutes().toString().padStart(2, '0'); // Padded minutes
  
//   // Update the time in your HTML element
//   time.innerHTML = `${hours}:${minutes}`;
// }

// Call updateTime initially to set the time immediately
// updateTime();

// Update the time every second (1000 milliseconds)
// setInterval(updateTime, 5000);

btn.addEventListener("click",()=>{
    noteParent.style.display = "block"
    btn.style.display = "none"
})

//note saving

function saveText() {
  let text = noteText.value;

  if(text.trim() !== "") {

      const {timestamp , dateString} = userDataDates()
    
      let storedData = {
        [`text-${timestamp}`]:{
            dateCompare: timestamp,
            showDate:dateString,
            text:text
        }
      }

      chrome.storage.sync.set(storedData);
   }

  noteText.value = ""
  getAllNotes()

}

closeNote.addEventListener("click",()=>{
    saveText()
    noteParent.style.display = "none"
    btn.style.display = "block"
})


const createNoteNodeError = () => {
    const notesContainer = document.getElementById("notes-container");
    if (notesContainer) {
        notesContainer.style.fontSize = "20px"
        notesContainer.style.textAlign  = "center"
        notesContainer.style.color  = "red"
        notesContainer.innerHTML = "Error retrieving notes!";
    }
}


const createNoteNodeEmpty = () => {
    const notesContainer = document.getElementById("notes-container");
    if (notesContainer) {
        notesContainer.style.fontSize = "20px"
        notesContainer.style.textAlign  = "center"
        notesContainer.style.textAlign  = "center"
        notesContainer.innerHTML = "It's empty here!";
    }
}

const createNoteNode = (key,text) => {
    
    // Create the main note container
    let noteDiv = document.createElement("div");
    noteDiv.id = "copy-note"; // Assign ID directly
    
    // Create the buttons container
    let copyNoteBtnsDiv = document.createElement("div");
    copyNoteBtnsDiv.id = "copy-note-btns"; // Assign ID directly
    
    // Create the delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.id = "delete-btn";
    deleteBtn.dataset.key = String(key);
    if(deleteBtn) {
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click",()=>{
         const key = deleteBtn.dataset.key
         DeleteNoteFromStorage(key)
      })   
    }

    
    
    // Create the copy button
    const copyBtn = document.createElement("button");
    copyBtn.id = "copy-btn";
    if(copyBtn) {
         copyBtn.textContent = "Copy"; 
         copyBtn.addEventListener("click",()=>{
         copyToClipboard(text)
      })   
    }
    
    // Append buttons to the buttons container
    copyNoteBtnsDiv.appendChild(deleteBtn);
    copyNoteBtnsDiv.appendChild(copyBtn);
    
    // Create the content container
    const noteContentDiv = document.createElement("div");
    noteContentDiv.id = "copy-note-content";
    if(noteContentDiv) {
        noteContentDiv.textContent = text
    }
    
    // Append the buttons container and content container to the main note container
    noteDiv.appendChild(copyNoteBtnsDiv);
    noteDiv.appendChild(noteContentDiv);
    
    // Optionally append the noteDiv to a parent container
    // Assuming you have a container with the ID "notes-container" in your HTML
    const notesContainer = document.getElementById("notes-container");
    if (notesContainer) {
        notesContainer.appendChild(noteDiv);
    }

    // console.log(noteDiv);
};


function removeCreateNoteNodeVarients() {
    const notesContainer = document.getElementById("notes-container");
    if (notesContainer) {
        notesContainer.innerHTML = "";
    }
}


function getAllNotes() {
    removeCreateNoteNodeVarients()
    chrome.storage.sync.get(null,(notes) => {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving notes:", chrome.runtime.lastError);
            return createNoteNodeError() 
        } else {
            let count = 0
            let arr = [];
            for(let note in notes) {
                count++
                let noteName = note;
                let obj = {...notes[note]}
                obj.noteName = noteName
                arr.push(obj)
            }

            arr.sort((a,b) => b.dateCompare - a.dateCompare )


            for(let note of arr) {
                const text = note.text
                createNoteNode(note.noteName,text)
            }

            if(!count) {
                createNoteNodeEmpty()
            }
     }
    })
}

getAllNotes()

 


function DeleteNoteFromStorage(key) {
    chrome.storage.sync.remove(key)
    getAllNotes()
} 


function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log("Text copied to clipboard:", text);
    })
    .catch(err => {
      console.error("Error copying text:", err);
    });
}






