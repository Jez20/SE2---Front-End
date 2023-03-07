import React, { useEffect, useState } from 'react';
import inventory from '../css/inventory.module.css';
import '../css/overlay.css';
import axios from "axios";


function Inventory() {

  // syntax 1

  // NOTES FOR BACK-END: click the button located in Action column
  // in the inventory table, to get the Data for axios
  
  // states for inventory
    const [itemCode, setItemCode] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemCondition, setItemCondition] = useState("");
    const [status, setStatus] = useState("");

    const getInventory = () => {
      try {
        axios.get("http://127.0.0.1:8000/inventory/", {withCredentials: true})
          .then((response) => {
            console.log(response);
            setItemCode(response.data.item_code);
            setItemName(response.data.item_name);
            setItemCondition(response.data.item_condition);
            setStatus(response.data.status);
          });
      } catch (error) {
        console.error(error);
      }
    };
    
  /*
  // syntax 2
  axios.get("http://127.0.0.1:8000/inventory/", {
    withCredentials: true
  })
    .then(response => {
      const data = response.data;
      // Use the response data to create a table
      const tableBody = document.querySelector('tbody');
      tableBody.innerHTML = createTableRows(data);
    })
    .catch(error => {
      console.error(error);
    });

  function createTableRows(data) {
    return data.map(row => {
      return `
        <tr>
          <td>${row.status}</td>
        </tr>
      `;
    }).join('');
  }
  */
  

    


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
          <a href="/">
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
            <select id={inventory.category}>
              <option value="select">Item Condition Filter</option>
              <option value="cond">Working</option>
              <option value="cond">Maintenance</option>
              <option value="cond">Retired</option>
              <option value="cond">Damaged</option>
              <option value="cond">Lost</option>
            </select>
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

              <tr>
                <td>{itemCode}</td>
                <td>{itemName}</td>
                <td>{itemCondition}</td>
                <td>{status}</td>
                <td><button onClick={getInventory}></button></td>
              </tr>

              <tr>
                <td>Item-001</td>
                <td>Ball</td>
                <td>Working</td>
                <td>Sports Athletics</td>
                <td>
                  <div className={inventory.category}>
                    <button
                      className={`${inventory.update} ${inventory.category}`}
                      onClick={openFormUpdateItems}
                    >
                      <i className="bx bxs-pencil action" />
                      Update
                    </button>
                    <button
                      className={`${inventory.generate} ${inventory.category}`}
                      onClick={openFormGenerateQR}
                    >
                      <i className="bx bx-qr" />
                      Generate QR
                    </button>
                    <button
                      className={`${inventory.del} ${inventory.category}`}
                      onClick={openFormDeleteItems}
                    >
                      <i className="bx bxs-trash-alt icon" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Item-001</td>
                <td>Ball</td>
                <td>Working</td>
                <td>Sports Athletics</td>
                <td>
                  <div className={inventory.category}>
                    <button
                      className={`${inventory.update} ${inventory.category}`}
                      onClick={openFormUpdateItems}
                    >
                      <i className="bx bxs-pencil action" />
                      Update
                    </button>
                    <button
                      className={`${inventory.generate} ${inventory.category}`}
                      onClick={openFormGenerateQR}
                    >
                      <i className="bx bx-qr" />
                      Generate QR
                    </button>
                    <button
                      className={`${inventory.del} ${inventory.category}`}
                      onClick={openFormDeleteItems}
                    >
                      <i className="bx bxs-trash-alt icon" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Item-001</td>
                <td>Ball</td>
                <td>Working</td>
                <td>Sports Athletics</td>
                <td>
                  <div className={inventory.category}>
                    <button
                      className={`${inventory.update} ${inventory.category}`}
                      onClick={openFormUpdateItems}
                    >
                      <i className="bx bxs-pencil action" />
                      Update
                    </button>
                    <button
                      className={`${inventory.generate} ${inventory.category}`}
                      onClick={openFormGenerateQR}
                    >
                      <i className="bx bx-qr" />
                      Generate QR
                    </button>
                    <button
                      className={`${inventory.del} ${inventory.category}`}
                      onClick={openFormDeleteItems}
                    >
                      <i className="bx bxs-trash-alt icon" />
                      Delete
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
  <div id="updateItemsOverlay" className={inventory.updateItemsOverlay}>
    <div className={inventory.updateItemsWrap}>
      <h2>Update Item</h2>
      <form>
        <label htmlFor="username">Item Name:</label>
        <input type="text" placeholder="Enter item name" id="updateItem" />
        <label htmlFor="username">Condition:</label>
        <div>
          <select className={inventory.dropdown}>
            <option value="select">Item Condition Filter</option>
            <option value="cond">Working</option>
            <option value="cond">Maintenance</option>
            <option value="cond">Retired</option>
            <option value="cond">Damaged</option>
            <option value="cond">Lost</option>
          </select>
        </div>
        <div className={inventory.buttons}>
          <input
            className={`${inventory.action_btn} ${inventory.edit}`}
            type="submit"
            value="Update"
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
  <div id="addItemsOverlay" className={inventory.addItemsOverlay}>
    <div className={inventory.addItemsWrap}>
      <h2>Add Item</h2>
      <form>
        <label htmlFor="username">Item Name:</label>
        <input type="text" placeholder="Enter item name" id="addItem" />
        <label htmlFor="username">Condition:</label>
        <div>
          <select className={inventory.dropdown}>
            <option value="select">Select Item Condition</option>
            <option value="cond">Working</option>
            <option value="cond">Maintenance</option>
            <option value="cond">Retired</option>
            <option value="cond">Damaged</option>
            <option value="cond">Lost</option>
          </select>
        </div>
        <label htmlFor="username">Category:</label>
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
            value="Add Item"
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

function openFormDeleteItems() {
    document.getElementById("deleteItemsOverlay").style.display ="block";
}

function openFormUpdateItems() {
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
