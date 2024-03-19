import React from "react";

const Rank = ({name, rank}) => {
	return (
		<div>
			<div className="white f3">
				{`${name}, your current number of entries is...`}
			</div>
			<div className="white f1">
				{rank}
			</div>
		</div>
	)
}

export default Rank;