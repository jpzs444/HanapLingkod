'use strict';

let MONTH= ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];

const UserProfile = () => {

    const DATA = {
        "userprofImage": "https://www.panaynews.net/wp-content/uploads/2018/07/Coco-10-e1531191379317.jpg",
        "userprofRole": "Worker",
        "userprofStrikes": "0",
        "userprofName": "Juan D. Cruz", 
        "userprofAddress": "Pogi, Bagasbas, Daet, Camarines Norte",
        "userprofBirthdate": "January 1, 1993",
        "userprofPhone": "09123456789",
        "userprofWorkDesc": "Will do my very best to serve my clients",
        "userprofAvgRating": "4",
    }

    const RATING = {
        "ratingSenderImage": "http://contents.pep.ph/images2/writeups/34b625c31.jpg",
        "ratingSender": "Pedro Penduko",
        "ratingDate": "June 27",
        "ratingTime": "11:00 am",
        "ratingReview": "Recruiter is so sarap. You know that I love chicken nuggets 💖",
    }

    const [user, setUser] = React.useState({})
    const [userRatings, setUserRatings] = React.useState([])
    const [userBirthday, setUserBirthday] = React.useState('')
    const [userOffenses, setUserOffense] = React.useState(0)

    React.useEffect(() => {
        fetchUserInformation()
        fetchUserRatings()
        fetchUserOffense()
    }, [])


    const fetchUserInformation = async () => {
        try {
            let userRole = sessionStorage.getItem("viewUserProfile_role")
            let userId = sessionStorage.getItem("viewUserProfile_Id")

            console.log(userRole)
            console.log(userId)
            await fetch(`https://hanaplingkod.onrender.com/${userRole}/${userId}`, {
                method: "GET",
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                console.log("user information: ", data)
                setUser({...data})
                setUserBirthday(getBirthday(data.birthday))
            })
        } catch (error) {
            console.log("error fetching user information", error)
        }
    }

    const fetchUserRatings = async () => {
        try {
            let ratingRoute = sessionStorage.getItem("viewUserProfile_role") === 'recruiter' ? "RecruiterComment" : "workerComment"
            let userId = sessionStorage.getItem("viewUserProfile_Id")

            await fetch(`https://hanaplingkod.onrender.com/${ratingRoute}/${userId}`, {
                method: "GET",
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                console.log("user ratings: ", data)
                setUserRatings([...data.comments])
            })
        } catch (error) {
            console.log("error fetching user ratings: ", error)
        }
    }

    const fetchUserOffense = async () => {
        try {
            let ratingRoute = sessionStorage.getItem("viewUserProfile_role")
            let userId = sessionStorage.getItem("viewUserProfile_Id")

            await fetch(`https://hanaplingkod.onrender.com/strike/${ratingRoute}/${userId}`, {
                method: "GET",
                headers: {
                    'content-type': "application/json",
                    "Authorization": sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                console.log("user offenses: ", data)
                setUserOffense(data)
            })
        } catch (error) {
            console.log("error fetching user offense: ", error)
        }
    }

    const getBirthday = (date) => {
        let tempDate = new Date(date)
        
        let birthMonth = MONTH[tempDate.getMonth()]

        let birthday = `${birthMonth} ${tempDate.getDate()}, ${tempDate.getFullYear()}`
        console.log("bday: ", birthday)
        return birthday
    }

    return(
        <div>
            {/* <nav class="flexRow">
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
            </nav> */}
            

            <div class="userprof">
                <h1>User Profile</h1>
                
                <div class="userprof-content">
                    <div class="userprof-content-side">
                        <div class="userprof-image">
                            <img src={user.profilePic === 'pic' ? "./assets/icons/account.png" : user.profilePic}/>
                        </div>
                        <p class="userprof-role">{user.role}</p>
                        <div class="userprof-strikes-container">
                            <p>Strikes:</p>
                            <p>{userOffenses}/5</p>
                        </div>
                    </div>

                    <div class="userprof-content-main">                    
                        <div class="userprof-main-info">
                            <div class="info-indiv-container">
                                <p>Name</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/account.png"/>
                                    <p class="userprof-name">{`${user.firstname} ${user.middlename?.charAt(0).toUpperCase()} ${user.lastname}`}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p>Phone Number</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/phonenumber.png"/>
                                    <p class="userprof-info">{user.phoneNumber}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p>Address</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/location.png"/>
                                    <p class="userprof-info">{`${user.street}, Purok ${user.purok}, ${user.barangay}, ${user.city}, ${user.province}`}</p>
                                </div>
                            </div>
                            {
                                user.role === 'worker' &&
                                <div class="info-indiv-container">
                                    <p>Work Description</p>
                                    <div class="info-indiv">
                                        <img src="./assets/icons/description.png"/>
                                        <p class="userprof-info">{user.workDescription}</p>
                                    </div>
                                </div>
                            }
                            <div class="info-indiv-container">
                                <p>Birthdate</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/birthday.png"/>
                                    <p class="userprof-info">{userBirthday}</p>
                                </div>
                            </div>
                        </div>

                        <div class="userprof-rating-heading">
                            <h3>Ratings and Reviews</h3>
                            <div class="rating-heading-icon">
                                <img src="./assets/icons/star-yellow.png"/>
                            </div>
                            <p>{user.rating ? user.rating : "0" }</p>
                        </div>

                        <div class="userprof-main-rating">
                        {
                            userRatings.map(function(rating) {
                                let date = new Date(rating.created_at)
                                let ratingDate = `${MONTH[date.getMonth()]} ${date.getDate()}, ${date.getHours()}:${date.getMinutes()}`
                                return (
                                <div class="rating-indiv-container">
                                    <div class="rating-indiv-upper">
                                        <div class="rating-sender">
                                            <div class="sender-image-container">
                                                <img src={rating.reviewer.profilePic === 'pic' ? './assets/icons/account.png' : rating.reviewer.profilePic}/>
                                            </div>
                                            <div class="sender-details-container">
                                                <p>{`${rating.reviewer.firstname} ${rating.reviewer.middlename?.charAt(0).toUpperCase()} ${rating.reviewer.lastname}`}</p>
                                                <p>{ratingDate}</p>
                                            </div>
                                        </div>
                                        <div class="rating-stars">
                                            {
                                                rating.rating === 5 &&
                                                <>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                </>
                                            }
                                            {
                                                rating.rating === 4 &&
                                                <>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                                </>
                                            }
                                            {
                                                rating.rating === 3 &&
                                                <>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                                </>
                                            }
                                            {
                                                rating.rating === 2 &&
                                                <>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                                </>
                                            }
                                            {
                                                rating.rating === 1 &&
                                                <>
                                                    <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                                    <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                    <div class="rating-indiv-lower">
                                        <p>{rating.message ? rating.message : "-- no comment --"}</p>
                                    </div>
                                </div>
                            )})
                        }
                        {
                            userRatings.length === 0 &&
                            <div class={"no-available-ratings"}>No available ratings at the moment</div>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const rootNode = document.getElementById('rootcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(UserProfile));