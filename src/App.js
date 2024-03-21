import React, {useState} from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import './App.css';

import ParticlesBg from 'particles-bg'

function App() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: new Date()
  })
  const [badClarifaiResponse, setBadClarifaiResponse] = useState(false);

  const loadUser = (user) => {
    setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      entries: user.entries,
      joined: user.joined
    });
  }

  const calculateFaceLocation = (regions) => {
    const boundingBox = regions.region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    const box_values = {
      leftCol: boundingBox.left_col * width,
      topRow: boundingBox.top_row * height,
      rightCol: width - (boundingBox.right_col * width),
      bottomRow: height - (boundingBox.bottom_row * height)
    }
    return box_values;
  }

  const displayFaceBox = (box) => {
    setBox(box);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onButtonSubmit = () => {
    setImageUrl(input);
    fetch(process.env.BACKEND_URL + "/imageurl", {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        input: input,
      })
    })
    .then(response => {
      return response.json()})
    .then(result => {
      const parsedResult = (JSON.parse(result));
      const regions = parsedResult.outputs[0].data.regions[0];
      setBadClarifaiResponse(false);
      fetch(process.env.BACKEND_URL + "/image", {
        method: "put",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          id: user.id
        })
      })
      .then(response => response.json())
      .then(count => {
        console.log("response for setUser", count)
        setUser({...user, entries: count.entries})
      })
      displayFaceBox(calculateFaceLocation(regions));
      }
    )
    .catch(error => {
      setBadClarifaiResponse(true);
      console.log('error', error)});
  }

  const onRouteChange = (route) => {
    if (route === "signout") {
      setImageUrl("");
      setIsSignedIn(false);
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  }

  return (
    <div className="App">
    <ParticlesBg type="cobweb" bg={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }} color="#ffffff"/>
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      { route === "home"
        ? <div>
            <Logo />
            <Rank rank={user.entries} name={user.name} />
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} badClarifaiResponse={badClarifaiResponse}/>
        </div>
        : (route === "register"
          ? <Register loadUser={loadUser} onRouteChange={onRouteChange} />
          : <SignIn loadUser={loadUser} onRouteChange={onRouteChange} />)
      }
    </div>
  );
}

export default App;
