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

    const [isVerifyModalOpen, setVerifyModalOpen] = React.useState(false);

    const handleOpenVerifyModal = () => {
        setVerifyModalOpen(true)
    }

    const handleCloseVerifyModal = () => {
        setVerifyModalOpen(false)
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
            

            <div class="accinfo">
                <h1>Account Information</h1>
                
                <div class="accinfo-content">
                    <div class="accinfo-content-side">
                        <div class="account-image">
                            <img src={DATA.accountImage}/>
                        </div>
                        <p class="account-role">{DATA.accountRole}</p>
                    </div>

                    <div class="accinfo-content-main">                    
                        <div class="account-main-info">
                            <div class="info-indiv-container">
                                <p>Name</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/account.png"/>
                                    <p class="account-name">{DATA.accountName}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p>Phone Number</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/phonenumber.png"/>
                                    <p class="account-info">{DATA.accountPhone}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p>Address</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/location.png"/>
                                    <p class="account-info">{DATA.accountAddress}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p>Work Description</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/description.png"/>
                                    <p class="account-info">{DATA.accountWorkDesc}</p>
                                </div>
                            </div>
                            <div class="info-indiv-container">
                                <p>Birthdate</p>
                                <div class="info-indiv">
                                    <img src="./assets/icons/birthday.png"/>
                                    <p class="account-info">{DATA.accountBirthdate}</p>
                                </div>
                            </div>
                        </div>

                        <h3>Government-Issued/Valid ID</h3>

                        <div class="account-main-info">
                            
                        </div>

                        <h3>License/Proof of Profession</h3>

                        <div class="account-main-info">
                            
                        </div>

                        <button type="button" class="verify-account-btn" onClick={() => handleOpenVerifyModal()}>Verify Account</button>
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
                        <button type="button" class="modal-button" id="confirm-verify">Verify</button>
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