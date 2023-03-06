import React, { useState } from 'react'
import axios from "axios"
import { withRouter } from 'react-router-dom';
//import { getMyData } from './api';
//import { useHistory } from 'react-router-dom';
import '../css/login.css'


// import IconButton from "@material-ui/core/IconButton";
// import Snackbar from "@material-ui/core/Snackbar";
// import CloseIcon from "@material-ui/icons/Close";
// import Button from "@material-ui/core/Button";


function Login() {
  //React Snackbar code Start
  const [open, setOpen] = React.useState(false);
  const handleToClose = (event, reason) => {
    if ("clickaway" == reason) return;
    setOpen(false);
  };
  
  const handleClickEvent = () => {
    setOpen(true);
  }; //React Snackbar code end

  //Axios
  const[email, setEmail] = useState("")
  const[password, setPass] = useState("")
  //const history = useHistory()

  function handleEmailChange(event){
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPass(event.target.value)
  }

  async function loginSubmit() {
    const data = {
      email: email,
      password: password
    };
    console.log(email)
    console.log(password)
    
    try{
    const response = await axios.post("http://127.0.0.1:8000/login/", data);
    console.log(response.data)
    console.log(document.cookie)
    window.location.href = '/Login';
    //const sessionId = response.headers.get('sessionid');
    //console.log(`Session ID: ${sessionId}`);
    //props.history.push('/Index.js');

    
  }
  catch (error){
    console.error(error)
  }
}

return (
<div className="d-lg-flex half">
  <div
    className="bg order-1 order-md-2"
    style={{ backgroundImage: 'url("images/logo.png")' }}
  />
  <div className="contents order-2 order-md-1">
    <div className="container">
      <div className="row align-items-center justify-content-center ">
        <div className="col-md-6">
          <h1 className="loginh1">
            <strong>Login</strong>
          </h1>
          <h2 className="mb-4">Equipment Inventory System</h2>
          <form onSubmit={loginSubmit}>
            <div className="form-group first">
              <label htmlFor="username">Email:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your email"
                value = {email}
                onChange={handleEmailChange}
                id="email"
              />
            </div>
            <div className="form-group last mb-3">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value = {password}
                onChange= {handlePassword}
                id="password"
              />
            </div>
            <input
              type="submit"
              value="Log In"
              className="btn btn-block login"
            />
            <div className="d-flex mb-5 align-items-center"></div>
            <p className="text-center">
              <a href="#" onclick={myFunction} className="forgot-pass">
                Don't Have an Account Yet?
              </a>
            </p>
            {/* !-- The actual snackbar */}
            <div id="snackbar">
              Please Contract Your School IT Professor
              <br />
              for your Account Registration
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

)
}

function myFunction() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  } 

export default Login

