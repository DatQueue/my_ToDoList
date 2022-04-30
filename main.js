"use strict";

window.addEventListener("load", () => {
  const taskForm = document.querySelector("#new-task-form");
  const taskInput = document.querySelector("#new-task-input");
  const taskBox = document.querySelector(".task__box");

  const TODO__KEY = "todoItems";

  let toDos = [];
  let storageItems = JSON.parse(localStorage.getItem(TODO__KEY));
  console.log(storageItems);

  if (storageItems) {
    storageItems.forEach((e) => {
      console.log(e);
      createItem(e);
      toDos.push(e);
    });
  }

  function onAdd() {
    //1.get text
    const text = taskInput.value;
    if (text === "") {
      alert("Please fill out the task");
      taskInput.focus();
      return;
    }
    //2.make new task
    //3.add items to container
    //4.scroll to item

    //5.initialize input
    taskInput.value = "";
    taskInput.focus();

    let newTodoObj = {
      text: text,
      id: Date.now(),
    };

    createItem(newTodoObj);
    toDos.push(newTodoObj);

    saveToDos();
  }

  function saveToDos() {
    localStorage.setItem(TODO__KEY, JSON.stringify(toDos));
  }

  function createItem(newTodoObj) {
    const taskRow = document.createElement("li");
    taskRow.setAttribute("class", "task__row");
    taskRow.setAttribute("id", `${newTodoObj.id}`);

    const task_add = document.createElement("div");
    task_add.setAttribute("class", "task");

    const task_checkBox = document.createElement("div");
    task_checkBox.setAttribute("class", "checkBox");

    task_add.appendChild(task_checkBox);

    const task_content_add = document.createElement("div");
    task_content_add.setAttribute("class", "content");

    task_add.appendChild(task_content_add);

    const task_input_add = document.createElement("input");
    task_input_add.setAttribute("class", "text");
    task_input_add.value = `${newTodoObj.text}`;
    task_input_add.type = "text";
    task_input_add.readOnly = true;

    task_content_add.appendChild(task_input_add);

    const action_add = document.createElement("div");
    action_add.classList.add("action");

    const task_edit_add = document.createElement("button");
    task_edit_add.classList.add("edit");
    task_edit_add.innerText = "EDIT";

    const task_delete_add = document.createElement("button");
    task_delete_add.classList.add("delete");
    task_delete_add.innerText = "DELETE";

    action_add.appendChild(task_edit_add);
    action_add.appendChild(task_delete_add);

    task_add.appendChild(action_add);

    taskRow.appendChild(task_add);

    task_delete_add.addEventListener("click", () => {
      deleteHandler(taskRow);
    });

    task_edit_add.addEventListener("click", (e) => {
      editHandler(e, task_input_add, task_checkBox, newTodoObj);
      saveToDos();
    });

    task_checkBox.addEventListener("click", (e) => {
      checkedHandler(e, task_input_add, task_edit_add);
    });

    taskBox.appendChild(taskRow);

    taskRow.scrollIntoView({ behavior: "smooth" });
  }

  function deleteHandler(taskRow) {
    let targetId = taskRow.id;
    taskBox.removeChild(taskRow);

    toDos = toDos.filter((todo) => todo.id !== parseInt(targetId));
    localStorage.setItem(TODO__KEY, JSON.stringify(toDos));
  }

  function editHandler(e, task_input_add, task_checkBox, newTodoObj) {
    if (e.target.innerText.toLowerCase() === "edit") {
      task_input_add.readOnly = false;
      task_input_add.focus();
      task_input_add.style.color = "#dc143c";
      e.target.innerText = "SAVE";
      task_checkBox.style.display = "none";
    } else {
      if (task_input_add.value === "") {
        alert("Please fill in the blank");
        task_input_add.focus();
        task_checkBox.style.display = "none";
      } else {
        e.target.innerText = "EDIT";
        task_input_add.readOnly = true;
        task_input_add.style.color = "white";
        task_checkBox.style.display = "block";
        let editedText = task_input_add.value;
        console.log(editedText);

        newTodoObj.text = editedText;
        console.log(newTodoObj);
      }
    }
  }

  function checkedHandler(e, task_input_add, task_edit_add) {
    const target = e.target;
    if (target.innerText === "") {
      target.innerText = "✔";
      target.style.opacity = 0.8;
      task_input_add.style.opacity = 0.2;
      task_input_add.style.textDecorationLine = "line-through";
      if (task_input_add.value === "") {
        alert("nothing value are in");
        task_input_add.focus();
        target.innerText = "";
      }
    } else {
      target.innerText = "";
      target.style.opacity = 1;
      task_input_add.style.textDecorationLine = "none";
      task_input_add.style.opacity = 1;
    }
    task_edit_add.addEventListener("click", () => {
      target.innerText = "";
      target.style.opacity = 1;
      task_input_add.style.opacity = 1;
      task_input_add.style.textDecorationLine = "none";
    });
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    onAdd();
  });
});
