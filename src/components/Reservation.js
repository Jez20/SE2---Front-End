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

function Reservation() {
  useRequireAuth(["Admin", "Editor"]);

  const location = useLocation();

  const navigate = useNavigate();

  const [items, setItem] = useState([])

  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    navigate('/Login');
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedItems = queryParams.getAll("item");
    console.log(selectedItems);
    refreshInventoryTable(selectedItems);
  }, [location.search]);

  const refreshInventoryTable = (selectedItems) => {

    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    var i = 0
    while (i < selectedItems.length) {
      i++;
      axios.get(selectedDomain + "/inventory/" + selectedItems, { headers: { 'sessionid': id } })
        .then(
          response => {
            setItem(response.data);
          })
        .catch(error => {
          console.error(error);
        });
    }
  }

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
    axios.put('http://127.0.0.1:8000/userChangePassword/', data)
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

  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState('');
  const [scanResultWebCam, setScanResultWebCam] = useState('');
  const classes = useStyles();
  const qrRef = useRef(null);

  const [checkedHistoryIds, setcheckedHistoryIds] = useState([]);

  const handleCheck = (history_id) => {
    if (checkedHistoryIds.includes(history_id)) {
      setcheckedHistoryIds(checkedHistoryIds.filter((history_id) => history_id !== history_id));
    } else {
      checkedHistoryIds([...checkedHistoryIds, history_id]);
    }
  };

  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(text);
      setImageUrl(response);
    } catch (error) {
      console.log(error);
    }
  }
  const handleErrorFile = (error) => {
    console.log(error);
  }
  const handleScanFile = (result) => {
    if (result) {
      setScanResultFile(result);
    }
  }
  const onScanFile = () => {
    qrRef.current.openImageDialog();
  }
  const handleErrorWebCam = (error) => {
    console.log(error);
  }
  const handleScanWebCam = (result) => {
    if (result) {
      setScanResultWebCam(result);
    }
  }


  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState('No result');


  const handleScan = (result) => {
    if (result) {
      setResult(result);
    }
  }

  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
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
            <h1>Confirm Reservation</h1>
          </div>
        </div>
        <div className="dash-content">
          <div className="activity">
            <div className="title">
              <i className="bx bxs-book-content icon" />
              <span className="text">Confirm Reservation</span>
            </div>
            {/* ROW 1 */}
            <div className={borrow.inventory}>
              <p>Step 1. Scan QR or Manual Input Code</p>
            </div>
            <div>
              <button
                className="generate category"
                onClick={openFormReservationScanQR}
              >
                <i className="bx bx-qr-scan" />
                Scan QR
              </button>
            </div>
            <div>
              <form>
                <input
                  type="text"
                  className="number"
                  name="phone"
                  placeholder="Enter Reservation ID"
                />
                <div>
                  <button className={`${borrow.update} ${borrow.category}`}>
                    <i className="bx bxs-id-card" />
                    Add Reservation ID
                  </button>
                </div>
              </form>
            </div>
            <div className={borrow.inventory}>
              <p>Step 2. Add to Record</p>
            </div>
            <div>
              <input
                type="text"
                className="number"
                name="phone"
                placeholder="Enter Email"
              />
              <div>
                <button className={`${borrow.update} ${borrow.category}`} onClick={openFormReservation}>
                  <i className="bx bx-plus icon" />
                  Add to Record
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
                    <th>Date of Expiration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Item-001</td>
                    <td>Ball</td>
                    <td>2022-12-07</td>
                    <td>
                      <div className="category">
                        <button
                          className="delete category"
                          onClick={openFormRemove}
                        >
                          <i className="bx bxs-trash icon" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Item-001</td>
                    <td>Ball</td>
                    <td>2022-12-07</td>
                    <td>
                      <div className="category">
                        <button
                          className="delete category"
                          onClick={openFormRemove}
                        >
                          <i className="bx bxs-trash icon" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Item-001</td>
                    <td>Ball</td>
                    <td>2022-12-07</td>
                    <td>
                      <div className="category">
                        <button
                          className="delete category"
                          onClick={openFormRemove}
                        >
                          <i className="bx bxs-trash icon" />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
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
                <QrReader
                  delay={100}
                  onError={handleError}
                  onScan={handleScan}
                  style={{ width: '300px', height: '300px' }}
                />
                <p style={{ textAlign: 'center' }}>
                  {(result && result.text) &&
                    <div className="card-body">
                      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                        <TextField
                          id="qr-code-text"
                          label="QR Code Text"
                          value={`Item Code: ${result.text}`}
                          onChange={(e) => handleScan(e.target.value)}
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
