'use-strict';

function Home() {

    

    return (
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


            {/* body */}
            <div class="body">
                <header>
                    <h1>HanapLingkod</h1>
                </header>
            
                <div class="dashboard">
                    <h2 class="dashboard-title">Dashboard</h2>
            
                    <div class="dashboard-overview flexRow">
                        <div class="recruiter-overview dbo-box flexRow">
                            <img class="overview-icon" src="./assets//icons/recruiter.png" />
            
                            <div class="overview-info">
                                <p class="overview-title">Recruiters</p>
                                <p class="info1">Verified   10/20</p>
                            </div>
                        </div>

                        <div class="worker-overview dbo-box flexRow">
                            <img class="overview-icon" src="./assets//icons/worker.png" />
            
                            <div class="overview-info">
                                <p class="overview-title">Workers</p>
                                <p class="info1">Verified   10/20</p>
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
                        
                        <div class="action-btn" onclick="window.location.href='UsersView.html'">
                            <img class="action-icon" src="./assets/icons/people.png" />
                            <p class="action-text">View<br />Users</p>
                        </div>
                        
                        <div class="action-btn" onclick="window.location.href='AccountVerification.html'">
                            <img class="action-icon" src="./assets/icons/verification.png" />
                            <p class="action-text">Account<br />Verification</p>
                        </div>

                        <div class="action-btn" onclick="window.location.href='./UserReports.html'">
                            <img class="action-icon" src="./assets/icons/reports.png" />
                            <p class="action-text">User<br />Reports</p>
                        </div>
                        
                        <div class="action-btn" onclick="window.location.href='./Categories.html'">
                            <img class="action-icon" src="./assets/icons/category.png" />
                            <p class="action-text">Add/Modify<br />Category</p>
                        </div>

                        <div class="action-btn" onclick="window.location.href='./signup.html'">
                            <img class="action-icon" src="./assets/icons/account.png" />
                            <p class="action-text">Create<br />Account</p>
                        </div>

                        <div class="action-btn" onclick="window.location.href='./Transactions.html'">
                            <img class="action-icon" src="./assets/icons/transaction-gray.png" />
                            <p class="action-text">User<br />Transactions</p>
                        </div>

                        
                        
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