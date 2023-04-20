import React, { useEffect, useState } from 'react';
import inventory from '../css/inventory.module.css';
import '../css/overlay.css';
import axios from "axios";
import borrow from '../css/borrow.module.css'
import '../css/overlay.css'
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from "../services/useRequireAuth";


function Borrow() {
  // states:
  useRequireAuth(["Admin", "Editor"]);
  const [items, setItem] = useState([])
  const [selectedItems, setSelectedItems] = useState([]);
  const id = sessionStorage.getItem('sessionid')
  const returnDomain = require('../common/domainString')
  const selectedDomain = returnDomain();
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    setUserRole(role);
  }, []);

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


  function handleReservation() {
    for (let x of selectedItems) {
      var email
      if (document.getElementById("number").value == null) {
        email = ""
      }
      else {
        email = document.getElementById("number").value
      }
      const dataPostObj = {
        email: email,
        item_code: x,
        claim: 0 // num
      }

      const dataPost = [
        dataPostObj
      ]
      const returnDomain = require('../common/domainString')
      const selectedDomain = returnDomain();
      axios.post(selectedDomain + 'reservation/', dataPost)
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

  function handleBorrow() {
    for (let x of selectedItems) {
      var email
      if (document.getElementById("number").value == null) {
        email = ""
      }
      else {
        email = document.getElementById("number").value
      }
      const dataPostObj = {
        email: email,
        item_code: x
      }

      const dataPost = [
        dataPostObj
      ]
      const returnDomain = require('../common/domainString')
      const selectedDomain = returnDomain();
      axios.post(selectedDomain + 'history/', dataPost)
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

  // function openFormBackpack() {
  //   const checkboxes = document.querySelectorAll('input[name="reservableItems"]:checked');
  //   const backpackList = document.getElementById('backpackList');
  //   backpackList.innerHTML = '';
  //   if (checkboxes.length === 0) {
  //     backpackList.innerHTML = '<li>No items selected</li>';
  //   } else {
  //     checkboxes.forEach(checkbox => {
  //       const itemName = checkbox.parentNode.parentNode.querySelector('h2').textContent;
  //       const itemCode = checkbox.parentNode.parentNode.querySelector('h3').textContent;
  //       const listItem = document.createElement('li');
  //       listItem.textContent = `${itemName} (${itemCode})`;
  //       backpackList.appendChild(listItem);
  //     });
  //   }
  //   document.getElementById("backpackOverlay").style.display = "block";
  // }

  function openFormBorrowSelectedItems() {
    const checkboxes = document.querySelectorAll('input[name="reservableItems"]:checked');
    const backpackList = document.getElementById('backpackList2');
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
      //   handleBorrow();
      //   document.getElementById("borrowOverlay").style.display = "none";
      // });
      // const cancelBtn = document.createElement('input');
      // cancelBtn.className = `${borrow.action_btn} ${borrow.cancel}`;
      // cancelBtn.type = 'submit';
      // cancelBtn.value = 'Cancel';
      // cancelBtn.addEventListener('click', () => {
      //   document.getElementById("borrowOverlay").style.display = "none";
      // });
      // borrowButtons.appendChild(confirmBtn);
      // borrowButtons.appendChild(cancelBtn);
      // backpackList.appendChild(borrowButtons);
    }
    document.getElementById("borrowOverlay").style.display = "block";
  }

  function openFormReserveSelectedItems() {
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
    document.getElementById("reserveOverlay").style.display = "block";
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
      axios.put(selectedDomain +'/userChangePassword/', data)
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

    function handleItemCategory(event) {
      setSelectedCategory(event.target.value);
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

  // Handle category filter change
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
        <div className={borrow.logoName}>
          <div className={borrow.logoImage}>
            <img src="images/logo.png" alt="" />
          </div>
          <span className={borrow.logo_name}>KLIA Inventory System</span>
        </div>
        <div className={borrow.menuItems}>
          <ul className={borrow.navLinks}>
            <li>
              <a href="/Index">
                <i className="bx bxs-dashboard icon" />
                <span className={borrow.linkName}>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/Borrow">
                <i className="bx bxs-shopping-bags" />
                <span className={borrow.linkName}>Borrow Items</span>
              </a>
            </li>
            <li>
              <a href="/Return">
                <i className="bx bxs-book-content icon" />
                <span className={borrow.linkName}>Return Items</span>
              </a>
            </li>
            <li>
              <a href="/Inventory">
                <i className="bx bx-box icon" />
                <span className={borrow.linkName}>Inventory</span>
              </a>
            </li>
            <li>
              <a href="/Users">
                <i className="bx bxs-user icon" />
                <span className={borrow.linkName}>Users</span>
              </a>
            </li>
            <li>
              <a className="openbtn" onClick={openForm}>
                <i className="bx bxs-lock-alt icon" />
                <span className={borrow.linkName}>Change Password</span>
              </a>
            </li>
          </ul>
          <ul className={borrow.logOutMode}>
            <li>
            <a href="#" onClick={handleLogout}>
                <i className="bx bxs-log-out icon" />
                <span className={borrow.linkName}>Logout</span>
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
      <section className={borrow.dashboard}>
        <div className={borrow.top}>
          <i className={`${borrow.sidebarToggle} uil uil-bars`} />
          <div className={borrow.searchBox}>
            <h1>Borrow Items</h1>
          </div>
        </div>
        <div className={borrow.dashContent}>
          <div className={borrow.activity}>
            <div className={borrow.title}>
              <i className="bx bxs-shopping-bags" />
              <span className={borrow.text}>Borrow Items</span>
            </div>
          </div>
          {/* ROW 1 */}
          <div className={borrow.inventory}>
            <p>
              Step 1. Input the borrower/Reservee's email
            </p>
          </div>
          <div>
            <form action="/action_page.php">
              <input
                className="email"
                type="text"
                id="number"
                name="email"
                placeholder="Email"
                required
              />
            </form>
          </div>
          {/* <div className={borrow.inventory}>
            <p>For Selected Items</p>
          </div>
          <div>
            <button className={`${borrow.check} ${borrow.category}`} onClick={openFormBackpack}>
              <i className="bx bxs-backpack icon" />
              Check Backpack
            </button>
          </div> */}
          <hr />
          <div className={borrow.inventory}>
            <p>Step 2. Select or unselect the items to be borrow or reserve</p>
          </div>

          <select id="categoryFilterDropdown" onChange={handleItemCategory}>
                      <option value="Default">Item Category Filter/Default</option>
                      {dynamicCategory}
                    </select>
         
          <button className={`${borrow.check} ${borrow.item}`} onClick={() => checkAll(true)}>
            <i className="bx bxs-select-multiple" />
            <a
              href="javascript:checkall('test','reservableItems',true)"
              style={{ textDecoration: "none" }}
            >
              Select All
            </a>
          </button>
          <button className={`${borrow.delete} ${borrow.item}`} onClick={() => checkAll(false)}>
            <i className="bx bxs-x-square" />
            <a
              href="javascript:checkall('test','reservableItems',false)"
              style={{ textDecoration: "none" }}
            >
              UnSelect All
            </a>
          </button>


          <tbody>
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {filteredItems.map(listeditem => (
        <div className={`${borrow.card} w3-hover-shadow`} style={{ margin: "10px" }}>
          <div className={borrow.cardDivider}>
            <h2>{listeditem.item_name}</h2>
            <h3>ITEM-{listeditem.item_code}</h3>
            <h2>{listeditem.category.category_name}</h2>
            <input
              id={`${listeditem.item_code}`}
              input name="reservableItems"
              className={borrow.radio}
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
  </tbody>
          <hr />
          <div className={borrow.inventory}>
            <p>Step 3. Perform an action</p>
          </div>
           {/* ROW 2 */}
           <div className={borrow.row2}>
            <button
              className={`${borrow.update} ${borrow.category}`}
              onClick={(event) => {
                // const queryParams = new URLSearchParams();
                // handleReservation()
                if (selectedItems.length === 0) {
                  event.preventDefault();
                } else {
                  openFormReserveSelectedItems();
                }
                // selectedItems.forEach((itemCode) => {
                //   queryParams.append("item", itemCode);
                // });
                // const url = `/Reservation?${queryParams.toString()}`;
                // window.location.href = url;
              }}
            >
              <i className="bx bxs-check-circle" />
              Reserve Selected Items
            </button>
            <button
              className={`${borrow.update} ${borrow.category}`}
              onClick={(event) => {
                // const queryParams = new URLSearchParams();
                // handleBorrow()
                // openFormBorrow()
                if (selectedItems.length === 0) {
                  event.preventDefault();
                } else {
                  openFormBorrowSelectedItems();
                }
                // selectedItems.forEach((itemCode) => {
                //   queryParams.append("item", itemCode);
                // });
                // const url = `/Reservation?${queryParams.toString()}`;
                // window.location.href = url;
              }}
            >
              <i className="bx bxs-check-circle" />
              Borrow Selected Items
            </button>
          </div>
          <hr />
          <div className={borrow.inventory}>
            <p>For Reserved Items, Navigation Button to View Reservation Table</p>
          </div>
          <button
              className={`${borrow.check} ${borrow.category}`}
              onClick={(event) => {
                const url = `/Reservation`;
                window.location.href = url;
              }}
            >
              <i className="bx bxs-check-circle" />
              Borrow Reservation
            </button>

        </div>
      </section>
      <div id="myOverlay" className={borrow.overlay}>
        <div className={borrow.wrap}>
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
      <div id="reserveOverlay" className={borrow.reserveOverlay}>
        <div className={borrow.reserveWrap}>
          <h1 id="reserveh1">
            <i className="bx bxs-info-circle" />
            List of Items to be Reserved
          </h1>
          {/* <h2 id="reserveh2">Reserve Selected Item/s</h2> */}
          <div className={borrow.backpack}>
            <ol id="backpackList" className={borrow.backpacklist}>
              <li>Ball</li>
              <li>Projector</li>
              <li>Chess</li>
              <li>Jumping Ropes</li>
            </ol>
          </div>
          <form>
            <div className={borrow.buttons}>
              <input
                className={`${borrow.action_btn} ${borrow.confirm}`}
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
                className={`${borrow.action_btn} ${borrow.cancel}`}
                type="submit"
                value="Cancel"
              />
            </div>
          </form>
        </div>
      </div>
      <div id="borrowOverlay" className={borrow.borrowOverlay}>
        <div className={borrow.borrowWrap}>
          {/* <h2 id="borrowh2">List of items to be borrowed</h2> */}
          <h1 id="reserveh1">
            <i className="bx bxs-info-circle" />
            List of Items to be Borrowed
          </h1>
          <div className={borrow.backpack}>
            <ol id="backpackList2" className={borrow.backpacklist}>
              <li>Ball</li>
              <li>Projector</li>
              <li>Chess</li>
              <li>Jumping Ropes</li>
            </ol>
          </div>
          <form>
            {/* <div className={borrow.card}>
              <img
                className="card-img-top"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUT4dzVBCJqmEcFm4gWT5dLwdTb3pTCTRNhA&usqp=CAU"
                alt="Card image cap"
                style={{ height: 300, width: 300 }}
              />
              <div className="card-body"></div>
            </div> */}
            <div className={borrow.buttons}>
              <input
                className={`${borrow.action_btn} ${borrow.confirm}`}
                type="submit"
                value="Confirm"
                onClick={(event) => {
                  // const queryParams = new URLSearchParams();
                  handleBorrow()
                  // openFormBorrow()
                  // selectedItems.forEach((itemCode) => {
                  //   queryParams.append("item", itemCode);
                  // });
                  // const url = `/Reservation?${queryParams.toString()}`;
                  // window.location.href = url;
                }}
              />
              <input
                className={`${borrow.action_btn} ${borrow.cancel}`}
                type="submit"
                value="Cancel"
              />
            </div>
          </form>
        </div>
      </div>
      <div id="backpackOverlay" className={borrow.backpackOverlay}>
        <div className={borrow.backpackWrap}>
          <h1 id="backpackh1">Selected Items</h1>
          <div className={borrow.backpack}>
            <ol id="backpackList" className={borrow.backpacklist}>
              <li>Ball</li>
              <li>Projector</li>
              <li>Chess</li>
              <li>Jumping Ropes</li>
            </ol>
          </div>
          <form>
            {/* <div className={borrow.buttons}>
              <input
                className={`${borrow.reset} ${borrow.category}`}
                type="submit"
                value="Reserve Now"
                onClick={(event) => {
                  const queryParams = new URLSearchParams();
                  selectedItems.forEach((itemCode) => {
                    console.log(itemCode);
                    queryParams.append("item", itemCode);
                  });
                  const url = `/Reservation?${queryParams.toString()}`;
                  window.location.href = url;
                }}
              />
              <input
                className={`${borrow.update} ${borrow.category}`}
                type="submit"
                value="Borrow Now"
              />
            </div> */}
            {/* <div className={inventory.qr}>
              <div className={inventory.buttons}>
                <input
                  className={`${inventory.buttonQR} ${inventory.confirm}`}
                  type="submit"
                  value="Confirm"
                />
              </div>
            </div> */}
          </form>
        </div>
      </div>
    </div>

  )
}

// Select All

// function checkall(formname, checkname, thestate) {
//     var el_collection = eval(
//       "document.forms." + formname + "." + checkname
//     );
//     for (c = 0; c < el_collection.length; c++)
//       el_collection[c].checked = thestate;
//   }


//overlays

function openForm() {
  document.getElementById("myOverlay").style.display = "block";
}

function openFormReserve() {
  document.getElementById("reserveOverlay").style.display = "block";
}

function openFormBorrow() {
  document.getElementById("borrowOverlay").style.display = "block";
}

export default Borrow
