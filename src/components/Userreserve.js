import React from 'react'
import userreserve from '../css/userreserve.module.css'
import '../css/overlay.css'
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useRequireAuth } from "../services/useRequireAuth";

// import { createGlobalStyle } from 'styled-components';

// const GlobalStyle = createGlobalStyle`
//   @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
//   @import url('https://www.w3schools.com/w3css/4/w3.css');
// `;

// <GlobalStyle />

function Userreserve() {
  useRequireAuth();
  
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('sessionid');
    sessionStorage.removeItem('role');
    navigate('/Login');
  };
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
      <hr />
      <button className={`${userreserve.check} ${userreserve.item}`}>
        <i className="bx bxs-select-multiple" />
        <a
          href="javascript:checkall('test','plan',true)"
          style={{ textDecoration: "none" }}
        >
          Select All
        </a>
      </button>
      <button className={`${userreserve.delete} ${userreserve.item}`}>
        <i className="bx bxs-x-square" />
        <a
          href="javascript:checkall('test','plan',false)"
          style={{ textDecoration: "none" }}
        >
          UnSelect All
        </a>
      </button>
      <div className={userreserve.row}>
        {/* <form name="test"> */}
        <div className={userreserve.column}>
        <div className={`${userreserve.card} w3-hover-shadow`}>
            <div className={userreserve.cardDivider}>
              <h2>BALL</h2>
              <h3>ITEM-001</h3>
              <input name="plan" className={userreserve.radio} type="checkbox" />
            </div>
            <div className="card-section">
            <div className={userreserve.category}>
                <button
                  className={`${userreserve.reset } ${userreserve.category}`}
                  onClick={openFormUserReserve}
                >
                  <i className="bx bxs-file" />
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={userreserve.column}>
          <div className={`${userreserve.card} w3-hover-shadow`}>
            <div className={userreserve.cardDivider}>
              <h2>BALL</h2>
              <h3>ITEM-001</h3>
              <input name="plan" className={userreserve.radio} type="checkbox" />
            </div>
            <div className="card-section">
              <div className={userreserve.category}>
                <button
                  className={`${userreserve.reset } ${userreserve.category}`}
                  onClick={openFormUserReserve}
                >
                  <i className="bx bxs-file" />
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={userreserve.column}>
          <div className={`${userreserve.card} w3-hover-shadow`}>
            <div className={userreserve.cardDivider}>
              <h2>BALL</h2>
              <h3>ITEM-001</h3>
              <input name="plan" className={userreserve.radio} type="checkbox" />
            </div>
            <div className="card-section">
              <div className={userreserve.category}>
                <button
                  className={`${userreserve.reset } ${userreserve.category}`}
                  onClick={openFormUserReserve}
                >
                  <i className="bx bxs-file" />
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={userreserve.column}>
          <div className={`${userreserve.card} w3-hover-shadow`}>
            <div className={userreserve.cardDivider}>
              <h2>BALL</h2>
              <h3>ITEM-001</h3>
              <input name="plan" className={userreserve.radio} type="checkbox" />
            </div>
            <div className="card-section">
              <div className={userreserve.category}>
                <button
                  className={`${userreserve.reset } ${userreserve.category}`}
                  onClick={openFormUserReserve}
                >
                  <i className="bx bxs-file" />
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* </form> */}
      </div>
    </div>
  </section>
  <div id="myOverlay" className={userreserve.overlay}>
    <div className={userreserve.wrap}>
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
        <div className={userreserve.buttons}>
          <input
            className={`${userreserve.action_btn} ${userreserve.confirm}`}
            type="submit"
            value="Confirm"
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
  <div id="userReserveOverlay" className={userreserve.userReserveOverlay}>
    <div className={userreserve.userReserveWrap}>
      <h1 id="userh1">
        <i className="bx bxs-info-circle" />
        Action
      </h1>
      <h2 id="userh2">Would you like to reserve this item?</h2>
      <form>
        <div className={userreserve.buttons}>
          <input
            className={`${userreserve.action_btn} ${userreserve.confirm}`}
            type="submit"
            value="Confirm"
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
  <div id="userBackpackOverlay" className={userreserve.userBackpackOverlay}>
    <div className={userreserve.userBackpackWrap}>
      <h1 id={userreserve.userbackpackh1}>Items Borrowed</h1>
      <div className={userreserve.userbackpack}>
        <ol className={userreserve.userbackpacklist}>
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
            value="Reserve Now"
            onClick={openFormReserve}
          />
          <input
            className={`${userreserve.update } ${userreserve.category}`}
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

//overlays

function openForm() {
    document.getElementById("myOverlay").style.display ="block";
}

function openFormUserBackpack() {
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
