import React from "react";
import { TodoListType } from "../types";
import "./TodoList.css";

type TodoListProps = {
  todoList: TodoListType;
  unsavedChanges: boolean;
  handleSubmit: () => void;
  itemStateChanged: (id: string, value: boolean) => void;
  itemTextChanged: (id: string, text: string) => void;
  itemRemoved: (id: string) => void;
  itemAdded: () => void;
  listNameChanged: (text: string) => void;
  itemMoved: (id: string, oldPosition: number, newPosition: number) => void;
};

const TodoList = ({
  todoList,
  unsavedChanges,
  handleSubmit,
  itemStateChanged,
  itemTextChanged,
  itemRemoved,
  itemAdded,
  listNameChanged,
  itemMoved,
}: TodoListProps) => {
  return (
    <div id="todoListContainer">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          id="todoListName"
          placeholder="To-do list title"
          value={todoList.name}
          onChange={(e) => listNameChanged(e.target.value)}
        />
        <ul id="itemList">
          {todoList.items
            ?.slice()
            .sort((a, b) => a.order - b.order)
            .map((i) => (
              <li key={i.id}>
                <div className="todoItemBlock">
                  <input
                    type="checkbox"
                    checked={i.done}
                    onChange={(e) => itemStateChanged(i.id, e.target.checked)}
                  />
                  <input
                    type="text"
                    className="todoItemInput"
                    placeholder="New to-do item"
                    value={i.description}
                    onChange={(e) => itemTextChanged(i.id, e.target.value)}
                  />
                  <button
                    type="button"
                    className="todoItemButton"
                    onClick={() => itemMoved(i.id, i.order, i.order - 1)}
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="todoItemButton"
                    onClick={() => itemMoved(i.id, i.order, i.order + 1)}
                  >
                    Move down
                  </button>
                  <button
                    type="button"
                    className="todoItemButton"
                    onClick={() => itemRemoved(i.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
        </ul>
        <button id="addButton" type="button" onClick={itemAdded}>
          Add new item
        </button>
        <button id="saveButton" type="submit" disabled={!unsavedChanges}>
          Save changes
        </button>
      </form>
    </div>
  );
};

export default TodoList;
