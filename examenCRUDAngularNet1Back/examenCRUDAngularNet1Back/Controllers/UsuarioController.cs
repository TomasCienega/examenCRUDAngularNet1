using examenCRUDAngularNet1Back.Context;
using examenCRUDAngularNet1Back.DTOs;
using examenCRUDAngularNet1Back.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace examenCRUDAngularNet1Back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly AngularNetCrudContext _context;
        private readonly string _secretKey;

        public UsuarioController(AngularNetCrudContext context, IConfiguration config)
        {
            _context = context;
            // Aquí le pides a esa configuración que te dé la Key
            _secretKey = config.GetSection("Jwt").GetValue<string>("Key")!;
        }

        [HttpPost]
        [Route("Login")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {
            // 1. Encriptamos la clave que escribió el usuario en Angular para poder compararla
            string claveHashed = ConvertirSHA256.Encriptar(request.Clave);

            // 2. Buscamos en la tabla Usuario
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == request.Correo && u.Clave == claveHashed);

            if (usuario == null)
                return Unauthorized(new { mensaje = "Correo o contraseña incorrectos" });

            // 3. Si existe, creamos el Token con tu nueva Key de 64 caracteres
            var keyBytes = Encoding.ASCII.GetBytes(_secretKey);
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, usuario.Correo));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddHours(8), // El pase de entrada dura 8 horas
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);

            // Convertimos el objeto token a un string para enviarlo
            string tokenString = tokenHandler.WriteToken(tokenConfig);

            return Ok(new { token = tokenString });
        }
    }
}
