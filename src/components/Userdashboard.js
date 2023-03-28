import '../css/userdashboard.css'
import '../css/overlay.css'
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useRequireAuth } from "../services/useRequireAuth";

function Userdashboard() {
  useRequireAuth();
  const [userHistory, setUserHistory] = useState([]);
  const navigate = useNavigate();
  const returnDomain = require('../common/domainString')
  const selectedDomain = returnDomain();

  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    navigate('/Login');
    axios.delete(selectedDomain+ 'logout/')
      .then(response => {
        console.log("delete success");  
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/userHistory/")
      .then((response) => {
        setUserHistory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/specificReservations/')
      .then(response => {
        setReservations(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  //Change Password

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const data = {
      email: "User@gmail.com", // change your email address here for test purposes, erase this during deployment
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
    document.getElementById("myOverlay").style.display ="none";
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
          <a href="/Userdashboard">
            <i className="bx bxs-dashboard icon" />
            <span className="link-name">Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/Userreserve">
            <i className="bx bxs-backpack icon" />
            <span className="link-name">Reserve Items</span>
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
        <h1>Dashboard</h1>
      </div>
    </div>
    <div className="dash-content">
      <div className="activity">
        <div className="title">
          <i className="bx bx-history" />
          <span className="text">History Table</span>
        </div>
        <div className="activity-data">
          <table className="table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Date - In</th>
                <th>Date - Out</th>
              </tr>
            </thead>
            <tbody>
              {userHistory.map((history) => (
                <tr key={history.id}>
                  <td>{history.item_code}</td>
                  <td>{history.item_name}</td>
                  <td>{history.date_in}</td>
                  <td>{history.date_out}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="title">
          <i className="bx bxs-detail" />
          <span className="text">Reservation Table</span>
        </div>
        {/* ROW 2 */}
        <div className="row-2">
          <button
            className="generate category"
            onClick={openFormGenerateInvoice}
          >
            <i className="bx bxs-download" />
            Generate Invoice
          </button>
        </div>

        <div className="activity-data">
      <table className="table">
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>Item Name</th>
            <th>Date of Expiration</th>
            <th>Invoice</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td>{reservation.reservation_id}</td>
              <td>{reservation.item_code.item_name}</td>
              <td>{reservation.date_of_expiration}</td>
              <td>
                <div className="checkboxes">
                  <label className="checkbox">
                    <input type="checkbox" />
                    <span className="indicator" />
                  </label>
                </div>
              </td>
              <td>
                <div className="category" onClick={openFormCancel}>
                  <button className="delete category">
                    <i className="bx bx-x" />
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          ))}
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
  <ToastContainer/>
  <div id="cancelOverlay" className="cancel-overlay">
    <div className="cancel-wrap">
      <h1 id="cancelh1">
        <i className="bx bxs-info-circle" />
        Action
      </h1>
      <h2 id="cancelh2">
        Would you like to cancel the reservation of this item?
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
  <div id="generateInvoiceOverlay" className="invoice-overlay">
    <div className="invoice-wrap">
      <h2 id="invoiceh2">Print Invoice</h2>
      <form>
        <div className="card">
          <img
            className="card-img-top"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUT4dzVBCJqmEcFm4gWT5dLwdTb3pTCTRNhA&usqp=CAU"
            alt="Card image cap"
            style={{ height: 300, width: 300 }}
          />
          <div className="card-body"></div>
        </div>
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

function openFormCancel() {
    document.getElementById("cancelOverlay").style.display ="block";
}

function openFormGenerateInvoice() {
    document.getElementById("generateInvoiceOverlay").style.display ="block";
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


export default Userdashboard
