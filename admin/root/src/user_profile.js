'use strict';

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
            

            <div class="userprof">
                <h1>User Profile</h1>
                
                <div class="userprof-content">
                    <div class="userprof-content-side">
                        <div class="userprof-image">
                            <img src={DATA.userprofImage}/>
                        </div>
                        <p class="userprof-role">{DATA.userprofRole}</p>
                        <div class="userprof-strikes-container">
                            <p>Strikes:</p>
                            <p>{DATA.userprofStrikes}/5</p>
                        </div>
                    </div>

                    <div class="userprof-content-main">                    
                        <div class="userprof-main-info">
                            <div class="info-indiv-container">
                                <p>Name</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/account.png"/>
                                    <p class="userprof-name">{DATA.userprofName}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p>Phone Number</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/phonenumber.png"/>
                                    <p class="userprof-info">{DATA.userprofPhone}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p>Address</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/location.png"/>
                                    <p class="userprof-info">{DATA.userprofAddress}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p>Work Description</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/description.png"/>
                                    <p class="userprof-info">{DATA.userprofWorkDesc}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p>Birthdate</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/birthday.png"/>
                                    <p class="userprof-info">{DATA.userprofBirthdate}</p>
                                </div>
                            </div>
                        </div>

                        <div class="userprof-rating-heading">
                            <h3>Ratings and Reviews</h3>
                            <div class="rating-heading-icon">
                                <img src="./assets/icons/star-yellow.png"/>
                            </div>
                            <p>{DATA.userprofAvgRating}</p>
                        </div>

                        <div class="userprof-main-rating">
                            <div class="rating-indiv-container">
                                <div class="rating-indiv-upper">
                                    <div class="rating-sender">
                                        <div class="sender-image-container">
                                            <img src={RATING.ratingSenderImage}/>
                                        </div>
                                        <div class="sender-details-container">
                                            <p>{RATING.ratingSender}</p>
                                            <p>{RATING.ratingDate}, {RATING.ratingTime}</p>
                                        </div>
                                    </div>
                                    <div class="rating-stars">
                                        <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                        <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                        <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                        <div class="star-container"><img src="./assets/icons/star-yellow.png"/></div>
                                        <div class="star-container"><img src="./assets/icons/star-empty.png"/></div>
                                    </div>
                                </div>
                                <div class="rating-indiv-lower">
                                    <p>{RATING.ratingReview}</p>
                                </div>
                            </div>
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