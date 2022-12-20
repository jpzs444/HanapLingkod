'use strict';

const UserReports = () => {

    const [reports, setReports] = React.useState([])

    const [sideNavOpen, setSideNavOpen] = React.useState(false)

    React.useEffect(() => {
        handleFetchReports()
    }, []);

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

    const DATAEMPTY = [
        {
            "user": {
                "firstname": "",
                "middlename": "",
                "lastname": "",
                "role": "",
            }, 
            "title": "",
        },
        {
            "user": {
                "firstname": "",
                "middlename": "",
                "lastname": "",
                "role": "",
            }, 
            "title": "",
        },
        {
            "user": {
                "firstname": "",
                "middlename": "",
                "lastname": "",
                "role": "",
            }, 
            "title": "",
        },
        {
            "user": {
                "firstname": "",
                "middlename": "",
                "lastname": "",
                "role": "",
            }, 
            "title": "",
        },
        {
            "user": {
                "firstname": "",
                "middlename": "",
                "lastname": "",
                "role": "",
            }, 
            "title": "",
        },
    ]

    const handleClickReport = (itemId) => {
        sessionStorage.setItem("selectedReportItem", itemId)
        window.location.assign("./UserReport.html")
    }
    
    const handleFetchReports = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/reportAUser`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                console.log("reports: ", data)
                data.length === 0 ? setReports([...DATAEMPTY]) : setReports([...data])
            })
        } catch (error) {
            console.log("error fetching reports: ", error)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem("adminAccessToken")
        sessionStorage.removeItem("adminUsername")
        sessionStorage.removeItem("adminId")
        sessionStorage.removeItem("viewUserProfile_role")
        sessionStorage.removeItem("viewUserProfile_Id")
        sessionStorage.removeItem("selectedReportItem")

        window.location.assign("./index.html")
    }

    return(
        <div>
            <nav class="flexRow">
                <div class="left">
                    <button id="menu-btn" onClick={() => setSideNavOpen(prev => !prev)}>
                        <img id="menu-image" src="./assets/icons/menu.png"/>
                    </button>
            
                    <button class="flexRow" id="logo-btn" onClick={() => window.location.href='Home.html'}>
                        <img id="logo-image" src="./assets/logo/logo_icon.png" />
                        <p class="title">HanapLingkod</p>
                    </button>
                </div>
                <div class="right">
                    <a class="home-link" href="./Home.html">Home</a>
                    <button id="settings-btn" onClick={() => handleLogout()}>
                        <img class={"popup-option-icon"} src="./assets/icons/logout.png" />
                        <p>Logout</p>
                    </button>
                </div>
            </nav>

            <div class={sideNavOpen ? "side-navigation-open" : "side-navigation"}>
                <div class="close-btn-div">
                    <button id="close-side-menu" onClick={() => setSideNavOpen(prev => !prev)}>
                        <img class="arrow-left-menu" src="./assets/icons/arrow-left-long.png" />
                    </button>
                </div>

                <div class="side-nav-menu">
                    <div class="menu flexRow" onClick={() => window.location.href='Home.html'}>
                        <img class="menu-icon" src="./assets/icons/home.png" />
                        <p class="menu-text">Home</p>
                    </div>

                    <div class="menu flexRow" onClick={() => window.location.href='UsersView.html'}>
                        <img class="menu-icon" src="./assets/icons/people.png" />
                        <p class="menu-text">View Users</p>
                    </div>

                    <div class="menu flexRow" onClick={() => window.location.href='AccountVerification.html'}>
                        <img class="menu-icon" src="./assets/icons/verification.png" />
                        <p class="menu-text">User Verification</p>
                    </div>

                    <div class="menu flexRow side-navigation-active-page" onClick={() => window.location.href='UserReports.html'}>
                        <img class="menu-icon" src="./assets/icons/reports.png" />
                        <p class="menu-text">User Reports</p>
                    </div>

                    <div class="menu flexRow" onClick={() => window.location.href='Categories.html'}>
                        <img class="menu-icon" src="./assets/icons/category.png" />
                        <p class="menu-text">Add/Modify Category</p>
                    </div>

                    <div class="menu flexRow" onClick={() => window.location.href='signup.html'}>
                        <img class="menu-icon" src="./assets/icons/account.png" />
                        <p class="menu-text">Create Account</p>
                    </div>

                    {/* <div class="menu flexRow" onClick={() => window.location.href='Transactions.html'}>
                        <img class="menu-icon" src="./assets/icons/transaction-gray.png" />
                        <p class="menu-text">Transaction</p>
                    </div> */}
                </div>
            </div>
            

            <div class="user-reports">
                <h1>User Reports</h1>

                <div>
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
                                {/* <th class="reports-th">
                                    <div class="reports-th-img">
                                        <img src="https://img.icons8.com/material-rounded/26/null/heart-monitor.png"/>
                                    </div>
                                    <div class="reports-th-title">Status</div>
                                </th> */}
                            </tr>
                            {
                                reports.map(item => (
                                    <tr class="reports-tr-data" onClick={() => {handleClickReport(item._id)}}>
                                        <td>{`${item.user.firstname} ${item.user.middlename.charAt(0).toUpperCase()} ${item.user.lastname}`}</td>
                                        <td>{item.user.role}</td>
                                        <td>{item.title}</td>
                                        {/* <td>{item.deleteflag.toString()}</td> */}
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