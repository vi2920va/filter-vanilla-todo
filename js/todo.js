'use strict';

let todos = [];
const loaded_todos = localStorage.getItem('TODOS');
const add_input = document.querySelector('.add-input');
const add_form = document.querySelector('.add-form');
const add_btn = document.querySelector('.add-btn');
const todo_list_all = document.querySelector('.todo-list__all');
const todo_list_complete = document.querySelector('.todo-list__complete');
const todo_list_incomplete = document.querySelector('.todo-list__incomplete');
const btn_group = document.querySelector('.btn-group');
const list = document.querySelectorAll('ul');

// 1. 초기화 실행.
function init() {
  loadTodos();
  addEvent();
  render();
}

// 2. 로컬 스토리지에서 데이터를 조회.
function loadTodos() {
  if (loaded_todos !== null) {
    todos = JSON.parse(loaded_todos);
    return todos;
  }
}

// 3. 화면 그리기.
function render(state = 'all') {
  blankTemplate();
  let join, item;
  let list = [...todos].reverse();

  switch (state) {
    case 'all':
      join = list.map(itemTemplate).join('');
      todo_list_all.innerHTML = join;
      break;
    case 'incomplete':
      item = list.filter(incompleteFilter);
      join = item.map(itemTemplate).join('');
      todo_list_incomplete.innerHTML = join;
      break;
    case 'complete':
      item = list.filter(completeFilter);
      join = item.map(itemTemplate).join('');
      todo_list_complete.innerHTML = join;
      break;
    default:
      console.log('It is a state that does not exist.');
  }
}

// 3-1. 리스트에 아이템을 추가하기 전 템플릿을 초기화.
function blankTemplate() {
  todo_list_all.innerHTML = '';
  todo_list_incomplete.innerHTML = '';
  todo_list_complete.innerHTML = '';
}

// 3-2. 아이템의 상태가 미완료 여부 필터.
function incompleteFilter(todo) {
  return !todo.isCompleted;
}

// 3-3. 아이템의 상태가 완료 여부 필터.
function completeFilter(todo) {
  return todo.isCompleted;
}

// 3-4. 아이템을 완료 여부 상태에 따라서 맞는 li를 요소를 만들기.
function itemTemplate(todo) {
  return `
  <li class = ${todo.isCompleted ? 'todo-complete' : 'todo-incomplete'} id = ${
    todo.id
  }>
    <input type="checkbox" id=${todo.id} value=${todo.isCompleted} ${
    todo.isCompleted ? 'checked' : 'unchecked'
  }>    
    <label for=${todo.id} class=${
    todo.isCompleted ? 'complete__item--content' : 'incomplete__item--content'
  }>
      ${todo.content}
    </label>
    <button type="button" class=${todo.isCompleted ? 'checkBtn' : 'deleteBtn'}>
      <i class="fas ${todo.isCompleted ? 'fa-check' : 'fa-times'}"></i>
      <span class="a11y-hidden">${todo.isCompleted ? '체크' : '삭제'}</span>
    </button>
  </li>`;
}

// 2. 이벤트.
function addEvent() {
  // 2-1. add_form에서 'Enter'를 누르면 추가.
  add_form.addEventListener('keydown', (e) => {
    return e.key.includes('Enter') && addFormSubmit(e);
  });

  // 2-2. add_form에서 'add-btn'를 누르면 추가.
  add_btn.addEventListener('click', (e) => {
    return addFormSubmit(e);
  });

  // 2-3.btn-group안에서 각각의 버튼을 누르면 화면 이동.
  btn_group.addEventListener('click', (e) => {
    switch (e.target.className) {
      case 'all-btn':
        render('all', e);
        break;
      case 'incomplete-btn':
        render('incomplete');
        break;
      case 'complete-btn':
        render('complete');
        break;
      default:
        console.log('The button does not exist.');
    }
  });

  // 2-4. ul tag안에서 각각 li에 있는 버튼을 누르면 이벤트 발생.

  list.forEach((item) => {
    item.addEventListener('click', (e) => {
      switch (e.target.className) {
        case 'deleteBtn':
          itemAction(e, 'delete');
          break;
        case 'checkBtn':
        case 'incomplete__item--content':
        case 'complete__item--content':
          itemAction(e, 'change');
          break;
        default:
          console.log('The button does not exist.');
      }
    });
  });
}

// 4. form 유효성 검사.
function addFormSubmit(e) {
  e.preventDefault();

  if (add_input.value === '') {
    return add_input.setAttribute('required', false);
  }

  addTodoItem(add_input.value);
  add_input.setAttribute('required', true);
  add_input.value = '';
}

// 4-1. 아이템 추가.
function addTodoItem(value) {
  todos.push({
    id: Math.floor(Math.random() * 999),
    content: value,
    isCompleted: false,
  });
  saveTodos();
  render();
}

// 5. 클릭한 대상과 아이템이 일치하는지 검사.
function matchingID(id, item) {
  return id === item.id;
}

// 6. li에서 어떤 버튼을 눌렀는지 상태에 따라서 맞는 행동.
function itemAction(e, state) {
  console.log('click');
  let todo;
  let name = e.currentTarget.className.substring(11);
  let list = [...todos];
  let li = e.target.parentNode;
  let id = Number(li.id);
  let item = list.find(matchingID.bind(todo, id));
  let index = list.findIndex(matchingID.bind(todo, id));

  switch (state) {
    case 'delete':
      list.splice(index, 1);
      break;
    case 'change':
      item.isCompleted = !item.isCompleted;
      list.splice(index, 0);
      break;
    default:
      console.log('It is a state that does not exist.');
  }
  todos = list;
  saveTodos();
  render(name);
}

// 7. 로컬 스토리지 데이터 저장
function saveTodos() {
  localStorage.setItem('TODOS', JSON.stringify(todos));
}

init();
