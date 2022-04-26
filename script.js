/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */

const searchBar = document.querySelector('#search-bar');
const metricBtn = document.querySelector('.metric-btn');
const imperialBtn = document.querySelector('.imperial-btn');
let metricUnits = false;
let currentUserSelection;
let currentWeatherData;

function showAlert() {
  document.querySelector('.location-alert').classList.add('active');
}

function removeAlert() {
  document.querySelector('.location-alert').classList.remove('active');
}

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
  const locationElements = document.querySelectorAll('.location-name');
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
      `http://api.openweathermap.org/data/2.5/onecall?lat=${userSelection.lat}&lon=${userSelection.lon}&units=imperial&appid=d1c6665a3812f694a38a458d35a7bf8c`,
    );
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    alert(error);
  }
}

function renderText(selector, textSource) {
  document.querySelector(selector).textContent = textSource;
}

function renderTemperature(selector, value) {
  document.querySelector(selector).textContent = value;
  if (metricUnits) {
    const tempInCelcius = (Number(value) - 32) * 0.5556;
    document.querySelector(selector).textContent = `${tempInCelcius.toFixed(0)}°C`;
    return;
  }
  if (metricUnits === false) {
    document.querySelector(selector).textContent = `${value.toFixed(1)}°F`;
  }
}

function renderPercentage(selector, value) {
  if (selector === '.raining-chance') {
    document.querySelector(selector).textContent = `${(value * 100).toFixed(0)}%`;
    return;
  }
  document.querySelector(selector).textContent = `${value.toFixed(0)}%`;
}

function renderSpeed(selector, value) {
  if (metricUnits) {
    const speedInKmh = Number(value) * 1.609344;
    document.querySelector(selector).textContent = `${speedInKmh.toFixed(1)}km/h`;
    return;
  }
  if (metricUnits === false) {
    document.querySelector(selector).textContent = `${value.toFixed(1)}mph`;
  }
}

function getDayName(i) {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const todayNum = new Date().getDay() - 1 + i;

  if (i === 0) {
    return 'Today';
  }

  if (todayNum <= 6) {
    return dayNames[todayNum];
  }

  if (todayNum > 6) {
    return dayNames[todayNum - 7];
  }
}

function renderUV(selector, value) {
  document.querySelector(selector).textContent = `${value.toFixed(0)}`;
}

function renderForecast(selector, value) {
  const forecast = document.querySelector('.forecast');
  if (forecast.childNodes.length <= 1) {
    for (let i = 0; i < value.length; i++) {
      const dayElement = document.createElement('div');
      dayElement.classList.add(`day${i}`);

      const dayName = document.createElement('div');
      dayName.textContent = getDayName(i);
      dayElement.append(dayName);

      const dayHighTemp = document.createElement('div');
      dayHighTemp.textContent = `H: ${value[i].temp.max}°F`;
      dayElement.append(dayHighTemp);

      const dayLowTemp = document.createElement('div');
      dayLowTemp.textContent = `L: ${value[i].temp.min}°F`;
      dayElement.append(dayLowTemp);

      forecast.append(dayElement);
    }
  }
}

function renderNewContent(weatherData, userSelection) {
  // location
  renderText('.location-name', userSelection.name);
  renderText('.state', userSelection.state);
  renderText('.country', userSelection.country);

  // temperature
  renderTemperature('.current', weatherData.current.temp);
  renderTemperature('.feels-like', weatherData.current.feels_like);
  renderText('.feels-like-div', 'Feels Like:');

  renderPercentage('.raining-chance', weatherData.hourly[0].pop);
  renderText('.raining-chance-div', 'Chance of Rain:');

  renderText('.humidity-div', 'Humidity:');
  renderPercentage('.humidity', weatherData.current.humidity);

  renderText('.wind-speed-div', 'Wind Speed:');
  renderSpeed('.wind-speed', weatherData.current.wind_speed);

  renderText('.uv-index-value-div', 'UV index:');
  renderUV('.uv-index-value', weatherData.current.uvi);
  renderText('.uv-link', 'Protect Yourself');

  renderForecast('.forecast', weatherData.daily);
}

function renderContentTransition(weatherData, userSelection) {
  const webpageContent = Array.from(document.querySelector('.content').children);

  webpageContent.forEach((child) => {
    child.style.opacity = '0';
  });
  setTimeout(() => {
    renderNewContent(weatherData, userSelection);
    webpageContent.forEach((child) => {
      child.style.opacity = '1';
    });
  }, 200);
}

function renderImageAndContentTransition(weatherData, userSelection, fileName) {
  const webpageBody = document.querySelector('.content');

  webpageBody.style.opacity = '15%';
  setTimeout(() => {
    renderNewContent(weatherData, userSelection);
    webpageBody.style.backgroundImage = `url(./assets/${fileName}.jpg)`;
    setTimeout(() => {
      webpageBody.style.opacity = '1';
    }, 50);
  }, 200);
}

function renderTransition(weatherData, userSelection) {
  const webpageBody = document.querySelector('.content');
  const weatherDescription = weatherData.current.weather[0].main;

  if (
    (webpageBody.style.backgroundImage == '' && weatherDescription === 'clear')
    || webpageBody.style.backgroundImage === `url("./assets/${weatherDescription}.jpg")`
  ) {
    renderContentTransition(weatherData, userSelection);
    return;
  }

  renderImageAndContentTransition(weatherData, userSelection, weatherDescription);
}

async function setupNewLocation(userSelection) {
  clearUserInput();
  clearErrorDisplay();
  clearLocationSelectorContent();
  const weatherData = await fetchWeatherData(userSelection);
  currentWeatherData = weatherData;
  renderTransition(weatherData, userSelection);
}

function addEventListenerToLocationElements(locations) {
  const locationElements = document.querySelectorAll('.location');

  locationElements.forEach((locationElement) => {
    locationElement.addEventListener('click', (e) => {
      const userSelection = getEventTargetData(e, locations);
      currentUserSelection = userSelection;
      setupNewLocation(userSelection);
      removeAlert();
    });
  });
}

function setupLocationSelection(locations) {
  showAlert();
  addLocationsId(locations);
  renderLocationSelector(locations);
  addLocationsElementId(locations);
  addEventListenerToLocationElements(locations);
}

async function fetchLocationData() {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${currentUserSelection}&limit=5&appid=d1c6665a3812f694a38a458d35a7bf8c`,
    );
    const locationData = await response.json();

    currentUserSelection = locationData;

    if (locationData.length > 1) {
      setupLocationSelection(locationData);
    }
    if (locationData.length === 1) {
      currentUserSelection = locationData[0];
      setupNewLocation(locationData[0]);
    }
    if (locationData.length === 0) {
      const errorDisplay = document.querySelector('.error-display');
      errorDisplay.textContent = 'Location not found. Please type in a valid city name.';
    }
  } catch (error) {
    alert(error);
  }
}

function saveUserSelection() {
  currentUserSelection = searchBar.value;
}

searchBar.addEventListener('keydown', (e) => {
  const locationSelector = document.querySelector('.location-selector');
  if (locationSelector.childNodes[1]) {
    clearLocationSelectorContent();
    removeAlert();
  }
  if (e.key === 'Enter') {
    saveUserSelection();
    fetchLocationData();
  }
});

metricBtn.addEventListener('click', () => {
  if (metricUnits === false && currentUserSelection == undefined) {
    metricUnits = true;
    return;
  }
  if (metricUnits === false) {
    metricUnits = true;
    renderContentTransition(currentWeatherData, currentUserSelection);
  }
});

imperialBtn.addEventListener('click', () => {
  if (metricUnits && currentUserSelection == undefined) {
    metricUnits = false;
    return;
  }
  if (metricUnits) {
    metricUnits = false;
    renderContentTransition(currentWeatherData, currentUserSelection);
  }
});
