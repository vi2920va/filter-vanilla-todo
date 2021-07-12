'use strict';

let todos = [];
const loaded_todos = localStorage.getItem('TODOS');
const wrapper = document.querySelector('.wrapper');
const add_input = document.querySelector('.add-input');
const todo_list_all = document.querySelector('.todo-list__all');
const todo_list_complete = document.querySelector('.todo-list__complete');
const todo_list_incomplete = document.querySelector('.todo-list__incomplete');

// 1. 초기화 실행.
function init() {
  addEvent();
  loadTodoList();
  renderTodo();
}

// 5. 로컬 스토리지에서 데이터를 조회.
function loadTodoList() {
  if (loaded_todos !== null) {
    todos = JSON.parse(loaded_todos);
    return todos;
  }
}

// 6. 추가, 수정, 삭제 이벤트를 할 때 화면을 다시 그리기.
function renderTodo() {
  let list, join;
  list = [...todos].reverse();
  join = list.map(templeateTodo).join('');
  todo_list_all.innerHTML = join;
}

// 7. 아이템을 완료 여부 상태에 따라서 맞는 li를 요소를 만들기.
function templeateTodo(todo) {
  return `
    <li class=${todo.isCompleted ? 'todo-complete' : 'todo-incomplete'}>
        <input type="checkbox" id=${todo.id} value=${todo.isCompleted}>    
        <label for=${todo.id} class=${
    todo.isCompleted ? 'complete__item--content' : 'incomplete__item--content'
  }>${todo.content}</label>
        <button type="button" class=${
          todo.isCompleted ? 'checkBtn' : 'deleteBtn'
        }>
          <i class="fas ${todo.isCompleted ? 'fa-check' : 'fa-times'}"></i>
          <span class="a11y-hidden">${todo.isCompleted ? '체크' : '삭제'}</span>
        </button>
    </li>`;
}

// 2. 이벤트 위임
function addEvent() {
  wrapper.addEventListener('click' || 'keydown', (e) => {
    // event listener
    let ul, li, list, item, todo, index, id;
    // 2-1. add-form 안에서 add-btn 버튼을 누르거나 Enter 버튼을 누르면 추가.
    if (e.target.className === 'add-btn' || e.key === 'Enter') {
      addFormSubmit();
      // 2-2. 삭제 아이콘을 누르면 미완료 목록에 있는 아이템을 삭제.
    } else if (e.target.className.includes('fa-times')) {
      list = [...todos];
      ul = e.target.parentNode.parentNode.parentNode;
      li = e.target.parentNode.parentNode;
      id = Number(li.id);
      index = list.findIndex(matchingID.bind(todo, id));
      list.splice(index, 1);
      todos = list;
      ul.removeChild(li);
      saveTodoList();
      // 2-3. 체크 아이콘을 누르면 완료 상태에 있는 아이템을 다시 미완료 상태로 변경.
    } else if (e.target.className.includes('fa-check')) {
      list = [...todos];
      li = e.target.parentNode.parentNode;
      id = Number(li.id);
      index = list.findIndex(matchingID.bind(todo, id));
      item = list.find(matchingID.bind(todo, id));
      item.isCompleted = !item.isCompleted;
      list.splice(index, 0);
      todos = list;
      renderTodo();
      saveTodoList();
      // 2-4. 미완료 아이템의 콘텐츠 내용을 누르면 완료 상태로 변경.
    } else if (e.target.className.includes('incomplete__item--content')) {
      list = [...todos];
      id = Number(e.target.getAttribute('for'));
      item = list.find(incomplete.bind(todo, id));
      index = list.findIndex(matchingID.bind(todo, id));
      item.isCompleted = !item.isCompleted;
      list.splice(index, 0);
      todos = list;
      saveTodoList();
      renderTodo();
      // 2-5. 완료 아이템의 콘텐츠를 내용을 누르면 미완료 상태로 변경.
    } else if (e.target.className.includes('complete__item--content')) {
      list = [...todos];
      id = Number(e.target.getAttribute('for'));
      item = list.find(completed.bind(todo, id));
      index = list.findIndex(matchingID.bind(todo, id));
      item.isCompleted = !item.isCompleted;
      list.splice(index, 0);
      todos = list;
      saveTodoList();
      renderTodo();
      // 2-6. all 버튼 누르면 아이템 전부를 보여준다.(수정중)
    } else if (e.target.className.includes('all-btn')) {
      renderTodo();
      // 2-7. icomplete 버튼을 누르면 미완료 상태의 아이템만 보여준다.
    } else if (e.target.className.includes('incomplete-btn')) {
      impleteFilter();
      // 2-8. complete 버튼을 누르면 완료 상태의 아이템만 보여준다.
    } else if (e.target.className.includes('complete-btn')) {
      completeFilter();
    }
  });
}

// 2-5. 완료 아이템의 조건을 검사.
function completed(id, item) {
  return id === item.id && item.isCompleted;
}
// 2-4. 미완료 아이템의 조건을 검사.
function incomplete(id, item) {
  return id === item.id && !item.isCompleted;
}

// 2-7. 미완료 상태의 아이템만 보여준다.
function impleteFilter() {
  todo_list_all.innerHTML = '';
  todo_list_complete.innerHTML = '';
  let list = todos.filter((todo) => !todo.isCompleted);

  let result = list
    .map((todo) => {
      return `
        <li class="todo-incomplete" id=${todo.id}>
          <input type="checkbox" id="${todo.id}" value="${todo.isCompleted}">    
          <label for="${todo.id}">${todo.content}</label>
          <button class="deleteBtn">
            <i class="fas fa-times"></i>
            <span class="a11y-hidden">삭제</span>
          </button>
        </li>
          `;
    })
    .reverse()
    .join('');
  todo_list_incomplete.innerHTML = result;
}

// 2-8. 완료 상태의 아이템만 보여준다.
function completeFilter() {
  todo_list_all.innerHTML = '';
  todo_list_incomplete.innerHTML = '';
  let list = todos.filter((todo) => todo.isCompleted);

  let result = list
    .map((todo) => {
      return `
        <li class="todo-complete" id=${todo.id}>
          <input type="checkbox" id=${todo.id} value=${todo.isCompleted}>    
          <label for="${todo.id}" class="complete__item--content">${todo.content}</label>
          <button class="checkBtn">
            <i class="fas fa-check"></i>
            <span class="a11y-hidden">체크</span>
          </button>
        </li>`;
    })
    .reverse()
    .join('');
  todo_list_complete.innerHTML = result;
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

// 2. 클릭한 대상과 아이템이 일치하는지 검사.
function matchingID(id, item) {
  return id === item.id;
}

// 5. 로컬 스토리지 데이터 저장
function saveTodoList() {
  localStorage.setItem('TODOS', JSON.stringify(todos));
}

init();
