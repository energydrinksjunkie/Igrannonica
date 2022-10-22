using Microsoft.EntityFrameworkCore;

namespace WebAPI_Project.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<ToDoList> ToDoLists { get; set; }

        public DbSet<User> Users { get; set; }
    }
}
