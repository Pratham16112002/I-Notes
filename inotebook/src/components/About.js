import React,{useContext } from 'react'
import {useLocation} from 'react-router-dom'
import noteContext from '../Context/notes/NoteContext'

const About = () => {
   
    
  return (
    <div>This is about  page</div>
  )
}
// When we use useEffect , then we need to use a.state.prop to change it on the frontend.
export default About