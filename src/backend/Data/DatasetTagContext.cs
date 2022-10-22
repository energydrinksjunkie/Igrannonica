using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class DatasetTagContext : DbContext
    {
        /*

        public DatasetTagContext(DbContextOptions<DatasetTagContext> options) : base(options)
        {

        }

        public DbSet<Dataset> Datasets { get; set; }
        public DbSet<DatasetTag> Tags { get; set; }
        public DbSet<DatasetDatasetTag> DatasetDatasetTags{get;set;}
       
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DatasetDatasetTag>().HasKey(sc => new { sc.DatasetId, sc.DatasetTagId });

            modelBuilder.Entity<DatasetDatasetTag>()
            .HasOne<Dataset>(sc => sc.Dataset)
            .WithMany(s => s.DatasetDatasetTags)
            .HasForeignKey(sc => sc.DatasetId);

            modelBuilder.Entity<DatasetDatasetTag>()
            .HasOne<DatasetTag>(sc => sc.DatasetTag)
            .WithMany(s => s.DatasetDatasetTags)
            .HasForeignKey(sc => sc.DatasetTagId);

            base.OnModelCreating(modelBuilder);

        }*/
    }
}
