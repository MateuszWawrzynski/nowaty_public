import React, { useEffect } from 'react'


const Gallery = () => {
	//	inject script to embed instagram gallery
	//	https://embedsocial.com/
	useEffect(() => {
		(function(d, s, id){
			var js; 
			if(d.getElementById(id)) { return; } 
			js = d.createElement(s); 
			js.id = id; 
			js.src = "https://embedsocial.com/embedscript/in.js"; 
			d.getElementsByTagName("body")[0].appendChild(js);
		}
		(document, "script", "EmbedSocialInstagramScript"));
	}, [])
	
	return (
		<div className='wrapper row'>
			<div className='embedInstagram col-12 col-xl-10 offset-xl-1'>
				<div className='embedsocial-instagram' data-ref={process.env.EMBEDSOCIAL_GALLERY_ID}></div>
			</div>

			<style jsx>{`
				.wrapper {
					.embedInstagram {
						background-color: #FFFFFF;
						border-radius: 45px;
						border-top: 10px solid #19606B;
						border-bottom: 10px solid #19606B;
						opacity: 1;
					}
				}
			`}</style>
		</div>
	)
}

export default Gallery;