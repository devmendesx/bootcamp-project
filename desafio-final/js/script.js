/* Estados da aplicação */
let allPeople = [];
let countMen = 0;
let countWoman = 0;
let inputName = null;
let btnMain = null;
let sumAges = 0;
let mediaAges = 0;
let usersFound = null;
let numberFormat = null;
window.addEventListener('load', () => {
  countMen = document.querySelector('#countMen');
  countWoman = document.querySelector('#countWomen');
  mediaAges = document.querySelector('#mediaAges');
  sumAges = document.querySelector('#sumAges');
  inputName = document.querySelector('#inputName');
  btnMain = document.querySelector('#btn-main');
  usersFound = document.querySelector('#usersFound');
  numberFormat = Intl.NumberFormat('pt-BR');
  fetchPeople();
});
async function fetchPeople() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  allPeople = json.results
    .map((people) => {
      const { name, picture, gender, dob } = people;
      people.name = people.name.first + people.name.last;
      return {
        name: name.first + ' ' + name.last,
        nameLower: people.name.toLowerCase(),
        photo: picture.thumbnail,
        gender: gender,
        age: dob.age,
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  render();
}
function render() {
  searchPeople();
}
function searchPeople() {
  inputName.addEventListener('keyup', handleInput);
  btnMain.addEventListener('click', handleButton);
}
function handleButton() {
  const searchText = inputName.value;
  const searchTextLower = searchText.toLowerCase();
  if (searchTextLower.trim() !== '') {
    filterUsers(searchTextLower);
  }
}
function handleInput(event) {
  const currentKey = event.key;
  if (currentKey !== 'Enter') {
    return;
  }
  const searchText = event.target.value;
  const searchTextLower = searchText.toLowerCase();
  if (searchTextLower.trim() !== '') {
    filterUsers(searchTextLower);
  }
}
function filterUsers(filterText) {
  const filteredUsers = allPeople.filter((user) => {
    return user.nameLower.includes(filterText);
  });
  if (filteredUsers.length !== 0) {
    syncPeople(filteredUsers);
    syncNumbers(filteredUsers);
  } else {
    sumAges.textContent = 0;
    mediaAges.textContent = 0;
    countMen.textContent = 0;
    countWoman.textContent = 0;
    usersFound.innerHTML = '';
    const h2 = document.createElement('h2');
    h2.textContent = `${filteredUsers.length} usuario(s) encontrado(s)`;
    usersFound.appendChild(h2);
  }
}
function syncPeople(people) {
  usersFound.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.textContent = `${people.length} usuario(s) encontrado(s)`;
  const ul = document.createElement('ul');
  people.forEach((users) => {
    const li = document.createElement('li');
    li.classList.add('row-rule');
    const user = `<span>${users.name}, ${users.age} anos.</span>`;
    const img = `<img src="${users.photo}" alt="${users.name}"/>`;
    li.innerHTML = `${img}${user}`;
    ul.appendChild(li);
  });
  usersFound.appendChild(h2);
  usersFound.appendChild(ul);
}
function syncNumbers(people) {
  sumAges.textContent = people.reduce((acc, current) => {
    return acc + current.age;
  }, 0);
  mediaAges.textContent = (
    people.reduce((acc, current) => {
      return acc + current.age;
    }, 0) / people.length
  ).toFixed(2);
  mediaAges.textContent = formatNumber(mediaAges.textContent);
  sumAges.textContent = formatNumber(sumAges.textContent);
  let countformen = 0;
  let countforwomen = 0;
  people.forEach((people) => {
    if (people.gender === 'male') {
      countformen++;
      countMen.textContent = countformen;
    } else {
      countforwomen++;
      countWoman.textContent = countforwomen;
    }
    if (countforwomen === 0) {
      countWoman.textContent = 0;
    } else if (countformen === 0) {
      countMen.textContent = 0;
    }
  });
}
function formatNumber(number) {
  return numberFormat.format(number);
}
