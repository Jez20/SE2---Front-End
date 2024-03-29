
import returncss from '../css/return.module.css'
import inventory from '../css/inventory.module.css'
import userdashboard from '../css/userdashboard.css'
import '../css/overlay.css'
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useRequireAuth } from "../services/useRequireAuth";

import { Container, Card, CardContent, makeStyles, Grid, TextField, Button } from '@material-ui/core';
import QRCode from 'qrcode';
import QrReader from "react-qr-scanner";

function Return() {
  useRequireAuth(["Admin", "Editor"]);
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);
  const [storeResult, setstoreResult] = useState("");
  const navigate = useNavigate();
  const returnDomain = require('../common/domainString')
  const selectedDomain = returnDomain();

  const handleLogout = () => {
    axios.delete(selectedDomain + 'logout/')
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    navigate('/Login');
  };

  useEffect(() => {
    refreshReturnTable();
  }, []);

  const refreshReturnTable = () => {

    axios.get(selectedDomain + 'history/returnItems/randomString') // replace with your API endpoint
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState('No result');


  const handleScan = (result) => {
    if (result) {
      setResult(result.text);
      console.log("Result:" + result.text);
      handleScanQR(result.text);
    }
  }

  const handleScanQR = (scannedItemCode) => {
    try {
      const scanItem = scannedItemCode;
      const scannedItem = parseInt(scanItem);
      console.log('Scanned Item Code:', scannedItemCode);
      console.log('Data:', data);

      // find the history item for the scanned item code
      const historyItem = data.find((item) => item.item_code.item_code === scannedItem);

      console.log('History Item:', historyItem);

      // if a history item is found for the scanned item code
      if (historyItem) {
        const hist_id = historyItem.history_id;
        console.log('hist_id:', hist_id);
        const returnDomain = require('../common/domainString');
        const selectedDomain = returnDomain();
        console.log(selectedDomain + hist_id);
        const returnPut = {
          history_id: hist_id,
        };
        const returnPutArr = [returnPut];
        axios
          .put(selectedDomain + 'history/returnItems/return', returnPutArr)
          .then((response) => {
            window.location.reload();
            document.getElementById('markItemsOverlay').style.display = 'none';
            toast.success("Successfully returned item");
            console.log('AXIOS.PUT SUCCESSFUL:', response);
          })
          .catch((error) => {
            console.log(error);
            toast.error("ERROR: Error in returning item");
          });
      } else {
        console.log('No history found for itemcode:', scannedItemCode);
        toast.error("ERROR: No item code or invalid item code");
      }
    } catch (error) {
      console.log(error);
      toast.error("ERROR: Error in scanning item");
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

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

  function handleMarkItemsLost(event) {
    event.preventDefault();
    const hist_id = document.getElementById("submitMarkItemsLost").getAttribute("data-item-code");
    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    console.log(selectedDomain + hist_id);
    const returnPut = {
      history_id: hist_id
    }
    const returnPutArr = [
      returnPut
    ]
    axios.put(selectedDomain + 'history/lost/lost', returnPutArr)
      .then((response) => {
        window.location.reload()
        document.getElementById("markItemsOverlay").style.display = "none";
        console.log("AXIOS.PUT SUCCESSFUL: " + response);
      })
      .catch((error) => {
        console.log("INSIDE ERROR!!!");
        console.log(error);
      });
  }

  const handleEnterItemCode = (event) => {
    event.preventDefault();
    const itemCodeInput = document.getElementById('itemCodeInput');
    const itemCode = itemCodeInput.value.trim();
    if (itemCode) {
      handleScanQR(itemCode);
    }
  };

  function handleReturnItem(event) {
    event.preventDefault();
    const hist_id = document.getElementById("returnItem").getAttribute("data-item-code");
    const notes = document.getElementById("returnItem").getAttribute("data-item-notes");
    const returnDomain = require('../common/domainString')
    console.log(notes);
    const selectedDomain = returnDomain();
    console.log(selectedDomain + hist_id);
    const returnPut = {
      history_id: hist_id,
      notes: notes
    }
    const returnPutArr = [
      returnPut
    ]
    axios.put(selectedDomain + 'history/returnItems/return', returnPutArr)
      .then((response) => {
        window.location.reload()
        document.getElementById("markItemsOverlay").style.display = "none";
        console.log("AXIOS.PUT SUCCESSFUL: " + response);
      })
      .catch((error) => {
        console.log(error);
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
            <h1>Return Items</h1>
          </div>
        </div>
        <div className={inventory.dashContent}>
          <div className={inventory.activity} style={{ marginTop: '100px' }}>
            <div className={inventory.title}>
              <i className="bx bxs-book-content icon" />
              <span className={inventory.text}>Return Items</span>
            </div>
            {/* ROW 1 */}
            {/* <div className={returncss.inventory}>
          <p>Step 1. Scan QR</p>
        </div>
        <div>
          <button className={`${returncss.generate} ${returncss.category}`} onClick={openFormScanQR}>
            <i className="bx bx-qr-scan" />
            Scan QR
          </button>
        </div> */}
            <div className={inventory.inventory} style={{ marginBottom: '20px' }}>
              <p className="notef">*NOTE: The Scanning of QR and Manual Input Code are for Returning of Items Only</p>
            </div>
            <div className={returncss.inventory}>
              <p>Step 1. Scan QR or Manual Input Code to Return an Item</p>
            </div>
            <div>
              <button
                className="generate category"
                onClick={openFormScanQR}
              >
                <i className="bx bx-qr-scan icon" />
                Scan QR
              </button>
              <hr />
              <p>Manual Input Code</p>
            </div>
            <div>
              <form>
                <input
                  type="text"
                  className="number"
                  name="itemCode"
                  placeholder="Enter Item Code"
                  id="itemCodeInput"
                  required // added required attribute
                />
                <div>
                  <button
                    className={`${returncss.update} ${returncss.category}`}
                    onClick={handleEnterItemCode}
                  >
                    <i className="bx bxs-id-card icon" />
                    Enter Item Code
                  </button>
                </div>
              </form>
            </div>
            <hr />
            <div className={returncss.inventory}>
              <p>Step 2. Mark Items as Lost if Necessary or Return an Item</p>
            </div>

            {/* <div className={returncss.inventory}>
          <p>Step 2. Return Items</p>
        </div>
        <div>
          <button className={`${returncss.update} ${returncss.category}`} onClick={openFormReturnItems}>
            <i className="bx bxs-book-content icon" />
            Return Items
          </button>
        </div> */}
            {/* ROW 2 */}
            {/* <div className={returncss.row2}>
          <button className={`${returncss.delete} ${returncss.category}`} onClick={openFormMarkItems}>
            <i className="bx bxs-book-bookmark" />
            Mark Items as Lost
          </button>
        </div> */}
            <div className={`${inventory.activityData}`} style={{ overflowX: 'auto', marginTop: '20px' }}>
              <div className="scrollTable" style={{ minWidth: '100%', maxHeight: '420px' }}>
                <table className={`${inventory.table}`} style={{ minWidth: '100%' }}>
                  <thead style={{ position: 'sticky', top: 0 }}>
                    <tr>
                      <th>History ID</th>
                      <th>Item Name</th>
                      <th>Item Code</th>
                      <th>Borrower Name</th>
                      <th>Date</th>
                      <th>Time-in</th>
                      <th>Notes</th>
                      <th>Action</th>
                      {/* <th>For Return</th>
            <th>Lost</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.history_id}>
                        <td>{item.history_id}</td>
                        <td>{item.item_code.item_name}</td>
                        <td>{item.item_code.item_code}</td>
                        <td>{`${item.email.first_name} ${item.email.last_name}`}</td>
                        <td>{new Date(item.date_in).toLocaleDateString()}</td>
                        <td>{new Date(item.date_in).toLocaleTimeString()}</td>
                        <td>
                          <div className="form-group">
                            <label htmlFor={`textarea-${item.history_id}`} />
                            <textarea
                              className="form-control"
                              id={`textarea-${item.history_id}`}
                              rows={3}
                              style={{ width: "auto", resize: "none", size: "100%" }}
                              value={item.notes}
                              onChange={(event) => {
                                const editedItem = { ...item };
                                editedItem.notes = event.target.value;
                                setData(data.map((dataItem) => (dataItem.history_id === item.history_id ? editedItem : dataItem)));
                              }}
                              placeholder="Enter Notes here or Leave it as Blank"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="category">
                            <button className={`${returncss.update} ${returncss.category}`} onClick={(e) => openFormReservation(item.history_id, item.notes)}>
                              <i className="bx bxs-book-content icon" />
                              Return Items
                            </button>
                            <button
                              className="delete category"
                              onClick={(e) => openFormMarkItems(item.history_id)}
                            >
                              <i className="bx bxs-trash icon" />
                              Mark Item as Lost
                            </button>
                          </div>
                          {/* <div className={returncss.checkboxes}>
              <label className={returncss.checkbox}>
                <input type="checkbox" />
                <span className={returncss.indicator} />
              </label>
            </div> */}
                        </td>
                        {/* <td>
            <div className={returncss.checkboxes}>
              <label className={returncss.checkbox}>
                <input type="checkbox" checked={checkedHistoryIds.includes(item.history_id)}/>
                <span className={returncss.indicator} />
              </label>
            </div>
          </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>
      <div id="myOverlay" className={returncss.overlay}>
        <div className={returncss.wrap}>
          <h2 style={{ fontSize: '2em', textAlign: 'center', padding: 0, marginBottom: 10 }}>Change Password</h2>
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
      <div id="markItemsOverlay" className={returncss.markItemsOverlay}>
        <div className={returncss.markItemsWrap}>
          <h1 id="markh1">
            <i className="bx bxs-info-circle" style={{ margin: 5 }} />
            Action
          </h1>
          <h2 id="markh2">Would you like to mark this item as lost?</h2>
          <form>
            <div className={returncss.buttons}>
              <input
                className={`${returncss.action_btn} ${returncss.confirm}`}
                id="submitMarkItemsLost"
                onClick={handleMarkItemsLost}
                data-item-code=''
                type="submit"
                value="Confirm"
              />
              <input
                className={`${returncss.action_btn} ${returncss.cancel}`}
                type="submit"
                value="Cancel"
              />
            </div>
          </form>
        </div>
      </div>
      <div id="reservationOverlay" className="reservation-overlay">
        <div className="reservation-wrap">
          <h1 id="reservationh1">
            <i className="bx bxs-info-circle" style={{ margin: 5 }} />
            Action
          </h1>
          <h2 id="reservationh2">
            Would you like to return this item?
          </h2>
          <form>
            <div className="buttons">
              <input
                className="action_btn confirm"
                id="returnItem"
                type="submit"
                data-item-code=''
                value="Confirm"
                onClick={handleReturnItem}
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
      {/* <div id="removeOverlay" className="remove-overlay">
        <div className="remove-wrap">
          <h1 id="removeh1">
            <i className="bx bxs-info-circle" />
            Action
          </h1>
          <h2 id="removeh2">Would you like to remove this item?</h2>
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
      </div> */}

      <div id="returnItemsOverlay" className={returncss.returnItemsOverlay}>
        <div className={returncss.returnItemsWrap}>
          <h1 id="returnh1">
            <i className="bx bxs-info-circle" style={{ margin: 5 }} />
            Action
          </h1>
          <h2 id="returnh2">Would you like to return these items?</h2>
          <form>
            <div className={returncss.buttons}>
              <input
                className={`${returncss.action_btn} ${returncss.confirm}`}
                type="submit"
                value="Confirm"
              />
              <input
                className={`${returncss.action_btn} ${returncss.cancel}`}
                type="submit"
                value="Cancel"
              />
            </div>
          </form>
        </div>
      </div>
      <div id="scanQROverlay" className={returncss.scanQROverlay}>
        <div className={returncss.scanQRWrap}>
          <h2>Scan QR</h2>
          <form>
            <div className={returncss.card} style={{ width: "18rem" }}>
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
            <div className={returncss.qr}>
              <input
                className={`${returncss.buttonQR} ${returncss.generate}`}
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

//overlays

function openForm() {
  document.getElementById("myOverlay").style.display = "block";
}

function openFormReturnItems() {
  document.getElementById("returnItemsOverlay").style.display = "block";
}

function openFormScanQR() {
  // ask for camera permission
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(() => {
      // if permission is granted, display the QR code scanner overlay
      document.getElementById("scanQROverlay").style.display = "block";
    })
    .catch((err) => {
      console.error(err);
      // if permission is denied, display an error message
      alert("Camera Permission is Required to Scan QR Codes. Please Click the Camera Permission on the Top Left Corner Beside the Search Bar");
    });
}


function openFormReservation(hist_id, notes) {
  console.log(hist_id);
  document.getElementById("returnItem").setAttribute("data-item-code", hist_id);
  console.log("pass this to openFromReservation:" + notes);
  document.getElementById("returnItem").setAttribute("data-item-notes", notes);
  console.log("Succesfully set the attribute of data-item-code");
  document.getElementById("reservationOverlay").style.display = "block";
}

function openFormMarkItems(hist_id) {
  console.log(hist_id);
  document.getElementById("submitMarkItemsLost").setAttribute("data-item-code", hist_id);
  console.log("Succesfully set the attribute of data-item-code");
  document.getElementById("markItemsOverlay").style.display = "block";
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

export default Return
