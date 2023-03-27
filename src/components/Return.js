import returncss from '../css/return.module.css'
import '../css/overlay.css'
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from "../services/useRequireAuth";

function Return() {
  useRequireAuth("Admin" || "Editor");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    navigate('/Login');
  };

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/history/') // replace with your API endpoint
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
        <div className={returncss.inventory}>
          <p>Step 1. Scan QR</p>
        </div>
        <div>
          <button className={`${returncss.generate} ${returncss.category}`} onClick={openFormScanQR}>
            <i className="bx bx-qr-scan" />
            Scan QR
          </button>
        </div>
        <div className={returncss.inventory}>
          <p>Step 2. Return Items</p>
        </div>
        <div>
          <button className={`${returncss.update} ${returncss.category}`} onClick={openFormReturnItems}>
            <i className="bx bxs-book-content icon" />
            Return Items
          </button>
        </div>
        {/* ROW 2 */}
        <div className={returncss.row2}>
          <button className={`${returncss.delete} ${returncss.category}`} onClick={openFormMarkItems}>
            <i className="bx bxs-book-bookmark" />
            Mark Items as Lost
          </button>
        </div>

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
            <th>For Return</th>
            <th>Lost</th>
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
            <div className={returncss.checkboxes}>
              <label className={returncss.checkbox}>
                <input type="checkbox" />
                <span className={returncss.indicator} />
              </label>
            </div>
          </td>
          <td>
            <div className={returncss.checkboxes}>
              <label className={returncss.checkbox}>
                <input type="checkbox" />
                <span className={returncss.indicator} />
              </label>
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
  <div id="myOverlay" className={returncss.overlay}>
    <div className={returncss.wrap}>
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
          <img
            className="card-img-top"
            src="https://qrcg-free-editor.qr-code-generator.com/main/assets/images/websiteQRCode_noFrame.png"
            alt="Card image cap"
            style={{ height: 300, width: 300 }}
          />
          <div className="card-body"></div>
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

//overlays

function openForm() {
    document.getElementById("myOverlay").style.display ="block";
}

function openFormMarkItems() {
    document.getElementById("markItemsOverlay").style.display ="block";
}

function openFormReturnItems() {
    document.getElementById("returnItemsOverlay").style.display ="block";
}

function openFormScanQR() {
    document.getElementById("scanQROverlay").style.display ="block";
}

export default Return
