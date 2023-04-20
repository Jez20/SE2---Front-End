import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dashboard from "../css/dashboard.module.css";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useRequireAuth } from "../services/useRequireAuth";
// import '../dashboard.css'
import "../css/overlay.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Index() {
  useRequireAuth(["Admin", "Editor"]);
  const [userRole, setUserRole] = useState(null);
  const [history, setHistory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const imgData = 'images/logo.png';
  const navigate = useNavigate();
  const returnDomain = require('../common/domainString')
  const selectedDomain = returnDomain();

  const toDateInputRef = useRef(null);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fromDateInput = document.getElementById("dateofbirth");
    const toDateInput = toDateInputRef.current;
  
    const updateMinDate = () => {
      toDateInput.min = fromDateInput.value;
      if (toDateInput.value < fromDateInput.value) {
        toDateInput.value = fromDateInput.value;
      }
    };
  
    fromDateInput.addEventListener("input", updateMinDate);
  
    return () => {
      fromDateInput.removeEventListener("input", updateMinDate);
    };
  }, []);


  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [generatedBy, setGeneratedBy] = useState("");

  const generatePDF = async (event) => {
    event.preventDefault();
    const now = new Date();
    const fileName = `KLIA-Inventory-History-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.pdf`;
    const dateGenerated = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()} at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

    const url = `${selectedDomain}history/withRange/${fromDate}/${toDate}`;
    const response = await axios.get(url);
    const data = response.data;

    const doc = new jsPDF({ orientation: "landscape", });
    doc.text('Krislizz International Academy Inventory System', 50, 20); // Add company name
    doc.addImage(imgData, 'PNG', 10, 10, 35, 35); // Add company logo

    doc.setFontSize(13);
    doc.text(`Apple Blossom Street, Capitol Hills Trece Martirez, Cavite, Philippines`, 50, 26)

    doc.setFontSize(10);
    doc.text(`Generated by: ${generatedBy}`, 50, 31);
    doc.text(`Date Generated: ${dateGenerated}`, 50, 36);
    doc.text(`From: ${fromDate} - To: ${toDate}`, 50, 41);



    doc.autoTable({
      startY: 50,
      head: [["History ID", "First Name", "Last Name", "Email", "Role","Item Code", "Item Name", "Date(Time-In)", "Date(Time-Out)", "Notes"]],
      body: data.map((item) => [item.history_id, item.email.first_name, item.email.last_name, item.email.email, item.email.role.role_name, item.item_code.item_code,item.item_code.item_name, item.date_in, item.date_out, item.notes]),
      options: {
        margin: {horizontal:"auto"},
      }
    });
    doc.save(fileName);
    const overlay = document.getElementById("generateReportOverlay");
    overlay.style.display = "none";
  }


  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    axios.delete(selectedDomain + 'logout/')
    navigate('/Login');
  };

  const refreshHistoryTable = () => {
    axios
      .get(`${selectedDomain}history/`)
      .then((response) => {
        setHistory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    axios
      .get(`${selectedDomain}history`)
      .then((response) => {
        setHistory(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => { //inventory data
    axios
      .get(`${selectedDomain}inventory/`) //axios.get to replace fetch
      .then(res => {
        console.log(res.data);
        setInventory(res.data);
      }).catch(err => {
        console.log(err);
      })
  }, []);

  const countObjectsWithKeyValue = (keyToCount, valueToCount) => {
    // Use the reduce() method to count the occurrences of the key-value pair
    const count = inventory.reduce((accumulator, currentValue) => {
      return accumulator + (currentValue[keyToCount] === valueToCount ? 1 : 0);
    }, 0);
    // Return the count
    return count;
  };

  const workingCount = countObjectsWithKeyValue("item_condition", "Working");
  const maintenanceCount = countObjectsWithKeyValue("item_condition", "Maintenance");
  const retiredCount = countObjectsWithKeyValue("item_condition", "Retired");
  const damagedCount = countObjectsWithKeyValue("item_condition", "Damaged");
  const lostCount = countObjectsWithKeyValue("item_condition", "Lost");

  const handleSortChange = (event) => {
    const order = event.target.value;
    setSortOrder(order);

    const sortedHistory = history.sort((a, b) => {
      const dateA = new Date(a.date_in);
      const dateB = new Date(b.date_in);
      if (order === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setHistory(sortedHistory);
  }

  function deleteItem() {
    const history_id = document.getElementById("submitDeleteItem").getAttribute("data-history-id");
    axios.delete(`${selectedDomain}history/${history_id}`)
      .then((response) => {
        refreshHistoryTable();
        document.getElementById("deleteHistoryOverlay").style.display = "none";

      })
      .catch((error) => {
        console.log(error);

      });
  }


  async function deleteData(history_id) {
    try {
      const response = await axios.delete(`${selectedDomain}history/${history_id}`);
      console.log(response);
    } catch (error) {
      console.log(error);
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

  const deleteAllRecords = async () => {
    try {
      await axios.delete(`${selectedDomain}history/clearLogs/clear`);
      toast.success("All records have been cleared");
    } catch (error) {
      toast.error("An error occured");
    }
  }

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
                <span className={dashboard.number}>{workingCount}</span>
              </div>
              <div className={`${dashboard.box} ${dashboard.box2}`}>
                <i className="bx bxs-wrench" />
                <span className={dashboard.text}>Maintenance</span>
                <span className={dashboard.number}>{maintenanceCount}</span>
              </div>
              <div className={`${dashboard.box} ${dashboard.box3}`}>
                <i className="bx bxs-shapes icon" />
                <span className={dashboard.text}>Retired</span>
                <span className={dashboard.number}>{retiredCount}</span>
              </div>
              <div className={`${dashboard.box} ${dashboard.box4}`}>
                <i className="bx bx-health icon" />
                <span className={dashboard.text}>Damaged</span>
                <span className={dashboard.number}>{damagedCount}</span>
              </div>
              <div className={`${dashboard.box} ${dashboard.box5}`}>
                <i className="bx bxs-x-circle icon" />
                <span className={dashboard.text}>Lost</span>
                <span className={dashboard.number}>{lostCount}</span>
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
              <select id="sortOrder" className={dashboard.dashboardSelect} onChange={handleSortChange}>
                <option value="asc">Date Filter</option>
                <option value="des">Default</option>
                <option value="asc">Ascending</option>
                <option value="des">Descending</option>
              </select>
              <button className={dashboard.clearLogOpenBtn} onClick={openFormClear} title={userRole !== "Editor" ? "You need to be an Editor to perform this action." : ""} disabled={userRole !== "Editor"}>
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
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Date (Time-in)</th>
                    <th>Date (Time-out)</th>
                    <th>Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.history_id}>
                      <td>{item.history_id}</td>
                      <td>{item.email.first_name}</td>
                      <td>{item.email.last_name}</td>
                      <td>{item.email.email}</td>
                      <td>{item.email.role.role_name}</td>
                      <td>{item.item_code.item_code}</td>
                      <td>{item.item_code.item_name}</td>
                      <td>{new Date(item.date_in).toLocaleString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false})}</td>
                      <td>{new Date(item.date_out).toLocaleString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false})}</td>
                      <td>{item.notes}</td>
                      <td>
                        <div className={dashboard.actions}>
                          {/* <div className={`${dashboard.box} ${dashboard.edit}`} 
                      onClick={openFormUpdateHistory}>
                      <i className="bx bxs-pencil action" />
                    </div> */}
                          {/* <div
                      className={`${dashboard.box} ${dashboard.delete}`}
                      onClick={(e) => openFormDeleteHistory(item.history_id)}
                    >
                      <i className="bx bxs-trash action" />
                    </div> */}
                          <div
                            className={`${dashboard.box} ${dashboard.delete}`}
                            onClick={(e) => {
                              if (userRole === "Editor") {
                                openFormDeleteHistory(item.history_id);
                              }
                            }}
                            disabled={userRole !== "Editor"}
                            title={userRole !== "Editor" ? "You need to be an Editor to perform this action." : ""}
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
                  onClick={deleteAllRecords}
                />
                <input
                  className={`${dashboard.action_btn} ${dashboard.cancel}`}
                  type="submit"
                  value="Cancel"
                  onClick={closeFormClear}
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
              <input type="time" placeholder="Enter time in" id="timeIn" />
              <label htmlFor="username">Time - Out:</label>
              <input type="time" placeholder="Enter time out" id="timeOut" />
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
                  id="submitDeleteItem"
                  className={`${dashboard.action_btn} ${dashboard.confirm}`}
                  onClick={() => deleteItem()}
                  data-history-id=''
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
        <div id="generateReportOverlay" className={dashboard.generateReportOverlay}>
          <div className={dashboard.generateReportWrap}>
            <h2 id="generateh1">Generate Report</h2>
            <h2 id="generateh2">Select Date</h2>
            <form>
              <label htmlFor="dateofbirth">From:</label>
              <input
                type="date"
                name="dateofbirth"
                id="dateofbirth"
                value={fromDate}
                onChange={(event) => {
                  setFromDate(event.target.value);
                  if (!event.target.value) {
                    toDateInputRef.current.disabled = true;
                  } else {
                    toDateInputRef.current.disabled = false;
                  }
                }}
              />
              <label htmlFor="dateofbirthTo">To:</label>
              <input
                type="date"
                name="dateofbirth"
                id="dateofbirthTo"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
                ref={toDateInputRef}
                disabled={!fromDate}
              />
              <label htmlFor="generatedBy">Generated by:</label>
              <input
                type="text"
                placeholder="Enter name"
                id="generatedBy"
                value={generatedBy}
                onChange={(event) => setGeneratedBy(event.target.value)}

              />
              {/* <label htmlFor="username">
                <div className={dashboard.checkboxes}>
                  Print report within the last 2 weeks
                  <label className={dashboard.checkbox}>
                    <input type="checkbox" />
                    <span className={dashboard.indicator} />
                  </label>
                </div>
              </label> */}
              <div className={dashboard.buttons}>
                <input
                  className={`${dashboard.action_btn} ${dashboard.genRep}`}
                  type="submit"
                  value="Print Report"
                  onClick={generatePDF}
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

function closeFormClear() {
  // Hide the confirmation form
  document.getElementById('clearOverlay').style.display = 'none';
}

function openFormUpdateHistory() {
  document.getElementById("updateHistoryOverlay").style.display = "block";
}

function openFormDeleteHistory(history_id) {
  document.getElementById("submitDeleteItem").setAttribute("data-history-id", history_id);
  document.getElementById("deleteHistoryOverlay").style.display = "block";
}

function openFormGenerateReport() {
  document.getElementById("generateReportOverlay").style.display = "block";
}

function closeFormGenerateReport() {
  document.getElementById("generateReportOverlay").style.display = "none";
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