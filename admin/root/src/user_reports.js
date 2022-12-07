'use strict';

const UserReports = () => {

    const DATA = [
        {
            "name": "Juan D. Cruz", 
            "role": "Worker",
            "reportTitle": "Disrepesctful, rude, and attitude problem",
            "status": "Unresolved"
        },
        {
            "name": "Leah D. Custodio", 
            "role": "Recruiter",
            "reportTitle": "Paid lower than the agreed price",
            "status": "Penalized"
        },
        {
            "name": "Pedro P. Penduko", 
            "role": "Worker",
            "reportTitle": "Very rude, did not fix my problem etc.",
            "status": "Dismissed"
        }
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
            

            <div class="user-reports">
                <h1>User Reports</h1>

                <div>
                    {/* <div>
                        <button>Recruiters</button>
                        <button>Workers</button>
                    </div> */}
                    <div>
                        <table>
                            <tr class="reports-tr-title">
                                <th class="reports-th">
                                    <div class="reports-th-img">
                                        <img src="https://img.icons8.com/material-sharp/26/000000/user-male-circle.png"/> 
                                    </div>
                                    <div class="reports-th-title">Reported User</div>
                                </th>
                                <th class="reports-th">
                                    <div class="reports-th-img">
                                        <img src="https://img.icons8.com/ios-filled/26/null/who.png"/>
                                    </div>
                                    <div class="reports-th-title">Role</div>
                                </th>
                                <th class="reports-th">
                                    <div class="reports-th-img">
                                        <img src="https://img.icons8.com/ios-glyphs/26/null/personal-video-recorder-menu.png"/>
                                    </div>
                                    <div class="reports-th-title">Report Title</div>
                                </th>
                                <th class="reports-th">
                                    <div class="reports-th-img">
                                        <img src="https://img.icons8.com/material-rounded/26/null/heart-monitor.png"/>
                                    </div>
                                    <div class="reports-th-title">Status</div>
                                </th>
                            </tr>
                            {
                                DATA.map(item => (
                                    <tr class="reports-tr-data">
                                        <td>{item.name}</td>
                                        <td>{item.role}</td>
                                        <td>{item.reportTitle}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const rootNode = document.getElementById('rootcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(UserReports));