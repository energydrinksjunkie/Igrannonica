using System.ComponentModel.DataAnnotations;

namespace project
{
    public class Employee
    {
        public int id { get; set; }

        [StringLength(20)]
        public String firstName { get; set; }

        [StringLength(20)]
        public String lastName { get; set; }

        public Char gender { get; set; }

        public int yearsOfExperience { get; set; }
    
        public Employee(int id, String firstName, String lastName, Char gender, int yearsOfExperience)
        {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.gender = gender;
            this.yearsOfExperience = yearsOfExperience;
        }
    }
}
