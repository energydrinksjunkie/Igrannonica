using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend
{
    public class userDto
    {
        [Required]
        public string  UsernameOrEmail { get; set;} = string.Empty;
        [Required]
        public string Password  { get; set; }= string.Empty;
    }
}