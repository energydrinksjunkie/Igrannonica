using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;



namespace backend.Data
{
    public class DatasetContext: DbContext
    {
        public DatasetContext(DbContextOptions<DatasetContext> options) : base(options)
        { }
        public DbSet<Dataset> Datasets { get; set; }
    }
}
