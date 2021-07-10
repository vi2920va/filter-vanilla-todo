let todos = [];

const loaded_todos = localStorage.getItem('TODOS');

const wrapper = document.querySelector('.wrapper');
const add_input = document.querySelector('.add-input');
const todo_list_all = document.querySelector('.todo-list__all');
const todo_list_complete = document.querySelector('.todo-list__complete');

// 1. 초기화 실행
function init() {
  addEvent();
  loadTodoList();
  renderTodo();
}

// 6. 로컬 스토리지 데이터 조회
function loadTodoList() {
  if (loaded_todos !== null) {
    todos = JSON.parse(loaded_todos);
    return todos;
  }
}

// 7. 추가, 삭제, 화면 그리기
function renderTodo() {
  let list = [...todos].reverse();
  list.map(templeateTodo);
}

// 8. 상태가 완료되었을 때만
function compledTodo(id) {
  let todo, item, list;
  list = [...todos].reverse();
  item = list.find(matchingID.bind(todo, id));
  elementStateChange(item);
}

// 7-1. li 요소와 그에 따른 요소들 추가.
function templeateTodo(todo) {
  let li = document.createElement('li');
  li.setAttribute(
    'class',
    !todo.isCompleted ? 'todo-incomplete' : 'todo-completed'
  );
  li.setAttribute('id', todo.id);
  let label = document.createElement('label');
  let text = document.createTextNode(todo.content);
  let input = document.createElement('input');
  let icon = document.createElement('i');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('value', todo.isCompleted);
  icon.setAttribute(
    'class',
    !todo.isCompleted ? 'fas fa-times' : 'fas fa-check'
  );
  label.appendChild(text);
  label.appendChild(input);
  label.appendChild(icon);
  li.appendChild(label);
  return todo_list_all.appendChild(li);
}

// 8-1. 완료 되었을 때 요소의 class와 상태 바꾸기.
function elementStateChange(item) {
  let li = todo_list_all.querySelector('li');
  let icon = todo_list_all.querySelector('.fas');
  let checkbox = todo_list_all.querySelector('input[type="checkbox"]');
  checkbox.value = item.isCompleted;
  li.classList.remove('todo-incomplete');
  li.classList.add('todo-completed');
  icon.classList.remove('fa-times');
  icon.classList.add('fa-check');
}

// 2. 이벤트 위임
function addEvent() {
  // event listener
  wrapper.addEventListener('click' || 'keydown', (e) => {
    let li, id, item, todo, list;
    if (e.target.className === 'add-btn' || e.key === 'Enter') {
      addFormSubmit();
    } else if (e.target.className === 'fas fa-times') {
      list = [...todos];
      li = e.target.parentNode.parentNode;
      id = Number(li.id);
      index = todos.findIndex(matchingID.bind(todo, id));
      list.splice(index, 1);
      todos = list;
      todo_list_all.removeChild(li);
      saveTodoList();
      // 수정중
    } else if (e.target.tagName === 'LABEL') {
      list = [...todos];
      li = e.target.parentNode;
      id = Number(li.id);
      index = todos.findIndex(matchingID.bind(todo, id));
      item = todos.find(matchingID.bind(todo, id));
      item.isCompleted = !item.isCompleted;
      list.splice(index, 0);
      todos = list;
      compledTodo(id);
      saveTodoList();
      // 수정중
    } else if (e.target.className === 'complete-btn') {
      filterTodo();
      // 수정중
    } else if (e.target.className === 'all-btn') {
      todo_list_all.style.display = 'block';
      todo_list_complete.style.display = 'none';
    }
  });
}
// 수정중
function filterTodo() {
  todo_list_all.style.display = 'none';
  todo_list_complete.style.display = 'block';
  let rs = todos.filter((todo) => todo.isCompleted);
  rs.map((todo) => {
    let li = document.createElement('li');
    li.setAttribute('class', 'todo-completed');
    li.setAttribute('id', todo.id);
    let label = document.createElement('label');
    let text = document.createTextNode(todo.content);
    let input = document.createElement('input');
    let icon = document.createElement('i');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('value', todo.isCompleted);
    icon.setAttribute('class', 'fas fa-times');
    label.append(text);
    label.append(input);
    label.append(icon);
    li.append(label);
    return todo_list_complete.append(li);
  });
}

// 3. form 유효성 검사
function addFormSubmit() {
  let value = add_input.value;

  if (value === '') {
    return false;
  }
  addTodoItem(value);
  value = '';
}

// 4. 아이템 추가
function addTodoItem(value) {
  todos.push({
    id: Math.floor(Math.random() * 999),
    content: value,
    isCompleted: false,
  });
  saveTodoList();
  renderTodo();
}

function matchingID(id, item) {
  return id === item.id;
}

// 5. 로컬 스토리지 데이터 저장
function saveTodoList() {
  localStorage.setItem('TODOS', JSON.stringify(todos));
}

init();
