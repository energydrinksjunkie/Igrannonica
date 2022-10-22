using System.ComponentModel.DataAnnotations;

namespace WebAPI_Project
{
    public class User
    {
        public int Id { get; set; }

        [StringLength(20)]
        public string Name { get; set; } = String.Empty;
    }
}
