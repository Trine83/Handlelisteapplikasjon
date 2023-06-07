const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
const todosListEl = document.getElementById('todos-list');
const notificationEl = document.querySelector('.notification');


// lets
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

// første 
renderTodos();

// FORM 
form.addEventListener('submit', function (event) {
  event.preventDefault();

  saveTodo();
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
});

// Lagre todo
function saveTodo() {
  const todoValue = todoInput.value;

  // sjekk om den er tom
  const isEmpty = todoValue === '';

  // Sjekk om den fordobler seg
  const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

  if (isEmpty) {
    showNotification("Gjøremål er tomt");
  } else if (isDuplicate) {
    showNotification('??!');
  } else {
    if (EditTodoId >= 0) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? todoValue : todo.value,
      }));
      EditTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      });
    }

    todoInput.value = '';
  }
}

// gjengi TODOS
function renderTodos() {
  if (todos.length === 0) {
    todosListEl.innerHTML = '<center>Ingenting å gjøre?</center>';
    return;
  }

  // fjern før gjengi
  todosListEl.innerHTML = '';

  // gjengi TODOS
  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `
    <div class="todo" id=${index}>
      <i 
        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
        style="color : ${todo.color}"
        data-action="check"
      ></i>
      <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
      <i class="bi bi-pencil-square" data-action="edit"></i>
      <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
  });
}

// CLICK EVENT Handleliste
todosListEl.addEventListener('click', (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== 'todo') return;

  // handle id
  const todo = parentElement;
  const todoId = Number(todo.id);

  // target action
  const action = target.dataset.action;

  action === 'check' && checkTodo(todoId);
  action === 'edit' && editTodo(todoId);
  action === 'delete' && deleteTodo(todoId);
});

// Hake av
function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));

  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Redigere en 
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

// slette TODO
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;

  // gjengi
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Vs en note
function showNotification(msg) {
  // forandre mld
  notificationEl.innerHTML = msg;

  // notification enter
  notificationEl.classList.add('notif-enter');

  // notification 
  setTimeout(() => {
    notificationEl.classList.remove('notif-enter');
  }, 2000);
}