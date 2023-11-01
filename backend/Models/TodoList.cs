using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TodoList
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = "";
        public ICollection<TodoItem> Items { get; set; } = new List<TodoItem>();
    }
}
