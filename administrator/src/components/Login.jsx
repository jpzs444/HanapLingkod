import React, {useRef, useEffect, useState} from 'react'
import logo from '../assets/logo/logo_full.png'

function Login() {

  const passwordRef = useRef(null);

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    console.log("login button")
    console.log("username: ", username)
    console.log("password: ", password)
    try {
      await fetch(`http://localhost:3000/login/admin`, {
      // await fetch(`https://hanaplingkod.onrender.com/recruiter`, {
        method: "POST",
        headers: {
          'content-type': 'application/json',
          // "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmE1YWRmMDJjMDIyOGM2MTc1MDczMyIsInJvbGUiOiJyZWNydWl0ZXIiLCJpYXQiOjE2NzAzODMzNTh9.ud7_ScBpbpxQQ9q6Jf55fezvnwLHLv3SnhqjSDdR43U"
        },
        body: JSON.stringify({
          username: username,
          password: password,
        })
      }).then(response => {
        response.json()
      })
      .then(data => console.log("success login: ", data)) 
    } catch (error) {
      console.log("error login: ", error)
    }
  }

  return (
    <div className='loginContainer'>
      <div className='imageContainer'>
        <img className='hanapLingkodLogo' src={logo} />
      </div>
      <div className='formContainer'>
        <main>
          <h1>Login to HanapLingkod</h1>

          <div className='form'>
            <label for="username">Username</label>
            <input type="text" name="username" id="username" 
              onChange={(e) => {
                e.keyCode == 13 && passwordRef.current.focus()
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

export default Login