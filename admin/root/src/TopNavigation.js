'use-strict'

export const TopNavigation = () => {
    return(
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
    )
}

const rootNode = document.getElementById('topnavigationcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(TopNavigation));