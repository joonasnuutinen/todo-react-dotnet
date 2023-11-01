import { useEffect, useReducer } from 'react';
import TodoList from './components/TodoList';
import { ActionKind, initialState, reducer } from './reducer';
import { TodoListType } from './types';

const isValidGuid = (candidate: string) => {
  const guidRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return candidate.match(guidRegExp) !== null;
}

async function fetchLists() {
  const res = await fetch(`/api/todo`);
  const data = await res.json();
  console.table('todo lists', data);
}

async function fetchList(listId: string, dispatch: Function) {
  const res = await fetch(`/api/todo/${listId}`);
  if (res.status === 404) {
    dispatch({ type: ActionKind.NEW_LIST, id: listId });
  } else {
    const receivedTodoList = await res.json() as TodoListType;
    dispatch({ type: ActionKind.LIST_RECEIVED, list: receivedTodoList });
  }
}

const getCurrentOrNewListId = () => {
  const possibleGuid = window.location.pathname.split('/')[1].trim().toLowerCase();
  const pathHasGuid = isValidGuid(possibleGuid);
  if (pathHasGuid) {
    return { listId: possibleGuid, isNew: false };
  } else {
    const newGuid = crypto.randomUUID();
    return { listId: newGuid, isNew: true };
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const { listId, isNew } = getCurrentOrNewListId();
    if (isNew) {
      const url = new URL(window.location.toString());
      url.pathname = listId;
      window.history.pushState({}, '', url);
    }

    fetchLists();

    fetchList(listId, dispatch);
  }, []);

  return (
    <TodoList
      unsavedChanges={!state.saved}
      todoList={state.list}
      handleSubmit={async () => {
        const res = await fetch(`/api/todo/${state.list.id}`, { method: 'POST', body: JSON.stringify(state.list), headers: { 'Content-Type': 'application/json' } });
        const list = await res.json() as TodoListType;
        dispatch({ type: ActionKind.LIST_SAVED, list });
      }}
      itemStateChanged={(id, value) => dispatch({ type: ActionKind.ITEM_STATE_CHANGED, id, checked: value })}
      itemTextChanged={(id, text) => dispatch({ type: ActionKind.ITEM_TEXT_CHANGED, id, text })}
      itemRemoved={(id) => dispatch({ type: ActionKind.ITEM_REMOVED, id })}
      itemAdded={() => dispatch({ type: ActionKind.ITEM_ADDED })}
      listNameChanged={(text) => dispatch({ type: ActionKind.LIST_NAME_CHANGED, name: text })}
      itemMoved={(id, oldPosition, newPosition) => dispatch({ type: ActionKind.ITEM_MOVED, id, oldPosition, newPosition })}
    />
  );
}

export default App;
