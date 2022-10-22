using System.ComponentModel.DataAnnotations;

namespace ProjekatMini
{
    public class Status
    {
        public int Id { get; set; }
        [StringLength(20)]
        public string StatusOpstion { get; set; } = string.Empty;

    }
}
