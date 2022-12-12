'use-strict';

function Home() {

    const [sideNavOpen, setSideNavOpen] = React.useState(false)
    const [recruiter, setRecruiter] = React.useState(0)
    const [worker, setWorker] = React.useState(0)
    const [recruiterUnVerified, setRecruiterUnVerified] = React.useState(0)
    const [workerUnVerified, setWorkerUnVerified] = React.useState(0)

    React.useEffect(() => {
        fetchRecruiterVerified()
        fetchWorkerVerified()
    }, [])

    const handleLogout = () => {
        sessionStorage.removeItem("adminAccessToken")
        sessionStorage.removeItem("adminUsername")
        sessionStorage.removeItem("adminId")
        sessionStorage.removeItem("viewUserProfile_role")
        sessionStorage.removeItem("viewUserProfile_Id")
        sessionStorage.removeItem("selectedReportItem")

        window.location.assign("./index.html")
    }

    const fetchRecruiterVerified = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/recruiter`, {
                method: 'GET',
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                let list = [...data]
                list = list.map(e => !e.verification && setRecruiterUnVerified(prev => prev + 1))
                console.log(list)
                setRecruiter(data.length)
            })
        } catch (error) {
            console.log("error fetch user(recruiter): ", error)
        }
    }

    const fetchWorkerVerified = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/worker`, {
                method: 'GET',
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                let list = [...data]
                console.log(list)
                list = list.map(e => e.verification && setWorkerUnVerified(prev => prev + 1))
                setWorker(data.length)
            })
        } catch (error) {
            console.log("error fetch user(recruiter): ", error)
        }
    }


    return (
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

                <div class={"side-nav-menu"}>
                    <div class="menu flexRow side-navigation-active-page" onClick={() => window.location.href='Home.html'}>
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

                    {/* <div class="menu flexRow" onClick={() => window.location.href='Transactions.html'}>
                        <img class="menu-icon" src="./assets/icons/transaction-gray.png" />
                        <p class="menu-text">Transaction</p>
                    </div> */}
                </div>
            </div>


            {/* body */}
            <div class="body">
                <header>
                    <h1>HanapLingkod</h1>
                </header>
            
                <div class="dashboard">
                    <h2 class="dashboard-title">Dashboard</h2>
            
                    <div class="dashboard-overview flexRow">
                        <div class="recruiter-overview dbo-box flexRow">
                            <img class="overview-icon" src="./assets/icons/recruiter.png" />
            
                            <div class="overview-info">
                                <p class="overview-title">Recruiters</p>
                                <p class="info1">Verified   {recruiterUnVerified}/{recruiter}</p>
                            </div>
                        </div>

                        <div class="worker-overview dbo-box flexRow">
                            <img class="overview-icon" src="./assets/icons/worker.png" />
            
                            <div class="overview-info">
                                <p class="overview-title">Workers</p>
                                <p class="info1">Verified {workerUnVerified}/{worker}</p>
                            </div>
                        </div>

                    </div>
            
            
                </div>


                {/* Actions */}
                <div class="actions">
                    <div class="actionsHeader">
                        <hr />
                        <h2>Actions</h2>
                        <hr />

                    </div>

                    <div class="action-btn-container">
                        
                        <div className="action-btn" onClick={() => window.location.href='UsersView.html'}>
                            <img className="action-icon" src="./assets/icons/people.png" />
                            <p className="action-text">View<br />Users</p>
                        </div>
                        
                        <div class={"action-btn"} onClick={() => window.location.href='AccountVerification.html'}>
                            <img class="action-icon" src="./assets/icons/verification.png" />
                            <p class="action-text">Account<br />Verification</p>
                        </div>

                        <div class={"action-btn"} onClick={() => window.location.href='UserReports.html'}>
                            <img class={"action-icon"} src="./assets/icons/reports.png" />
                            <p class={"action-text"}>User<br />Reports</p>
                        </div>
                        
                        <div class={"action-btn"} onClick={() => window.location.href='Categories.html'}>
                            <img class={"action-icon"} src="./assets/icons/category.png" />
                            <p class={"action-text"}>Add/Modify<br />Category</p>
                        </div>

                        <div class="action-btn" onClick={() => window.location.href='signup.html'}>
                            <img class="action-icon" src="./assets/icons/account.png" />
                            <p class="action-text">Create<br />Account</p>
                        </div>

                        {/* <div class="action-btn" onClick={() => window.location.href='Transactions.html'}>
                            <img class="action-icon" src="./assets/icons/transaction-gray.png" />
                            <p class="action-text">User<br />Transactions</p>
                        </div> */}

                        
                        
                    </div>
                    
                </div>


                {/* Reports | Transactions */}
                <div class="transactions">

                </div>

            </div>
        </div>
    )
}


const rootNode = document.getElementById('rootHomeComponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(Home));