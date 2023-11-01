export type TodoItemType = {
    id: string,
    description: string,
    done: boolean,
    order: number,
};

export type TodoListType = {
    id: string,
    name: string,
    items: Array<TodoItemType>
};
