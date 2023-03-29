import returncss from '../css/return.module.css'
import '../css/overlay.css'
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useRequireAuth } from "../services/useRequireAuth";

import {Container, Card, CardContent, makeStyles, Grid, TextField, Button} from '@material-ui/core';
import QRCode from 'qrcode';
import QrReader from "react-qr-scanner";

function Return() {
  useRequireAuth(["Admin", "Editor"]);
  const [data, setData] = useState([]);
  const [storeResult, setstoreResult] = useState("");
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    navigate('/Login');
  };

  useEffect(() => {
    refreshReturnTable();
  }, []);

  const refreshReturnTable = () => {
    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
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
  const [scanResultWebCam, setScanResultWebCam] =  useState('');
  const classes = useStyles();
  const qrRef = useRef(null);

  const [checkedHistoryIds, setcheckedHistoryIds] = useState([]);

  const handleCheck = (history_id) => {
    if (checkedHistoryIds.includes(history_id)){
      setcheckedHistoryIds(checkedHistoryIds.filter((history_id) => history_id !== history_id));
    } else {
      checkedHistoryIds([...checkedHistoryIds, history_id]);
    }
  }; 

  const generateQrCode = async () => {
    try {
          const response = await QRCode.toDataURL(text);
          setImageUrl(response);
    }catch (error) {
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
    if (result){
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

  function handleMarkItemsLost (event) {
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
  
  function handleCancel() {
    // hide the overlay
    document.getElementById("myOverlay").style.display ="none";
  }

  return (
<div>
  <nav>
    <div className={returncss.logoName}>
      <div className={returncss.logoImage}>
        <img src="images/logo.png" alt="" />
      </div>
      <span className={returncss.logo_name}>KLIA Inventory System</span>
    </div>
    <div className={returncss.menuItems}>
      <ul className={returncss.navLinks}>
        <li>
          <a href="/Index">
            <i className="bx bxs-dashboard icon" />
            <span className={returncss.linkName}>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/Borrow">
          <i className="bx bxs-shopping-bags" />
            <span className={returncss.linkName}>Borrow Items</span>
          </a>
        </li>
        <li>
          <a href="/Return">
            <i className="bx bxs-book-content icon" />
            <span className={returncss.linkName}>Return Items</span>
          </a>
        </li>
        <li>
          <a href="/Inventory">
            <i className="bx bx-box icon" />
            <span className={returncss.linkName}>Inventory</span>
          </a>
        </li>
        <li>
          <a href="/Users">
            <i className="bx bxs-user icon" />
            <span className={returncss.linkName}>Users</span>
          </a>
        </li>
        <li>
          <a className={returncss.openbtn} onClick={openForm}>
            <i className="bx bxs-lock-alt icon" />
            <span className={returncss.linkName}>Change Password</span>
          </a>
        </li>
      </ul>
      <ul className={returncss.logoutMode}>
        <li>
        <a href="#" onClick={handleLogout}>
            <i className="bx bxs-log-out icon" />
            <span className={returncss.linkName}>Logout</span>
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
  <section className={returncss.dashboard}>
    <div className={returncss.top}>
    <i className={`${returncss.sidebarToggle} uil uil-bars`} />
      <div className={returncss.searchBox}>
        <h1>Return Items</h1>
      </div>
    </div>
    <div className={returncss.dashContent}>
      <div className={returncss.activity}>
        <div className={returncss.title}>
          <i className="bx bxs-book-content icon" />
          <span className={returncss.text}>Return Items</span>
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
                    <div className={returncss.inventory}>
              <p>Step 1. Scan QR or Manual Input Code</p>
            </div>
            <div>
              <button
                className="generate category"
                onClick={openFormScanQR}
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
                  <button className={`${returncss.update} ${returncss.category}`}>
                    <i className="bx bxs-id-card" />
                    Add Reservation ID
                  </button>
                </div>
              </form>
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

    <div className={returncss.activityData}>
      <table className={returncss.table}>
        <thead>
          <tr>
            <th>History ID</th>
            <th>Item Name</th>
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
              />
            </div>
          </td>
          <td>
          <div className="category">
                      <button className={`${returncss.update} ${returncss.category}`} onClick={openFormReservation}>
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
  </section>
  <div id="myOverlay" className={returncss.overlay}>
    <div className={returncss.wrap}>
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
  <ToastContainer/>
  <div id="markItemsOverlay" className={returncss.markItemsOverlay}>
    <div className={returncss.markItemsWrap}>
      <h1 id="markh1">
        <i className="bx bxs-info-circle" />
        Action
      </h1>
      <h2 id="markh2">Would you like to mark the selected items as lost?</h2>
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
            <i className="bx bxs-info-circle" />
            Action
          </h1>
          <h2 id="reservationh2">
            Would you like to add this item?
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
        <i className="bx bxs-info-circle" />
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
      style={{width: '300px', height: '300px'}}
    />
    <p style={{textAlign: 'center'}}>
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
    alignItems:  'center',
    background: '#3f51b5',
    color: '#fff',
    padding: 20
  },
  btn : {
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
    document.getElementById("myOverlay").style.display ="block";
}

function openFormReturnItems() {
    document.getElementById("returnItemsOverlay").style.display ="block";
}

function openFormScanQR() {
    document.getElementById("scanQROverlay").style.display ="block";
}


function openFormReservation() {
  document.getElementById("reservationOverlay").style.display = "block";
}

function openFormMarkItems(hist_id) {
  console.log(hist_id);
  document.getElementById("submitMarkItemsLost").setAttribute("data-item-code", hist_id);
  console.log("Succesfully set the attribute of data-item-code");
  document.getElementById("markItemsOverlay").style.display = "block";
}

export default Return
