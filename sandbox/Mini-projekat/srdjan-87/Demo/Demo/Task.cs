using System.ComponentModel.DataAnnotations;

namespace Demo
{
    public class Task
    {
        public int Id { get; set; }
        public DateTime CreationDate { get; set; }
        [StringLength(45)]
        public string Title { get; set; } = String.Empty;
        [StringLength(120)]
        public string Description { get; set; } = String.Empty;
        public int CurrentStatusId { get; set; }
        public Status? CurrentStatus { get; set; }
    }
}
