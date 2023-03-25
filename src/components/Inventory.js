import React, { useEffect, useState } from 'react';
import inventory from '../css/inventory.module.css';
import '../css/overlay.css';
import axios from "axios";
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

  const id = sessionStorage.getItem('sessionid')
  console.log("Session ID: " + id)

function Inventory() {

  // states:
  const navigate = useNavigate();
  const[items, setItem] = useState([])
  const[itemCode, setItemCode] = useState("")
  const[itemName, setItemName] = useState("")
  const[itemCondition, setItemCondition] = useState("")
  const[itemCategory, setItemCategory] = useState("")
  const[conditionFilter, setConditionFilter] = useState('')
  //const[status, setStatus] = useState("")

  // hook
  useEffect(() => {
    refreshInventoryTable();
  }, []);

  // Get The Inventory
  const refreshInventoryTable = () =>{
    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    axios.get(selectedDomain + '/inventory/' + conditionFilter, {headers:{'sessionid': id}})
    .then(
    response => {
        setItem(response.data);
    })
    .catch(error => {
      console.error(error);
    });
}
  // info handlers
  function handleItemName(event){
    setItemName(event.target.value);
  }

  function handleItemCondition(event){
    setItemCondition(event.target.value);
  }

  function handleItemCategory(event){
    setItemCategory(event.target.value);
  }

  function handleConditionFilter(event){
    setConditionFilter(event.target.value);
  }

  function handleTableFilter(event){
    event.preventDefault();
    refreshInventoryTable();
  }

  // + Add Item using axios.post
  function handleSubmitAddItem(event){
    event.preventDefault();
    const dataPostObj = {
      item_name: itemName,
      item_condition: itemCondition,
      category: itemCategory, // num
      status: "TEST_STATUS"
    }
    const dataPost = [
      dataPostObj
    ]
    console.log(dataPost);
    console.log(itemName);
    console.log(itemCondition);
    console.log(itemCategory);

    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    axios.post(selectedDomain + '/inventory/', dataPost, {headers:{'sessionid': id}})
    .then((response) => {
        refreshInventoryTable();
        document.getElementById("addItemsOverlay").style.display ="none";
        console.log("AXIOS.POST SUCCESSFUL: " + response);
    })
    .catch((error) => {
      console.log("INSIDE ERROR!!!");
      console.log(error);
    });
  } // end of handle submit function

  // IN-ROW buttons
  // update
  function updateItem(event) {
    event.preventDefault();
    const item_code = document.getElementById("submitUpdateItem").getAttribute("data-item-code");
    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    console.log(selectedDomain + item_code);
    console.log("Item_Code is: " + item_code);
    const dataPut = {
      item_name: itemName,
      item_condition: itemCondition,
      category: 1, // changed to hash map number later, for now hardcoded
      status: "TEST_STATUS"
    }
    console.log(dataPut);
    console.log(itemName);
    console.log(itemCondition);
    console.log(itemCategory);

    axios.put(selectedDomain + '/inventory/' + item_code, dataPut, {headers:{'sessionid': id}})
    .then((response) => {
      refreshInventoryTable();
      document.getElementById("updateItemsOverlay").style.display ="none";
      console.log("AXIOS.PUT SUCCESSFUL: " + response);
    })
    .catch((error) => {
      console.log("INSIDE ERROR!!!");
      console.log(error);
    });
  }
  // generate QR - front-end's job???

  // delete
  function deleteItem() {
    const item_code = document.getElementById("submitDeleteItem").getAttribute("data-item-code");
    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    console.log(selectedDomain + item_code);
    console.log("Item_Code is: " + item_code);
    axios.delete(selectedDomain + '/inventory/' + item_code, {headers:{'sessionid': id}})
    .then((response) => {
      refreshInventoryTable();
      document.getElementById("deleteItemsOverlay").style.display ="none";
      console.log("AXIOS.DELETE SUCCESSFUL: " + response);
    })
    .catch((error) => {
      console.log("INSIDE ERROR!!!");
      console.log(error);
    });
  }

const roleCompare = sessionStorage.getItem('role')
if (roleCompare === "User"){
  navigate('/Login')
  return
}

// cancel Button Handlers:

return (
<>
  <nav>
    <div className={inventory.logoName}>
      <div className={inventory.logoImage}>
        <img src="images/logo.png" alt="" />
      </div>
      <span className={inventory.logo_name}>KLIA Inventory System</span>
    </div>
    <div className={inventory.menuItems}>
      <ul className={inventory.navLinks}>
        <li>
          <a href="/Index">
            <i className="bx bxs-dashboard icon" />
            <span className={inventory.linkName}>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/Borrow">
            <i className="bx bxs-backpack icon" />
            <span className={inventory.linkName}>Borrow Items</span>
          </a>
        </li>
        <li>
          <a href="/Return">
            <i className="bx bxs-book-content icon" />
            <span className={inventory.linkName}>Return Items</span>
          </a>
        </li>
        <li>
          <a href="/Inventory">
            <i className="bx bx-box icon" />
            <span className={inventory.linkName}>Inventory</span>
          </a>
        </li>
        <li>
          <a href="/Users">
            <i className="bx bxs-user icon" />
            <span className={inventory.linkName}>Users</span>
          </a>
        </li>
        <li>
          <a className={inventory.openbtn} onClick={openForm}>
            <i className="bx bxs-lock-alt icon" />
            <span className={inventory.linkName}>Change Password</span>
          </a>
        </li>
      </ul>
      <ul className={inventory.logoutMode}>
        <li>
          <a href="/Login">
            <i className="bx bxs-log-out icon" />
            <span className={inventory.linkName}>Logout</span>
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
  <section className={inventory.dashboard}>
    <div className={inventory.top}>
      <i className={`${inventory.sidebarToggle} uil uil-bars`} />
      <div className={inventory.searchBox}>
        <h1>Inventory</h1>
      </div>
    </div>
    <div className={inventory.dashContent}>
      <div className={inventory.activity}>
        <div className={inventory.title}>
          <i className="bx bx-box icon" />
          <span className={inventory.text}>Inventory</span>
        </div>
        {/* ROW 1 */}
        <div className={inventory.inventory}>
          <p>*NOTE: Ctrl + F to find equipments</p>
        </div>
        {/* ROW 2 */}
        <div className={inventory.row2}>
          <div className="row-1-select">
            <form onSubmit={handleTableFilter}>
              <select id="conditionFilterDropdown" onChange={handleConditionFilter}>
                <option value="select">Item Condition Filter</option>
                <option value="Working">Working</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Retired">Retired</option>
                <option value="Damaged">Damaged</option>
                <option value="Lost">Lost</option>
              </select>
              <button 
              id="conditionFilterApply"
              type="submit">
                Apply Filter
              </button>
            </form>
            
          </div>
          <div className={inventory.row2btns}>
            <button
              className={`${inventory.delete} ${inventory.category}`}
              onClick={openFormDeleteCategory}
            >
              <i className="bx bxs-trash-alt icon" />
              Delete Category
            </button>
            <button className={`${inventory.add} ${inventory.category}`} onClick={openFormAddCategory}>
              <i className="bx bxs-category icon" />
              Add Category
            </button>
            <button className={`${inventory.add} ${inventory.item}`} onClick={openFormAddItems}>
              <i className="bx bx-plus icon" />
              Add Item
            </button>
          </div>
        </div>
        <div className={inventory.activityData}>
          <table className={inventory.table}>
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Item Condition</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>

              {/* Testing Grounds - kyle*/}
              {
                items.map(
                  row => (
                    <tr key={row.item_code}>
                      <td>{row.item_code}</td>
                      <td>{row.item_name}</td>
                      <td>{row.item_condition}</td>
                      <td>{row.category.category_name}</td>
                      <td>
                        <div className={`${inventory.category}`}>
                          <button className={`${inventory.update} ${inventory.category}`}
                            onClick={(e) =>openFormUpdateItems(row.item_code)}>
                            <i className="bx bxs-pencil action"></i>
                            Update
                          </button>
                          <button className={`${inventory.generate} ${inventory.category}`} 
                            onClick={openFormGenerateQR}>
                            <i className="bx bx-qr"></i> Generate QR
                          </button>
                          <button className={`${inventory.del} ${inventory.category}`}
                            onClick={(e) =>openFormDeleteItems(row.item_code)}>
                            <i className="bx bxs-trash-alt icon"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              }

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
  <div id="myOverlay" className={inventory.overlay}>
    <div className={inventory.wrap}>
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
        <div className={inventory.buttons}>
          <input
            className={`${inventory.action_btn} ${inventory.confirm}`}
            type="submit"
            value="Confirm"
          />
          <input
            className={`${inventory.action_btn} ${inventory.cancel}`}
            type="submit"
            value="Cancel"
          />
        </div>
      </form>
    </div>
  </div>
  <div id="deleteItemsOverlay" className={inventory.deleteItemsOverlay}>
    <div className={inventory.deleteItemsWrap}>
      <h1 id="deleteh1">
        <i className="bx bxs-error icon" /> Warning!{" "}
      </h1>
      <h2 id="deleteh2">Would you like to delete this item?</h2>
      <form>
        <div className={inventory.buttons}>
          <input
            id="submitDeleteItem"
            className={`${inventory.action_btn} ${inventory.confirm}`}
            onClick={() => deleteItem()}
            data-item-code=''
            type="submit"
            value="Confirm"
          />
          <input
            id="cancelDeleteItem"
            className={`${inventory.action_btn} ${inventory.cancel}`}
            type="button"
            value="Cancel"
          />
        </div>
      </form>
    </div>
  </div>
  <div id="updateItemsOverlay" className={inventory.updateItemsOverlay}>
    <div className={inventory.updateItemsWrap}>
      <h2>Update Item</h2>
      <form id="updateItemsOverlayForm" onSubmit={updateItem}>
        <label htmlFor="username">Item Name:</label>
        <input type="text" placeholder="Enter item name" id="updateItem" 
        onChange={handleItemName}/>
        <label htmlFor="username">Condition:</label>
        <div>
          <select className={inventory.dropdown} onChange={handleItemCondition}>
            <option value="select">Item Condition Filter</option>
            <option value="Working">Working</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Retired">Retired</option>
            <option value="Damaged">Damaged</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <div className={inventory.buttons}>
          <input
            id="submitUpdateItem"
            className={`${inventory.action_btn} ${inventory.edit}`}
            data-item-code=''
            type="submit"
            value="Update"
          />
          <input
            className={`${inventory.action_btn} ${inventory.cancel}`}
            type="button"
            value="Cancel"
          />
        </div>
      </form>
    </div>
  </div>
  <div id="addItemsOverlay" className={inventory.addItemsOverlay}>
    <div className={inventory.addItemsWrap}>
      <h2>Add Item</h2>
      <form id="addItemsOverlayForm" onSubmit={handleSubmitAddItem}>
        <label htmlFor="username">Item Name:</label>
        <input type="text" placeholder="Enter item name" 
        id="addItem" 
        onChange={handleItemName} 
        />
        <label htmlFor="username">Condition:</label>
        <div>
          <select id="selectItemCondition" onChange={handleItemCondition} className={inventory.dropdown} >
            <option value="Default">Select Item Condition</option>
            <option value="Working">Working</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Retired">Retired</option>
            <option value="Damaged">Damaged</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <label htmlFor="username">Category:</label>
        <div>
          <select id="selectItemCategory" onChange={handleItemCategory} className={inventory.dropdown}>
            <option value="Default">Select Item Category</option>
            <option value="1">Sports Athletics</option>
            <option value="2">Construction</option>
            <option value="3">Laboratory</option>
          </select>
        </div>
        <div className={inventory.buttons}>
          <input
            id="submitAddItem"
            className={`${inventory.action_btn} ${inventory.confirm}`}
            type="submit"
            value="Add Item"
          />
          <input
            id="cancelAddItem"
            className={`${inventory.action_btn} ${inventory.cancel}`}
            type="button"
            value="Cancel"
          />
        </div>
      </form>
    </div>
  </div>
  <div id="addCategoryOverlay" className={inventory.addCategoryOverlay}>
    <div className={inventory.addCategoryWrap}>
      <h2>Add Category</h2>
      <form>
        <label htmlFor="username">Category:</label>
        <input type="text" placeholder="Enter category name" id="addCategory" />
        <div className={inventory.buttons}>
          <input
            className={`${inventory.action_btn} ${inventory.confirm}`}
            type="submit"
            value="Add Category"
          />
          <input
            className={`${inventory.action_btn} ${inventory.cancel}`}
            type="submit"
            value="Cancel"
          />
        </div>
      </form>
    </div>
  </div>
  <div id="deleteCategoryOverlay" className={inventory.deleteCategoryOverlay}>
    <div className={inventory.deleteCategoryWrap}>
      <h2>Delete Category</h2>
      <form>
        <label htmlFor="username">Categories:</label>
        <div>
          <select className={inventory.dropdown}>
            <option value="select">Select Item Category</option>
            <option value="cond">Sports Athletics</option>
            <option value="cond">Construction</option>
            <option value="cond">Laboratory</option>
          </select>
        </div>
        <div className={inventory.buttons}>
          <input
            className={`${inventory.action_btn} ${inventory.confirm}`}
            type="submit"
            value="Confirm"
          />
          <input
            className={`${inventory.action_btn} ${inventory.cancel}`}
            type="submit"
            value="Cancel"
          />
        </div>
      </form>
    </div>
  </div>
  <div id="generateQROverlay" className={inventory.generateQROverlay}>
    <div className={inventory.generateQRWrap}>
      <h2>QR Generated</h2>
      <form>
        <div className={inventory.card} style={{ width: "18rem" }}>
          <img
            className="card-img-top"
            src="https://qrcg-free-editor.qr-code-generator.com/main/assets/images/websiteQRCode_noFrame.png"
            alt="Card image cap"
            style={{ height: 300, width: 300 }}
          />
          <div className="card-body"></div>
        </div>
        <div className={inventory.qr}>
          <input
            className={`${inventory.buttonQR} ${inventory.confirm}`}
            type="submit"
            value="Proceed"
          />
        </div>
      </form>
    </div>
  </div>
</>

  )
}

//overlays

function openForm() {
    document.getElementById("myOverlay").style.display ="block";
}

function openFormDeleteItems(item_code) {
  document.getElementById("submitDeleteItem").setAttribute("data-item-code", item_code);
  console.log("Succesfully set the attribute of data-item-code");
  document.getElementById("deleteItemsOverlay").style.display = "block";
}


function openFormUpdateItems(item_code) {
  document.getElementById("submitUpdateItem").setAttribute("data-item-code", item_code);
  console.log("Succesfully set the attribute of data-item-code");
  document.getElementById("updateItemsOverlay").style.display ="block";
}

function openFormAddItems() {
    document.getElementById("addItemsOverlay").style.display ="block";
}

function openFormAddCategory() {
    document.getElementById("addCategoryOverlay").style.display ="block";
}

function openFormDeleteCategory() {
    document.getElementById("deleteCategoryOverlay").style.display ="block";
}

function openFormGenerateQR() {
    document.getElementById("generateQROverlay").style.display ="block";
}

export default Inventory
