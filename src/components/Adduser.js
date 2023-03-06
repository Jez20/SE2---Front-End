import React from 'react'
import '../css/owl.carousel.min.css'
import '../css/bootstrap.min.css'
import '../css/bootstrap.min.css.map'
import '../css/adduser.css'

function Adduser() {
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
          {/* <h2 class="mb-4">Equipment Inventory System</h2> */}
          <form action="users.html" method="post">
            <div className="form-group first">
              <label htmlFor="username">Email:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter email"
                id="email"
              />
            </div>
            <div className="form-group last mb-3">
              <label htmlFor="password">Phone Number:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter phone number"
                id="email"
              />
            </div>
            <div className="form-group first">
              <label htmlFor="username">First Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter first name"
                id="firstName"
              />
            </div>
            <div className="form-group last mb-3">
              <label htmlFor="password">Last Name:</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter last name"
                id="lastName"
              />
            </div>
            <div className="form-group first">
              <label htmlFor="username">Role:</label>
              <select id="category">
                <option value="select">Select Role</option>
                <option value="cond">Super Admin</option>
                <option value="cond">Admin</option>
                <option value="cond">Student</option>
              </select>
            </div>
            <input
              type="submit"
              value="Add User"
              className="btn btn-block add"
            />
            <input
              type="submit"
              value="Cancel"
              className="btn btn-block cancel"
            />
            <div className="d-flex mb-5 align-items-center"></div>
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

export default Adduser
