/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import logo from './assets/img/brand/tejarat.png';
import profile from './assets/img/brand/user.png';
import logout from './assets/img/brand/logout.png';
import Login from './components/login'

import User from './forms/user/index';
import BaseInfo from './forms/baseInfo/index';
import Request from './forms/request/index';
import RequestInquiryNew from './forms/request_inquiry/create';
import RequestInquiry from './forms/request_inquiry/index';
import TechnicalCommittee from './forms/technical_committee/index';
// import TechnicalCommitteeNew from './forms/technical_committee/create';
import TechnicalCommitteeMeeting from './forms/technical_committee_meeting/index';
import Approvals from './forms/approvals/index';
import Proposal from './forms/proposal/index';
import ContractDraft from './forms/contract_draft/index';
import Contract from './forms/contract/index';

import Invoice from './forms/invoice/index';
import InvoiceApprove from './forms/invoice_inquiry/index';
import InvoicePayment from './forms/invoice_payment/index';
import InvoiceLogistics from './forms/invoice_logistics/index';
import InvoiceSendToCompany from './forms/invoice_send_company/index';
import InvoiceBackFromCompany from './forms/invoice_back_company/index';

import ReportTimeline from './reports/timeline';
import ImageViewer from './reports/imageViewer';

import Permission from './forms/permission/index';
//import CommingSoon from './forms/commingSoon';
import MainPage from './reports/dashboard';
// import MainPage from './forms/mainPage';

import './assets/css/antd.rtl.css';
import './assets/vendor/nucleo/css/nucleo.rtl.css';
import './assets/vendor/@fortawesome/fontawesome-free/css/all.min.css';
import './assets/css/argon.rtl.css';
import './assets/fonts/IRANSans/style.css';
import './assets/css/custom.css';

import PrivateRoute from './components/PrivateRoute'


function App() {
  const [selectedNav, setSelectedNav] = useState(0);
  const [subMenu, setSubMenu] = useState(0);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : undefined;
    if (user) {
      setCurrentUser({ name: user.name, lastLoginDate: user.last_login, role_id: user.role_id });
    }


  }, [])
  const signOut = () => {
    setCurrentUser({});
    localStorage.clear();
    window.location.reload();
  }
  const loginCallback = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : undefined;
    if (user) {
      debugger;
      setCurrentUser({ name: user.name, lastLoginDate: user.last_login, role_id: user.role });
    }
  }
  return (
    <div className="App" dir='RTL'>

      <Router>

        {localStorage.getItem('user') && <nav className="sidenav navbar navbar-vertical  fixed-left  navbar-expand-xs navbar-light bg-white" id="sidenav-main">
          <div className="scrollbar-inner">

            <div className="sidenav-header align-items-center">
              {/* <input type="button" onClick={(e)=>e.target.classList.contains("")} value="------" /> */}
              <span className="navbar-brand" >
                <Link to="/" >
                  <img src={logo} className="navbar-brand-img" alt="..." />
                </Link>
              </span>
            </div>
            <div className="navbar-inner">

              <div className="collapse navbar-collapse" id="sidenav-collapse-main">

                <ul className="navbar-nav">


                  <li className="nav-item" onClick={() => setSubMenu(1)}>
                    <a className="nav-link">
                      <i className="custom-nav-img 	far fa-file-code"></i>
                      <span className="nav-link-text">درخواست ها</span></a>
                    {subMenu === 1 && <ul className="nav-sub-menu">
                      <li className="nav-item1" onClick={() => setSelectedNav(1)}>
                        <Link to="/reqList" className={selectedNav === 1 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">لیست درخواست ها</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(11)}>
                        <Link to="/createReqInquiry" className={selectedNav === 11 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">ثبت استعلام</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(2)}>
                        <Link to="/reqInquiry" className={selectedNav === 2 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">پاسخ به درخواست</span></Link>
                      </li>
                    </ul>}
                  </li>
                  <li className="nav-item" onClick={() => setSubMenu(2)}>
                    <a className="nav-link">
                      <i className="custom-nav-img fas fa-balance-scale"></i>
                      <span className="nav-link-text">کمیته فنی</span></a>
                    {subMenu === 2 && <ul className="nav-sub-menu">
                      <li className="nav-item1" onClick={() => setSelectedNav(3)}>
                        <Link to="/createTechnicalcommittee" className={selectedNav === 3 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">دستور جلسه</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(15)}>
                        <Link to="/technicalcommittee" className={selectedNav === 15 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">صورت جلسه</span></Link>
                      </li>
                    </ul>}
                  </li>
                  <li className="nav-item" onClick={() => setSubMenu(3)}>
                    <a className="nav-link">
                      <i className="custom-nav-img 	fas fa-box"></i>
                      <span className="nav-link-text">فرآیند اجرایی</span></a>
                    {subMenu === 3 && <ul className="nav-sub-menu">
                      <li className="nav-item1" onClick={() => setSelectedNav(4)}>
                        <Link to="/approvals" className={selectedNav === 4 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">مصوبات</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(5)}>
                        <Link to="/proposal" className={selectedNav === 5 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">دریافت پروپوزال نهایی</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(16)}>
                        <Link to="/contract_draft" className={selectedNav === 16 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">پیش نویس  قرارداد</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(6)}>
                        <Link to="/contract" className={selectedNav === 6 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">انعقاد قرارداد و ابلاغ</span></Link>
                      </li>
                    </ul>}
                  </li>
                  <li className="nav-item" onClick={() => setSubMenu(4)}>
                    <a className="nav-link">
                      <i className="custom-nav-img fas fa-landmark"></i>
                      <span className="nav-link-text">صورتحساب و ممیزی</span></a>
                    {subMenu === 4 && <ul className="nav-sub-menu">
                      <li className="nav-item1" onClick={() => setSelectedNav(7)}>
                        <Link to="/invoice" className={selectedNav === 7 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">ثبت صورتحساب</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(8)}>
                        <Link to="/approveInvoice" className={selectedNav === 8 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">پاسخ استعلام</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(9)}>
                        <Link to="/toCompanyInvoice" className={selectedNav === 9 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">ارسال به شرکت</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(17)}>
                        <Link to="/companyBackInvoice" className={selectedNav === 17 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">پاسخ شرکت</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(18)}>
                        <Link to="/logisticsInvoice" className={selectedNav === 18 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">تدارکات</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(10)}>
                        <Link to="/paymentInvoice" className={selectedNav === 10 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">مالی</span></Link>
                      </li>
                    </ul>}
                  </li>
                  <li className="nav-item" onClick={() => setSubMenu(5)}>
                    <a className="nav-link">
                      <i className="custom-nav-img 	far fa-chart-bar"></i>
                      <span className="nav-link-text">گزارشات</span></a>
                    {subMenu === 5 && <ul className="nav-sub-menu">
                      <li className="nav-item1" onClick={() => setSelectedNav(12)}>
                        <a className={selectedNav === 12 ? "nav-sub-link selected-nav" : "nav-sub-link"} href='http://10.39.95.172/Reports_PB/powerbi/Dashboard?rs:embed=true'>
                          <span className="nav-link-text1">داشبورد</span></a>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(13)}>
                        <Link to="/imgViewer?id=1" className={selectedNav === 13 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">فرآیند ثبت درخواست تا ابلاغ قرارداد</span></Link>
                      </li>
                      <li className="nav-item1" onClick={() => setSelectedNav(14)}>
                        <Link to="/imgViewer?id=2" className={selectedNav === 14 ? "nav-sub-link selected-nav" : "nav-sub-link"}>
                          <span className="nav-link-text1">فرآیند ممیزی و پرداخت</span></Link>
                      </li>

                    </ul>}
                  </li>
                  {currentUser.role_id==10&&<div>
                    <li className="nav-item">
                      <hr className="my-3" />
                      <h4 className="navbar-heading p-0 text-muted" style={{ marginRight: '20px' }}>
                        <span className="docs-normal">راهبر سامانه</span>
                      </h4>
                    </li>
                    <li className="nav-item" onClick={() => setSelectedNav(21)}>
                      <Link to="/user" className={selectedNav === 21 ? "nav-link selected-nav" : "nav-link"}>
                        <i className="custom-nav-img usermanagmenr"></i>
                        <span className="nav-link-text">مدیریت کاربران</span></Link>
                    </li>
                    <li className="nav-item" onClick={() => setSelectedNav(22)}>
                      <Link to="/permission" className={selectedNav === 22 ? "nav-link selected-nav" : "nav-link"}>
                        <i className="custom-nav-img permisstion"></i>
                        <span className="nav-link-text">مدیریت دسترسی ها</span></Link>
                    </li>
                    <li className="nav-item" onClick={() => setSelectedNav(23)}>
                      <Link to="/baseInfo" className={selectedNav === 23 ? "nav-link selected-nav" : "nav-link"}>
                        <i className="custom-nav-img basictable"></i>
                        <span className="nav-link-text">جداول پایه</span></Link>
                    </li>
                  </div>}
                </ul>

              </div>
            </div>
          </div>
        </nav>
        }
        <div className="main-content" id="panel">

          <nav className="navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom">
            <div className="container-fluid">
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <div className="head-all" > سماپ (سامانه مدیریت اطلاعات پروژه)  </div>

                {localStorage.getItem('user') && <ul className="navbar-nav align-items-center  ml-md-auto login-container ">
                  <li className="nav-item dropdown" >
                    <span className="nav-link" >
                      <div className='nav-login'>
                        <img src={profile} className="profile" alt="..." />
                        <span className="">{currentUser ? currentUser.name : ''}</span>
                      </div>
                    </span>

                  </li>
                  <div className="logoutBox" onClick={() => signOut()}>
                    <img src={logout} className="logout" alt="..." />

                    <span className="exit" >خروج</span>
                  </div>

                </ul>}

              </div>
            </div>
          </nav>

          <div className="header bg-light pb-6">

            <Switch>

              <PrivateRoute path="/user" component={User} role={10} />
              <PrivateRoute path="/permission" component={Permission} role={10} />
              <PrivateRoute path="/baseInfo" component={BaseInfo} role={10} />

              <PrivateRoute path="/reqList" component={Request} role="" />
              <PrivateRoute path="/createReqInquiry" component={RequestInquiryNew} role="" />
              <PrivateRoute path="/reqInquiry" component={RequestInquiry} role="" />
              <PrivateRoute path="/technicalcommittee" component={TechnicalCommittee} role="" />
              <PrivateRoute path="/createTechnicalcommittee" component={TechnicalCommitteeMeeting} role="" />
              <PrivateRoute path="/approvals" component={Approvals} role="" />
              <PrivateRoute path="/proposal" component={Proposal} role="" />
              <PrivateRoute path="/contract_draft" component={ContractDraft} role="" />
              <PrivateRoute path="/contract" component={Contract} role="" />
              <PrivateRoute path="/invoice" component={Invoice} role="" />
              <PrivateRoute path="/approveInvoice" component={InvoiceApprove} role="" />
              <PrivateRoute path="/logisticsInvoice" component={InvoiceLogistics} role="" />
              <PrivateRoute path="/paymentInvoice" component={InvoicePayment} role="" />
              <PrivateRoute path="/toCompanyInvoice" component={InvoiceSendToCompany} role="" />
              <PrivateRoute path="/companyBackInvoice" component={InvoiceBackFromCompany} role="" />
              
              <PrivateRoute path="/rpttimeline" component={ReportTimeline} role="" />
              <PrivateRoute path="/imgViewer" component={ImageViewer} role="" />

              {/* <Route path="/commingSoon" component={CommingSoon} role="" /> */}

              <Route path="/login">
                <Login callback={loginCallback} />
              </Route>
              <PrivateRoute path="/" component={MainPage} />

            </Switch>
          </div>


        </div>
        {/* <div id="footer"> <a href="mailto: info@bstict.com">طراحی و پیاده سازی : BSTICT </a>  </div> */}
      </Router>
    </div>
  );
}

export default App;
