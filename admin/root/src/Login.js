"use-strict";


function Login() {

    const passwordRef = React.useRef(null);
  
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    const [invalidLogin, setInvalidLogin] = React.useState(false)
    const [inputRequired, setInputRequired] = React.useState(false)

    const handleLogin = async () => {
      console.log("login button")

      setInvalidLogin(false)
      setInputRequired(false)
      if(!username || !password){
        setInputRequired(true)
        return;
      }


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

          if(data?._id){
            sessionStorage.setItem("adminAccessToken", data.accessToken)
            sessionStorage.setItem("adminUsername", data.username)
            sessionStorage.setItem("adminId", data._id)
            
            window.location.assign("./Home.html")

          } else {
            setInvalidLogin(true)
          }
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
              {
                invalidLogin &&
                <div class={"invalidUsernamePassword-container"}>
                  <p>{inputRequired ? "Username or password missing. Try again" : "Invalid username or password. Try again"}</p>
                </div>
              }
              {
                inputRequired &&
                <div class={"require-UsernamePassword-container"}>
                  <p>{inputRequired ? "Username or password missing. Try again" : "Invalid username or password. Try again"}</p>
                </div>
              }

              <label for="username">Username</label>
              <input type="text" name="username" id="username" required
                onChange={(e) => {
                  // e.keyCode == 13 && passwordRef.current.focus()
                  setUsername(e.target.value)
                }}
              />

              <label for="username">Password</label>
              <input type="password" name="password" id="password" ref={passwordRef} required
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button className='button' id="loginButton" type="submit" onClick={() => handleLogin()}>Login</button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const rootNode = document.getElementById('rootcomponent');
  const root = ReactDOM.createRoot(rootNode);
  root.render(React.createElement(Login));