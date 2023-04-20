import React, { useEffect, useState, useRef } from 'react';
import inventory from '../css/inventory.module.css';
import '../css/overlay.css';
import axios from "axios";
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useRequireAuth } from "../services/useRequireAuth";

import { Container, Card, CardContent, makeStyles, Grid, TextField, Button } from '@material-ui/core';
import QRCode from 'qrcode';
import QrReader from "react-qr-scanner";

const id = sessionStorage.getItem('sessionid')
if (id != null){
  console.log("Session ID is successfully collected - (Inventory.js)");
} else {
  console.log("WARNING: No Session ID found!");
}


function Inventory() {

  //Change Password

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const returnDomain = require('../common/domainString')
  const selectedDomain = returnDomain();

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
    axios.put(selectedDomain +'userChangePassword/', data)
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

  //QR Code
  const [showOverlay, setShowOverlay] = useState(false);

  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState('');
  const [scanResultWebCam, setScanResultWebCam] = useState('');
  const classes = useStyles();
  const qrRef = useRef(null);


  const handleQRCodeClick = (code) => {
    generateQrCode(code)
    setShowOverlay(true);
  };

  const generateQrCode = async (code) => {
    try {
      const response = await QRCode.toDataURL(code.toString());
      setImageUrl(response);
      setText(code.toString()); // set the value of the text input field
    } catch (error) {
      toast.error("ERROR: Failed to generate QR code")
      console.log(error);
    }
  }
  const handleErrorFile = (error) => {
    console.log(error);
  }
  const handleScanFile = (result) => {
    if (result) {
      setScanResultFile(result);
    }
  }
  const onScanFile = () => {
    qrRef.current.openImageDialog();
  }
  const handleErrorWebCam = (error) => {
    console.log(error);
  }
  const handleScanWebCam = (result) => {
    if (result) {
      setScanResultWebCam(result);
    }
  }

  // states:
  useRequireAuth(["Admin", "Editor"]);
  const navigate = useNavigate();
  const [items, setItem] = useState([]);
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [itemCategoryField, setItemCategoryField] = useState("");
  const [conditionFilter, setConditionFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Default');
  const [dynamicCategory, setDynamicCategory] = useState([]);
  var itemStatus = ""

  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    axios.delete(selectedDomain+ 'logout/')
    navigate('/Login');
  };
  // hooks
  useEffect(() => {
    refreshInventoryTable();
    refreshCategoryTable();
  }, []);

  // Get The Inventory
  const refreshInventoryTable = () => {
    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    axios.get(selectedDomain + 'inventory/' + conditionFilter)
      .then(
        response => {
          setItem(response.data);
          // put notification here that the table does not contain any items
        })
      .catch(error => {
        toast.error("ERROR: Failed to generate Inventory table");
        console.log(error);
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

  // Handlers
  function handleItemName(event) {
    setItemName(event.target.value);
  }

  function handleItemCondition(event) {
    setItemCondition(event.target.value);
  }

  function handleItemCategory(event) {
    setSelectedCategory(event.target.value);
  }

  function handleConditionFilter(event) {
    setConditionFilter(event.target.value);
  }

  function handleTableFilter(event) {
    event.preventDefault();
    refreshInventoryTable();
  }

  function handleItemCategoryField(event) {
    setItemCategoryField(event.target.value);
  }

  // Delete category
  function handleSubmitDeleteCategory(event) {
    event.preventDefault();
    const categ_code = selectedCategory;
    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    console.log(selectedDomain + categ_code);
    axios.delete(selectedDomain + 'category/' + categ_code)
      .then((response) => {
        refreshInventoryTable();
        refreshCategoryTable();
        document.getElementById("deleteCategoryOverlay").style.display = "none";
        toast.success("Category deleted successfully");
        console.log("AXIOS.DELETE SUCCESSFUL: " + response);
      })
      .catch((error) => {
        if (error.response.status === 404){
          toast.error("ERROR: Choose a valid Category option");
          console.log(error);
        } else {
          toast.error("ERROR!");
        } 
      });
  }

  // Add category
  function handleSubmitAddCategory(event) {
    event.preventDefault();
    const categoryPostObj = {
      category_name: itemCategoryField
    }
    console.log(categoryPostObj);

    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    axios.post(selectedDomain + 'category/', categoryPostObj)
      .then((response) => {
        refreshInventoryTable();
        refreshCategoryTable();
        document.getElementById("addCategoryOverlay").style.display = "none";
        toast.success("Category added successfully");
        console.log("AXIOS.POST SUCCESSFUL: " + response);
      })
      .catch((error) => {
        console.log("INSIDE ERROR!!!");
        console.log(error);
      });
  }

  // Add Item
  function handleSubmitAddItem(event) {
    event.preventDefault();
    if (itemCondition == "Working") {
      itemStatus = "Available"
    }
    else {
      itemStatus = "Unavailable"
    }
    const dataPostObj = {
      item_name: itemName,
      item_condition: itemCondition,
      category: selectedCategory, // num
      status: itemStatus
    }

    const dataPost = [
      dataPostObj
    ]
    console.log(dataPost);
    console.log(itemName);
    console.log(itemCondition);
    console.log(selectedCategory);

    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    axios.post(selectedDomain + 'inventory/', dataPost)
      .then((response) => {
        refreshInventoryTable();
        document.getElementById("addItemsOverlay").style.display = "none";
        toast.success("Item added successfully");
        console.log("AXIOS.POST SUCCESSFUL: " + response);
      })
      .catch((error) => {
        console.log("INSIDE ERROR!!!");
        console.log(error);
      });
  }

  // IN-ROW buttons:

  // update
  function updateItem(event) {
    event.preventDefault();
    const item_code = document.getElementById("submitUpdateItem").getAttribute("data-item-code");
    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    console.log(selectedDomain + item_code);

    axios.get(selectedDomain + 'inventory/' + item_code)
      .then(
        response => {
          let dataGetSpecCateg = 0;
          dataGetSpecCateg = response.data[0].category.category_id
          if (itemCondition == "Working") {
            itemStatus = "Available"
          }
          else {
            itemStatus = "Unavailable"
          }
          const dataPut = {
            item_name: itemName,
            item_condition: itemCondition,
            category: dataGetSpecCateg,
            status: itemStatus
          }

          console.log(dataPut);
          console.log(itemName);
          console.log(itemCondition);
          console.log(dataGetSpecCateg);

          axios.put(selectedDomain + 'inventory/' + item_code, dataPut)
            .then((response) => {
              refreshInventoryTable();
              document.getElementById("updateItemsOverlay").style.display = "none";
              toast.success("Item updated successfully");
              console.log("AXIOS.PUT SUCCESSFUL: " + response);
            })
            .catch((error) => {
              if (error.response.status === 400) {
                // handle 400 Bad Request error.
                toast.error("ERROR: Choose a valid Item Condition option");
                console.log(error);
              } else {
                toast.error("ERROR!");
              }
            });
        })
      .catch(error => {
        console.error(error);
      });

  }

  // delete
  function deleteItem() {
    const item_code = document.getElementById("submitDeleteItem").getAttribute("data-item-code");
    const returnDomain = require('../common/domainString')
    const selectedDomain = returnDomain();
    console.log(selectedDomain + item_code);
    console.log("Item_Code is: " + item_code);
    axios.delete(selectedDomain + 'inventory/' + item_code)
      .then((response) => {
        refreshInventoryTable();
        document.getElementById("deleteItemsOverlay").style.display = "none";
        toast.success("Item deleted successfully"); // not working?
        console.log("AXIOS.DELETE SUCCESSFUL: " + response);
      })
      .catch((error) => {
        toast.error("ERROR: Failed to delete the item");
        console.log(error);
      });
  }

  const roleCompare = sessionStorage.getItem('role')
  if (roleCompare === "User") {
    navigate('/Login')
    return
  }

  // cancel Button Handlers:
  function cancelDeleteCategoryOverlay() {
    document.getElementById("deleteCategoryOverlay").style.display = "none";
    refreshInventoryTable();
    refreshCategoryTable();
  }

  function cancelAddCategoryOverlay() {
    document.getElementById("addCategoryOverlay").style.display = "none";
    refreshInventoryTable();
    refreshCategoryTable();
  }

  function cancelAddItemsOverlay() {
    document.getElementById("addItemsOverlay").style.display = "none";
    refreshInventoryTable();
    refreshCategoryTable();
  }

  function cancelUpdateItemsOverlay() {
    document.getElementById("updateItemsOverlay").style.display = "none";
    refreshInventoryTable();
    refreshCategoryTable();
  }

  function cancelDeleteItemsOverlay() {
    document.getElementById("deleteItemsOverlay").style.display = "none";
    refreshInventoryTable();
    refreshCategoryTable();
  }

  return (
    <div>
      {showOverlay && (
        document.getElementById("generateQROverlay").style.display = "block"
      )
      }
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
                  <i className="bx bxs-shopping-bags" />
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
                <a href="#" onClick={handleLogout}>
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
                <p className="notef">*NOTE: Ctrl + F to find equipments</p>
              </div>
              {/* ROW 2 */}
              <div className={inventory.row2}>
                <div className="row-1-select">
                  <form onSubmit={handleTableFilter}>
                    <select id="conditionFilterDropdown" onChange={handleConditionFilter}>
                      <option value="">Item Condition Filter/Default</option>
                      <option value="Working">Working</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Retired">Retired</option>
                      <option value="Damaged">Damaged</option>
                      <option value="Lost">Lost</option>
                    </select>
                    <button
                      className={`${inventory.update} ${inventory.category} ${inventory.row2btns}`}
                      id="conditionFilterApply"
                      type="submit">
                      <i className="bx bxs-filter-alt icon" />
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
                  <button className={`${inventory.add} ${inventory.category}`}
                    onClick={openFormAddCategory}>
                    <i className="bx bxs-category icon" />
                    Add Category
                  </button>
                  <button className={`${inventory.add} ${inventory.item}`}
                    onClick={openFormAddItems}>
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
                                  onClick={(e) => openFormUpdateItems(row.item_code, row.item_name)}>
                                  <i className="bx bxs-pencil action"></i>
                                  Update
                                </button>
                                <button type="button" className={`${inventory.generate} ${inventory.category}`}
                                  onClick={() => handleQRCodeClick(row.item_code)}>
                                  <i className="bx bx-qr"></i> Generate QR
                                </button>
                                {/* <input
                                  className={`${inventory.action_btn} ${inventory.generate}`}
                                  type="button"
                                  value="Generate"
                                  onClick={() => handleQRCodeClick(row.item_code)}
                                /> */}
                                <button className={`${inventory.del} ${inventory.category}`}
                                  onClick={(e) => openFormDeleteItems(row.item_code)}>
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
                  onClick={cancelDeleteItemsOverlay}
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
              <input id="itemNameUpdateItem" type="text" placeholder="Enter item name"
                onChange={handleItemName} />
              <label htmlFor="username">Condition:</label>
              <div>
                <select id="itemConditionUpdateItem" className={inventory.dropdown} onChange={handleItemCondition}>
                  <option value="">Item Condition Filter/Default</option>
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
                  data-item-name=""
                  data-item-condition=""
                  type="submit"
                  value="Update"
                />
                <input
                  className={`${inventory.action_btn} ${inventory.cancel}`}
                  onClick={cancelUpdateItemsOverlay}
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
                id="itemNameAddItem"
                onChange={handleItemName}
              />
              <label htmlFor="username">Condition:</label>
              <div>
                <select id="itemConditionAddItem"
                  onChange={handleItemCondition} className={inventory.dropdown} >
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
                <select id="itemCategoryAddItem" value={selectedCategory}
                  onChange={handleItemCategory} className={inventory.dropdown}>
                  <option value="Default">Select Item Category</option>
                  {dynamicCategory}
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
                  onClick={cancelAddItemsOverlay}
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
            <form onSubmit={handleSubmitAddCategory}>
              <label htmlFor="username">Category:</label>
              <input id="categoryNameAddCategory" type="text" placeholder="Enter category name"
                onChange={handleItemCategoryField} />
              <div className={inventory.buttons}>
                <input
                  className={`${inventory.action_btn} ${inventory.confirm}`}
                  type="submit"
                  value="Add Category"
                />
                <input
                  className={`${inventory.action_btn} ${inventory.cancel}`}
                  onClick={cancelAddCategoryOverlay}
                  type="button"
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
                <Container className={classes.conatiner}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xl={4} lg={4} md={6} sm={12} xs={12} >
                          {imageUrl ? (
                           <a href={imageUrl} download={`qr-code-${itemCode}.png`}>
                           <img src={imageUrl} alt="img" style={{ width: '200px' }} />
                         </a>
                         ) : null}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Container>
                <div className="card-body">
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      id="qr-code-text"
                      label="QR Code Text"
                      value={`Item Code: ${text}`}
                      onChange={(e) => {
                        setText(e.target.value);
                        const code = e.target.value.split(':')[1].trim();
                        setItemCode(code);
                      }}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{
                        style: {
                          color: 'white',
                        },
                      }}
                      classes={{
                        root: classes.textField,
                      }}
                    />
                  </Grid>
                </div>
              </div>
              <div className={inventory.qr}>
                <div className={inventory.buttons}>
                  <input
                    className={`${inventory.buttonQR} ${inventory.confirm}`}
                    type="submit"
                    value="Confirm"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div id="deleteCategoryOverlay" className={inventory.deleteCategoryOverlay}>
          <div className={inventory.deleteCategoryWrap}>
            <h2>Delete Category</h2>
            <form onSubmit={handleSubmitDeleteCategory}>
              <label htmlFor="username">Categories:</label>
              <div>
                <select id="itemCategoryDeleteCategory" value={selectedCategory}
                  onChange={handleItemCategory} className={inventory.dropdown}>
                  <option value="">Select Item Category</option>
                  {dynamicCategory}
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
                  onClick={cancelDeleteCategoryOverlay}
                  type="button"
                  value="Cancel"
                />
              </div>
            </form>
          </div>
        </div>
      </>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  conatiner: {
    marginTop: 10
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#3f51b5',
    color: '#fff',
    padding: 20
  },
  btn: {
    marginTop: 10,
    marginBottom: 20
  },

  textField: {
    backgroundColor: 'transparent',
    '& .MuiInputBase-input': {
      color: 'white',
      textAlign: 'center',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },
    '& .MuiOutlinedInput-input': {
      color: 'white',
      textAlign: 'center',
    },
    '& .MuiInputLabel-outlined': {
      color: 'white',
    },
  },
}));

//overlays
function openForm() {
  document.getElementById("myOverlay").style.display = "block";
}

function openFormDeleteItems(item_code) {
  document.getElementById("submitDeleteItem").setAttribute("data-item-code", item_code);
  console.log("Succesfully set the attribute of data-item-code");
  document.getElementById("deleteItemsOverlay").style.display = "block";
}


function openFormUpdateItems(item_code, item_name) {
  document.getElementById("submitUpdateItem").setAttribute("data-item-code", item_code);
  const itemNameUpdateItem = document.getElementById("itemNameUpdateItem");
  itemNameUpdateItem.value = item_name;
  document.getElementById("itemConditionUpdateItem").selectedIndex = 0;
  console.log("Succesfully set the attribute of data-item-code");
  document.getElementById("updateItemsOverlay").style.display = "block";
}

function openFormAddItems() {
  document.getElementById("itemNameAddItem").value = "";
  document.getElementById("itemConditionAddItem").selectedIndex = 0;
  document.getElementById("itemCategoryAddItem").selectedIndex = 0;
  document.getElementById("addItemsOverlay").style.display = "block";
}

function openFormAddCategory() {
  document.getElementById("categoryNameAddCategory").value = "";
  document.getElementById("addCategoryOverlay").style.display = "block";
}

function openFormDeleteCategory() {
  document.getElementById("itemCategoryDeleteCategory").selectedIndex = 0;
  document.getElementById("deleteCategoryOverlay").style.display = "block";
}

export default Inventory
