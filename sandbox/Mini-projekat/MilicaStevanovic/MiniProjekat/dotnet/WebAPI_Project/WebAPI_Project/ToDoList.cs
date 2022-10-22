using System.ComponentModel.DataAnnotations;

namespace WebAPI_Project
{
    public class ToDoList
    {
        public int Id { get; set; }

        [StringLength(200)]
        public string Comment { get; set; } = String.Empty;

        public int userId { get; set; }

        public User? user { get; set; }

    }
}
