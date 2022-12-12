'use strict';

const AccountInformation = () => {

    const DATA = {
        "accountImage": "https://www.panaynews.net/wp-content/uploads/2018/07/Coco-10-e1531191379317.jpg",
        "accountRole": "Worker",
        "accountName": "Juan D. Cruz", 
        "accountAddress": "Pogi, Bagasbas, Daet, Camarines Norte",
        "accountBirthdate": "January 1, 1993",
        "accountPhone": "09123456789",
        "accountWorkDesc": "Will do my very best to serve my clients",
    }

    const [user, setUser] = React.useState({})
    const [userBirthday, setUserBirthday] = React.useState("")
    const [isVerifyModalOpen, setVerifyModalOpen] = React.useState(false);

    const [sideNavOpen, setSideNavOpen] = React.useState(false)

    React.useEffect(() => {
        fetchUserInformation()
    }, []);

    const handleOpenVerifyModal = () => {
        setVerifyModalOpen(true)
    }

    const handleCloseVerifyModal = () => {
        setVerifyModalOpen(false)
    }

    const fetchUserInformation = async () => {
        try {
            let userRole = sessionStorage.getItem("viewUserProfile_role")
            let userId = sessionStorage.getItem("viewUserProfile_Id")

            await fetch(`https://hanaplingkod.onrender.com/${userRole}/${userId}`, {
                method: 'GET',
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                console.log(data)
                setUser({...data})
                setUserBirthday(getBirthday(data.birthday))
            })
        } catch (error) {
            console.log("error fetching user information(account iformation): ", error)
        }
    }

    const handleVerifyingUser = async () => {
        console.log("verify a user")

        try {
            let userRole = sessionStorage.getItem("viewUserProfile_role")
            let userId = sessionStorage.getItem("viewUserProfile_Id")

            await fetch(`https://hanaplingkod.onrender.com/verifyAUser/${userRole}`, {
                method: 'PUT',
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                },
                body: JSON.stringify({
                    id: userId
                })
            })
            handleCloseVerifyModal()
            window.location.assign("./AccountVerification.html")
        } catch (error) {
            console.log("error verifying a user: ", error)
        }
    }

    const getBirthday = (date) => {
        let tempDate = new Date(date)
        let month= ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
        let birthMonth = month[tempDate.getMonth()]

        let birthday = `${birthMonth} ${tempDate.getDate()}, ${tempDate.getFullYear()}`
        console.log("bday: ", birthday)
        return birthday
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

            {/* side navigation */}
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

                    {/* <div class="menu flexRow" onClick={() => window.location.href='Transactions.html'}>
                        <img class="menu-icon" src="./assets/icons/transaction-gray.png" />
                        <p class="menu-text">Transaction</p>
                    </div> */}
                </div>
            </div>
            

            <div class="accinfo">
                <h1>Account Information</h1>
                
                <div class="accinfo-content">
                    <div class="accinfo-content-side">
                        <div class="account-image">
                            <img src={user.profilePic === 'pic' ? "./assets/icons/account.png" : user.profilePic}/>
                        </div>
                        <p class="account-role">{user.role}</p>
                    </div>

                    <div class="accinfo-content-main">                    
                        <div class="account-main-info main-user-information">
                            <div class="info-indiv-container">
                                <p class="info-label">Name</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/account.png"/>
                                    <p class="account-name">{`${user.firstname} ${user.middlename?.charAt(0).toUpperCase()} ${user.lastname}`}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p class="info-label">Phone Number</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/phonenumber.png"/>
                                    <p class="account-info">{user.phoneNumber}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p class="info-label">Address</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/location.png"/>
                                    <p class="account-info">{`${user.street}, Purok ${user.purok}, ${user.barangay}, ${user.city}, ${user.province}`}</p>
                                </div>
                            </div>
                            {
                                user.role === 'worker' &&
                                <div class="info-indiv-container">
                                    <p class="info-label">Work Description</p>
                                    <div class="info-indiv">
                                        <img src="./assets/icons/description.png"/>
                                        <p class="account-info">{user.workDescription}</p>
                                    </div>
                                </div>
                            }
                            <div class="info-indiv-container">
                                <p class="info-label">Birthdate</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/birthday.png"/>
                                    <p class="account-info">{userBirthday}</p>
                                </div>
                            </div>
                        </div>

                        <h3>Government-Issued/Valid ID</h3>

                        <div class="account-main-info">
                            <img className={"govId-image"} src={user.GovId} />
                        </div>

                        {
                            user.role === "worker" &&
                            <>
                                <h3>License/Proof of Profession</h3>

                                <div class="account-main-info">
                                    <img className={"govId-image"} src={user.licenseCertificate} />
                                </div>
                            </>
                        }
                        
                        {
                            !user.verification &&
                            <button type="button" class="verify-account-btn" onClick={() => handleOpenVerifyModal()}>Verify Account</button>
                        }
                    </div>
                </div>
            </div>

            {/* Verify Account Modal */}
            <div class={isVerifyModalOpen ? "verify-modal-container show-modal" : "verify-modal-container hide-modal"}>
                <div class="verify-modal">
                    <h2 class="modal-title">Verify Account?</h2>
                    <p class="modal-description">
                        By clicking ‘Verify Account’, you let other users on the app 
                        know that this user has met the requirements given to its 
                        account type.
                    </p>
                    <div class="modal-buttons">
                        <button type="button" class="modal-button" id="confirm-verify" onClick={() => handleVerifyingUser()}>Verify</button>
                        <button type="button" class="modal-button modal-button-cancel" onClick={() => handleCloseVerifyModal()}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const rootNode = document.getElementById('rootcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(AccountInformation));