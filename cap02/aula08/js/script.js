window.addEventListener('load', () => {
  var inputName = document.querySelector('#inputName');
  prevent();
  activateInput();
  render();
});
var globalNames = [];
var currentIndex;
var isEditing = false;
function prevent() {
  var form = document.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}

function activateInput() {
  function insertName(nameAsNew) {
    //globalNames.push(nameAsNew);
    globalNames = [...globalNames, nameAsNew];
  }
  function updateName(newName) {
    globalNames[currentIndex] = newName;
  }
  inputName.focus();
  inputName.addEventListener('keyup', (event) => {
    var isFilled = !!event.target.value && event.target.value.trim() !== '';
    if (event.key === 'Enter') {
      if (!isFilled) {
        alert('Campo em Branco');
        clearInput();
        return;
      } else if (isEditing) {
        updateName(event.target.value);
        isEditing = false;
        clearInput();
      } else {
        insertName(event.target.value);
        clearInput();
      }
    }
    render();
  });
  clearInput();
}

function createDeleteButton(nameIndex) {
  var deleteButton = document.createElement('button');
  deleteButton.textContent = 'x';
  deleteButton.classList.add('deleteButton');

  deleteButton.addEventListener('click', () => {
    globalNames = globalNames.filter((_, i) => i !== nameIndex);
    render();
  });

  return deleteButton;
}

function createSpan(name, index) {
  var names = document.createElement('span');
  names.classList.add('clickable');
  names.textContent = name;

  names.addEventListener('click', () => {
    isEditing = true;
    inputName.value = name;
    inputName.focus();
    currentIndex = index;
  });

  return names;
}

function render() {
  var divNames = document.querySelector('#names');
  divNames.innerHTML = '';
  var listNames = document.createElement('ul');
  for (var i = 0; i < globalNames.length; i++) {
    var currentName = globalNames[i];

    var li = document.createElement('li');

    var buttonDelete = createDeleteButton(i);
    var names = createSpan(currentName, i);
    names.textContent = currentName;

    li.classList.add('allNames');
    li.appendChild(buttonDelete);
    li.appendChild(names);
    listNames.appendChild(li);
  }
  divNames.appendChild(listNames);
}
function clearInput() {
  inputName.value = '';
  inputName.focus();
}
