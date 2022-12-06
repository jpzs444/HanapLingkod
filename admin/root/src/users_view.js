'use strict';

const UsersView = () => {
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
            

            <div>
                <h1>Users of HanapLingkod</h1>

                <div>
                    <div>
                        <button>Recruiters</button>
                        <button>Workers</button>
                    </div>
                    <div>
                        <table>
                            <tr>
                                <th></th>
                                <th>
                                    <img src="https://img.icons8.com/material-sharp/96/000000/user-male-circle.png"/>
                                    Name
                                </th>
                                <th>
                                    <img src="https://img.icons8.com/sf-regular-filled/96/null/near-me.png"/>
                                    Address
                                </th>
                                <th></th>
                                <th>
                                    <img src="https://img.icons8.com/metro/26/000000/christmas-star.png"/>
                                    Rating
                                </th>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const rootNode = document.getElementById('rootcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(UsersView));