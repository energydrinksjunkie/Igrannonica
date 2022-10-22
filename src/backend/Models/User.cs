using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    { 
        [Key]
        public int Id {  get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password {  get; set; }
        public string RefreshToken { get; set; }  = string.Empty;
        public DateTime RefreshTokenExpires { get; set; }
        public bool VerifiedEmail { get; set; }
        public string Role { get; set; } = "Unverified user";
    }
}
