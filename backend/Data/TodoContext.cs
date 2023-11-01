using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class TodoContext : DbContext
    {
        public TodoContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<TodoList> TodoLists { get; set; }
        public DbSet<TodoItem> TodoItems { get; set; }

        // Uncomment the method below to enable better EF Core logging
        /*
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.LogTo(Console.WriteLine).EnableSensitiveDataLogging();
        }
        */
    }
}
