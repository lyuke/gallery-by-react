require('styles/App.scss');

import React from 'react';


let imageDatas = require('../data/imageDatas.json');

function genImageURL(imageDatasArr) {
	imageDatasArr.forEach(function(imageData) {
		imageData.imageURL = require('../images/' + imageData.fileName);
	})
	return imageDatasArr;
}

imageDatas = genImageURL(imageDatas);

class ImgFigure extends React.Component {

	render() {
		return (
			<figure className="img-figure">
				<img src={this.props.data.imageURL}
				alt={this.props.data.title} />
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>

		);
	}

}



class AppComponent extends React.Component {
	render() {
		let controllerUnits = [],
			imgFigures = [];

		imageDatas.forEach(function(img) {
			imgFigures.push(<ImgFigure data={img} key={img.fileName}/>);
		})


		return (
			<section className="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className = "controller-nav" >
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

AppComponent.defaultProps = {};

export default AppComponent;