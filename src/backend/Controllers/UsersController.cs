using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{   
  
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext userContext;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContext;

        public UsersController(UserContext userContext, IConfiguration configuration, IHttpContextAccessor httpContext)
        {
            this.userContext = userContext;
            _configuration = configuration;
            _httpContext = httpContext;

        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Object>> getUserByID(int id)
        {
            var user = await userContext.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var p = new
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                image = "assets\\resources\\" + user.Username + ".png" /* = File(b, "image/png")*/
            };
            return p;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<List<User>>> getUsers()
        {
            return Ok(await this.userContext.Users.ToListAsync());
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> deleteUser(int id)
        {
            User u = await this.userContext.Users.FindAsync(id);
            if (u != null)
            {
                this.userContext.Users.Remove(u);
                this.userContext.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
        
        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("email/{email}")]
        public async Task<ActionResult> deleteUserEmail(string email)
        {
            User u = await this.userContext.Users.FirstOrDefaultAsync(x=>x.Email==email);
            if (u != null)
            {
                this.userContext.Users.Remove(u);
                this.userContext.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
