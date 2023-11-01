using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class TodoItem
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Description { get; set; } = "";
        public bool Done { get; set; }
        public int Order { get; set; }
    }
}