import React, {
  createContext,
  useContext,
  useReducer,
  type PropsWithChildren,
} from "react";
import { TodoListType } from "./types";

export type State = {
  list: TodoListType;
  saved: boolean;
};

export enum ActionKind {
  LIST_RECEIVED = "list_received",
  NEW_LIST = "new_list",
  ITEM_STATE_CHANGED = "item_state_changed",
  ITEM_TEXT_CHANGED = "item_text_changed",
  ITEM_REMOVED = "item_removed",
  ITEM_ADDED = "item_added",
  ITEM_MOVED = "item_moved",
  LIST_NAME_CHANGED = "list_name_changed",
  LIST_SAVED = "list_saved",
}

export type Action =
  | { type: ActionKind.LIST_RECEIVED; list: TodoListType }
  | { type: ActionKind.NEW_LIST; id: string }
  | { type: ActionKind.ITEM_STATE_CHANGED; id: string; checked: boolean }
  | { type: ActionKind.ITEM_TEXT_CHANGED; id: string; text: string }
  | { type: ActionKind.ITEM_REMOVED; id: string }
  | { type: ActionKind.ITEM_ADDED }
  | {
      type: ActionKind.ITEM_MOVED;
      id: string;
      oldPosition: number;
      newPosition: number;
    }
  | { type: ActionKind.LIST_NAME_CHANGED; name: string }
  | { type: ActionKind.LIST_SAVED; list: TodoListType };

export const initialState: State = {
  list: { id: "", items: [], name: "" } as TodoListType,
  saved: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionKind.LIST_RECEIVED:
      return { ...state, list: action.list, saved: true };
    case ActionKind.NEW_LIST:
      return {
        ...state,
        list: { id: action.id, items: [], name: "" },
        saved: false,
      };
    case ActionKind.LIST_NAME_CHANGED:
      return {
        ...state,
        list: { ...state.list, name: action.name },
        saved: false,
      };
    case ActionKind.ITEM_TEXT_CHANGED:
      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.map((i) =>
            i.id === action.id ? { ...i, description: action.text } : i,
          ),
        },
        saved: false,
      };
    case ActionKind.ITEM_STATE_CHANGED:
      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.map((i) =>
            i.id === action.id ? { ...i, done: action.checked } : i,
          ),
        },
        saved: false,
      };
    case ActionKind.ITEM_REMOVED:
      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.filter((i) => i.id !== action.id),
        },
        saved: false,
      };
    case ActionKind.ITEM_ADDED:
      return {
        ...state,
        list: {
          ...state.list,
          items: [
            ...state.list.items,
            {
              id: crypto.randomUUID(),
              description: "",
              done: false,
              order: Math.max(...state.list.items.map((_) => _.order)) + 1,
            },
          ],
        },
        saved: false,
      };
    case ActionKind.ITEM_MOVED:
      if (
        action.newPosition < 0 ||
        action.newPosition >= state.list.items.length
      )
        return state;
      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.map((i) => {
            // Swap the items at the new and old positions
            if (i.id === action.id) {
              return { ...i, order: action.newPosition };
            } else if (i.order === action.newPosition) {
              return { ...i, order: action.oldPosition };
            } else {
              return { ...i };
            }
          }),
        },
        saved: false,
      };
    case ActionKind.LIST_SAVED:
      return { ...state, list: action.list, saved: true };
    default:
      throw new Error();
  }
};

const TodoContext = createContext<State | null>(null);
const TodoDispatchContext = createContext<React.Dispatch<Action> | null>(null);

export function TodoProvider({ children }: PropsWithChildren<unknown>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TodoContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoContext.Provider>
  );
}

export function useTodo() {
  return useContext(TodoContext);
}

export function useTodoDispatch() {
  return useContext(TodoDispatchContext);
}
