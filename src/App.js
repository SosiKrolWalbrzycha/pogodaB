import React, { Component } from 'react'
import './App.css'

const PromptStatement = props => {
	if(props.data === 0) {return (<h4>Wybierz miejscowość której prognozę chcesz zobaczyć.</h4>)}
	else {return (<h4>Niestety, mam problem z pobraniem danych. Spróbuj jeszcze raz lub zgłoś problem.</h4>)}

	
}

const PromptData = props => {
	return (
		<div>
			<h4>Prognoza dla miejscowości: {props.cityname}</h4>
			<p>Temperatura wynosi: {props.temp} stopni Celsjusza.</p>
			<p>Zasięg widocznosci: {props.visibility} metrów.</p>
			<p>Kierunek wiatru: {props.winddirection} stopni.</p>
			<p>Prędkość wiatru wynosi: {props.windspeed} km/h.</p>
			<p>Zachmurzenie: {props.clouds} %.</p>
		</div>
	)
}



class App extends Component {
	state = {
		cityrequest: '',
		cityrequestlat: 0,
		cityrequestlon: 0,
		cityname: '',
		temp: 0,
		visibility: 0,
		clouds: 0,
		windspeed: 0,
		winddirection: 0,
		error:0,
	}

	deleteCityrequest = () => {
		this.setState({ cityrequest: '' })
	}


	location = () => {
		fetch(
			`http://api.openweathermap.org/geo/1.0/direct?q=${this.state.cityrequest},616&limit=1&appid=3e7b287f8027f09bfa1bbf1152eb8152`
		)
			.then(res => res.json())
			.then(res =>
				fetch(
					`https://api.openweathermap.org/data/2.5/weather?lat=${res[0].lat}&lon=${res[0].lon}&appid=3e7b287f8027f09bfa1bbf1152eb8152&units=metric`
				)
			)
			.then(res => res.json())
			.then(res =>
				this.setState({
					cityname: res.name,
					clouds: res.clouds.all,
					windspeed: res.wind.speed,
					winddirection: res.wind.deg,
					temp: res.main.temp,
					visibility: res.visibility,
				})
			)

			.then(this.deleteCityrequest)
			.catch(error => this.setState({
				error:1,}), setTimeout(this.deleteCityrequest, 1000))
	}

	addCityToState = e => {
		this.setState({ cityrequest: e.target.value })
	}

	render() {
		return (
			<div>
				<div className='header'>
					<input
						type='text'
						className='city'
						placeholder='tutaj wpisz nazwę miasta...'
						onChange={this.addCityToState}
						value={this.state.cityrequest}
					/>
					<button className='buton' onClick={this.location}>
						Pobierz dane
					</button>
				</div>
				<div className='result'>
					{this.state.visibility ? (
						<PromptData
							cityname={this.state.cityname}
							temp={this.state.temp}
							visibility={this.state.visibility}
							clouds={this.state.clouds}
							windspeed={this.state.windspeed}
							winddirection={this.state.winddirection}
						/>
					) : (
						<PromptStatement data={this.state.error} cityrequest={this.state.cityrequest}/>
					)}
				</div>
				
			</div>
		)
	}
}

export default App
