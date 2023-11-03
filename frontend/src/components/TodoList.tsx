import React, { useEffect } from "react";
import "./TodoList.css";
import {
  useTodo,
  useTodoDispatch,
  ActionKind,
  State,
  Action,
} from "../TodoContext";
import type { TodoListType } from "../types";

const isValidGuid = (candidate: string) => {
  const guidRegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return candidate.match(guidRegExp) !== null;
};

async function fetchLists() {
  const res = await fetch(`/api/todo`);
  const data = await res.json();
  console.table("todo lists", data);
}

async function fetchList(
  listId: string,
  dispatch: React.Dispatch<React.ReducerAction<React.Reducer<State, Action>>>,
) {
  const res = await fetch(`/api/todo/${listId}`);
  if (res.status === 404) {
    dispatch({ type: ActionKind.NEW_LIST, id: listId });
  } else {
    const receivedTodoList = (await res.json()) as TodoListType;
    dispatch({ type: ActionKind.LIST_RECEIVED, list: receivedTodoList });
  }
}

const getCurrentOrNewListId = () => {
  const possibleGuid = window.location.pathname
    .split("/")[1]
    .trim()
    .toLowerCase();
  const pathHasGuid = isValidGuid(possibleGuid);
  if (pathHasGuid) {
    return { listId: possibleGuid, isNew: false };
  } else {
    const newGuid = crypto.randomUUID();
    return { listId: newGuid, isNew: true };
  }
};

const TodoList = () => {
  const state = useTodo();
  const dispatch = useTodoDispatch();

  if (!state || !dispatch) return null;

  useEffect(() => {
    const { listId, isNew } = getCurrentOrNewListId();
    if (isNew) {
      const url = new URL(window.location.toString());
      url.pathname = listId;
      window.history.pushState({}, "", url);
    }

    fetchLists();

    fetchList(listId, dispatch);
  }, [dispatch]);

  const { saved, list } = state;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const res = await fetch(`/api/todo/${state.list.id}`, {
      method: "POST",
      body: JSON.stringify(state.list),
      headers: { "Content-Type": "application/json" },
    });
    const list = (await res.json()) as TodoListType;
    dispatch({ type: ActionKind.LIST_SAVED, list });
  };

  return (
    <div id="todoListContainer">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="todoListName"
          placeholder="To-do list title"
          value={list.name}
          onChange={(e) =>
            dispatch({
              type: ActionKind.LIST_NAME_CHANGED,
              name: e.target.value,
            })
          }
        />
        <ul id="itemList">
          {list.items
            ?.slice()
            .sort((a, b) => a.order - b.order)
            .map((i) => (
              <li key={i.id}>
                <div className="todoItemBlock">
                  <input
                    type="checkbox"
                    checked={i.done}
                    onChange={(e) =>
                      dispatch({
                        type: ActionKind.ITEM_STATE_CHANGED,
                        id: i.id,
                        checked: e.target.checked,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="todoItemInput"
                    placeholder="New to-do item"
                    value={i.description}
                    onChange={(e) =>
                      dispatch({
                        type: ActionKind.ITEM_TEXT_CHANGED,
                        id: i.id,
                        text: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="todoItemButton"
                    onClick={() =>
                      dispatch({
                        type: ActionKind.ITEM_MOVED,
                        id: i.id,
                        oldPosition: i.order,
                        newPosition: i.order - 1,
                      })
                    }
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="todoItemButton"
                    onClick={() =>
                      dispatch({
                        type: ActionKind.ITEM_MOVED,
                        id: i.id,
                        oldPosition: i.order,
                        newPosition: i.order + 1,
                      })
                    }
                  >
                    Move down
                  </button>
                  <button
                    type="button"
                    className="todoItemButton"
                    onClick={() =>
                      dispatch({ type: ActionKind.ITEM_REMOVED, id: i.id })
                    }
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
        </ul>
        <button
          id="addButton"
          type="button"
          onClick={() => dispatch({ type: ActionKind.ITEM_ADDED })}
        >
          Add new item
        </button>
        <button id="saveButton" type="submit" disabled={saved}>
          Save changes
        </button>
      </form>
    </div>
  );
};

export default TodoList;
