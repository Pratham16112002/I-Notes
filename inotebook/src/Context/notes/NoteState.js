import React, { useState } from "react";
import Notes from "../../components/Notes";

import noteContext from "./NoteContext";


const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial  = []
  

  const [notes,setNotes] = useState(notesInitial)
// Get all Notes
  const getNotes = async () =>{
    // To do api call
    const response = await fetch(`${host}/api/notes/fetchallnotes`,{
      method : 'GET',
      headers: {
        'Content-Type' : 'application/json',
        'auth-token':localStorage.getItem('token')
      }
    })
    const json = await response.json()
    console.log(json)
    setNotes(json)
  }
      // Add a note 
      const addNote = async (title,description,tag) =>{
        // To do api call
        const response = await fetch(`${host}/api/notes/addnote`,{
          method : 'POST',
          headers: {
            'Content-Type' : 'application/json',
            'auth-token':localStorage.getItem('token')
          },
          body:JSON.stringify({title,description,tag})
        })
        const json = await response.json()  
        const note = json;
        setNotes(notes.concat(note))
      }
      // Delete a note
      const deleteNote = async (id) =>{
        // To do api call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
          method : 'DELETE',
          headers: {
            "Content-Type": "application/json",
            'auth-token':localStorage.getItem('token')
          },
        })
        const json = response.json()
        console.log(json)
        console.log("Deleting a Note "+ id);
        const newNotes = notes.filter((note) => { return note._id!==id}) 
        setNotes(newNotes)
      }
      // Edit a note
      const editNote = async (id , title, description,tag) =>{
        // API calls
        const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
          method : 'PATCH',
          headers: {
            'Content-Type' : 'application/json',
            'auth-token':localStorage.getItem('token')
          },
          body:JSON.stringify({title,description,tag})
        })


        let newNotes =  JSON.parse(JSON.stringify(notes))

        // Logic for editing notes
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id === id){
            newNotes[index].title= title;
            newNotes[index].description=description;
            newNotes[index].tag=tag;    
            break;
          }
          
        }
        setNotes(newNotes)
      }

  return (
        <noteContext.Provider value={{notes,addNote,editNote,deleteNote,getNotes}}>
            {props.children}
        </noteContext.Provider>
    )

}



export default NoteState;