import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({box, imageUrl, badClarifaiResponse}) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
      {badClarifaiResponse ? <div className="white bg-red ba">Please supply a valid image link.</div> : <div></div>}
      <div>
        <img id="inputImage" src={imageUrl} alt="" width="500px" height="auto"/>
        <div className="bounding-box" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
      </div>
      </div>
    </div>
  )
}

export default FaceRecognition;