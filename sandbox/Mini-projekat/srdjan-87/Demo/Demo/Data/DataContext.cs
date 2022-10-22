using Microsoft.EntityFrameworkCore;

namespace Demo.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Task> Tasks { get; set; }
        public DbSet<Status> Statuses { get; set; }
    }
}
