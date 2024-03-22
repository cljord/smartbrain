import React, {useState} from "react";
import "./Register.css";

const Register = ({onRouteChange, loadUser}) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onRegister = () => {
    fetch("https://smartbrain-api-4360.onrender.com/register", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        email: email,
        password: password,
        name: name
      })
    })
    .then(response => response.json())
    .then(user => {
      console.log("")
      console.log(user);
      if (user.id) {
        // returned user is an array, so take first entry
        console.log("in user.id")
        loadUser(user[0]);
        onRouteChange("home");
      }
    })
  }

  return (
      <div>
          <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
              <main className="pa4 black-80">
                <div className="measure">
                  <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f1 fw6 ph0 mh0">Register</legend>
                    <div className="mt3">
                      <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                      <input onChange={onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="name"  id="name" />
                    </div>
                    <div className="mt3">
                      <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                      <input onChange={onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
                    </div>
                    <div className="mv3">
                      <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                      <input onChange={onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
                    </div>
                  </fieldset>
                  <div className="">
                    <input onClick={onRegister} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register" />
                  </div>                  
                </div>
              </main>
          </article>
      </div>
    )
}

export default Register;

