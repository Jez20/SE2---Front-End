import React from 'react'
import borrow from '../css/borrow.module.css'
import '../css/overlay.css'

import { Helmet } from 'react-helmet';

// import { createGlobalStyle } from 'styled-components';

// const GlobalStyle = createGlobalStyle`
//   @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
//   @import url('https://www.w3schools.com/w3css/4/w3.css');
// `;

// <GlobalStyle />

function Borrow() {
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
          <a href="/Login">
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
          Step 1. Leave it blank if you are going to borrow, Otherwise input the
          borrower's email
        </p>
      </div>
      <div>
        <form action="/action_page.php">
          <input
            className="email"
            type="text"
            id="number"
            name="phone"
            placeholder="Email"
          />
        </form>
      </div>
      <div className={borrow.inventory}>
        <p>For Selected Items</p>
      </div>
      <div>
        <button className={`${borrow.check} ${borrow.category}`} onClick={openFormBackpack}>
          <i className="bx bxs-backpack icon" />
          Check Backpack
        </button>
      </div>
      <div className={borrow.inventory}>
        <p>Click items to be selected</p>
      </div>
      {/* ROW 2 */}
      <div className={borrow.row2}>
        <button
          className={`${borrow.update} ${borrow.category}`}
          onClick={event =>  window.location.href='/Reservation'}
        >
          <i className="bx bxs-check-circle" />
          Confirm Reservation
        </button>
      </div>
      <hr />
      <button className={`${borrow.check} ${borrow.item}`}>
        <i className="bx bxs-select-multiple" />
        <a
          href="javascript:checkall('test','plan',true)"
          style={{ textDecoration: "none" }}
        >
          Select All
        </a>
      </button>
      <button className={`${borrow.delete} ${borrow.item}`}>
        <i className="bx bxs-x-square" />
        <a
          href="javascript:checkall('test','plan',false)"
          style={{ textDecoration: "none" }}
        >
          UnSelect All
        </a>
      </button>
      <div className={borrow.row}>
        {/* <form name="test" id="cardForm"> */}
        <div className={borrow.column}>
          <div className={`${borrow.card} w3-hover-shadow`}>
            <div className={borrow.cardDivider}>
              <h2>BALL</h2>
              <h3>ITEM-001</h3>
              <input name="plan" className={borrow.radio} type="checkbox" />
            </div>
            <div className="card-section">
              <div className={borrow.category}>
                <button className={`${borrow.reset} ${borrow.category}`} onClick={openFormReserve}>
                  <i className="bx bxs-file" />
                  Reserve
                </button>
                <button className={`${borrow.update} ${borrow.category}`} onClick={openFormBorrow}>
                  <i className="bx bxs-backpack" />
                  Borrow Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={borrow.column}>
          <div className={`${borrow.card} w3-hover-shadow`}>
            <div className={borrow.cardDivider}>
              <h2>BALL</h2>
              <h3>ITEM-001</h3>
              <input name="plan" className={borrow.radio} type="checkbox" />
            </div>
            <div className="card-section">
              <div className={borrow.category}>
                <button className={`${borrow.reset} ${borrow.category}`} onClick={openFormReserve}>
                  <i className="bx bxs-file" />
                  Reserve
                </button>
                <button className={`${borrow.update} ${borrow.category}`} onClick={openFormBorrow}>
                  <i className="bx bxs-backpack" />
                  Borrow Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={borrow.column}>
          <div className={`${borrow.card} w3-hover-shadow`}>
            <div className={borrow.cardDivider}>
              <h2>BALL</h2>
              <h3>ITEM-001</h3>
              <input name="plan" className={borrow.radio} type="checkbox" />
            </div>
            <div className="card-section">
              <div className={borrow.category}>
                <button className={`${borrow.reset} ${borrow.category}`} onClick={openFormReserve}>
                  <i className="bx bxs-file" />
                  Reserve
                </button>
                <button className={`${borrow.update} ${borrow.category}`} onClick={openFormBorrow}>
                  <i className="bx bxs-backpack" />
                  Borrow Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={borrow.column}>
          <div className={`${borrow.card} w3-hover-shadow`}>
            <div className={borrow.cardDivider}>
              <h2>BALL</h2>
              <h3>ITEM-001</h3>
              <input name="plan" className={borrow.radio} type="checkbox" />
            </div>
            <div className="card-section">
              <div className={borrow.category}>
                <button className={`${borrow.reset} ${borrow.category}`} onClick={openFormReserve}>
                  <i className="bx bxs-file" />
                  Reserve
                </button>
                <button className={`${borrow.update} ${borrow.category}`} onClick={openFormBorrow}>
                  <i className="bx bxs-backpack" />
                  Borrow Now
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* </form> */}
      </div>
    </div>
  </section>
  <div id="myOverlay" className={borrow.overlay}>
    <div className={borrow.wrap}>
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
        <div className={borrow.buttons}>
          <input
            className={`${borrow.action_btn} ${borrow.confirm}`}
            type="submit"
            value="Confirm"
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
  <div id="reserveOverlay" className={borrow.reserveOverlay}>
    <div className={borrow.reserveWrap}>
      <h1 id="reserveh1">
        <i className="bx bxs-info-circle" />
        Action
      </h1>
      <h2 id="reserveh2">Would you like to reserve this item?</h2>
      <form>
        <div className={borrow.buttons}>
          <input
            className={`${borrow.action_btn} ${borrow.confirm}`}
            type="submit"
            value="Confirm"
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
      <h2 id="borrowh2">Print Invoice</h2>
      <form>
        <div className={borrow.card}>
          <img
            className="card-img-top"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUT4dzVBCJqmEcFm4gWT5dLwdTb3pTCTRNhA&usqp=CAU"
            alt="Card image cap"
            style={{ height: 300, width: 300 }}
          />
          <div className="card-body"></div>
        </div>
        <div className={borrow.buttons}>
          <input
            className={`${borrow.action_btn} ${borrow.confirm}`}
            type="submit"
            value="Confirm"
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
      <h1 id="backpackh1">Items Borrowed</h1>
      <div className={borrow.backpack}>
        <ol className={borrow.backpacklist}>
          <li>Ball</li>
          <li>Projector</li>
          <li>Chess</li>
          <li>Jumping Ropes</li>
        </ol>
      </div>
      <form>
        <div className={borrow.buttons}>
          <input
            className={`${borrow.reset} ${borrow.category}`}
            type="submit"
            value="Reserve Now"
            onClick={openFormReserve}
          />
          <input
            className={`${borrow.update} ${borrow.category}`}
            type="submit"
            value="Borrow Now"
          />
        </div>
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
    document.getElementById("myOverlay").style.display ="block";
}

function openFormReserve() {
    document.getElementById("reserveOverlay").style.display ="block";
}

function openFormBorrow() {
    document.getElementById("borrowOverlay").style.display ="block";
}

function openFormBackpack() {
    document.getElementById("backpackOverlay").style.display ="block";
}





export default Borrow
