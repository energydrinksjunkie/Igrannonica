using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace backend
{
    public class DatasetUpdateDto
    {
        public bool? Public { get; set; } = null;

        [Required]
        public int UserID { get; set; } = 0;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        public string DatasetSource { get; set; }

        public string? Delimiter { get; set; } = null;

        public string? LineTerminator { get; set; } = null;

        public string? Quotechar { get; set; } = null;

        public string? Escapechar { get; set; } = null;

        public string? Encoding { get; set; } = null;
    }
}
