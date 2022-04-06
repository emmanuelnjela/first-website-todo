/* first step in my journal from knowing few to pro. The first project is todo app */
(function() {
  'use strict'

  function handle_input_container() {
    let tbody = document.querySelector('tbody');
    const input_container = document.querySelector('.todo-input-container');
    const button = input_container.children[0];
    const input = input_container.children[1];
    let local_todos = Object.values(localStorage).map(e => JSON.parse(e));
    const todo_rows = [];
    let todo = [];
    let id = Number.parseInt(generate_id(), 10);
    
    input.value = "";
    input.addEventListener('keydown', e => {
      if (e.key == BackSpace) {
        todo.pop();
      } else if (e.key.length == 1) {
        todo.push(e.key);
        e.target.value = todo.join('');
      }
      e.preventDefault();
    })
    button.addEventListener('click', (e) => {
      let todo_row = create_todo(input.value, id);
      if (todo_row) {
        todo_rows.push(todo_row);
        handle_set_to_local(`tr-${id}`, todo_rows[todo_rows.length - 1]);
        id++;
      }
            if(input.value){
          append_to_tbody();
      }
      input.value = '';
      handle_badge(localStorage.length);
      e.preventDefault();

    })
    if (localStorage.length > 0) {
      append_from_local(local_todos);
    }

  }

  handle_input_container();

  function generate_id() {
    if (localStorage.length == 0) return 0;
    let id = Object.keys(localStorage)
      .map(tr => tr.split("-")[1])
      .reduce((sum, elem) => Math.max(sum, elem));
    return id + 1;
  }

  function create_todo(task, id) {
    if (task) {
      let isComplete = false;
      return {
        task,
        isComplete,
        id
      };
    }
    return null;
  }

  function handle_td(data) {
    let td = document.createElement('td');
    td.append(data);
    return td;
  }


  function handle_tr(td) {
    let tr = document.createElement('tr');
    tr.appendChild(td);
    return tr;
  }

  function handle_checkbox() {
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'checkbox';
    input.addEventListener('change', e => {
      if (e.target.checked) {
        add_text_styles(e.target, "italic", "line-through", "grey");
      } else {
        add_text_styles(e.target);
      }
      input.isComplete = !input.isCompelete;
    });
    return input;
  }

  function add_text_styles(target, font_style = "normal", text_dec = "none", color = "currentColor") {
    target.parentElement.nextSibling.style.fontStyle = font_style;
    target.parentElement.nextSibling.style.textDecoration = text_dec;
    target.parentElement.nextSibling.style.color = color;
  }

  function handle_btn() {
    let btn = document.createElement('button');
    btn.append('X');
    btn.id = 'del';
    btn.addEventListener("click", e => {
      let target_tr = e.target.parentElement.parentElement;
      target_tr.remove();
      handle_delete_from_local(`tr-${target_tr.id}`);
      handle_badge(localStorage.length);
    })
    return btn;
  }

  function handle_badge(task_number) {
    let badge = document.querySelector(".badge");
    badge.textContent = task_number;
  }


  function append_from_local(array) {
    let tbody = document.querySelector("tbody");
    for (let element of array) {
      let row = element;
      let td_task = handle_td(row.id);
      let td_btn = handle_td(handle_btn());
      let tr = handle_tr(handle_td(handle_checkbox()));
      tr.id = row.id;
      tr.append(handle_td(row.task));
      tr.append(td_btn);
      tbody.append(tr);
      handle_badge(localStorage.length);
    }
  }

  function handle_set_to_local(name, data) {
    if (name && data) {
      let str_data = JSON.stringify(data);
      localStorage.setItem(name, str_data);
    }
  }


  function handle_get_from_local(name) {
    if (name) {
      let prs_name = localStorage.getItem(name);
      let data = JSON.parse(prs_name);
      return data;
    }
  }

  function handle_delete_from_local(name) {
    if (localStorage.key(name)) {
      localStorage.removeItem(name);
    }
  }


  function append_to_tbody() {
    let local_todos = Object.values(localStorage).map(e => JSON.parse(e));
    let last_item = local_todos.map(e => e.id)
      .sort((a, b) => a - b).reduce((cur, next) => Math.max(cur, next));
    let tbody = document.querySelector('tbody');
    let row = local_todos.filter(e => e.id == last_item)[0];

    let td_task = handle_td(row.id);
    let td_btn = handle_td(handle_btn());
    let tr = handle_tr(handle_td(handle_checkbox()));
    tr.id = row.id;
    tr.append(handle_td(row.task));
    tr.append(td_btn);
    tbody.append(tr);
  }

})()
