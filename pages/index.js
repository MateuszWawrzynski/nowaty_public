import Head from 'next/head'
import { faCalendarPlus, faCommentAlt, faCameraRetro, faComments } from '@fortawesome/free-solid-svg-icons'

import Hero 		from "../components/templates/Hero"
import HeroMobile 	from "../components/templates/HeroMobile"
import Section 		from "../components/templates/Section"
import SignIn 		from '../components/templates/SignIn'
import Contact 		from '../components/templates/Contact'
import Gallery 		from '../components/templates/Gallery'
import Comments 	from '../components/templates/Comments'
import Footer 		from '../components/templates/Footer'


export default class Home extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			width: 0
		};

		this.updateWidth = this.updateWidth.bind(this);
	}

	// https://stackoverflow.com/a/46586783
	updateWidth(){
		this.setState({
			width: Math.min(window.innerWidth, window.outerWidth)
		});
	}
	componentDidMount(){
		this.updateWidth();
		window.addEventListener("resize", this.updateWidth);
	}
	componentWillUnmount(){
		window.removeEventListener("resize", this.updateWidth);
	}
	
	render(){
		return (
			<div>
				<Head>
					<title>Nowa Ty - Salon urody</title>
					<link rel="icon" href="/favicon.ico" />

					<meta name="viewport" content="initial-scale=1.0, user-scalable=0, width=device-width" />
					<meta charSet='utf-8' />

					{/* https://stackoverflow.com/a/33193739 */}
					<meta name="theme-color" content="#19606B" />
					<meta name="msapplication-navbutton-color" content="#19606B" />
					<meta name="apple-mobile-web-app-status-bar-style" content="#19606B" />
					
					<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" />
					<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>
					<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
					<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
				</Head>

				{/* render desktop hero component if width >= 768 or mobile when less */}
				{this.state.width >= 768 ? 
					<Hero background="/img/backgrounds/hero-desktop.jpg" /> 
					: 
					<HeroMobile background="/img/backgrounds/hero-mobile.jpg" />
				}

				<Section 
					id={'signin'} 
					icon={faCalendarPlus} 
					title="Zapisz si?? na wizyt??" 
					desc="Znajd?? odpowiedni dla siebie wolny termin i zarezerwuj wizyt?? w salonie!" 
					background="/img/backgrounds/signin.jpg"
					alpha=".75"
				>
					<SignIn />
				</Section>

				<Section 
					id={'contact'} 
					icon={faCommentAlt} 
					title="Skontaktuj si?? z nami" 
					desc="Jesli chcesz zapyta?? o cokolwiek - skorzystaj z poni??szego formularza lub kliknij w dowoln?? ikonk?? aplikacji." 
					background="/img/backgrounds/contact.jpg"
					alpha=".75"
				>
					<Contact />
				</Section>

				<Section 
					id={'gallery'} 
					icon={faCameraRetro} title="Galeria prac" 
					desc="Poni??ej znajdziesz przyk??ady naszej pracy - mo??e wybierzesz co?? inspiruj??cego dla siebie?" 
					background="/img/backgrounds/gallery.jpg" 
					alpha="1"
				>
					<Gallery />
				</Section>

				<Section 
					id={'comments'} 
					icon={faComments} title="Opinie klient??w" 
					desc="Dowiedz si?? co pisz?? o nas klienci. Je??li chcesz, napisz te?? sw??j komentarz. Dzi??ki!" 
					background="/img/backgrounds/comments.jpg"
					alpha=".75"
				>
					<Comments />
				</Section>

				<Footer background="/img/backgrounds/footer.jpg" />
			</div>
		)
	}
}