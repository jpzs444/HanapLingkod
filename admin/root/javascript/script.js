const sideNav = document.querySelector(".side-navigation")
const leftSide_nav = document.querySelector(".left")
const mainBody = document.querySelector("body")

const handleOpenSideNav = () => {
    sideNav.style.marginLeft = "0px"
    leftSide_nav.style.marginLeft = "300px"
    mainBody.style.marginLeft = "300px"
}

const handleCloseSideNav = () => {
    sideNav.style.marginLeft = "-300px"
    leftSide_nav.style.marginLeft = "0px"
    mainBody.style.marginLeft = "auto"
}

const handleActionBtnClick = (action) => {
    console.log("action clicked: ", action)
}