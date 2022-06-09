import { BrowserRouter as Router,Switch, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import Home from "./components/Home"
import About from "./components/About";
import NoteState from "./Context/notes/NoteState";
import Alert from "./components/Alert"
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";

function App() {
  const [alert,setAlert] = useState(null);
  const [email , setEmail] = useState(null);
  const showAlert = (message,type ) => {
    setAlert({msg:message,
      type : type 
    })
    setTimeout(() => {
      setAlert(null)
    }, 1500);
  }
  const showDetails = (name,email) => {
        setEmail({name : name ,
          email:email})
  }
  return (
    <>
    <NoteState>
      <Router>
      <Navbar showDetails={showDetails}/>
      <Alert alert={alert}/>
      <div className="container">
        <Switch>
          <Route exact path="/">
            <Home showAlert={showAlert}/>
          </Route>
          <Route path="/login">
            <Login showAlert={showAlert}/>
          </Route>
          <Route path="/signup">
            <Signup showAlert={showAlert}/>
          </Route>
        </Switch>
        </div>
      </Router>
      </NoteState>
    </>
  );
}

export default App;
