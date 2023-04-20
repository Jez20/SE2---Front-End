import axios from "axios";
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import '../css/owl.carousel.min.css'
import '../css/bootstrap.min.css'
import '../css/bootstrap.min.css.map'
import '../css/adduser.css'
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from "../services/useRequireAuth";


function Adduser() {
  useRequireAuth(["Admin", "Editor"]);
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [user_password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const returnDomain = require('../common/domainString')
  const selectedDomain = returnDomain();
  

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };
  const handleCancel = (event) => {
    event.preventDefault();
    navigate('/Users');
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    toast.success("Successfully added user");
    
    try {
      const response = await axios.post(selectedDomain + 'user/', [
        {
          "email": email,
          "phone_number": phone_number,
          "first_name": first_name,
          "last_name": last_name,
          "user_password": user_password,
          "role": role
        }
        
      ]);
      console.log("Successfully Added User")
      
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="d-lg-flex half">
    <div
      className="bg order-1 order-md-2"
      style={{ backgroundImage: 'url("images/logo.png")' }}
    />
    <div className="contents order-2 order-md-1">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-md-6">
            <h1 className="adduserh1">
              <strong>Add User</strong>
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group first">
                <label htmlFor="email">Email:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className="form-group last mb-3">
  <label htmlFor="phone">Phone Number:</label>
  <input
    type="text"
    className="form-control"
    placeholder="Enter phone number"
    id="phone"
    value={phone_number}
    onChange={handlePhoneNumberChange}
    pattern="[0-9]{11}"
    title="Please Enter 11 Digits"
    required
  />
</div>
              <div className="form-group first">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter first name"
                  id="firstName"
                  value={first_name}
                  onChange={handleFirstNameChange}
                  required
                />
              </div>
              <div className="form-group last mb-3">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter last name"
                  id="lastName"
                  value={last_name}
                  onChange={handleLastNameChange}
                  required
                />
              </div>
              <div className="form-group last mb-3">
                <label htmlFor="lastName">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter User Password"
                  id="password"
                  value={user_password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group first">
                <label htmlFor="category">Role:</label>
                <select
                  id="category"
                  value={role}
                  onChange={handleRoleChange}
                >
                  <option value="">Select Role</option>
                  <option value="2">Admin</option>
                  <option value="1">User</option>
                </select>
              </div>
              <input
                type="submit"
                disabled={role === ""}
                value="Add User"
                className="btn btn-block add"
                title={role === "" ? "Please fill out the necessary fields" : ""}
              />
                              
              <input
                type="button"
                value="Back to Users"
                className="btn btn-block cancel"
                onClick={handleCancel}
              />
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  </div>

  );
}

export default Adduser
