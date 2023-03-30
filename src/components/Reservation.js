import borrow from '../css/borrow.module.css'
import axios from "axios";
import '../css/reservation.css'
import '../css/overlay.css'
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from "../services/useRequireAuth";
import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from "react-router-dom";

import { Container, Card, CardContent, makeStyles, Grid, TextField, Button } from '@material-ui/core';
import QRCode from 'qrcode';
import QrReader from "react-qr-scanner";

const id = sessionStorage.getItem('sessionid')
console.log("Session ID: " + id)
const returnDomain = require('../common/domainString')
const selectedDomain = returnDomain();

function Reservation() {
  useRequireAuth(["Admin", "Editor"]);

  const location = useLocation();

  const navigate = useNavigate();


  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    navigate('/Login');
  };

  const [items, setItem] = useState([])
  const [borrowitem, setBorrowItem] = useState("")
  const [borrowEmail, setBorrowEmail] = useState("")

  
  useEffect(() => {
    refreshInventoryTable()
  }, []);
  //Change Password

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const data = {
      email: "Editor@gmail.com", // change your email address here for test purposes, erase this during deployment
      old_password: currentPassword,
      new_password: newPassword,
      user_password: confirmPassword,
    };
    console.log(currentPassword);
    console.log(newPassword);
    console.log(confirmPassword);
    axios.put(selectedDomain +'userChangePassword/', data)
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
          toast.error("Old password matches the new password");
        }
        if (error.response.status === 409) {
          // handle a 409 conflict error
          toast.error("Password update failed - password mismatched");
        }
        if (error.response.status === 404) {
          // handle a 404 conflict error
          toast.error("Current password is incorrect");
        }
        if (error.response.status === 401) {
          // handle any other error
          toast.error("Password update failed");
        }
      });
  }

  function handleCancel() {
    // hide the overlay
    document.getElementById("myOverlay").style.display = "none";
  }

  const classes = useStyles();


  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState('No result');





  const refreshInventoryTable = () => {
    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    axios.get(selectedDomain + 'reservation/' + document.getElementById("emailsearch").value)
      .then(
        response => {
          setItem(response.data);
        })
      .catch(error => {
        console.error(error);
      });
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
          <ul className="nav-links">
            <li>
              <a href="/Index">
                <i className="bx bxs-dashboard icon" />
                <span className="link-name">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/Borrow">
                <i className="bx bxs-backpack icon" />
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
          <i className="uil uil-bars sidebar-toggle" onClick={burger} />
          <div className="search-box">
            <h1>Borrow Reservation</h1>
          </div>
        </div>
        <div className="dash-content">
          <div className="activity">
            <div className="title">
              <i className="bx bxs-book-content icon" />
              <span className="text">Borrow Reservation</span>
            </div>
            
            <div className={borrow.inventory}>
              <p>Step 1. Input email of reservee</p>
            </div>
            <div>
              







              
              <input
                id ="emailsearch"
                type="text"
                className="number"
                name="phone"
                placeholder="Enter Email"
              />
              <div>
                <button className={`${borrow.update} ${borrow.category}`} onClick={() =>{
                  refreshInventoryTable()}}>
                  <i className="bx bx-search icon" />
                  Find User
                </button>
              </div>
            </div>
            <div className="activity">
              <div className="title">
                <i className="bx bx-table" />
                <span className="text">Reservation Table</span>
              </div>
            </div>
            {/* ROW 2 */}
            <div className="row-2"></div>
            <div className="activity-data">
              <table className="table">
                <thead>
                  <tr>
                    <th>Reservation ID</th>
                    <th>Item Name</th>
                    <th>Email</th>
                    <th>Date of Expiration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {
                items.map(
                  listeditem => (

                    <tr>
                    <td>{listeditem.item_code.item_code}</td>
                    <td>{listeditem.item_code.item_name}</td>
                    <td>{listeditem.email}</td>
                    <td>{listeditem.date_of_expiration}</td>
                    <td>
                      <div className="category">
                        
                        <button className={`${borrow.update} ${borrow.category}`} onClick={()=>{
                          
                          const dataPostObj = {
                            reservation_id: listeditem.reservation_id,
                            email: listeditem.email,
                            item_code: listeditem.item_code.item_code,
                            notes: " "
                          }
                          
                          const dataPost = [
                           dataPostObj
                          ]
                          const returnDomain = require('../common/domainString')
                          const selectedDomain = returnDomain();
                          axios.post(selectedDomain + 'confirmReservation/', dataPost)
                          .then((response) => {
                            
                          refreshInventoryTable()
                              document.getElementById("addItemsOverlay").style.display ="none";
                              console.log("AXIOS.POST SUCCESSFUL: " + response);
                          })
                          .catch((error) => {
                            console.log("INSIDE ERROR!!!");
                            console.log(error);
                          });


                        }}>
                          <i className="bx bx-plus icon" />
                          Add to Record
                        </button>
                        <button
                          className="delete category"
                          onClick={() => {

                            
                      const returnDomain = require('../common/domainString')
                      const selectedDomain = returnDomain();
                            axios.delete(selectedDomain + 'reservation/' + listeditem.reservation_id)
                              .then((response) => {
                                
                          refreshInventoryTable()
                                document.getElementById("deleteItemsOverlay").style.display = "none";
                                console.log("AXIOS.DELETE SUCCESSFUL: " + response);
                              })
                              .catch((error) => {
                                console.log("INSIDE ERROR!!!");
                                console.log(error);
                              });
                          }


                          }
                        >
                          <i className="bx bxs-trash icon" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                    
                  )

                )
                } 
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <div id="myOverlay" className="overlay">
        <div className="wrap">
          <h2>Change Password</h2>
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
      <div id="reservationOverlay" className="reservation-overlay">
        <div className="reservation-wrap">
          <h1 id="reservationh1">
            <i className="bx bxs-info-circle" />
            Action
          </h1>
          <h2 id="reservationh2">
            Would you like to confirm the reservation of these items?
          </h2>
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
      <div id="removeOverlay" className="remove-overlay">
        <div className="remove-wrap">
          <h1 id="removeh1">
            <i className="bx bxs-info-circle" />
            Action
          </h1>
          <h2 id="removeh2">Would you like to remove this item to reservation?</h2>
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
      <div id="reservationScanQROverlay" className="reservation-scan-qr-overlay">
        <div className="reservation-scan-qr-wrap">
          <h2>Scan QR</h2>
          <form>
            {/* <div className={borrow.card}  style={{ width: "18rem" }}> */}
            <div>
              <div>
                <p style={{ textAlign: 'center' }}>
                  {(result && result.text) &&
                    <div className="card-body">
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          id="qr-code-text"
                          label="QR Code Text"
                          value={`Item Code: ${result.text}`}
                          variant="outlined"
                          fullWidth
                          InputProps={{
                            readOnly: true,
                          }}
                          InputLabelProps={{
                            style: {
                              color: 'white',
                            },
                          }}
                          classes={{
                            root: classes.textField,
                          }}
                        />
                      </Grid>
                    </div>
                  }
                </p>
              </div>
            </div>
            <div className="qr">
              <input
                className="buttonQR generate"
                type="submit"
                value="Scan QR"
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
  document.getElementById("myOverlay").style.display = "block";
}

function openFormReservation() {
  document.getElementById("reservationOverlay").style.display = "block";
}

function openFormRemove() {
  document.getElementById("removeOverlay").style.display = "block";
}

function openFormReservationScanQR() {
  document.getElementById("reservationScanQROverlay").style.display = "block";
}

function burger() {
  const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle");
  const sidebar = body.querySelector("nav");
  const sidebarToggle = body.querySelector(".sidebar-toggle");

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
      localStorage.setItem("status", "close");
    }
    else {
      localStorage.setItem("status", "open");
    }
  })
}

const useStyles = makeStyles((theme) => ({
  conatiner: {
    marginTop: 10
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#3f51b5',
    color: '#fff',
    padding: 20
  },
  btn: {
    marginTop: 10,
    marginBottom: 20
  },

  textField: {
    backgroundColor: 'transparent',
    '& .MuiInputBase-input': {
      color: 'white',
      textAlign: 'center',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },
    '& .MuiOutlinedInput-input': {
      color: 'white',
      textAlign: 'center',
    },
    '& .MuiInputLabel-outlined': {
      color: 'white',
    },
  },
}));

export default Reservation
