using backend.Models;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static void Initialize(TodoContext context)
        {
            if (context.TodoLists.Any())
            {
                return;
            }

            var lists = new TodoList[]
            {
                new TodoList
                {
                    Name = "Mary's todo list",
                    Items = new TodoItem[]
                    {
                        new TodoItem
                        {
                            Description = "Do the dishes",
                            Done = true,
                            Order = 0,
                        },
                        new TodoItem
                        {
                            Description = "Make dinner",
                            Done = false,
                            Order = 1
                        },
                    }
                },
                new TodoList
                {
                    Name = "Harry's important stuff",
                    Items = new TodoItem[]
                    {
                        new TodoItem
                        {
                            Description = "Take the dog for a walk",
                            Done = true,
                            Order = 0,
                        },
                        new TodoItem
                        {
                            Description = "Go jogging",
                            Done = false,
                            Order = 1,
                        }
                    }
                }
            };

            context.TodoLists.AddRange(lists);
            context.SaveChanges();
        }
    }
}
