using System.ComponentModel.DataAnnotations;

namespace ProjekatMini
{
    public class InspectionType
    {
        public int id { get; set; }
        [StringLength(20)]
        public string InspectionName { get; set; } = string.Empty;

    }
}
