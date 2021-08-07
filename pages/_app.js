import React from 'react'
import App from 'next/app'

import { Provider } from 'next-auth/client'

import axios from 'axios';
axios.defaults.baseURL = process.env.FIREBASE_APIURL;
 
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
 

class MyApp extends App {
	render() {
		const { Component, pageProps } = this.props
		return (
			<>
				<Provider session={pageProps.session}>
					<Component {...pageProps} />
				</Provider>	

				<style jsx global>{`
					@font-face {
						font-family: 'Raleway';
							src: url('/fonts/Raleway/Raleway-Regular.ttf');	
					}
					@font-face {
						font-family: 'Lato';
							src: url('/fonts/Lato/Lato-Regular.ttf');	
					}
					@font-face {
						font-family: 'SansitaSwashed';
							src: url('/fonts/SansitaSwashed/SansitaSwashed-Regular.ttf');	
					}
					
					html { font-size: calc(1em + 1vw); }
					body { font-family: 'Raleway', sans-serif; }
					html, body {margin: 0; padding: 0; overflow-x: hidden; }	/* https://stackoverflow.com/a/23367521 */
					input,button,select,textarea { font-size: inherit; }
					
					a {
						color: inherit;
						text-decoration: underline;
						transition-duration: .15s;

						:hover {
							color: #BBBBBB;
						}
					}

					/* http://webkit-scroll-gen.sourceforge.net/ */
					::-webkit-scrollbar {
						width: 15px;
						height: 15px;
					}
					::-webkit-scrollbar-button {
						width: 0px;
						height: 0px;
					}
					::-webkit-scrollbar-thumb {
						background: #ffffff;
						border: 1px none #000000;
						border-radius: 0px;
					}
					::-webkit-scrollbar-thumb:hover {
						background: #e3e3e3;
					}
					::-webkit-scrollbar-thumb:active {
						background: #c7c7c7;
					}
					::-webkit-scrollbar-track {
						background: #707070;
						border: 1px none #000000;
						border-radius: 0px;
					}
					::-webkit-scrollbar-track:hover {
						background: #707070;
					}
					::-webkit-scrollbar-track:active {
						background: #707070;
					}
					::-webkit-scrollbar-corner {
						background: transparent;
					}
				`}</style>
			</>
		);
	}
}
 
export default MyApp