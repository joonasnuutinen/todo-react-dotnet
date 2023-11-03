import React from "react";
import { render, screen } from "@testing-library/react";
import TodoList from "./TodoList";
import { TodoListType } from "./../types";

test("save button is disabled when no unsaved changes are present", async () => {
  const todoList: TodoListType = {
    id: "list1",
    name: "Test to-do list",
    items: [
      {
        id: "item1",
        description: "Item 1 description",
        done: false,
        order: 1,
      },
      {
        id: "item2",
        description: "Item 2 description",
        done: true,
        order: 2,
      },
    ],
  };

  render(<TodoList />);

  const saveButton = await screen.findByText("Save changes");
  expect(saveButton).toBeDisabled();
});
