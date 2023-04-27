import React, { useState, useEffect } from 'react';
import inventory from '../css/inventory.module.css';
import userreserve from '../css/userreserve.module.css'
import borrow from '../css/borrow.module.css'
import '../css/overlay.css'
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ToastContainer, toast } from 'react-toastify';
import { useRequireAuth } from "../services/useRequireAuth";
import axios from "axios";

// import { createGlobalStyle } from 'styled-components';

// const GlobalStyle = createGlobalStyle`
//   @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
//   @import url('https://www.w3schools.com/w3css/4/w3.css');
// `;

// <GlobalStyle />

function Userreserve() {
  const [items, setItem] = useState([])
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Default'); // contains the category ID
  const [dynamicCategory, setDynamicCategory] = useState([]);

  // hook
  useEffect(() => {
    refreshInventoryTable();
    refreshCategoryTable();
  }, []);


  // Get The Inventory
  const refreshInventoryTable = () => {

    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    axios.get(selectedDomain + "itemsView/")
      .then(
        response => {
          setItem(response.data);
        })
      .catch(error => {
        console.error(error);
      });
  }

  // + Add Item using axios.post


  // IN-ROW buttons
  // update
  // generate QR
  function checkAll(checked) {
    const newSelectedItems = checked
      ? items.map((item) => item.item_code)
      : [];

    setSelectedItems(newSelectedItems);
    const checkboxes = document.querySelectorAll('input[name="reservableItems"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = checked;
    });
    console.log(selectedItems)
  }

  function handleReservation() {
    for (let x of selectedItems) {
      const dataPostObj = {
        item_code: x,
        email: 'User@gmail.com', // HARDCODED USER EMAIL FOR TESTING PURPOSES!!!! DELETE AND UPDATE WHEN B.END IS FIXED!
        claim: 0 // num
      }

      const dataPost = [
        dataPostObj
      ]
      const returnDomain = require('../common/domainString')
      const selectedDomain = returnDomain();
      axios.post(selectedDomain + 'specificUserInsertReservations/', dataPost)
        .then((response) => {
          refreshInventoryTable();
          document.getElementById("addItemsOverlay").style.display = "none";
          console.log("AXIOS.POST SUCCESSFUL: " + response);
        })
        .catch((error) => {
          console.log("INSIDE ERROR!!!");
          console.log(error);
        });
    }

    checkAll(false)
  }

  useRequireAuth();

  const navigate = useNavigate();
  const returnDomain = require('../common/domainString')
  const selectedDomain = returnDomain();

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

        // Get the category table
        const refreshCategoryTable = () => {
          const returnDomain = require('../common/domainString')
          const selectedDomain = returnDomain();
          axios.get(selectedDomain + 'category/')
            .then(
              response => {
                const data = response.data;
                const categoryHashMap = {};
      
                data.forEach(category => {
                  categoryHashMap[category.category_id] = category.category_name;
                });
                const dynamicCategoryOptions = Object.entries(categoryHashMap).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ));
                setDynamicCategory(dynamicCategoryOptions);
              })
            .catch(error => {
              toast.error("ERROR: Failed to refresh Category table");
              console.log(error);
            });
        }
      
          //handlers
          function handleCancel() {
            // hide the overlay
            document.getElementById("myOverlay").style.display ="none";
          }
      
        // Get the category table
        useEffect(() => {
          const returnDomain = require('../common/domainString')
          const selectedDomain = returnDomain();
          axios.get(selectedDomain + 'category/')
            .then(
              response => {
                const data = response.data;
                const categoryHashMap = {};
      
                data.forEach(category => {
                  categoryHashMap[category.category_id] = category.category_name;
                });
                const dynamicCategoryOptions = Object.entries(categoryHashMap).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ));
                setDynamicCategory(dynamicCategoryOptions);
              })
            .catch(error => {
              toast.error("ERROR: Failed to refresh Category table");
              console.log(error);
            });
        }, []);

  function openFormReserveSelectedItems() {
    const checkboxes = document.querySelectorAll('input[name="reservableItems"]:checked');
    const backpackList = document.getElementById('userbackpackList');
    backpackList.innerHTML = '';
    if (checkboxes.length === 0) {
      backpackList.innerHTML = '<li>No items selected</li>';
    } else {
      checkboxes.forEach(checkbox => {
        const itemName = checkbox.parentNode.parentNode.querySelector('h2').textContent;
        const itemCode = checkbox.parentNode.parentNode.querySelector('h3').textContent;
        const listItem = document.createElement('li');
        listItem.textContent = `${itemName} (${itemCode})`;
        backpackList.appendChild(listItem);
      });
      // const borrowButtons = document.createElement('div');
      // borrowButtons.className = borrow.buttons;
      // const confirmBtn = document.createElement('input');
      // confirmBtn.className = `${borrow.action_btn} ${borrow.confirm}`;
      // confirmBtn.type = 'submit';
      // confirmBtn.value = 'Confirm';
      // confirmBtn.addEventListener('click', (event) => {
      //   event.preventDefault();
      //   handleReservation();
      //   document.getElementById("reserveOverlay").style.display = "none";
      // });
      // const cancelBtn = document.createElement('input');
      // cancelBtn.className = `${borrow.action_btn} ${borrow.cancel}`;
      // cancelBtn.type = 'submit';
      // cancelBtn.value = 'Cancel';
      // cancelBtn.addEventListener('click', () => {
      //   document.getElementById("reserveOverlay").style.display = "none";
      // });
      // borrowButtons.appendChild(confirmBtn);
      // borrowButtons.appendChild(cancelBtn);
      // backpackList.appendChild(borrowButtons);
    }
    document.getElementById("userReserveOverlay").style.display = "block";
  }

  function handleItemCategory(event) {
    setSelectedCategory(event.target.value);
  }

  // Filter items based on selected category
const filteredItems = selectedCategory === 'Default'
? items
: items.filter(item => item.category.category_id === Number(selectedCategory));

  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          data-react-helmet="true"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://www.w3schools.com/w3css/4/w3.css"
          data-react-helmet="true"
        />
      </Helmet>
      <nav>
        <div className="logo-name">
          <div className="logo-image">
            <img src="images/logo.png" alt="" />
          </div>
          <span className="logo_name">KLIA Inventory System</span>
        </div>
        <div className="menu-items">
          <ul className="navLinks">
            <li>
              <a href="/Userdashboard">
                <i className="bx bxs-dashboard icon" />
                <span className="link-name">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/Userreserve">
                <i className="bx bxs-shopping-bags icon" />
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
            <h1>Reserve Items</h1>
          </div>
        </div>
        <div className={inventory.dashContent}>
          <div className={inventory.activity} style={{marginTop: '100px'}}>
            <div className={inventory.title}>
              <i className="bx bxs-shopping-bags" />
              <span className={inventory.text}>Reserve Items</span>
            </div>
          </div>
          {/* <div className={userreserve.inventory}>
        <p>For Selected Items</p>
      </div>
      <div>
        <button className={`${userreserve.check} ${userreserve.category}`} onClick={openFormUserBackpack}>
          <i className="bx bxs-backpack icon" />
          Check Backpack
        </button>
      </div> */}
          <div className={userreserve.inventory}>
            <p>Step 1. Select or unselect the items to be borrow or reserve</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
  <div style={{ marginBottom: "10px" }}>
    <select id="categoryFilterDropdown" onChange={handleItemCategory}>
      <option value="Default">Item Category Filter/Default</option>
      {dynamicCategory}
    </select>
  </div>

          <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: "10px" }}>
            <button className={`${userreserve.check} ${userreserve.item}`} onClick={() => checkAll(true)}>
              <i className="bx bxs-select-multiple icon" />
              <a
                href="javascript:checkall('test','reservableItems',true)"
                style={{ textDecoration: "none" }}
              >
                Select All
              </a>
            </button>
            <button className={`${userreserve.delete} ${userreserve.item}`} onClick={() => checkAll(false)}>
              <i className="bx bxs-x-square icon" />
              <a
                href="javascript:checkall('test','reservableItems',false)"
                style={{ textDecoration: "none" }}
              >
                UnSelect All
              </a>
            </button>
          </div>

          <div style={{ height: "440px", overflowY: "auto", overflowX: "hidden", maxWidth: "calc(100vw - 20px)" }}>
  <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", margin: "-10px" }}>
    {filteredItems.map((listeditem, index) => (
      <div
        key={index}
        className={`${borrow.card} w3-hover-shadow`}
        style={{ margin: "10px", flex: "0 0 calc(25% - 20px)", cursor: "pointer", minHeight: "200px" }} // added minHeight property
        onClick={() => {
          const selectedIndex = selectedItems.indexOf(listeditem.item_code);
          if (selectedIndex === -1) {
            setSelectedItems([...selectedItems, listeditem.item_code]);
          } else {
            const newSelectedItems = [...selectedItems];
            newSelectedItems.splice(selectedIndex, 1);
            setSelectedItems(newSelectedItems);
          }
          console.log(selectedItems)
        }}
      >
        <div className={borrow.cardDivider}>
        <div className={borrow.cardText}>
          <h2>{listeditem.item_name}</h2>
          <h3>ITEM-{listeditem.item_code}</h3>
          <h2>{listeditem.category.category_name}</h2>
          </div>
          <input
            id={`${listeditem.item_code}`}
            input name="reservableItems"
            className={borrow.radio}
            type="checkbox"
            checked={selectedItems.includes(listeditem.item_code)}
            onChange={() => {
              const selectedIndex = selectedItems.indexOf(listeditem.item_code);
              if (selectedIndex === -1) {
                setSelectedItems([...selectedItems, listeditem.item_code]);
              } else {
                const newSelectedItems = [...selectedItems];
                newSelectedItems.splice(selectedIndex, 1);
                setSelectedItems(newSelectedItems);
              }
              console.log(selectedItems)
            }}
          />
        </div>
        <div className="card-section" style={{ width: 300 }}>
          {/* <div className={borrow.category}>
            <button className={`${borrow.reset} ${borrow.category}`} onClick={openFormReserve}>
              <i className="bx bxs-file" />
              Reserve
            </button>
            <button className={`${borrow.update} ${borrow.category}`} onClick={openFormBorrow}>
              <i className="bx bxs-backpack" />
              Borrow Now
            </button>
          </div> */}
        </div>
      </div>
    ))}
  </div>
</div>


</div>

          <hr />
          <div className={userreserve.inventory}>
            <p>Step 2. Perform an action</p>
          </div>
          <div className={userreserve.row2}>
            <button
              // className={`${userreserve.update} ${userreserve.category}`}
              // onClick={(event) => {
              //   // const queryParams = new URLSearchParams();

              //   handleReservation()
              //   // selectedItems.forEach((itemCode) => {
              //   //   queryParams.append("item", itemCode);
              //   // });
              //   // const url = `/Reservation?${queryParams.toString()}`;
              //   // window.location.href = url;
              // }}
              className={`${userreserve.update} ${userreserve.category}`}
              onClick={(event) => {
                // const queryParams = new URLSearchParams();
                // handleReservation()
                if (selectedItems.length === 0) {
                  event.preventDefault();
                } else {
                  console.log("Clicked");
                  openFormReserveSelectedItems();
                }
                // selectedItems.forEach((itemCode) => {
                //   queryParams.append("item", itemCode);
                // });
                // const url = `/Reservation?${queryParams.toString()}`;
                // window.location.href = url;
              }}
            > <i className="bx bxs-receipt icon" />
              Reserve Selected Items</button>
          </div>
        </div>
      </section>
      <div id="myOverlay" className={userreserve.overlay}>
        <div className={userreserve.wrap}>
          <h2 style={{marginTop: -5, fontSize: '2em', textAlign: 'center', padding: 0}}>Change Password</h2>
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



      <div id="userReserveOverlay" class={userreserve.userReserveOverlay}>

        <div class={userreserve.userReserveWrap}>
          <h1 id="reserveh1">
            <i className="bx bxs-info-circle" style={{margin: 5 }}/>
            List of Items to be Reserved
          </h1>
          {/* <h2 id="reserveh2">Reserve Selected Item/s</h2> */}
          <div className={userreserve.userbackpack} style={{ border: '3px solid #FFCC66', borderRadius: 10}}>
            <ol id="userbackpackList" className={userreserve.userbackpacklist}>
              <li>Ball</li>
              <li>Projector</li>
              <li>Chess</li>
              <li>Jumping Ropes</li>
            </ol>
          </div>
          <form>
            <div className={userreserve.buttons}>
              <input
                className={`${userreserve.action_btn} ${userreserve.confirm}`}
                type="submit"
                value="Confirm"
                onClick={(event) => {
                  // const queryParams = new URLSearchParams();
                  handleReservation()
                  // openFormReserve()
                  // selectedItems.forEach((itemCode) => {
                  //   queryParams.append("item", itemCode);
                  // });
                  // const url = `/Reservation?${queryParams.toString()}`;
                  // window.location.href = url;
                }}
              />
              <input
                className={`${userreserve.action_btn} ${userreserve.cancel}`}
                type="submit"
                value="Cancel"
              />
            </div>
          </form>
        </div>

      </div>

      {/* <div id="userBackpackOverlay" className={userreserve.userBackpackOverlay}>
    <div className={userreserve.userBackpackWrap}>
      <h1 id={userreserve.userbackpackh1}>Items Borrowed</h1>
      <div className={userreserve.userbackpack}>
        <ol id="backpackList" className={userreserve.userbackpacklist}>
          <li>Ball</li>
          <li>Projector</li>
          <li>Chess</li>
          <li>Jumping Ropes</li>
        </ol>
      </div>
      <form>
        <div className={userreserve.buttons}>
          <input
            className={`${userreserve.reset } ${userreserve.category}`}
            type="submit"
            value="Close"
          />
        </div>
      </form>
    </div>
  </div> */}
    </div>

  )
}

//overlays

function openForm() {
  document.getElementById("myOverlay").style.display = "block";
}

function openFormUserBackpack() {
  const checkboxes = document.querySelectorAll('input[name="reservableItems"]:checked');
  const backpackList = document.getElementById('backpackList');
  backpackList.innerHTML = '';
  if (checkboxes.length === 0) {
    backpackList.innerHTML = '<li>No items selected</li>';
  } else {
    checkboxes.forEach(checkbox => {
      const itemName = checkbox.parentNode.parentNode.querySelector('h2').textContent;
      const itemCode = checkbox.parentNode.parentNode.querySelector('h3').textContent;
      const listItem = document.createElement('li');
      listItem.textContent = `${itemName} (${itemCode})`;
      backpackList.appendChild(listItem);
    });
  }
  document.getElementById("userBackpackOverlay").style.display = "block";
}

function openFormUserReserve() {
  document.getElementById("userReserveOverlay").style.display = "block";
}

function openFormReserve() {
  document.getElementById("reserveOverlay").style.display = "block";
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

export default Userreserve
