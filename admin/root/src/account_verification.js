'use strict';

const AccountVerification = () => {

    const DATA = [
        {"name": "Juan D. Cruz", "role": "Worker", "address": "Bagasbas, Daet, Camarines Norte",},
        {"name": "Leah Custodio", "role": "Recruiter", "address": "Awitan, Daet, Camarines Norte",},
        {"name": "Pedro P. Penduko", "role": "Worker", "address": "Awitan, Daet, Camarines Norte",},
    ]

    const [role, setRole] = React.useState(false)
    const [user, setUser] = React.useState([])

    const [sideNavOpen, setSideNavOpen] = React.useState(false)

    React.useEffect(() => {
        fetchUserData(role)
    }, [])

    const handleOnClickItem = (user) => {
        console.log("hi ", user.firstname)
        sessionStorage.setItem("viewUserProfile_Id", user._id)
        sessionStorage.setItem("viewUserProfile_role", user.role)
        window.location.assign("./AccountInformation.html")
    }

    const handleSwitchRoleType = (b) => {
        setRole(b)
        fetchUserData(b)
        console.log("role: ", b)
    }

    const fetchUserData = async (role) => {
        // role == boolean
        let isVerified = role ? "verifiedUsers" : "unverifiedUsers"
        
        try {
            await fetch(`https://hanaplingkod.onrender.com/${isVerified}`, {
                method: 'GET',
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                console.log(data)
                role ? setUser([...data.verifiedWorkers, ...data.verifiedRecruiters])
                :
                setUser([...data.unverifiedWorkers, ...data.unverifiedRecruiters])
            })
            
        } catch (error) {
            console.log("error fetching user data(userViewJS): ", error)
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

                    <div class="menu flexRow side-navigation-active-page" onClick={() => window.location.href='AccountVerification.html'}>
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
            

            <div className="container">
                <h1 className="headerTitle">Account Verification</h1>

                <main>
                    <div className="tabButton_container">
                        <div>
                            <button className={role ? null : "active" } onClick={() => handleSwitchRoleType(false)} id="recruiterButton">Unverified</button>
                            <button class={role ? "active" : null} onClick={() => handleSwitchRoleType(true)} id="workerButton" >Verified</button>
                        </div>
                    </div>
                    <div className="table_container">
                        <table>
                            <tr className="table_header">
                                <th className="name_column">
                                    <div className="headerItem_container">
                                        <img className="column_icon" src="./assets/icons/account-white.png"/>
                                        <p className="tr_title tr_title_name">Name</p>
                                    </div>
                                </th>
                                <th className="role_column">
                                    <div className="headerItem_container">
                                        <img className="column_icon" src="./assets/icons/role-white.png"/>
                                        <p className="tr_title">Role</p>
                                    </div>
                                </th>
                                <th className="address_column">
                                    <div className="headerItem_container">
                                        <img className="column_icon" src="./assets/icons/location-white.png"/>
                                        <p className="tr_title">Address</p>
                                    </div>
                                </th>
                                <th className="rating_column">
                                    <div className="headerItem_container">
                                        <img class="column_icon header-icon" src="./assets/icons/star-white.png"/>
                                        <p className="tr_title">Rating</p>
                                    </div>
                                </th>
                            </tr>

                            {/* items */}
                            {
                                user.map(item => (
                                    <tr className="table_data" onClick={() => handleOnClickItem(item)}>
                                        <td className="name_column">
                                            <p className="tr_title">{`${item.firstname} ${item.middlename?.charAt(0).toUpperCase()} ${item.lastname}`}</p>
                                        </td>
                                        <td className="role_column">
                                            <p className="tr_title">{item.role}</p>
                                        </td>
                                        <td className="address_column">
                                            <p className="tr_title">{`${item.street}, Purok ${item.purok}, ${item.barangay}, ${item.city}, ${item.province}`}</p>
                                        </td>
                                        <td className="rating_column">
                                            <div className="rating_container">
                                                <img src="./assets/icons/star-yellow.png" />
                                                <p className="tr_title">{item.rating ? item.rating : "0"}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                </main>
            </div>
        </div>
    )
}

const rootNode = document.getElementById('rootcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(AccountVerification));