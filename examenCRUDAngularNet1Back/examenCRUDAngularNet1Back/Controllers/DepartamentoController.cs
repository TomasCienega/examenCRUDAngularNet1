using examenCRUDAngularNet1Back.Context;
using examenCRUDAngularNet1Back.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace examenCRUDAngularNet1Back.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DepartamentoController : ControllerBase
    {
        private readonly AngularNetCrudContext _context;

        public DepartamentoController(AngularNetCrudContext context)
        {
            _context = context;
        }
        [AllowAnonymous] // <--- Este método sí se puede ver sin estar logueado
        [HttpGet]
        [Route("ListarDepartamentos")]
        public async Task<ActionResult<List<DepartamentoDTO>>> ListarDeps()
        {
            try
            {
                var _listaBD = await _context.Departamentos.ToListAsync();

                var _listaDTO = _listaBD.Select(dep => new DepartamentoDTO
                {
                    IdDepartamento = dep.IdDepartamento,
                    NombreDepartamento = dep.NombreDepartamento ?? string.Empty,
                }).ToList();
                return Ok(_listaDTO);
            }
            catch (Exception ex) { 
                return BadRequest(ex.Message);
            }
        }
    }
}
