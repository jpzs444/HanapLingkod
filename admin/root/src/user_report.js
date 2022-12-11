'use strict';
// import dayjs from 'https://cdn.skypack.dev/dayjs';
// let relativeTime = require('dayjs/plugin/relativeTime')
// dayjs.extend(relativeTime)

const UserReport = () => {

    const DATA = {
        "reportTitle": "Disrepesctful, rude, and attitude problem",
        "reportDate": "November 14",
        "reportElapsedTime": "5 days",
        "reportDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "reporter": "Leah Custodio",
        "userImage": "https://www.panaynews.net/wp-content/uploads/2018/07/Coco-10-e1531191379317.jpg", 
        "userReported": "Juan D. Cruz", 
        "userRole": "Worker",
        "userStrikes": "2",
    }


    const [isPermabanModalOpen, setIsPermabanModalOpen] = React.useState(false)
    const [reportInformation, setReportInformation] = React.useState({})
    const [reportedUser, setReportedUser] = React.useState({})
    const [senderUser, setSenderUser] = React.useState({})
    const [cDate, setCDate] = React.useState("")
    const [cDateToNow, setCDateToNow] = React.useState(0)
    const [offense, setOffense] = React.useState(0)

    React.useEffect(() => {
        handleFetchReportInformation()
    }, []);

    const handleFetchReportInformation = async () => {
        try {
            let reportId = sessionStorage.getItem("selectedReportItem")
            await fetch(`https://hanaplingkod.onrender.com/reportAUser/${reportId}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': sessionStorage.getItem("adminAccessToken")
                }
            }).then(res => res.json())
            .then(data => {
                console.log("report item: ", data)
                setReportInformation({...data.report})
                setReportedUser({...data.reportedUser})
                setSenderUser({...data.senderUser})
                viewDate(data.report.createdAt)
                setOffense(data.offense)
            })
        } catch (error) {
            console.log("error fetch report information: ", error)
        }
    }

    // Add offense to user | Penalize Reported User
    const handlePenalizeReportedUser = async (e) => {
        console.log("penalize reported user")
        try {
            // await fetch(`https://hanaplingkod.onrender.com/banUser/${reportedUser.role}`, {
            //     method: "POST",
            //     headers: {
            //         'content-type': 'application/json',
            //         'Authorization': sessionStorage.getItem("adminAccessToken") 
            //     },
            //     body: JSON.stringify({
            //         id: reportedUser.id
            //     })
            // }).then(res => res.json())
            
            handleClosePenalizeModal()
            window.location.assign("./UserReports.html")

        } catch (error) {
            console.log("error penalizing reported user", error)
        }
    }


    // permanently bans a user
    const handlePermanentlyBanReportedUser = async (e) => {
        console.log("permanently banned reported user")
        try {
            // await fetch(`https://hanaplingkod.onrender.com/permanentBanUser/${reportedUser.role}`, {
            //     method: "POST",
            //     headers: {
            //         'content-type': 'application/json',
            //         'Authorization': sessionStorage.getItem("adminAccessToken") 
            //     },
            //     body: JSON.stringify({
            //         id: reportedUser.id
            //     })
            // }).then(res => res.json())
            
            handleClosePermabanModal()
            window.location.assign("./UserReports.html")

        } catch (error) {
            console.log("error penalizing reported user", error)
        }
    }


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

    const viewDate = (d) => {
        let month= ["January","February","March","April","May","June","July",
        "August","September","October","November","December"];
        let createdAt = new Date(d)

        let monthIndex = month[createdAt.getMonth()]
        let dd = `${monthIndex} ${createdAt.getDate()}`
        setCDate(dd.toString())
        console.log(dd)
    }

    const handleNotificationAge = (createdAt) => {
        let notifDate = new Date(createdAt)
        let dateNow = new Date()
        let dateDiff = Math.abs(dateNow.getTime() - notifDate.getTime())
    
        // convert milliseconds to seconds
        dateDiff = dateDiff / 1000
        // console.log("seconds: ", dateDiff)
    
        let day = Math.floor(dateDiff / 60 / 60 / 24)
        if(day === 0) {  
          let hours = Math.floor(dateDiff / 60 / 60 )
          if ( hours === 0 ) {
            let minutes = Math.floor(dateDiff / 60 % 60)
            
            if ( minutes === 0 ) {
              let seconds = Math.floor(dateDiff % 60)
              return `${seconds} seconds ago`
            }
            
            return minutes > 1 ? `${minutes} minutes ago` : `${minutes} minute ago`
          }
            return hours > 1 ? `${hours} hours ago` : `${hours} hour ago`
        }
        return day > 1 ? `${day} days ago` : `${day} day ago`
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
                    <div class="report">
                        <h1 class="report-title">{reportInformation.title}</h1>
                        <p class="report-date-reporter">Reported {cDate} <span class="dot">•</span> {handleNotificationAge(reportInformation.createdAt)}  <span class="dot">•</span> {`${senderUser.firstname} ${senderUser.lastname}`}</p>
                        <h4><img class="reported-user-icon" src="./assets/icons/account.png"/>Reported User</h4>
                        <div class="report-user-container">
                            <div class="report-user-img"><img src={reportedUser.profilePic === 'pic' ? "../assets/icons/account.png" : reportedUser.profilePic}/></div>
                            <div class="report-user-info">
                                <div>{`${reportedUser.firstname} ${reportedUser.lastname}`}</div>
                                <div class="report-user-info-add">
                                    <div>{reportedUser.role}</div>
                                    <div class="dot">•</div>
                                    <div>Strikes: <span class="strike-number">{offense}</span></div>
                                </div>
                            </div>

                            <button class="report-user-view-profile" onClick={() => {window.location.assign("./AccountInformation.html")}}>View</button>
                        </div>
                        <h4><img class="reported-desc-icon" src="./assets/icons/description.png"/>Report Description</h4>
                        <p class="report-description">"{reportInformation.description}"</p>
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
                        <button type="button" class="modal-button" id="permaban-yes" onClick={() => handlePermanentlyBanReportedUser()}>Yes</button>
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
                        <button type="button" class="modal-button" id="penalize-yes" onClick={() => handlePenalizeReportedUser()}>Yes</button>
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