const sideNav = document.querySelector(".side-navigation")

const handleOpenSideNav = () => {
    sideNav.style.marginLeft = "0px"
}

const handleCloseSideNav = () => {
    sideNav.style.marginLeft = "-300px"
}

const handleActionBtnClick = (action) => {
    console.log("action clicked: ", action)
}

let adminData = sessionStorage.getItem("adminUsername")
let adminToken = sessionStorage.getItem("adminAccessToken")
let adminId = sessionStorage.getItem("adminId")
