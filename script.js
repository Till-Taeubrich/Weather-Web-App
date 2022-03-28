const searchBar = document.querySelector('#search-bar');

async function getWeatherData() {
  const userSearch = searchBar.value;
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${userSearch}&APPID=ec14f259ccf044b9dbeec27752c8e621`,
    );
    const weatherData = await response.json();
    console.log(weatherData);
    const temperature = weatherData.main.temp;
  } catch (error) {
    alert(error);
  }
}

function getTemperature() {}

searchBar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getWeatherData();
  }
});
