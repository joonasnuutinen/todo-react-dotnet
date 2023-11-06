import React, { useState, useEffect, useRef } from "react";
import "./TodoList.css";
import { useTodo, useTodoDispatch, ActionKind } from "../../TodoContext";
import type { TodoListType } from "../../types";

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

async function fetchList(listId: string): Promise<TodoListType | null> {
  const res = await fetch(`/api/todo/${listId}`);

  if (res.status !== 200) return null;

  return (await res.json()) as TodoListType;
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

interface SavingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onDone: () => Promise<void>;
}

const SavingInput = ({ onDone, ...props }: SavingInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <input
      ref={inputRef}
      onBlur={() => onDone()}
      onKeyDown={(e) => {
        if (e.key === "Enter" && inputRef.current) {
          e.preventDefault();
          inputRef.current.blur();
          e.target.dispatchEvent(new FocusEvent("blur"));
        }
      }}
      {...props}
    />
  );
};

const TodoList = () => {
  const state = useTodo();
  const dispatch = useTodoDispatch();

  if (!state || !dispatch) return null;

  const [loading, setLoading] = useState(true);
  const [willFocusLast, setWillFocusLast] = useState(false);
  const [willSave, setWillSave] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e?.preventDefault();
    const res = await fetch(`/api/todo/${state.list.id}`, {
      method: "POST",
      body: JSON.stringify(state.list),
      headers: { "Content-Type": "application/json" },
    });
    const list = (await res.json()) as TodoListType;
    dispatch({ type: ActionKind.LIST_SAVED, list });
  };

  useEffect(() => {
    const { listId, isNew } = getCurrentOrNewListId();
    if (isNew) {
      const url = new URL(window.location.toString());
      url.pathname = listId;
      window.history.pushState({}, "", url);
    }

    // fetchLists();

    fetchList(listId).then((list) => {
      if (!list) {
        dispatch({ type: ActionKind.NEW_LIST, id: listId });
      } else {
        dispatch({ type: ActionKind.LIST_RECEIVED, list });
      }
      setLoading(false);
    });
  }, [dispatch]);

  /**
   * Focus the last item input if set to be focused
   */
  useEffect(() => {
    if (willFocusLast && listRef.current) {
      const itemInputs = [
        ...listRef.current.querySelectorAll(".todoItemInput"),
      ] as HTMLInputElement[];
      if (itemInputs.length < 1) return;
      const lastItemInput = itemInputs[itemInputs.length - 1];
      lastItemInput.focus();
      setWillFocusLast(false);
    }
  }, [willFocusLast, listRef.current]);

  /**
   * Save the list if set to be saved
   */
  useEffect(() => {
    if (willSave) {
      handleSubmit().then(() => setWillSave(false));
    }
  }, [willSave]);

  const { saved, list } = state;

  return (
    <div id="todoListContainer">
      {loading ? (
        <div>Loading</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <SavingInput
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
            onDone={() => handleSubmit()}
          />
          <ul id="itemList" ref={listRef}>
            {list.items
              ?.slice()
              .sort((a, b) => a.order - b.order)
              .map(({ id, done, description, order }, i) => (
                <li key={id}>
                  <div className="todoItemBlock">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={(e) => {
                        dispatch({
                          type: ActionKind.ITEM_STATE_CHANGED,
                          id,
                          checked: e.target.checked,
                        });
                        setWillSave(true);
                      }}
                    />
                    <SavingInput
                      type="text"
                      className="todoItemInput"
                      placeholder="New to-do item"
                      value={description}
                      onChange={(e) =>
                        dispatch({
                          type: ActionKind.ITEM_TEXT_CHANGED,
                          id,
                          text: e.target.value,
                        })
                      }
                      onDone={handleSubmit}
                    />
                    <button
                      type="button"
                      className="todoItemButton"
                      onClick={() => {
                        dispatch({
                          type: ActionKind.ITEM_MOVED,
                          id,
                          oldPosition: order,
                          newPosition: order - 1,
                        });
                        setWillSave(true);
                      }}
                      disabled={i < 1}
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      className="todoItemButton"
                      onClick={() => {
                        dispatch({
                          type: ActionKind.ITEM_MOVED,
                          id,
                          oldPosition: order,
                          newPosition: order + 1,
                        });
                        setWillSave(true);
                      }}
                      disabled={i >= list.items.length - 1}
                    >
                      Move down
                    </button>
                    <button
                      type="button"
                      className="todoItemButton"
                      onClick={() => {
                        dispatch({ type: ActionKind.ITEM_REMOVED, id });
                        setWillSave(true);
                      }}
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
            onClick={() => {
              dispatch({ type: ActionKind.ITEM_ADDED });
              setWillFocusLast(true);
            }}
          >
            Add new item
          </button>
        </form>
      )}
    </div>
  );
};

export default TodoList;
