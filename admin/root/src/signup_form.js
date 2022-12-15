'use strict';

function SignUpForm() {
    const [userInformation, setUserInformation] = React.useState({
        username: "",
        firstname: "",
        lastname: "",
        middlename: "",
        firstname: "",
        sex: "male",
        birthday: "",
        age: "",
        email: "",
        phoneNumber: ""
    });

    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [passwordMatch, setPasswordMatch] = React.useState(true)

    // React.useEffect(() => {
    //     console.log(userInformation)
    // }, [userInformation])


    const handleCheckPasswordMatch = (e) => {
        e.preventDefault()

        let target = e.target

        if(target.name === "password") {
            console.log("from password")
            setPassword(target.value)
        } else if(target.name === "confirmPassword") {
            console.log("from confirm password")
            setConfirmPassword(target.value)
        }
    }

    const handleCreateAccount = (e) => {
        e.preventDefault()
        console.log("hi submit form")
        console.log("userInformation: ", userInformation)

        try {

            fetch(`https://hanaplingkod.onrender.com/signup/admin`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    username: userInformation.username,
                    password: confirmPassword,
                    firstname: userInformation.firstname,
                    lastname: userInformation.lastname,
                    middlename: userInformation.middlename,
                    birthday: userInformation.birthday,
                    age: userInformation.age,
                    sex: userInformation.sex,
                    phoneNumber: userInformation.phoneNumber,
                    emailAddress: userInformation.email,
                }),
            }).then(res => {
                if(res.ok){
                    window.location.assign("./index.html")
                    return res.json()
                } else {
                    throw res
                }
            })

        } catch (error) {
            console.log("error fetch service cat: ", error)
        }
    }

    return (
        <div className="signup-container">
            {/* logo */}
            <div class={"leftface"}>
                <img src="./assets/logo/logo_full.png" className="image_logo left" />
                <button onClick={() => window.location.href='Home.html'}>Go to Homepage</button>
            </div>

            {/* <button onClick={() => handleCreateAccount()}>try me!</button> */}

            <div className='right'>
                <div className="form-container">
                    <h2>Create Administrator Account</h2>
                    <form onSubmit={handleCreateAccount}>
                        {/* firstname & middlename */}
                        <div className="formRow">
                            <div className="item_wide">
                                <label className="label" for="fname">First Name</label>
                                <input type="text" id="fname" className="input_wide_input" placeholder="Juan" name="fname" required 
                                onChange={e => {
                                    setUserInformation(prev => ({...prev, firstname: e.target.value}))
                                    console.log(userInformation)
                                }} />
                            </div>
                            <div className="item_wide">
                                <label className="label" for="mname">Middle Name (Optional)</label>
                                <input type="text" id="mname" className="input_wide_input" placeholder="Lopez" name="mname" onChange={e => setUserInformation(prev => ({...prev, middlename: e.target.value}))} />
                            </div>
                        </div>

                        {/* lastname */}
                        <div className="formRow">
                            <div className="item_wide">
                                <label className="label" for="lname">Last Name</label>
                                <input type="text" id="lname" className="input_wide_input" placeholder="de La Cruz" name="lname" required onChange={e => setUserInformation(prev => ({...prev, lastname: e.target.value}))} />
                            </div>
                        </div>

                        {/* username & email */}
                        <div className="formRow">
                            <div className="item_wide">
                                <label className="label" for="username">Username</label>
                                <input type="text" id="username" className="input_wide_input" placeholder="juandlc" name="username" required onChange={e => setUserInformation(prev => ({...prev, username: e.target.value}))} />
                            </div>
                            <div className="item_wide">
                                <label className="label" for="email">Email</label>
                                <input type="email" id="email" className="input_wide_input" placeholder="example@email.com" name="email" required onChange={e => setUserInformation(prev => ({...prev, email: e.target.value}))} />
                            </div>
                        </div>

                        {/* password & confirm password */}
                        <div className="formRow">
                            <div className="item_wide">
                                <label className="label" for="password">Password</label>
                                <input type="password" id="password" className="input_wide_input" placeholder="Password"
                                onChange={e => {
                                    if(confirmPassword){
                                        setPasswordMatch(confirmPassword === e.target.value)
                                    }
                                    handleCheckPasswordMatch(e)
                                }} 
                                name="password" required />
                            </div>
                            <div className="item_wide">
                                <label className="label" for="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" className="input_wide_input" placeholder="Confirm Password"
                                onChange={e => {
                                    if(password){
                                        setPasswordMatch(password === e.target.value)
                                    }
                                    handleCheckPasswordMatch(e)
                                }} 
                                name="confirmPassword" required />
                            </div>
                            {
                                !passwordMatch &&
                                <p className="password_match">Passwords does not match</p>
                                
                            }
                            {
                                (password.length < 8 && password.length > 0) && passwordMatch &&
                                <p className="password_match">Password should be at least 8 characters long</p>
                            }
                        </div>

                        {/* birthday & (age and sex) */}
                        <div className="formRow">
                            <div className="item_wide">
                                <label className="label" for="birthday">Birthday</label>
                                <input type="date" id="birthday" className="input_wide_input" name="birthday" required onChange={e => {
                                    setUserInformation(prev => ({...prev, birthday: e.target.value}))
                                }} />
                            </div>
                            {/* age and sex */}
                            <div className="item_multi">
                                <div className="item_small">
                                    <label className="label" for="age">Age</label>
                                    <input type="number" id="age" className="input_smaller" name="age" required onChange={e => setUserInformation(prev => ({...prev, age: e.target.value}))} />
                                </div>
                                <div className="item_small">
                                    <label className="label" for="sex">Sex</label>
                                    <select id="select_sex" onChange={e => {
                                        console.log(e.target.value)
                                        setUserInformation(prev => ({...prev, sex: e.target.value}))
                                    }}>
                                        <option styles="background-color: #FA7A17" value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {/* <input type="text" id="sex" className="input_smaller" name="sex" required /> */}
                                </div>
                            </div>
                        </div>

                        {/* phone number */}
                        <div className="formRow">
                            <div className="item_wide">
                                <label className="label" for="phoneNumber">Phone Number</label>
                                <input type="number" id="phoneNumber" className="input_wide_input" name="phoneNumber" onChange={e => setUserInformation(prev => ({...prev, phoneNumber: e.target.value}))} placeholder="ex. +639123456789" required />
                            </div>
                        </div>

                        {/* submit button */}
                        <div className="button-container">
                            <button id="button_create-account" type="submit" >Create Account</button>
                            {/* <input type="submit" value="Create Account" id="button_create-account" onclick /> */}
                            <p className="hasAccount">Already have an account? <a className="link_signin" href="./index.html">Sign in</a></p>
                        </div>
                    </form>
                </div>

            </div>
            
        </div>
    );
}


const rootNode = document.getElementById('rootcomponent');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(SignUpForm));