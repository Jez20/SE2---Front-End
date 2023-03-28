import borrow from '../css/borrow.module.css'
import axios from "axios";
import '../css/reservation.css'
import '../css/overlay.css'
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from "../services/useRequireAuth";
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

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
    <i className="uil uil-bars sidebar-toggle" onClick={burger}/>
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
        <div className="card" style={{ width: "18rem" }}>
          <img
            className="card-img-top"
            src="https://qrcg-free-editor.qr-code-generator.com/main/assets/images/websiteQRCode_noFrame.png"
            alt="Card image cap"
            style={{ height: 300, width: 300 }}
          />
          <div className="card-body"></div>
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
    document.getElementById("myOverlay").style.display ="block";
}

function openFormReservation() {
    document.getElementById("reservationOverlay").style.display ="block";
}

function openFormRemove() {
    document.getElementById("removeOverlay").style.display ="block";
}

function openFormReservationScanQR() {
    document.getElementById("reservationScanQROverlay").style.display ="block";
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

export default Reservation
