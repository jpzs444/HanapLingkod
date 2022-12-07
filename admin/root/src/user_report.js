'use strict';

const UserReport = () => {

    const DATA = [
        {
            "reportTitle": "Disrepesctful, rude, and attitude problem",
            "reportDate": "November 14",
            "reportElapsedTime": "5 days",
            "reportDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "reporter": "Leah Custodio",
            //"picture": 
            "userReported": "Juan D. Cruz", 
            "userRole": "Worker",
            "userStrikes": "2",
        },
    ]  

    return(
        <div>
            <nav class="flexRow">
                <div class="left">
                    <button id="menu-btn" onclick="handleOpenSideNav()">
                        <img id="menu-image" src="./assets/icons/menu.png"/>
                    </button>
            
                    <button class="flexRow" id="logo-btn">
                        <img id="logo-image" src="./assets/logo/logo_icon.png" />
                        <p class="title">HanapLingkod</p>
                    </button>
                </div>
                <div class="right">
                    <a class="home-link" href="#">Home</a>
                    <a class="account-link" href="#">Account</a>
                    <button id="settings-btn">
                        <img id="settings-image" src="./assets/icons/settings.png" />
                    </button>
                </div>
            </nav>
            

            <div class="user-report">
                <h1>User Report</h1>

                <div>
                    {/* <div>
                        <button>Recruiters</button>
                        <button>Workers</button>
                    </div> */}
                    <div>                    
                        {
                            DATA.map(item => (
                                <div class="report">
                                    <h1 class="report-title">{item.reportTitle}</h1>
                                    <p class="report-date-reporter">Reported {item.reportDate} <span class="dot">•</span> {item.reportElapsedTime} ago <span class="dot">•</span> {item.reporter}</p>
                                    <h4>Reported User</h4>
                                    <div class="report-user-container">
                                        <div><img src="https://img.icons8.com/material-sharp/40/000000/user-male-circle.png"/></div>
                                        <div class="report-user-info">
                                            <div>{item.userReported}</div>
                                            <div class="report-user-info-add">
                                                <div>{item.userRole}</div>
                                                <div class="dot">•</div>
                                                <div>Strikes: <span class="strike-number">{item.userStrikes}</span></div>
                                            </div>
                                        </div>

                                        <button class="report-user-view-profile">View</button>
                                    </div>
                                    <h4>Report Description</h4>
                                    <p class="report-description">"{item.reportDescription}"</p>
                                </div>
                            ))
                        }
                    </div>
                    <div class="report-buttons">
                        <button class="button-permanent">Permanently Ban User</button>
                        <button class="button-penalize">Penalize Reported User</button>
                        <button class="button-dismiss">Dismiss Report</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const rootNode = document.getElementById('rootcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(UserReport));