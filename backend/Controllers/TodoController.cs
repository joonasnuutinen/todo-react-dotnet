using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly TodoContext _context;

        public TodoController(TodoContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public ActionResult<TodoList> Get(Guid id)
        {
            var list = _context
                .TodoLists
                .Include(l => l.Items)
                .AsNoTracking()
                .SingleOrDefault(l => l.Id == id);
            if (list == null)
            {
                return NotFound();
            }
            return list;
        }

        [HttpPost("{id}")]
        public ActionResult<TodoList> Post([FromBody] TodoList list)
        {
            var listInDb = _context
                .TodoLists
                .Include(l => l.Items)
                .SingleOrDefault(l => l.Id == list.Id);
            if (listInDb == null)
            {
                _context.Add(list);
                _context.SaveChanges();
                return Ok(list);
            }

            using var transaction = _context.Database.BeginTransaction();

            _context.RemoveRange(listInDb.Items);
            _context.SaveChanges();

            _context.Entry(listInDb).CurrentValues.SetValues(list);
            foreach (var incomingItem in list.Items)
            {
                listInDb.Items.Add(incomingItem);
            }

            _context.SaveChanges();
            transaction.Commit();

            return Ok(listInDb);
        }

        [HttpGet]
        public IEnumerable<TodoList> Get()
        {
            return _context
                .TodoLists
                .Include(l => l.Items)
                .ToList();
        }
    }
}
