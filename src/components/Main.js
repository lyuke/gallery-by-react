require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/imageDatas.json');

function genImageURL(imageDatasArr) {
	imageDatasArr.forEach(function(imageData) {
		imageData.imageURL = require('../images/' + imageData.fileName);
	})
	return imageDatasArr;
}

imageDatas = genImageURL(imageDatas);

class ImgFigure extends React.Component {

	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();

	}
	render() {
		let styleObj = {};
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		if (this.props.arrange.rotate) {
			styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
		}
		let imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL}
				alt={this.props.data.title} />
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className='img-back' onClick={this.handleClick}>
						<p>{this.props.data.desc}</p>
					</div>
				</figcaption>
			</figure>

		);
	}

}

class ControllerUnit extends React.Component {

	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}
	render() {
		let controllerUnitClassName = "controller-unit";

		if (this.props.arrange.isCenter) {
			controllerUnitClassName += " is-center";
			if (this.props.arrange.isInverse) {
				controllerUnitClassName += ' is-inverse';
			}
		}

		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>

		)
	}
}



//获取随机值
const getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

//获取
const get30DegRandom = () => {
	return (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * 30);
}



class AppComponent extends React.Component {

	constructor(props) {
		super(props);

		this.Constant = {
			centerPos: {
				left: 0,
				right: 0
			},
			hPosRange: {
				leftSecX: [0, 0],
				rightSecX: [0.0],
				y: [0, 0]
			},
			vPosRange: {

				//垂直方向范围
				x: [0, 0],
				topY: [0, 0]
			}

		};
		this.state = {
			imgsArrangeArr: [
				// pos {
				// 	left: '0',
				// 	right: '0'
				// }
				//rotate:0,
				//isInverse:false
				//isCenter:false
			]
		};


	}

	inverse(index) {
		return () => {
			let imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}
	}
	center(index) {
		return () => {
			this.rearrange(index);
		}
	}

	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}


		//取出上侧图片状态
		topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeArr[index] = {
				pos: {
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}

		});

		for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			let hPosRangeLORX = null;
			if (i < k) {
				hPosRangeLORX = hPosRangeLeftSecX;
			} else {
				hPosRangeLORX = hPosRangeRightSecX;
			}
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		}

		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);


		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});



	}

	componentDidMount() {
		let stageDom = ReactDOM.findDOMNode(this.refs.stage);
		let stageW = stageDom.scrollWidth;
		let stageH = stageDom.scrollHeight;
		let halfStageW = Math.ceil(stageW / 2);
		let halfStageH = Math.ceil(stageH / 2);

		let imageFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
		let imgW = imageFigureDOM.scrollWidth;
		let imgH = imageFigureDOM.scrollHeight;
		let halfImgW = Math.ceil(imgW / 2);
		let halfImgH = Math.ceil(imgH / 2);

		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);
	}

	render() {
		let controllerUnits = [],
			imgFigures = [];

		imageDatas.forEach((img, index) => {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						right: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}

			imgFigures.push(<ImgFigure data={img} key={img.fileName} ref={'imgFigure'+index}
			 arrange={this.state.imgsArrangeArr[index]} 
			 inverse={this.inverse(index)}
			 center={this.center(index)} />);
			controllerUnits.push(<ControllerUnit key={img.fileName} arrange={this.state.imgsArrangeArr[index]} 
			inverse={this.inverse(index)} 
			center={this.center(index)} />)
		});


		return (
			<section className="stage" ref="stage">
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