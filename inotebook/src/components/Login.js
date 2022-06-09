import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'


const Login = (props) => {
        const [credentials,setCredentials]= useState({
            email:"",
            password:""
        })
        let history = useHistory()
    const handleSubmit= async (e) =>{
        e.preventDefault()
        const response = await fetch(`http://localhost:5000/api/auth/login`,{
            method : 'POST',
            headers: {
              'Content-Type' : 'application/json'
            },
            body : JSON.stringify({email : credentials.email,password : credentials.password})
          })
          const json = await response.json()
          console.log(json)
          if(json.success){
            //   save the auth token and redirect
            localStorage.setItem('token',json.authtoken)
            props.showAlert("Logged In","success")
            history.push('/')
          }
          else{
              props.showAlert("Invalid Creadentials ","danger")
          }
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
      }
    return (
        <div className="mt-3">
            <h2>Login to continue to inotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label for="email">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange}/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label for="password">Password</label>
                    <input type="password" className="form-control" name="password"  value={credentials.password} id="password" placeholder="Password" onChange={onChange}/>
                </div>

                <button type="submit" className="btn btn-primary" >Submit</button>
            </form>
        </div>
    )
}

export default Login