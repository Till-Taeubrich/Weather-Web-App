/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */

const searchBar = document.querySelector('#search-bar');

function addLocationsId(locations) {
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    location.id = i;
  }
}

function renderLocationSelector(locations) {
  const locationSelector = document.querySelector('.location-selector');

  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    const locationElement = document.createElement('div');
    locationElement.classList.add('location');
    locationElement.dataset.id = i;

    const nameElement = document.createElement('div');
    nameElement.textContent = location.name;
    locationElement.append(nameElement);

    const stateElement = document.createElement('div');
    stateElement.textContent = location.state;
    locationElement.append(stateElement);

    const countryElement = document.createElement('div');
    countryElement.textContent = location.country;
    locationElement.append(countryElement);

    locationSelector.append(locationElement);
  }
}

function addLocationsElementId(locations) {
  const locationElements = document.querySelectorAll('.location');
  for (let i = 0; i < locationElements.length; i++) {
    const locationElement = locationElements[i];
    locationElement.dataset.id = locations[i].id;
  }
}

function getEventTargetData(e, locations) {
  return locations.find((location) => location.id === Number(e.target.parentElement.dataset.id));
}

function clearUserInput() {
  searchBar.value = '';
}

function clearErrorDisplay() {
  const errorDisplay = document.querySelector('.error-display');
  errorDisplay.textContent = '';
}

function clearLocationSelectorContent() {
  const locationSelector = document.querySelector('.location-selector');

  while (locationSelector.lastChild) {
    locationSelector.removeChild(locationSelector.lastChild);
  }
}

async function fetchWeatherData(userSelection) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/onecall?lat=${userSelection.lat}&lon=${userSelection.lon}&appid=d1c6665a3812f694a38a458d35a7bf8c`,
    );
    return await response.json();
  } catch (error) {
    alert(error);
  }
}

function loadBackgroundImage(weatherData) {
  const weatherDescription = weatherData.current.weather[0].main;
  console.log(weatherDescription);
  const webpageBody = document.querySelector('.content');

  switch (weatherDescription) {
    case 'Thunderstorm':
      webpageBody.style.backgroundImage = 'url(./assets/thunderstorm.jpg)';
      break;
    case 'Drizzle':
      webpageBody.style.backgroundImage = 'url(./assets/drizzle.jpg)';
      break;
    case 'Rain':
      webpageBody.style.backgroundImage = 'url(./assets/rain.jpg)';
      break;
    case 'Snow':
      webpageBody.style.backgroundImage = 'url(./assets/snow.jpg)';
      break;
    case 'Clear':
      webpageBody.style.backgroundImage = 'url(./assets/clear.jpg)';
      break;
    case 'Clouds':
      webpageBody.style.backgroundImage = 'url(./assets/clouds.jpg)';
      break;
    case 'Mist':
      webpageBody.style.backgroundImage = 'url(./assets/mist.jpg)';
      break;
    case 'Smoke':
      webpageBody.style.backgroundImage = 'url(./assets/smoke.jpg)';
      break;
    case 'Haze':
      webpageBody.style.backgroundImage = 'url(./assets/haze.jpg)';
      break;
    case 'Dust':
      webpageBody.style.backgroundImage = 'url(./assets/dust.jpg)';
      break;
    case 'Fog':
      webpageBody.style.backgroundImage = 'url(./assets/mist.jpg)';
      break;
    case 'Sand':
      webpageBody.style.backgroundImage = 'url(./assets/dust.jpg)';
      break;
    case 'Ash':
      webpageBody.style.backgroundImage = 'url(./assets/ash.jpg)';
      break;
    case 'Squall':
      webpageBody.style.backgroundImage = 'url(./assets/squall.jpg)';
      break;
    case 'Tornado':
      webpageBody.style.backgroundImage = 'url(./assets/tornado.jpg)';
      break;
    default:
      webpageBody.style.backgroundImage = 'url(./assets/clear.jpg)';
      break;
  }
}

async function setupNewLocation(userSelection) {
  clearUserInput();
  clearErrorDisplay();
  clearLocationSelectorContent();
  const weatherData = await fetchWeatherData(userSelection);
  console.log(weatherData);
  loadBackgroundImage(weatherData);
}

function addEventListenerToLocationElements(locations) {
  const locationElements = document.querySelectorAll('.location');

  locationElements.forEach((locationElement) => {
    locationElement.addEventListener('click', (e) => {
      const userSelection = getEventTargetData(e, locations);
      setupNewLocation(userSelection);
    });
  });
}

function setupLocationSelection(locations) {
  addLocationsId(locations);
  renderLocationSelector(locations);
  addLocationsElementId(locations);
  addEventListenerToLocationElements(locations);
}

async function fetchCoordinatesData() {
  const userSelection = searchBar.value;
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${userSelection}&limit=5&appid=d1c6665a3812f694a38a458d35a7bf8c`,
    );
    const coordinatesData = await response.json();

    if (coordinatesData.length > 1) {
      setupLocationSelection(coordinatesData);
    }
    if (coordinatesData.length === 1) {
      setupNewLocation(coordinatesData[0]);
    }
    if (coordinatesData.length === 0) {
      const errorDisplay = document.querySelector('.error-display');
      errorDisplay.textContent = 'Location not found. Please type in a valid city name.';
    }
  } catch (error) {
    alert(error);
  }
}

searchBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    fetchCoordinatesData();
  }
});
