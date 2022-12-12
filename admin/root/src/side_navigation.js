'use-strict';


const SideNavigation = () => {
    return(
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
    )
}

const rootNode = document.getElementById('sidenavigationcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(SideNavigation));