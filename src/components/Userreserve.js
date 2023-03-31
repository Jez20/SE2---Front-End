import React, { useState, useEffect } from 'react';
import userreserve from '../css/userreserve.module.css'
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

  // hook
  useEffect(() => {
    refreshInventoryTable();
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

  function handleReservation(){
    for (let x of selectedItems) {
    const dataPostObj = {
      item_code: x,
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
        document.getElementById("addItemsOverlay").style.display ="none";
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
    axios.delete(selectedDomain+ 'logout/')
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
    <div className={userreserve.logoName}>
      <div className={userreserve.logoImage}>
        <img src="images/logo.png" alt="" />
      </div>
      <span className={userreserve.logo_name}>KLIA Inventory System</span>
    </div>
    <div className={userreserve.menuItems}>
      <ul className={userreserve.navLinks}>
        <li>
          <a href="/Userdashboard">
            <i className="bx bxs-dashboard icon" />
            <span className={userreserve.linkName}>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/Userreserve">
            <i className="bx bxs-shopping-bags" />
            <span className={userreserve.linkName}>Reserve Items</span>
          </a>
        </li>
        <li>
          <a className="openbtn" onClick={openForm}>
            <i className="bx bxs-lock-alt icon" />
            <span className={userreserve.linkName}>Change Password</span>
          </a>
        </li>
      </ul>
      <ul className={userreserve.logoutMode}>
        <li>
          <a href="#" onClick={handleLogout}>
            <i className="bx bxs-log-out icon" />
            <span className={userreserve.linkName}>Logout</span>
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
  <section className={userreserve.dashboard}>
    <div className={userreserve.top}>
    <i className={`${userreserve.sidebarToggle} uil uil-bars`} onClick={burger}/>
      <div className={userreserve.searchBox}>
        <h1>Reserve Items</h1>
      </div>
    </div>
    <div className={userreserve.dashContent}>
      <div className={userreserve.activity}>
        <div className={userreserve.title}>
          <i className="bx bxs-shopping-bags" />
          <span className={userreserve.text}>Reserve Items</span>
        </div>
      </div>
      <div className={userreserve.inventory}>
        <p>For Selected Items</p>
      </div>
      <div>
        <button className={`${userreserve.check} ${userreserve.category}`} onClick={openFormUserBackpack}>
          <i className="bx bxs-backpack icon" />
          Check Backpack
        </button>
      </div>
      <div className={userreserve.inventory}>
        <p>Click items to be selected</p>
      </div>

      <button
              className={`${userreserve.update} ${userreserve.category}`}
              onClick={(event) => {
                // const queryParams = new URLSearchParams();
                
                handleReservation()
                // selectedItems.forEach((itemCode) => {
                //   queryParams.append("item", itemCode);
                // });
                // const url = `/Reservation?${queryParams.toString()}`;
                // window.location.href = url;
              }}
            > <i className="bx bxs-check-circle" />
            Reserve Selected Items</button>

      <hr />
                <button className={`${userreserve.check} ${userreserve.item}`} onClick={() => checkAll(true)}>
            <i className="bx bxs-select-multiple" />
            <a
              href="javascript:checkall('test','reservableItems',true)"
              style={{ textDecoration: "none" }}
            >
              Select All
            </a>
          </button>
          <button className={`${userreserve.delete} ${userreserve.item}`} onClick={() => checkAll(false)}>
            <i className="bx bxs-x-square" />
            <a
              href="javascript:checkall('test','reservableItems',false)"
              style={{ textDecoration: "none" }}
            >
              UnSelect All
            </a>
          </button>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
              {

                items.map(
                  listeditem => (

                    <div className={`${userreserve.card} w3-hover-shadow`} style={{ margin: "10px" }}>
                      <div className={userreserve.cardDivider}>
                        <h2>{listeditem.item_name}</h2>
                        <h3>ITEM-{listeditem.item_code}</h3>
                        <input id={`${listeditem.item_code}`} 
                        input name="reservableItems" 
                        className={userreserve.radio} 
                        type="checkbox" 
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
                        />
                      </div>
                      <div className="card-section">
                      </div>
                    </div>

                  )

                )

              }
            </div>
    </div>
  </section>
  <div id="myOverlay" className={userreserve.overlay}>
    <div className={userreserve.wrap}>
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
  
  <div id="userBackpackOverlay" className={userreserve.userBackpackOverlay}>
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
  </div>
</div>

  )
}

//overlays

function openForm() {
    document.getElementById("myOverlay").style.display ="block";
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
    document.getElementById("userBackpackOverlay").style.display ="block";
}

function openFormUserReserve() {
    document.getElementById("userReserveOverlay").style.display ="block";
}

function openFormReserve() {
    document.getElementById("reserveOverlay").style.display ="block";
}

function burger() {
  const body = document.querySelector("body"),
     modeToggle = body.querySelector(".mode-toggle");
  const sidebar = body.querySelector("nav");
  const sidebarToggle = body.querySelector(`.${userreserve.sidebarToggle}`);

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

export default Userreserve
