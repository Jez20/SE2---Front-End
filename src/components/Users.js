import React from 'react'
import '../css/users.css'
import '../css/overlay.css'

function Users() {
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
          <a href="/Login">
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
        <h1>Users</h1>
      </div>
    </div>
    <div className="dash-content">
      <div className="activity">
        <div className="title">
          <i className="bx bxs-user icon" />
          <span className="text">Users</span>
        </div>
        {/* ROW 1 */}
        <div className="inventory">
          <p>*NOTE: Ctrl + F to find users, Default Password: fn.ln</p>
        </div>
        {/* ROW 2 */}
        <div className="row-2">
          <button className="delete category" onClick={openFormDeleteUsers}>
            <i className="bx bxs-trash-alt icon" />
            Delete Selected Users
          </button>
          <button
            className="add item"
            onClick={event =>  window.location.href='/Adduser'}
          >
            <i className="bx bx-plus icon" />
            Add Users
          </button>
        </div>
        <div className="activity-data">
          <table className="table">
            <thead>
              <tr>
                <th>Select</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="checkboxes">
                    <label className="checkbox">
                      <input type="checkbox" />
                      <span className="indicator" />
                    </label>
                  </div>
                </td>
                <td>John</td>
                <td>Doe</td>
                <td>JD@gmail.com</td>
                <td>
                  <form action="/action_page.php">
                    <input
                      type="text"
                      className="number"
                      name="phone"
                      placeholder="09750744817"
                    />
                  </form>
                </td>
                <td>
                  <select id="role1">
                    <option value="select">Select Role</option>
                    <option value="cond">Super Admin</option>
                    <option value="cond">Admin</option>
                    <option value="cond">Student</option>
                  </select>
                </td>
                <td>
                  <div className="category">
                    <button
                      className="update category"
                      onClick={openFormUpdateUsers}
                    >
                      <i className="bx bxs-pencil action" />
                      Update User
                    </button>
                    <button
                      className="reset category"
                      onClick={openFormResetPassword}
                    >
                      <i className="bx bx-refresh" />
                      Reset Password
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="checkboxes">
                    <label className="checkbox">
                      <input type="checkbox" />
                      <span className="indicator" />
                    </label>
                  </div>
                </td>
                <td>John</td>
                <td>Doe</td>
                <td>JD@gmail.com</td>
                <td>
                  <form action="/action_page.php">
                    <input
                      type="text"
                      className="number"
                      name="phone"
                      placeholder="09750744817"
                    />
                  </form>
                </td>
                <td>
                  <select id="role3">
                    <option value="select">Select Role</option>
                    <option value="cond">Super Admin</option>
                    <option value="cond">Admin</option>
                    <option value="cond">Student</option>
                  </select>
                </td>
                <td>
                  <div className="category">
                    <button
                      className="update category"
                      onClick={openFormUpdateUsers}
                    >
                      <i className="bx bxs-pencil action" />
                      Update User
                    </button>
                    <button
                      className="reset category"
                      onClick={openFormResetPassword}
                    >
                      <i className="bx bx-refresh" />
                      Reset Password
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="checkboxes">
                    <label className="checkbox">
                      <input type="checkbox" />
                      <span className="indicator" />
                    </label>
                  </div>
                </td>
                <td>John</td>
                <td>Doe</td>
                <td>JD@gmail.com</td>
                <td>
                  <form action="/action_page.php">
                    <input
                      type="text"
                      className="number"
                      name="phone"
                      placeholder="09750744817"
                    />
                  </form>
                </td>
                <td>
                  <select id="role2">
                    <option value="select">Select Role</option>
                    <option value="cond">Super Admin</option>
                    <option value="cond">Admin</option>
                    <option value="cond">Student</option>
                  </select>
                </td>
                <td>
                  <div className="category">
                    <button
                      className="update category"
                      onClick={openFormUpdateUsers}
                    >
                      <i className="bx bxs-pencil action" />
                      Update User
                    </button>
                    <button
                      className="reset category"
                      onClick={openFormResetPassword}
                    >
                      <i className="bx bx-refresh" />
                      Reset Password
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
  <div id="deleteUsersOverlay" className="delete-users-overlay">
    <div className="delete-users-wrap">
      <h1 id="usersh1">
        <i className="bx bxs-error icon" /> Warning!{" "}
      </h1>
      <h2 id="usersh2">
        Performing this action is irreversable, Would you like to delete
        selected users?
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
  <div id="updateUsersOverlay" className="update-users-overlay">
    <div className="update-users-wrap">
      <h1 id="updateh1">
        <i className="bx bxs-info-circle" /> Action{" "}
      </h1>
      <h2 id="updateh2">Would you like to update this person's information?</h2>
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
  <div id="resetPasswordOverlay" className="reset-password-overlay">
    <div className="reset-password-wrap">
      <h1 id="reseth1">
        <i className="bx bxs-info-circle" /> Action{" "}
      </h1>
      <h2 id="reseth2">Would you like to reset this person's password?</h2>
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
</div>

  )
}

//overlays

function openForm() {
    document.getElementById("myOverlay").style.display ="block";
}

function openFormDeleteUsers() {
    document.getElementById("deleteUsersOverlay").style.display ="block";
}

function openFormUpdateUsers() {
    document.getElementById("updateUsersOverlay").style.display ="block";
}

function openFormResetPassword() {
    document.getElementById("resetPasswordOverlay").style.display ="block";
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

export default Users
