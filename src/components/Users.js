import '../css/users.css'
import '../css/overlay.css'
import inventory from '../css/inventory.module.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from "../services/useRequireAuth";

function Users() {
  useRequireAuth(["Admin", "Editor"]);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userData, setUserData] = useState({});
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const returnDomain = require('../common/domainString')
  const selectedDomain = returnDomain();

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    navigate('/Login');
    axios.delete(selectedDomain + 'logout/')
      .then(response => {
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios.get(selectedDomain + 'user/')
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
    axios.delete(selectedDomain + 'user/', { data: emailObjects })
      .then(response => {
        setUsers(users.filter(user => !selectedItems.includes(user.email)));
        setSelectedItems([]);

      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleResetPassword = async (email) => {
    try {
      const response = await axios.put(selectedDomain + `editorResetPassword/`, {
        email: email,
      });
      setUserData(response.data);
      toast.success('Successfully reset password');
    } catch (error) {
      console.error(error);
      toast.error('ERROR: Something Went Wrong');
    }
  };

  const handleUpdatePhoneNumber = (email) => {
    axios.put(selectedDomain + `user/${email}`, {
      phone_number: userData[email].newPhoneNumber,
    })
      .then(response => {

        setUserData(prevState => ({
          ...prevState,
          [email]: {
            ...prevState[email],
            phone_number: prevState[email].newPhoneNumber
          }
        }));

        setShowToast(true);
        window.location.reload()
      })
      .catch(error => {
        console.error(error);
        toast.error('ERROR: You have not changed anything');
      });
  };
  useEffect(() => {
    if (showToast) {
      toast.success('Phone number updated successfully');
      setShowToast(false);
    }
  }, [showToast]);
  const handleUpdateRole = async (email) => {
    try {
      const response = await axios.put(selectedDomain + `user/${email}`, {
        role: userData[email].newRole
      });
      setUserData(prevState => ({
        ...prevState,
        [email]: {
          ...prevState[email],
          phone_number: prevState[email].newRole
        }
      }));
      toast.success('Role has been updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('ERROR: You have not changed anything');
    }
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const data = {
      email: "test", // change your email address here for test purposes, erase this during deployment
      old_password: currentPassword,
      new_password: newPassword,
      user_password: confirmPassword,
    };
    console.log(currentPassword);
    console.log(newPassword);
    console.log(confirmPassword);
    axios.put(selectedDomain + 'userChangePassword/', data)
      .then(response => {
        console.log(response.data);
        // add a success message to your UI if needed
        // hide the overlay
        toast.success("Password updated successfully");
        handleCancel();
      })
      .catch(error => {
        console.error(error);
        if (error.response.status === 400) {
          // handle a 400 conflict error
          toast.error("ERROR: Old password matches the new password");
        }
        if (error.response.status === 409) {
          // handle a 409 conflict error
          toast.error("ERROR: Password update failed - password mismatched");
        }
        if (error.response.status === 404) {
          // handle a 404 conflict error
          toast.error("ERROR: Current password is incorrect");
        }
        if (error.response.status === 401) {
          // handle any other error
          toast.error("ERROR: Password update failed");
        }
      });
  }

  function handleCancel() {
    // hide the overlay
    document.getElementById("myOverlay").style.display = "none";
  }

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
          <ul className={inventory.navLinks}>
            <li>
              <a href="/Index">
                <i className="bx bxs-dashboard icon" />
                <span className="link-name">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/Borrow">
                <i className="bx bxs-shopping-bags icon" />
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
          <ul className="navLinks">
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
          </ul>
        </div>
      </nav>
      <section className="dashboard">
        <div className="top">
          <i className="uil uil-bars sidebar-toggle" onClick={burger} />
          <div className="search-box">
            <h1>Users</h1>
          </div>
        </div>
        <div className={inventory.dashContent}>
          <div className={inventory.activity} style={{marginTop: '100px'}}>
            <div className={inventory.title}>
              <i className="bx bxs-user icon" />
              <span className={inventory.text}>Users</span>
            </div>
            {/* ROW 1 */}
            <div className="inventory">
              <p className='notef'>*NOTE: Ctrl + F to find users</p>
              <p className='note'>⚠️ Only Editors can edit user credentials. Admins and Editors can add users</p>
              <p className='note'>⚠️ Only Editors can promote Admins to Editors</p>
              <p className='note'>⚠️ Resetting password will reset the password to the user's email</p>
            </div>
            {/* ROW 2 */}
            <div className={inventory.row2}>
              <div className={inventory.row2btns}>
                <button className={`${inventory.delete} ${inventory.category}`} onClick={openFormDeleteUsers} title={userRole !== "Editor" ? "You need to be an Editor to perform this action." : ""} disabled={userRole !== "Editor"} >
                  <i className="bx bxs-trash-alt icon" />
                  Delete Selected Users
                </button>
                <button
                  className={`${inventory.add} ${inventory.item}`}
                  onClick={event => window.location.href = '/Adduser'}
                >
                  <i className="bx bx-plus icon" />
                  Add Users
                </button>
              </div>
            </div>

            <div className={`${inventory.activityData}`} style={{ overflowX: 'auto',marginTop: '70px'}}>
              <div className="scrollTable" style={{ minWidth: '100%', maxHeight: '610px' }}>
                <table className={`${inventory.table}`} style={{ minWidth: '100%' }}>
                  <thead style={{ position: 'sticky', top: 0 , zIndex: 1}}>
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
                              disabled={userRole !== "Editor"}
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
                            disabled={userRole !== "Editor"}
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
                              // onClick={() => handleUpdatePhoneNumber(user.email)}
                              title={userRole !== "Editor" ? "You need to be an Editor to perform this action." : ""} disabled={userRole !== "Editor"}
                              onClick={openFormUpdatePhone}
                            >
                              <i className="bx bxs-pencil action icon" />
                              Update Phone Number
                            </button>
                            <button
                              className="update category"
                              title={userRole !== "Editor" ? "You need to be an Editor to perform this action." : ""} disabled={userRole !== "Editor"}
                              onClick={openFormUpdateUserRole}
                            // onClick={() => handleUpdateRole(user.email)}
                            >
                              <i className="bx bxs-pencil action icon" />
                              Update Role
                            </button>
                            <button
                              className="reset category"
                              title={userRole !== "Editor" ? "You need to be an Editor to perform this action." : ""} disabled={userRole !== "Editor"}
                              // onClick={() => handleResetPassword(user.email)}
                              onClick={openFormResetPassword}
                            >
                              <i className="bx bx-refresh icon" />
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
        </div>
      </section>
      <div id="myOverlay" className="overlay">
        <div className="wrap">
          <h2 style={{ fontSize: '2em', textAlign: 'center', padding: 0, marginBottom: 10}}>Change Password</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="currentPass">Current Password:</label>
            <input
              type="password"
              placeholder="Enter your current password" required
              id="currentPass"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
            <label htmlFor="newPass">New Password:</label>
            <input
              type="password"
              placeholder="Enter your new password" required
              id="newPass"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <label htmlFor="conPass">Confirm Password:</label>
            <input
              type="password"
              placeholder="Confirm password" required
              id="conPass"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            <div className="buttons">
              <input
                className="action_btn confirm"
                type="submit"
                value="Confirm"
              />
              <input
                className="action_btn cancel"
                type="button"
                value="Cancel"
                onClick={handleCancel}
              />
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
      <div id="deleteUsersOverlay" className="delete-users-overlay">
        <div className="delete-users-wrap">
          <h1 id="usersh1">
            <i className="bx bxs-error" style={{margin: 5 }}/> Warning!{" "}
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

      {users.map((user, index) => (
        <div key={index}>
          <div id="updatePhoneOverlay" className="update-users-overlay">
            <div className="update-users-wrap">
              <h1 id="updateh1">
                <i className="bx bxs-info-circle" /> Action{" "}
              </h1>
              <h2 id="updateh2">Would you like to update this person's phone number?</h2>
              <form>
                <div className="buttons">
                  <input
                    className="action_btn confirm"
                    type="submit"
                    value="Confirm"
                    onClick={(event) => {
                      // Custom function to handle phone number update
                      const handlePhoneNumberUpdate = () => {
                        // Retrieve user email from user object
                        const email = user.email;
                        // Call function to update phone number
                        handleUpdatePhoneNumber(email);
                      }

                      // Call custom function to handle phone number update
                      handlePhoneNumberUpdate();
                    }}
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

          <div id="updateRoleOverlay" className="update-users-overlay">
            <div className="update-users-wrap">
              <h1 id="updateh1">
                <i className="bx bxs-info-circle" /> Action{" "}
              </h1>
              <h2 id="updateh2">Would you like to update this person's role?</h2>
              <form>
                <div className="buttons">
                  <input
                    className="action_btn confirm"
                    type="submit"
                    value="Confirm"
                    onClick={(event) => {
                      // Custom function to handle role update
                      const handleRoleUpdate = () => {
                        // Retrieve user email from user object
                        const email = user.email;
                        // Call function to update role
                        handleUpdateRole(email);
                      }

                      // Call custom function to handle role update
                      handleRoleUpdate();
                    }}
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
                    onClick={(event) => {
                      // Custom function to handle reset password
                      const handlePasswordReset = () => {
                        // Retrieve user email from user object
                        const email = user.email;
                        // Call function to reset password
                        handleResetPassword(email);
                      }

                      // Call custom function to handle password reset
                      handlePasswordReset();
                    }}

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
      ))}


    </div>

  )
}

//overlays

function openForm() {
  document.getElementById("myOverlay").style.display = "block";
}

function openFormUpdateUserRole() {
  document.getElementById("updateRoleOverlay").style.display = "block";
}

function openFormUpdatePhone() {
  document.getElementById("updatePhoneOverlay").style.display = "block";
}

function openFormResetPassword() {
  document.getElementById("resetPasswordOverlay").style.display = "block";
}

function openFormDeleteUsers() {
  document.getElementById("deleteUsersOverlay").style.display = "block";
}

function burger() {
  const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle");
  const sidebar = body.querySelector("nav");
  const sidebarToggle = body.querySelector(".sidebar-toggle");

  sidebar.classList.toggle("close");
  if (sidebar.classList.contains("close")) {
    localStorage.setItem("status", "close");
  }
  else {
    localStorage.setItem("status", "open");
  }
}

export default Users
