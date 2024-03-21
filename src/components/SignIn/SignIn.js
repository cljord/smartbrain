import React, {useState} from "react";
import "./SignIn.css";

const SignIn = ({onRouteChange, loadUser}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInFailed, setSignInFailed] = useState(false);

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const onSubmitSignIn = () => {
    fetch("https://smartbrain-api-4360.onrender.com/signin", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(response => response.json())
    .then(user => {
      if (user.id) {
        loadUser(user);
        setSignInFailed(false);
        onRouteChange("home");
      } else {
        setSignInFailed(true);
      }
    })
  }

  return (
      <div>
          <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
              <main className="pa4 black-80">
                <div className="measure">
                  <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                    {signInFailed ? (
                      <div className="white bg-red ba">
                        Wrong credentials. Please try again or register.
                      </div>)
                      : null
                    }
                    <div className="mt3">
                      <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                      <input onChange={onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address" id="email-address" />
                    </div>
                    <div className="mv3">
                      <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                      <input onChange={onPasswordChange}  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password" id="password" />
                    </div>
                  </fieldset>
                  <div className="">
                    <input onClick={onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in" />
                  </div>
                  <div className="lh-copy mt3">
                    <p onClick={() => onRouteChange("register")} className="f6 link dim black db pointer">Register</p>
                  </div>
                </div>
              </main>
          </article>
      </div>
  )
}

export default SignIn;

