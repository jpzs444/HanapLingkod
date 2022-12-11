"use-strict";


function Login() {

    const passwordRef = React.useRef(null);
  
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    const handleLogin = async () => {
      console.log("login button")

      try {
        await fetch(`https://hanaplingkod.onrender.com/login/admin`, {
          method: "POST",
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          })
        }).then(res => res.json())
        .then(data => {
          console.log("login admin data: ", data)

          sessionStorage.setItem("adminAccessToken", data.accessToken)
          sessionStorage.setItem("adminUsername", data.username)
          sessionStorage.setItem("adminId", data._id)
          
          window.location.assign("./index.html")
          
        })
        // .then(data => console.log("success login: ", data)) 
        console.log("success?")
      } catch (error) {
        console.log("error login: ", error)
      }
    }
  
  
    return (
      <div className='loginContainer'>
        <div className='imageContainer'>
          <img className='hanapLingkodLogo' src={"./assets/logo/logo_full.png"} />
        </div>
        <div className='formContainer'>
          <main>
            <h1>Login to HanapLingkod</h1>

            <div className='form'>
              <label for="username">Username</label>
              <input type="text" name="username" id="username" 
                onChange={(e) => {
                  // e.keyCode == 13 && passwordRef.current.focus()
                  setUsername(e.target.value)
                }}
              />

              <label for="username">Password</label>
              <input type="password" name="password" id="password" ref={passwordRef} 
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button className='button' id="loginButton" onClick={() => handleLogin()}>Login</button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const rootNode = document.getElementById('rootcomponent');
  const root = ReactDOM.createRoot(rootNode);
  root.render(React.createElement(Login));