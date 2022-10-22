using Microsoft.EntityFrameworkCore;

namespace project.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DataContext() : base()
        {
        }

        public DbSet<Employee> Employees { get; set; }
    }
}
