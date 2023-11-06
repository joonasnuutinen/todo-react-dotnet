import React from "react";
import type { TodoItemType } from "../../types";
import { useTodoDispatch, ActionKind } from "../../TodoContext";
import SavingInput from "../SavingInput";
import "./TodoListItem.css";

interface TodoListItemProps {
  item: TodoItemType;
  index: number;
  listLength: number;
  handleSubmit: () => Promise<void>;
  setWillSave: React.Dispatch<React.SetStateAction<boolean>>;
}

const TodoListItem = ({
  item,
  index,
  listLength,
  handleSubmit,
  setWillSave,
}: TodoListItemProps) => {
  const dispatch = useTodoDispatch();

  if (!dispatch) return null;

  const { id, done, description, order } = item;

  return (
    <li>
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
          onDoneEditing={handleSubmit}
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
          disabled={index < 1}
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
          disabled={index >= listLength - 1}
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
  );
};

export default TodoListItem;
