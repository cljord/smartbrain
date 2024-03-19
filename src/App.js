import React, {useState, useEffect} from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import './App.css';

import ParticlesBg from 'particles-bg'

const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = process.env.REACT_APP_CLARIFAI_PAT;
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'kriskris';
  const APP_ID = 'Smartbrain';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                      // "base64": IMAGE_BYTES_STRING
                  }
              }
          }
      ]
  });

  return {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };
}

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
    fetch("https://api.clarifai.com/v2/models/" + "face-detection"+ "/outputs", returnClarifaiRequestOptions(input))
    .then(response => response.json())
    .then(result => {
        fetch("http://localhost:3001/image", {
          method: "put",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            id: user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          setUser({...user, entries: count})
        })
        const regions = result.outputs[0].data.regions[0];
        displayFaceBox(calculateFaceLocation(regions));
    })
    .catch(error => console.log('error', error));
  }

  const onRouteChange = (route) => {
    if (route === "signout") {
      setIsSignedIn(false);
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  }

  return (
    <div className="App">
    <ParticlesBg type="cobweb" bg={true} color="#ffffff"/>
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      { route === "home"
        ? <div>
            <Logo />
            <Rank rank={user.entries} name={user.name} />
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
        : (route === "register"
          ? <Register loadUser={loadUser} onRouteChange={onRouteChange} />
          : <SignIn loadUser={loadUser} onRouteChange={onRouteChange} />)
      }
    </div>
  );
}

export default App;
