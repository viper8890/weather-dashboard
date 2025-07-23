async function getWeather(){
	const city = document.getElementById('cityInput').value;
	const apiKey = 'OPENWEATHERMAP-API-KEY';
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	
	try{
		const response = await fetch(url);
		if (!response.ok){
			throw new Error("City not found");
		}
		const data = await response.json();
		const iconCode = data.weather[0].icon;
		const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
		const timezoneOffset = data.timezone;
		const utcTime = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
		const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000);
		const formattedTime = localTime.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});
		const formattedDate = localTime.toLocaleDateString('en-US',{
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		const weatherHTML = `
		<h2>${data.name}, ${data.sys.country}</h2>
		<img src="${iconUrl}" alt="Weather icon">
		<p>📅 Local Date: ${formattedDate}</p>
		<p>🕒 Local Time: ${formattedTime}</p>
		<p>🌡️ Temperature: ${data.main.temp}°C</p>
		<p>☁️ Condition: ${data.weather[0].main}</p>
		<p>💧 Humidity: ${data.main.humidity}%</p>
		<p>💨 Wind Speed: ${data.wind.speed}m/s</p>
		`;
		
		document.getElementById('weatherResult').innerHTML = weatherHTML;
		
		saveToHistory(city);
		displayHistory();
	}catch (error){
		document.getElementById('weatherResult').innerHTML = `<p style="color:red;">${error.message}</p>`;
		}
}

function saveToHistory(city){
	let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
	if (!history.includes(city)){
		history.unshift(city);
		if(history.length > 5)
			history.pop();
		localStorage.setItem('weatherHistory', JSON.stringify(history));
	}
}

function displayHistory(){
	let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
	const historyContainer = document.getElementById('searchHistory');
	historyContainer.innerHTML = '';
	
	history.forEach(city =>{
		const btn = document.createElement('button');
		btn.className = 'history-btn';
		btn.textContent = city;
		btn.addEventListener('click', () =>{
			document.getElementById('cityInput').value = city;
			getWeather();
		});
		
		btn.addEventListener('contextmenu', (e) =>{
			e.preventDefault();
			const confirmDelete = confirm(`Remove "${city}" from search history?`);
			if (confirmDelete){
				deleteFromHistory(city);
			}
		});
		
		historyContainer.appendChild(btn);
	});
}

function deleteFromHistory(cityToRemove){
	let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
	history = history.filter(city => city !== cityToRemove);
	localStorage.setItem('weatherHistory', JSON.stringify(history));
	displayHistory();
}
window.getWeather = getWeather;
//window.onload = displayHistory;
