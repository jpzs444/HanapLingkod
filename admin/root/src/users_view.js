'use strict';

const UsersView = () => {

    const DATA = [
        {"name": "Juan D. Cruz", "address": "Pogi, Daet",},
        {"name": "Theo D. Cruz", "address": "Pogi, Daet",},
        {"name": "Third D. Cruz", "address": "Pogi, Daet",},
        {"name": "Frank D. Cruz", "address": "Pogi, Daet",},
        {"name": "Ferdinand D. Cruz", "address": "Pogi, Daet",},
        {"name": "Seth D. Cruz", "address": "Pogi, Daet",},
        {"name": "Sven D. Cruz", "address": "Pogi, Daet",},
        {"name": "Emma D. Cruz", "address": "Pogi, Daet",},
        {"name": "Emma D. Cruz", "address": "Pogi, Daet",},
        {"name": "Emma D. Cruz", "address": "Pogi, Daet",},
        {"name": "Emma D. Cruz", "address": "Pogi, Daet",},
        {"name": "Emma D. Cruz", "address": "Pogi, Daet",},
    ]

    const [searchWord, setSearchWord] = React.useState("")
    const [role, setRole] = React.useState(true)
    const [userList, setUserList] = React.useState([])

    React.useEffect(() => {
        fetchUserData(role)
    }, [])

    const handleOnClickItem = (user) => {
        console.log("hi userId: ", user.role)
        sessionStorage.setItem("viewUserProfile_Id", user._id)
        sessionStorage.setItem("viewUserProfile_role", user.role)
        window.location.assign("./UserProfile.html")
    }

    const handleSwitchRoleType = (b) => {
        setRole(b)
        fetchUserData(b)
        console.log("role: ", b)
    }

    const fetchUserData = async (role) => {
        // role == boolean
        let userRole = role ? "recruiter" : "worker"
        
        try {
            await fetch(`https://hanaplingkod.onrender.com/${userRole}`, {
                method: 'GET',
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                console.log(data)
                setUserList([...data])
            })
            
        } catch (error) {
            console.log("error fetching user data(userViewJS): ", error)
        }
    }

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

            {/* Side Menu/Navigation */}
            <div class="side-navigation">
                <div class="close-btn-div">
                    <button id="close-side-menu" onclick="handleCloseSideNav()">
                        <img class="arrow-left-menu" src="./assets/icons/arrow-left-long.png" />
                    </button>
                </div>

                <div class="side-nav-menu">
                    <div class="menu flexRow">
                        <img class="menu-icon" src="./assets/icons/home.png" />
                        <p class="menu-text">Home</p>
                    </div>

                    <div class="menu flexRow">
                        <img class="menu-icon" src="./assets/icons/penalization.png" />
                        <p class="menu-text">User Penalization</p>
                    </div>

                    <div class="menu flexRow">
                        <img class="menu-icon" src="./assets/icons/verification.png" />
                        <p class="menu-text">User Verification</p>
                    </div>

                    <div class="menu flexRow">
                        <img class="menu-icon" src="./assets/icons/reports.png" />
                        <p class="menu-text">User Reports</p>
                    </div>

                    <div class="menu flexRow">
                        <img class="menu-icon" src="./assets/icons/account.png" />
                        <p class="menu-text">Create Account</p>
                    </div>

                    <div class="menu flexRow">
                        <img class="menu-icon" src="./assets/icons/transaction.png" />
                        <p class="menu-text">Transaction</p>
                    </div>
                </div>
            </div>
            

            <div className="container">
                <h1 className="headerTitle">Users of HanapLingkod</h1>

                <main>
                    <div className="tabButton_container">
                        <div>
                            <button className={role ? "active" : null} onClick={(e) => {e.preventDefault(); handleSwitchRoleType(true); fetchUserData(true);}} id="recruiterButton">Recruiters</button>
                            <button class={role ? null : "active"} onClick={(e) => {e.preventDefault(); handleSwitchRoleType(false); fetchUserData(false);}} id="workerButton" >Workers</button>
                        </div>
                        <div class="search-container">
                            <input type="text" placeholder="Search a user" onChange={e => setSearchWord(e.target.value)} />
                            <button>
                                <img src="https://img.icons8.com/fluency-systems-regular/20/null/search--v1.png"/>
                            </button>
                        </div>
                    </div>
                    <div className="table_container">
                        <table>
                            <tr className="table_header">
                                <th className="image_column"></th>
                                <th className="name_column">
                                    <div className="headerItem_container">
                                        <img className="column_icon" src="./assets/icons/account-white.png"/>
                                        <p className="tr_title">Name</p>
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
                                        <img className="column_icon" src="./assets/icons/star-white.png"/>
                                        <p className="tr_title">Rating</p>
                                    </div>
                                </th>
                            </tr>

                            {/* items */}
                            {
                                userList.map(user => (
                                    <tr className="table_data" onClick={() => {handleOnClickItem(user)}}>
                                        <td className="image_column">
                                            <img className="userProfilePic" src={user.profilePic === 'pic' ? "./assets/icons/account.png" : user.profilePic} />
                                        </td>
                                        <td className="name_column">
                                            <p className="tr_title">{`${user.firstname} ${user.middlename.charAt(0).toUpperCase()} ${user.lastname}`}</p>
                                        </td>
                                        <td className="address_column">
                                            <p className="tr_title">{`${user.street}, Purok ${user.purok}, ${user.barangay}, ${user.city}, ${user.province}`}</p>
                                        </td>
                                        <td className="rating_column">
                                            <div className="rating_container">
                                                <img src="./assets/icons/star-yellow.png"></img>
                                                <p className="tr_title">{user.rating ? user.rating : "0"}</p>
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
root.render(React.createElement(UsersView));