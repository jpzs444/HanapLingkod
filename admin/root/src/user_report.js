'use strict';

const UserReport = () => {

    const DATA = [
        {
            "reportTitle": "Disrepesctful, rude, and attitude problem",
            "reportDate": "November 14",
            "reportElapsedTime": "5 days",
            "reportDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "reporter": "Leah Custodio",
            //"picture": 
            "userReported": "Juan D. Cruz", 
            "userRole": "Worker",
            "userStrikes": "2",
        },
    ]  

    const [isPermabanModalOpen, setIsPermabanModalOpen] = React.useState(false)

    const handleOpenPermabanModal = () => {
        setIsPermabanModalOpen(true);
    }

    const handleClosePermabanModal = () => {
        setIsPermabanModalOpen(false);
    }

    const [isPenalizeModalOpen, setIsPenalizeModalOpen] = React.useState(false)

    const handleOpenPenalizeModal = () => {
        setIsPenalizeModalOpen(true);
    }

    const handleClosePenalizeModal = () => {
        setIsPenalizeModalOpen(false);
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
            

            <div class="user-report">
                <h1>User Report</h1>

                <div>
                    {/* <div>
                        <button>Recruiters</button>
                        <button>Workers</button>
                    </div> */}
                    <div>                    
                        {
                            DATA.map(item => (
                                <div class="report">
                                    <h1 class="report-title">{item.reportTitle}</h1>
                                    <p class="report-date-reporter">Reported {item.reportDate} <span class="dot">•</span> {item.reportElapsedTime} ago <span class="dot">•</span> {item.reporter}</p>
                                    <h4>Reported User</h4>
                                    <div class="report-user-container">
                                        <div><img src="https://img.icons8.com/material-sharp/40/000000/user-male-circle.png"/></div>
                                        <div class="report-user-info">
                                            <div>{item.userReported}</div>
                                            <div class="report-user-info-add">
                                                <div>{item.userRole}</div>
                                                <div class="dot">•</div>
                                                <div>Strikes: <span class="strike-number">{item.userStrikes}</span></div>
                                            </div>
                                        </div>

                                        <button class="report-user-view-profile">View</button>
                                    </div>
                                    <h4>Report Description</h4>
                                    <p class="report-description">"{item.reportDescription}"</p>
                                </div>
                            ))
                        }
                    </div>
                    <div class="report-buttons">
                        <button type="button" class="button-permanent" onClick={() => handleOpenPermabanModal()}>Permanently Ban User</button>
                        <button type="button" class="button-penalize" onClick={() => handleOpenPenalizeModal()}>Penalize Reported User</button>
                        <button type="button" class="button-dismiss">Dismiss Report</button>
                    </div>
                </div>
            </div>

            {/* Permanent Ban User Modal */}
            <div class={isPermabanModalOpen ? "permaban-modal-container show-modal" : "permaban-modal-container hide-modal"}>
                <div class="permaban-modal">
                    <h2 class="modal-title">Permanently Ban User?</h2>
                    <p class="modal-description">By clicking "Yes", the account of the reported user will be permanently deleted in HanapLingkod.</p>
                    <div class="modal-buttons">
                        <button type="button" class="modal-button" id="permaban-yes">Yes</button>
                        <button type="button" class="modal-button modal-button-cancel" onClick={() => handleClosePermabanModal()}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* Penalize User Modal */}
            <div class={isPenalizeModalOpen ? "penalize-modal-container show-modal" : "penalize-modal-container hide-modal"}>
                <div class="penalize-modal">
                    <h2 class="modal-title">Penalize Reported User?</h2>
                    <p class="modal-description">By clicking "Yes", the account of the reported user will be given a strike and will be penalized accordingly.</p>
                    <div class="modal-description-add">
                        <p>1st to 2nd strike: Sends warning</p>
                        <p>3rd strike: 1-day account ban</p>
                        <p>4th strike: 3-day account ban</p>
                        <p>5th strike: 7-day account ban</p>
                        <p>6th strike: Permanent ban</p>
                    </div>
                   <div class="modal-buttons">
                        <button type="button" class="modal-button" id="penalize-yes">Yes</button>
                        <button type="button" class="modal-button modal-button-cancel" onClick={() => handleClosePenalizeModal()}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const rootNode = document.getElementById('rootcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(UserReport));