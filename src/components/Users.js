//import React from 'react'
import '../css/users.css'
import '../css/overlay.css'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Users() {
  const [users, setUsers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newRole, setNewRole] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [userData, setUserData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const returnDomain = require('../common/domainString')
  const selectedDomain = returnDomain();

  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    navigate('/Login');
  };

  useEffect(() => {
    axios.get(selectedDomain + '/user/')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const deleteSelectedUsers = () => {
    const emailObjects = selectedItems.map(email => ({ email }));
    toast.success("Successfully deleted user/s");
    axios.delete(selectedDomain+ '/user/', { data: emailObjects })
      .then(response => {
        // remove deleted users from the list
        setUsers(users.filter(user => !selectedItems.includes(user.email)));
        // clear the selection
        console.log("delete success");
        setSelectedItems([]);
        
      })
      .catch(error => {
        console.error(error);
      });
  };
  const handleResetPassword = (email) => {
    console.log(email);
    axios.put(selectedDomain + `/resetPassword/`, {
      email: email,
    })
    .then(response => {   
      setUserData(response.data);
      toast.success('Successfully reset password');
    })
    .catch(error => {
      console.error(error);
      toast.error('Something Went Wrong');
    });
  };
  const handleUpdatePhoneNumber = (email) => {
    axios.put(selectedDomain + `/user/${email}`, {
      phone_number: userData[email].newPhoneNumber,
    })
    .then(response => {
      // update the phone number for the specific user
      setUserData(prevState => ({
        ...prevState,
        [email]: {
          ...prevState[email],
          phone_number: prevState[email].newPhoneNumber
        }
      }));
      // show a success toast
      setShowToast(true);
      window.location.reload()
    })
    .catch(error => {
      console.error(error);
      toast.error('You have not changed anything');
    });
  };
  useEffect(() => {
    if (showToast) {
      toast.success('Phone number updated successfully');
      setShowToast(false);
    }
  }, [showToast]);
  const handleUpdateRole = (email) => {
    console.log(email);
    console.log(userData[email].phone_number);
    console.log(userData[email].newRole);
    axios.put(selectedDomain + `/user/${email}`, {
      role: userData[email].newRole
    })
    .then(response => {
      // update the role for the specific user
      setUserData(prevState => ({
        ...prevState,
        [email]: {
          ...prevState[email],
          phone_number: prevState[email].newRole
        }
      }));
      // show a success toast
      toast.success('Role has been updated successfully');
    })
    .catch(error => {
      console.error(error);
      toast.error('You have not changed anything');
    });
  };
  

  return (
<div>
  <nav>
    <div className="logo-name">
      <div className="logo-image">
        <img src="images/logo.png" alt="" />
      </div>
      <span className="logo_name">KLIA Inventory System</span>
    </div>
    <div className="menu-items">
      <ul className="nav-links">
        <li>
          <a href="/Index">
            <i className="bx bxs-dashboard icon" />
            <span className="link-name">Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/Borrow">
          <i className="bx bxs-shopping-bags" />
            <span className="link-name">Borrow Items</span>
          </a>
        </li>
        <li>
          <a href="/Return">
            <i className="bx bxs-book-content icon" />
            <span className="link-name">Return Items</span>
          </a>
        </li>
        <li>
          <a href="/Inventory">
            <i className="bx bx-box icon" />
            <span className="link-name">Inventory</span>
          </a>
        </li>
        <li>
          <a href="/Users">
            <i className="bx bxs-user icon" />
            <span className="link-name">Users</span>
          </a>
        </li>
        <li>
          <a className="openbtn" onClick={openForm}>
            <i className="bx bxs-lock-alt icon" />
            <span className="link-name">Change Password</span>
          </a>
        </li>
      </ul>
      <ul className="logout-mode">
        <li>
          <a href="#" onClick={handleLogout}>
            <i className="bx bxs-log-out icon" />
            <span className="link-name">Logout</span>
          </a>
        </li>
        <li className="mode">
          <a href="#">
          </a>
          <div className="mode-toggle">
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <section className="dashboard">
    <div className="top">
    <i className="uil uil-bars sidebar-toggle" onClick={burger}/>
      <div className="search-box">
        <h1>Users</h1>
      </div>
    </div>
    <div className="dash-content">
      <div className="activity">
        <div className="title">
          <i className="bx bxs-user icon" />
          <span className="text">Users</span>
        </div>
        {/* ROW 1 */}
        <div className="inventory">
          <p>*NOTE: Ctrl + F to find users</p>
          <p>*NOTE: Resetting password will reset the password to the user's email</p>
        </div>
        {/* ROW 2 */}
        <div className="row-2">
          <button className="delete category" onClick={openFormDeleteUsers}>
            <i className="bx bxs-trash-alt icon" />
            Delete Selected Users
          </button>
          <button
            className="add item"
            onClick={event =>  window.location.href='/Adduser'}
          >
            <i className="bx bx-plus icon" />
            Add Users
          </button>
        </div>
        <div className="activity-data">
          <table className="table">
            <thead>
              <tr>
                <th>Select</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                  <div className="checkboxes">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        value={user.email}
                        checked={selectedItems.includes(user.email)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, e.target.value]);
                          } else {
                            setSelectedItems(selectedItems.filter(email => email !== e.target.value));
                          }
                          
                        }}
                        
                      />
                      <span className="indicator" />
                    </label>
                    </div>
                  </td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                  <form action="/action_page.php">
                    <input
                      type="tel"
                      placeholder={user.phone_number}
                      value={userData[user.email]?.newPhoneNumber}
                      maxlength="11"
                      onChange={(e) => setUserData(prevState => ({
                        ...prevState,
                        [user.email]: {
                          ...prevState[user.email],
                          newPhoneNumber: e.target.value
                        }
                      }))}
                    />
                  </form>
                </td>
                <td>
                <select
                      value={userData[user.email]?.newRole || user.role}
                      onChange={(e) => setUserData(prevState => ({
                        ...prevState,
                        [user.email]: {
                          ...prevState[user.email],
                          newRole: e.target.value
                        }
                      }))}
                    >
                    <option value="1">User</option>
                    <option value="2">Admin</option>
                    <option value="3">Editor</option>
                  </select>
                </td>
                <td>
                  <div className="category">
                    <button
                      className="update category"
                      onClick={() => handleUpdatePhoneNumber(user.email)}
                    >
                      <i className="bx bxs-pencil action" />
                      Update Phone Number
                    </button>
                    <button
                      className="update category"
                      onClick={() => handleUpdateRole(user.email)}
                    >
                      <i className="bx bxs-pencil action" />
                      Update Role
                    </button>
                    <button
                      className="reset category"
                      onClick={() => handleResetPassword(user.email)}
                    >
                      <i className="bx bx-refresh" />
                      Reset Password
                    </button>

                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
          <ToastContainer />
        </div>
      </div>
    </div>
  </section>
  <div id="myOverlay" className="overlay">
    <div className="wrap">
      <h2>Change Password</h2>
      <form>
        <label htmlFor="username">Current Password:</label>
        <input
          type="text"
          placeholder="Enter your current password"
          id="currentPass"
        />
        <label htmlFor="username">New Password:</label>
        <input type="text" placeholder="Enter your new password" id="newPass" />
        <label htmlFor="username">Confirm Password:</label>
        <input type="text" placeholder="Confirm password" id="conPass" />
        <div className="buttons">
          <input
            className="action_btn confirm"
            type="submit"
            value="Confirm"
          />
          <input
            className="action_btn cancel"
            type="submit"
            value="Cancel"
          />
        </div>
      </form>
    </div>
  </div>
  <div id="deleteUsersOverlay" className="delete-users-overlay">
    <div className="delete-users-wrap">
      <h1 id="usersh1">
        <i className="bx bxs-error icon" /> Warning!{" "}
      </h1>
      <h2 id="usersh2">
        Performing this action is irreversable, Would you like to delete
        selected users?
      </h2>
      <form>
        <div className="buttons">
          <input
            className="action_btn confirm"
            type="submit"
            value="Confirm"
            onClick={deleteSelectedUsers}
          />
          <input
            className="action_btn cancel"
            type="submit"
            value="Cancel"
          />
        </div>
      </form>
    </div>
  </div>
  <div id="updateUsersOverlay" className="update-users-overlay">
    <div className="update-users-wrap">
      <h1 id="updateh1">
        <i className="bx bxs-info-circle" /> Action{" "}
      </h1>
      <h2 id="updateh2">Would you like to update this person's information?</h2>
      <form>
        <div className="buttons">
          <input
            className="action_btn confirm"
            type="submit"
            value="Confirm"
            
          />
          <input
            className="action_btn cancel"
            type="submit"
            value="Cancel"
          />
        </div>
      </form>
    </div>
  </div>
  <div id="resetPasswordOverlay" className="reset-password-overlay">
    <div className="reset-password-wrap">
      <h1 id="reseth1">
        <i className="bx bxs-info-circle" /> Action{" "}
      </h1>
      <h2 id="reseth2">Would you like to reset this person's password?</h2>
      <form>
        <div className="buttons">
          <input
            className="action_btn confirm"
            type="submit"
            value="Confirm"
          />
          <input
            className="action_btn cancel"
            type="submit"
            value="Cancel"
          />
        </div>
      </form>
    </div>
  </div>
</div>

  )
}

//overlays

function openForm() {
    document.getElementById("myOverlay").style.display ="block";
}

function openFormDeleteUsers() {
    document.getElementById("deleteUsersOverlay").style.display ="block";
}

function openFormUpdateUsers() {
    document.getElementById("updateUsersOverlay").style.display ="block";
}

function openFormResetPassword() {
    document.getElementById("resetPasswordOverlay").style.display ="block";
}

function burger() {
  const body = document.querySelector("body"),
     modeToggle = body.querySelector(".mode-toggle");
  const sidebar = body.querySelector("nav");
  const sidebarToggle = body.querySelector(".sidebar-toggle");

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }
    else {
        localStorage.setItem("status", "open");
    }
  })
}

export default Users
