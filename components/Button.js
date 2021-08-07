import React, { Component } from 'react'

export default class Button extends Component {
	render() {
		return (
			<>
				<button type={this.props.type ? 'submit' : 'button'}>
					{this.props.children}
				</button>

				<style jsx>{`
					button {
						padding: .5vh 3vw;
						outline: none;
						border: 1px solid #B84F82;
						border-radius: 90px;
						color: white;
						transition-duration: .2s;

						background: -moz-linear-gradient(0deg, rgba(#B84F82,1) 0%, rgba(#B84F82,0.5) 100%);
						background: -webkit-linear-gradient(0deg, rgba(#B84F82,1) 0%, rgba(#B84F82,0.5) 100%);
						background: linear-gradient(0deg, rgba(#B84F82,1) 0%, rgba(#B84F82,0.5) 100%);
						filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#B84F82",endColorstr="#FFFFFF",GradientType=1);

						:hover {
							transform: scale(1.1);
						}
					}
				`}</style>
			</>
		)
	}
}
