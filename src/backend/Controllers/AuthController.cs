using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Http.Extensions;
using System.Security.Cryptography;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Newtonsoft.Json;

namespace backend.Controllers
{

    
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly UserContext userContext;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContext;
        //private const int _expirationMinutes = 5;

        public AuthController(UserContext userContext, IConfiguration configuration, IHttpContextAccessor httpContext)
        {
            this.userContext = userContext;
            _configuration = configuration;
            _httpContext = httpContext;
        }

        Services.EmailSender emailSender = new Services.EmailSender();

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(User user)
        {
            //proveravanje maila

            var response = new ResponseBase();

            if (!IsValidEmail(user.Email))
            {
               response.AddError("bad request", "email_notValid");
            }

            User userDB = this.userContext.Users.FirstOrDefault(x => x.Username == user.Username);
            if (userDB != null)
            {
                response.AddError("bad request", "username_AlreadyExists");
            }

            userDB = this.userContext.Users.FirstOrDefault(x => x.Email == user.Email);
            if (userDB != null)
            {
                response.AddError("bad request", "email_AlreadyExists");
            }
            
            if(response.data.errors.Count>0)
            {
                return BadRequest(response);
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.VerifiedEmail = false;
            user.Role = "Unverified user";
            
            this.userContext.Users.Add(user);

            await this.userContext.SaveChangesAsync();

            //slanje verifikacionog mejla

            await sendVerificationEmail(user.Email);

            return Ok(new
            {
                success = true
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(userDto request)
        {
            //proveravanje da li postoji username
            User user = this.userContext.Users.FirstOrDefault(user => user.Username == request.UsernameOrEmail || user.Email == request.UsernameOrEmail);
            if (user == null)
            {
                return BadRequest(new ResponseBase().AddError("bad request", "user_notFound"));
            }
            else
            {
                if (BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                {
                    if (user.VerifiedEmail == false)
                    {
                        return BadRequest(new ResponseBase().AddError("bad request", "email_notVerified"));
                    }
                    else
                    {
                        List<Claim> claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name, user.Username),
                            new Claim(ClaimTypes.Email, user.Email),
                            new Claim(ClaimTypes.SerialNumber, user.Id.ToString()),
                            new Claim(ClaimTypes.Role, user.Role),
                            new Claim("message","Logging in...")
                        };

                        var refreshToken = GenerateRefreshToken();
                        JwtSecurityToken token = CreateToken(claims);
                        user.RefreshToken = refreshToken;
                        _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInDays"], out int refreshTokenValidityInDays);
                        user.RefreshTokenExpires = DateTime.Now.AddDays(refreshTokenValidityInDays);

                        userContext.Entry(user).State = EntityState.Modified;
                        await userContext.SaveChangesAsync();

                        return Ok(new
                        {
                            success = true,
                            data = new
                            {
                                token = new JwtSecurityTokenHandler().WriteToken(token),
                                refreshToken = refreshToken
                            }
                        });
                    }
                }
                else
                {
                    return BadRequest(new ResponseBase().AddError("bad request", "incorrect_password"));
                }
            }
        }


        [HttpGet("verifyEmail")]
        public async Task<ActionResult<string>> verifyEmail(string email, string token)
        {
            Console.WriteLine($"email={email}, token={token}");
            User user = this.userContext.Users.FirstOrDefault(user => user.Email == email);
            if(user == null)
            {
                return BadRequest(new ResponseBase().AddError("bad request", "user_notFound"));
            }
            else
            {
                if (ValidateCurrentToken(token))
                {
                    // TODO
                    if(true || user.Email == GetClaim(token, ClaimTypes.Email))
                    {
                        user.VerifiedEmail = true;
                        user.Role = "User";
                        this.userContext.Update(user);
                        await this.userContext.SaveChangesAsync();

                        return Ok(new
                        {
                            success = true,
                            data = ""
                        });
                    }
                    else
                    {
                        return BadRequest(new ResponseBase().AddError("bad request", "token_emailMismatch"));
                    }
                }
                else
                {
                    return BadRequest(new ResponseBase().AddError("bad request", "token_notValid"));
                }
            }    
        }

        [HttpPost("sendVerificationEmail")]
        public async Task<ActionResult<string>> sendVerificationEmail(string email)
        {
            User user = this.userContext.Users.FirstOrDefault(x => x.Email == email);
            if (user == null)
            {
                return BadRequest(new ResponseBase().AddError("bad request", "email_notExists"));
            }
            else
            {
                /*List<Claim> claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim("message", "Verify email address")
                };*/

                //JwtSecurityToken token = CreateToken(claims);

                string message = @"Hello, <b>" + user.Username 
                                + @"</b>.<br> Please confirm your email 
                                    <a href='"
                                +
                                _configuration["Addresses:Frontend"]
                                +
                                    "/verifyEmail?email="
                                + user.Email
                                + "&token=" + GenerateMyToken(user.Email)
                                /*Convert.ToBase64String(
                                    Encoding.UTF8.GetBytes(
                                        new JwtSecurityTokenHandler().WriteToken(token)))*/
                                + @"'>here</a>.<br>
                                    <b>This link will be valid for 5 minutes!</b><br><br>"
                                +"If you did not create this account please click "

                                //izmeniti link kad se implementuje strana na frontu

                                + "<a href='"+ _configuration["Addresses:Frontend"] + "/cancelRegistration?email="
                                 + user.Email
                                + "&token=" + GenerateEmailToken(user.Email)
                                +"'>here</a>.";

                await emailSender.SendEmailAsync(user.Email, "Confirm Account", message);

                return Ok(new
                {
                    success = true,
                });
            }
        }

        private string GenerateEmailToken(string email)
        {
            var mySecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AppSettings:Token"]));
            var myIssuer = _configuration["JWT:ValidIssuer"];
            var myAudience = _configuration["JWT:ValidAudience"];
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email, email),
                }),
                Issuer = myIssuer,
                Audience = myAudience,
                SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpGet("cancelRegistration")]
        public async Task<ActionResult> deleteFakeUser(string email, string token)
        {
            User user = this.userContext.Users.FirstOrDefault(user => user.Email == email);
            if (user == null)
            {
                return BadRequest(new ResponseBase().AddError("bad request", "user_notFound"));
            }
            else
            {
                if (ValidateCurrentToken(token))
                {
                    // TODO
                    if (true || user.Email == GetClaim(token, ClaimTypes.Email))
                    {
                        this.userContext.Remove(user);
                        await this.userContext.SaveChangesAsync();
                        return Ok(new
                        {
                            success = true,
                            data = ""
                        });
                    }
                    else
                    {
                        return BadRequest(new ResponseBase().AddError("bad request", "token_emailMismatch"));
                    }

                }
                else
                {
                    return BadRequest(new ResponseBase().AddError("bad request", "token_notValid"));
                }
            }
        }
        
        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken(TokenModel tokenModel)
        {
            if (tokenModel is null)
            {
                return BadRequest("Invalid client request");
            }

            string? accessToken = tokenModel.AccessToken;
            string? refreshToken = tokenModel.RefreshToken;

            var principal = GetPrincipalFromExpiredToken(accessToken);

            if (principal == null)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            string username = principal.Identity.Name;
            

            var user = this.userContext.Users.FirstOrDefault(x=>x.Username==username);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpires <= DateTime.Now)
            {
                return BadRequest("Invalid access token or refresh token");
            }

            var newAccessToken = CreateToken(principal.Claims.ToList());
            var newRefreshToken = GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;

            userContext.Entry(user).State = EntityState.Modified;
            await userContext.SaveChangesAsync();

            return new ObjectResult(new
            {
                accessToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
                refreshToken = newRefreshToken
            });
        }


        private JwtSecurityToken CreateToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AppSettings:Token"]));
            _ = int.TryParse(_configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }

        private string GenerateMyToken(string email)
        {

            _ = int.TryParse(_configuration["JWT:TokenValidityInMinutes"], out int tokenValidityInMinutes);

            var mySecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AppSettings:Token"]));
            var myIssuer = _configuration["JWT:ValidIssuer"];
            var myAudience = _configuration["JWT:ValidAudience"];
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email, email),
                }),
                Expires = DateTime.Now.AddMinutes(tokenValidityInMinutes),
                Issuer = myIssuer,
                Audience = myAudience,
                SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GetClaim(string token, string claimType)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;
            var stringClaimValue = securityToken.Claims.First(claim => claim.Type == claimType).Value;
            Console.WriteLine(securityToken);

            return stringClaimValue;
        }

        private bool ValidateCurrentToken(string token)
        {
            var mySecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AppSettings:Token"]));
            var myIssuer = _configuration["JWT:ValidIssuer"];
            var myAudience = _configuration["JWT:ValidAudience"];
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = myIssuer,
                    ValidAudience = myAudience,
                    IssuerSigningKey = mySecurityKey
                }, out SecurityToken validatedToken);
            }
            catch
            {
                return false;
            }
            return true;
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"])),
                ValidateLifetime = false
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;

        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private bool IsValidEmail(string email)
        {
            var trimmedEmail = email.Trim();

            if (trimmedEmail.EndsWith("."))
            {
                return false;
            }
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == trimmedEmail;
            }
            catch
            {
                return false;
            }
        }
    }
}