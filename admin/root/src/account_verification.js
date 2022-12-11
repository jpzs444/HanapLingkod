'use strict';

const AccountVerification = () => {

    const DATA = [
        {"name": "Juan D. Cruz", "role": "Worker", "address": "Bagasbas, Daet, Camarines Norte",},
        {"name": "Leah Custodio", "role": "Recruiter", "address": "Awitan, Daet, Camarines Norte",},
        {"name": "Pedro P. Penduko", "role": "Worker", "address": "Awitan, Daet, Camarines Norte",},
    ]

    const [role, setRole] = React.useState(false)
    const [user, setUser] = React.useState([])

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