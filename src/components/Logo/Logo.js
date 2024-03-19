import React from "react";
import Tilt from "react-parallax-tilt";
import brain from "./brainlogo.png";
import "./Logo.css"

const Logo = () => {
	return (
		<div className="ma4 mt0">
			<Tilt className="Tilt br2 shadow-2" style={{height: 150, width: 150}} tiltMaxAngleX={35} tiltMaxAngleY={35} >
		      <div className="Tilt-inner pa3">
		        <img  style={{paddingTop: "10px"}} alt="brainlogo" src={brain}/>
		      </div>
		    </Tilt>
		</div>
	)
}

export default Logo;