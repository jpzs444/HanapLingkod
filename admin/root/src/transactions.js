'use strict';

const Transactions = () => {

    const DATA = [
        {
            "type": "Request", 
            "recruiter": "Leah P. Custodio",
            "worker": "Juan D. Cruz",
            "date" : "Nov. 19",
            "status": "Pending"
        },
        {
            "type": "Booking", 
            "recruiter": "Ding P. Custodio",
            "worker": "Pedro P. Penduko",
            "date" : "Nov. 19",
            "status": "On-going"
        },
        {
            "type": "Booking", 
            "recruiter": "Leah P. Custodio",
            "worker": "Cardo D. Lisay",
            "date" : "Nov. 19",
            "status": "Completed"
        }
    ]
    
    const [transactions, setTransactions] = React.useState([])


    const fetchTransactions = async () => {
        try {
            await fetch(`https://hanaplingkod.onrender.com/`)
        } catch (error) {
            console.log("error fetching transactions (bookings): ", error)
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
            

            <div class="transactions">
                <h1>Transactions</h1>

                <div>
                    <div>
                        <table>
                            <tr class="trans-tr-title">
                                <th class="trans-th">
                                    <div class="trans-th-img">
                                        <img src="./assets/icons/transaction-white.png"/> 
                                    </div>
                                    <div class="trans-th-title">Type</div>
                                </th>
                                <th class="trans-th">
                                    <div class="trans-th-img">
                                        <img src="./assets/icons/recruiter-white.png"/>
                                    </div>
                                    <div class="trans-th-title">Recruiter</div>
                                </th>
                                <th class="trans-th">
                                    <div class="trans-th-img">
                                        <img src="./assets/icons/worker-white.png"/>
                                    </div>
                                    <div class="trans-th-title">Worker</div>
                                </th>
                                <th class="trans-th">
                                    <div class="trans-th-img">
                                        <img src="./assets/icons/calendar-white.png"/>
                                    </div>
                                    <div class="trans-th-title">Date</div>
                                </th>
                                <th class="trans-th">
                                    <div class="trans-th-img trans-th-img-status">
                                        <img src="./assets/icons/status-white.png"/>
                                    </div>
                                    <div class="trans-th-title">Status</div>
                                </th>
                            </tr>
                            {
                                DATA.map(item => (
                                    <tr class="trans-tr-data">
                                        <td>{item.type}</td>
                                        <td>{item.recruiter}</td>
                                        <td>{item.worker}</td>
                                        <td>{item.date}</td>
                                        <td>{item.status}</td>
                                    </tr>
                                ))
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const rootNode = document.getElementById('rootcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(Transactions));