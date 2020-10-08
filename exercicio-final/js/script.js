/* Estados da aplicação */

let tabCountries = null;
let tabFavoriteCountries = null;

let allCountries = [];
let allFavoritesCountries = [];

let countCountries = 0;
let countFavoritesCountries = 0;

let totalPopulationList = 0;
let totalPopulationFavoritesList = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavoriteCountries = document.querySelector('#tabFavoritesCountries');
  countCountries = document.querySelector('#countCountries');
  countFavoritesCountries = document.querySelector('#countFavoritesCountries');
  totalPopulationList = document.querySelector('#totalPopulationList');
  // prettier-ignore
  totalPopulationFavoritesList = 
  document.querySelector('#totalPopulationFavoritesList');
  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
});

async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;
    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedPopulation: formatNumber(population),
      flag,
    };
  });
  render();
}
function render() {
  renderCountryList();
  renderFavoritesList();
  renderSummary();
  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = '<div';
  allCountries
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .forEach((country) => {
      const { id, name, formattedPopulation, flag } = country;
      const countryHTML = `
      <div class="country">
        <div>
        <a id="${id}"class="waves-effect waves-light btn">+</a>
        </div>
        <div>
        <img src="${flag}" alt="${name}">
        </div>
        <div>
        <ul>
        <li>${name}</li>
        <li>${formattedPopulation}</li>
        </ul>
        </div>
      </div>
    `;

      countriesHTML += countryHTML;
    });
  tabCountries.innerHTML = countriesHTML;
}
function renderFavoritesList() {
  let favoritesHTML = '<div>';

  allFavoritesCountries
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .forEach((country) => {
      const { id, name, formattedPopulation, flag } = country;

      const favoritesCountryHTML = `
      <div class="country">
        <div>
        <a id="${id}"class="waves-effect waves-light btn red darken-4">-</a>
        </div>
        <div>
        <img src="${flag}" alt="${name}">
        </div>
        <div>
        <ul>
        <li>${name}</li>
        <li>${formattedPopulation}</li>
        </ul>
        </div>
      </div>
    `;

      favoritesHTML += favoritesCountryHTML;
    });

  favoritesHTML += '</div>';
  tabFavoriteCountries.innerHTML = favoritesHTML;
}
function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavoritesCountries.textContent = allFavoritesCountries.length;

  const totalPopulation = allCountries.reduce((acc, current) => {
    return acc + current.population;
  }, 0);
  totalPopulationList.textContent = formatNumber(totalPopulation);

  const totalPopulationFavorites = allFavoritesCountries.reduce(
    (acc, current) => {
      return acc + current.population;
    },
    0
  );
  totalPopulationFavoritesList.textContent = formatNumber(
    totalPopulationFavorites
  );
}
function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteCountryButton = Array.from(
    tabFavoriteCountries.querySelectorAll('.btn')
  );

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addtoFavorite(button.id));
  });
  favoriteCountryButton.forEach((button) => {
    button.addEventListener('click', () => remove(button.id));
  });
}

function addtoFavorite(id) {
  const countryAdd = allCountries.find((country) => country.id === id);
  allFavoritesCountries = [...allFavoritesCountries, countryAdd];

  allCountries = allCountries.filter((country) => country.id !== id);
  render();
}
function remove(id) {
  const favoritesRemoved = allFavoritesCountries.find(
    (country) => country.id === id
  );
  //prettier-ignore
  allCountries = [...allCountries, favoritesRemoved];

  allFavoritesCountries = allFavoritesCountries.filter(
    (country) => country.id !== id
  );
  render();
}
function formatNumber(number) {
  return numberFormat.format(number);
}
