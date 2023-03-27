import React, { useState, useEffect } from "react";
import axios from "axios";
import dashboard from "../css/dashboard.module.css";
import { useNavigate } from 'react-router-dom';
// import '../dashboard.css'
import "../css/overlay.css";

function Index() {
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    navigate('/Login');
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/history/")
      .then((response) => {
        setHistoryData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={dashboard.App}>
      <nav>
        <div className={dashboard.logoName}>
          <div className={dashboard.logoImage}>
            <img src="images/logo.png" alt="" />
          </div>
          <span className={dashboard.logo_name}>KLIA Inventory System</span>
        </div>
        <div className={dashboard.menuItems}>
          <ul className={dashboard.navLinks}>
            <li>
              <a href="/Index">
                <i className="bx bxs-dashboard icon" />
                <span className={dashboard.linkName}>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/Borrow">
                <i className="bx bxs-shopping-bags" />
                <span className={dashboard.linkName}>Borrow Items</span>
              </a>
            </li>
            <li>
              <a href="/Return">
                <i className="bx bxs-book-content icon" />
                <span className={dashboard.linkName}>Return Items</span>
              </a>
            </li>
            <li>
              <a href="/Inventory">
                <i className="bx bx-box icon" />
                <span className={dashboard.linkName}>Inventory</span>
              </a>
            </li>
            <li>
              <a href="/Users">
                <i className="bx bxs-user icon" />
                <span className={dashboard.linkName}>Users</span>
              </a>
            </li>
            <li>
              <a className="openbtn" onClick={openForm}>
                <i className="bx bxs-lock-alt icon" />
                <span className={dashboard.linkName}>Change Password</span>
              </a>
            </li>
          </ul>
          <ul className={dashboard.logOutMode}>
            <li>
              <a href="#" onClick={handleLogout}>
                <i className="bx bxs-log-out icon" />
                <span className={dashboard.linkName}>Logout</span>
              </a>
            </li>
            <li className="mode">
              <a href="#"></a>
              <div className="mode-toggle"></div>
            </li>
          </ul>
        </div>
      </nav>
      <section className={dashboard.dashboard}>
        <div className={dashboard.top}>
          <i
            className={`${dashboard.sidebarToggle} uil uil-bars`}
            onClick={burger}
          />
          <div className={dashboard.searchBox}>
            <h1>Dashboard</h1>
          </div>
        </div>
        <div className={dashboard.dashContent}>
          <div className={dashboard.overview}>
            <div className={dashboard.title}>
              <i className="uil uil-tachometer-fast-alt" />
              <span className={dashboard.text}>Dashboard</span>
            </div>
            <div className={dashboard.boxes}>
              <div className={`${dashboard.box} ${dashboard.box1}`}>
                <i className="bx bx-check icon" />
                <span className={dashboard.text}>Working</span>
                <span className={dashboard.number}>12</span>
              </div>
              <div className={`${dashboard.box} ${dashboard.box2}`}>
                <i className="bx bxs-wrench" />
                <span className={dashboard.text}>Maintenance</span>
                <span className={dashboard.number}>4</span>
              </div>
              <div className={`${dashboard.box} ${dashboard.box3}`}>
                <i className="bx bxs-shapes icon" />
                <span className={dashboard.text}>Retired</span>
                <span className={dashboard.number}>2</span>
              </div>
              <div className={`${dashboard.box} ${dashboard.box4}`}>
                <i className="bx bx-health icon" />
                <span className={dashboard.text}>Damaged</span>
                <span className={dashboard.number}>3</span>
              </div>
              <div className={`${dashboard.box} ${dashboard.box5}`}>
                <i className="bx bxs-x-circle icon" />
                <span className={dashboard.text}>Lost</span>
                <span className={dashboard.number}>5</span>
              </div>
            </div>
          </div>
          <div className={dashboard.activity}>
        <div className={dashboard.title}>
          <i className="uil uil-clock-three" />
          <span className={dashboard.text}>Recent Activity</span>
        </div>
        {/* ROW 2 */}
        <div className={dashboard.row2}>
          <button className={dashboard.genRep} onClick={openFormGenerateReport}>
            <i className="bx bxs-download" />
            Generate Report
          </button>
          <select id="category" className={dashboard.dashboardSelect}>
            <option value="select">Date Filter</option>
            <option value="date-1">Default</option>
            <option value="date-2">Ascending</option>
            <option value="date-3">Descending</option>
          </select>
          <button className={dashboard.clearLogOpenBtn} onClick={openFormClear}>
            <i className="bx bx-menu-alt-right clear" />
            Clear Logs
          </button>
        </div>
          <div className={dashboard.activityData}>
            <table className={dashboard.table}>
              <thead>
                <tr>
                  <th>History ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Item Name</th>
                  <th>Date (Time-in)</th>
                  <th>Date (Time-out)</th>
                  <th>Text Sent</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.history_id}</td>
                    <td>{item.email.first_name}</td>
                    <td>{item.email.last_name}</td>
                    <td>{item.email.email}</td>
                    <td>{item.email.role.role_name}</td>
                    <td>{item.item_code.item_name}</td>
                    <td>{item.date_in}</td>
                    <td>{item.date_out}</td>
                    <td>{item.texts}</td>
                    <td>
                    <div className={dashboard.actions}>
                    <div className={`${dashboard.box} ${dashboard.edit}`} onClick={openFormUpdateHistory}>
                      <i className="bx bxs-pencil action" />
                    </div>
                    <div
                      className={`${dashboard.box} ${dashboard.delete}`}
                      onClick={openFormDeleteHistory}
                    >
                      <i className="bx bxs-trash action" />
                    </div>
                  </div>
                      {/* <div className={dashboard.actions}>
                        <div
                          className={`${dashboard.box} ${dashboard.edit}} onClick={() => handleEdit(item)} > Edit </div> <div className={${dashboard.box} ${dashboard.delete}`}
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </div>
                      </div> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
        <div id="myOverlay" className={dashboard.overlay}>
          <div className={dashboard.wrap}>
            <h2>Change Password</h2>
            <form>
              <label htmlFor="username">Current Password:</label>
              <input
                type="text"
                placeholder="Enter your current password"
                id="currentPass"
              />
              <label htmlFor="username">New Password:</label>
              <input
                type="text"
                placeholder="Enter your new password"
                id="newPass"
              />
              <label htmlFor="username">Confirm Password:</label>
              <input type="text" placeholder="Confirm password" id="conPass" />
              <div className={dashboard.buttons}>
                <input
                  className={`${dashboard.action_btn} ${dashboard.confirm}`}
                  type="submit"
                  value="Confirm"
                />
                <input
                  className={`${dashboard.action_btn} ${dashboard.cancel}`}
                  type="submit"
                  value="Cancel"
                />
              </div>
            </form>
          </div>
        </div>
        <div id="clearOverlay" className={dashboard.clearOverlay}>
          <div className={dashboard.clearWrap}>
            <h1 id="clearh1">
              <i className="bx bxs-error icon" /> Warning!{" "}
            </h1>
            <h2 id="clearh2">
              Performing this action is irreversable, Would you like to clear
              all logs?
            </h2>
            <form>
              <div className={dashboard.buttons}>
                <input
                  className={`${dashboard.action_btn} ${dashboard.confirm}`}
                  type="submit"
                  value="Confirm"
                />
                <input
                  className={`${dashboard.action_btn} ${dashboard.cancel}`}
                  type="submit"
                  value="Cancel"
                />
              </div>
            </form>
          </div>
        </div>
        <div
          id="updateHistoryOverlay"
          className={dashboard.updateHistoryOverlay}
        >
          <div className={dashboard.updateHistoryWrap}>
            <h2>Update History</h2>
            <form>
              <label htmlFor="username">Time - In:</label>
              <input type="text" placeholder="Enter time in" id="timeIn" />
              <label htmlFor="username">Time - Out:</label>
              <input type="text" placeholder="Enter time out" id="timeOut" />
              <div className="buttons">
                <input
                  className={`${dashboard.action_btn} ${dashboard.edit}`}
                  type="submit"
                  value="Update"
                />
                <input
                  className={`${dashboard.action_btn} ${dashboard.cancel}`}
                  type="submit"
                  value="Cancel"
                />
              </div>
            </form>
          </div>
        </div>
        <div
          id="deleteHistoryOverlay"
          className={dashboard.deleteHistoryOverlay}
        >
          <div className={dashboard.deleteHistoryWrap}>
            <h1 id="historyh1">
              <i className="bx bxs-error icon" /> Warning!{" "}
            </h1>
            <h2 id="historyh2">
              Would you like to delete the selected record?
            </h2>
            <form>
              <div className={dashboard.buttons}>
                <input
                  className={`${dashboard.action_btn} ${dashboard.confirm}`}
                  type="submit"
                  value="Confirm"
                />
                <input
                  className={`${dashboard.action_btn} ${dashboard.cancel}`}
                  type="submit"
                  value="Cancel"
                />
              </div>
            </form>
          </div>
        </div>
        <div
          id="generateReportOverlay"
          className={dashboard.generateReportOverlay}
        >
          <div className={dashboard.generateReportWrap}>
            <h2 id="generateh1">Generate Report</h2>
            <h2 id="generateh2">Select Date</h2>
            <form>
              <label htmlFor="username">From:</label>
              <input type="date" name="dateofbirth" id="dateofbirth" />
              <label htmlFor="username">To:</label>
              <input type="date" name="dateofbirth" id="dateofbirthTo" />
              <label htmlFor="username">Generated by:</label>
              <input type="text" placeholder="Enter name" id="generatedBy" />
              <label htmlFor="username">
                <div className={dashboard.checkboxes}>
                  Print report within the last 2 weeks
                  <label className={dashboard.checkbox}>
                    <input type="checkbox" />
                    <span className={dashboard.indicator} />
                  </label>
                </div>
              </label>
              <div className={dashboard.buttons}>
                <input
                  className={`${dashboard.action_btn} ${dashboard.genRep}`}
                  type="submit"
                  value="Print Report"
                />
                <input
                  className={`${dashboard.action_btn} ${dashboard.cancel}`}
                  type="submit"
                  value="Cancel"
                />
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

// CSS Module Example

// import dashboard from '../dashboard.module.css'
// import '../overlay.css'
// className={dashboard.App}

// const Index = () => {
//   return (
//   )
// }

function handleEdit(item) {
  // handle edit logic here
}

function handleDelete(item) {
  // handle delete logic here
}

//overlays

function openForm() {
  document.getElementById("myOverlay").style.display = "block";
}

function openFormClear() {
  document.getElementById("clearOverlay").style.display = "block";
}

function openFormUpdateHistory() {
  document.getElementById("updateHistoryOverlay").style.display = "block";
}

function openFormDeleteHistory() {
  document.getElementById("deleteHistoryOverlay").style.display = "block";
}

function openFormGenerateReport() {
  document.getElementById("generateReportOverlay").style.display = "block";
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
    } else {
      localStorage.setItem("status", "open");
    }
  });
}

export default Index;
