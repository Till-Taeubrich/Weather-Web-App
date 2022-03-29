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

function getLocationData(e, locations) {
  return locations.find((location) => location.id === Number(e.target.parentElement.dataset.id));
}

function setupNewLocation(userSelection) {
  console.log(userSelection);
}

function selectLocation(e, locations) {
  const userSelection = getLocationData(e, locations);
  setupNewLocation(userSelection);
}

function addEventListenerToLocationElements(locations) {
  const locationElements = document.querySelectorAll('.location');

  locationElements.forEach((locationElement) => {
    locationElement.addEventListener('click', (e) => {
      selectLocation(e, locations);
    });
  });
}

function setupLocationSelection(locations) {
  addLocationsId(locations);
  renderLocationSelector(locations);
  addLocationsElementId(locations);
  addEventListenerToLocationElements(locations);
}

async function fetchWeatherData() {
  const userSelection = searchBar.value;
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${userSelection}&limit=5&appid=ec14f259ccf044b9dbeec27752c8e621`,
    );
    const weatherData = await response.json();

    if (weatherData.length > 1) {
      setupLocationSelection(weatherData);
    } else {
      setupNewLocation(weatherData[0]);
    }
  } catch (error) {
    alert(error);
  }
}

searchBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    fetchWeatherData();
  }
});

// API'S
// with exclude
// `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=ec14f259ccf044b9dbeec27752c8e621`,
// without exclude
// `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=ec14f259ccf044b9dbeec27752c8e621`,

// for each array element give id
// render array element below searchBar (name, country, state)
// give each element addeventlistener click
// get lat & lon from element that's clicked on
