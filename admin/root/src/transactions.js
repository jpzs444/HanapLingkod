'use strict';

const Transactions = () => {

    const DATA = [
        {
            "type": "Request", 
            "recruiter": "Leah P. Custodio",
            "worker": "Juan D. Cruz",
            "date" : "Nov. 19",
            "status": "Pending"
        },
        {
            "type": "Booking", 
            "recruiter": "Ding P. Custodio",
            "worker": "Pedro P. Penduko",
            "date" : "Nov. 19",
            "status": "On-going"
        },
        {
            "type": "Booking", 
            "recruiter": "Leah P. Custodio",
            "worker": "Cardo D. Lisay",
            "date" : "Nov. 19",
            "status": "Completed"
        }
    ]
    
    const [transactions, setTransactions] = React.useState([])
    const [sideNavOpen, setSideNavOpen] = React.useState(false)


    const fetchTransactions = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/`)
        } catch (error) {
            console.log("error fetching transactions (bookings): ", error)
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

                    <div class="menu flexRow" onClick={() => window.location.href='UserReports.html'}>
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

                    {/* <div class="menu flexRow side-navigation-active-page" onClick={() => window.location.href='Transactions.html'}>
                        <img class="menu-icon" src="./assets/icons/transaction-gray.png" />
                        <p class="menu-text">Transaction</p>
                    </div> */}
                </div>
            </div>
            

            <div class="transactions">
                <h1>Transactions</h1>

                <div>
                    <div>
                        <table>
                            <tr class="trans-tr-title">
                                <th class="trans-th">
                                    <div class="trans-th-img">
                                        <img src="./assets/icons/transaction-white.png"/> 
                                    </div>
                                    <div class="trans-th-title">Type</div>
                                </th>
                                <th class="trans-th">
                                    <div class="trans-th-img">
                                        <img src="./assets/icons/recruiter-white.png"/>
                                    </div>
                                    <div class="trans-th-title">Recruiter</div>
                                </th>
                                <th class="trans-th">
                                    <div class="trans-th-img">
                                        <img src="./assets/icons/worker-white.png"/>
                                    </div>
                                    <div class="trans-th-title">Worker</div>
                                </th>
                                <th class="trans-th">
                                    <div class="trans-th-img">
                                        <img src="./assets/icons/calendar-white.png"/>
                                    </div>
                                    <div class="trans-th-title">Date</div>
                                </th>
                                <th class="trans-th">
                                    <div class="trans-th-img trans-th-img-status">
                                        <img src="./assets/icons/status-white.png"/>
                                    </div>
                                    <div class="trans-th-title">Status</div>
                                </th>
                            </tr>
                            {
                                DATA.map(item => (
                                    <tr class="trans-tr-data">
                                        <td>{item.type}</td>
                                        <td>{item.recruiter}</td>
                                        <td>{item.worker}</td>
                                        <td>{item.date}</td>
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
root.render(React.createElement(Transactions));