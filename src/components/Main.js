require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';


let imageDatas = require('../data/imageDatas.json');

function genImageURL(imageDatasArr) {
	imageDatasArr.forEach(function(imageData) {
		imageData.imageURL = require('../images/' + imageData.fileName);
	})
	return imageDatasArr;
}

imageDatas = genImageURL(imageDatas);

class AppComponent extends React.Component {
	render() {
		return (
			<section className="stage">
				<section className="img-sec">
					
				</section>
				<nav className = "controller-nav" >
					
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;