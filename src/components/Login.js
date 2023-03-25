import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/login.css'
import loginService from '../services/loginService';

function Login() {
  //React Snackbar code Start
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const[email, setEmail] = useState("")
  const[password, setPass] = useState("")
  //const history = useHistory()
  

  function handleEmailChange(event){
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPass(event.target.value)
  }

  async function loginSubmit(event) {
    event.preventDefault();
    const data = {
      email: email,
      password: password
    };
    console.log(email)
    console.log(password)
    
    try{
    const response = await loginService.loginFunction(data);
    sessionStorage.setItem('sessionid', response.data.sessionid)
    sessionStorage.setItem('role', response.data.role)
    navigate('/Index');
  }
  catch (error){
    console.error(error)
    toast.error('Invalid email or password');
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
                required
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
                required
              />
            </div>
            <input
              type="submit"
              value="Log In"
              className="btn btn-block login"
            />
            <div className="d-flex mb-5 align-items-center"></div>
            <p className="text-center">
              <a href="#" onClick={handleRegisterClick} className="forgot-pass">
                Don't Have an Account Yet?
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
  <ToastContainer />
</div>

)
}

function handleRegisterClick() {
  toast.info('Please Contact Your School IT or staff for your Account Registration', {
    position: 'bottom-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}

export default Login

