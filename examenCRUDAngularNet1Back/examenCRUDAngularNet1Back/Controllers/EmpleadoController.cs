using examenCRUDAngularNet1Back.Context;
using examenCRUDAngularNet1Back.DTOs;
using examenCRUDAngularNet1Back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace examenCRUDAngularNet1Back.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly AngularNetCrudContext _context;

        public EmpleadoController(AngularNetCrudContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        [Route("ListaEmpleados")]
        public async Task<ActionResult<List<EmpleadoDTO>>> ListarEmps(int idDep)
        {
            try
            {
                List<Empleado> _listaEmpleadosBD;
                if (idDep == 0)
                {
                    _listaEmpleadosBD = await _context.Empleados
                        .Include(d => d.IdDepartamentoNavigation)
                        .OrderByDescending(a => a.Activo)
                        .ToListAsync();
                }
                else
                {
                    _listaEmpleadosBD = await _context.Empleados.FromSqlRaw("EXEC sp_ListarEmpleadosPorIdDepartamento {0}", idDep).ToListAsync();
                }
                    //await _context.Entry(emp).Reference(d=> d.IdDepartamentoNavigation).LoadAsync();

                var _listaEmpleadosDTO = _listaEmpleadosBD.Select(emp => new EmpleadoDTO
                {
                    IdEmpleado = emp.IdEmpleado,
                    NombreEmpleado = emp.NombreEmpleado,
                    IdDepartamento = emp.IdDepartamento,
                    NombreDepartamento = emp.IdDepartamentoNavigation?.NombreDepartamento ?? string.Empty,
                    Activo = emp.Activo,
                }).ToList();
                return Ok(_listaEmpleadosDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ObtenerEmpleado/{idEmp}")]
        public async Task<ActionResult<EmpleadoDTO>> Obtener(int idEmp)
        {
            try
            {
                //var _empleadoDTO = new EmpleadoDTO();
                var _empleadoBD = await _context.Empleados.Include(d=> d.IdDepartamentoNavigation).FirstOrDefaultAsync(e => e.IdEmpleado == idEmp);

                if (_empleadoBD == null) return NotFound("Empledo no encontrado");

                //_empleadoDTO.IdEmpleado = idEmp;
                //_empleadoDTO.NombreEmpleado = _empleadoBD?.NombreEmpleado ?? string.Empty;
                //_empleadoDTO.IdDepartamento = _empleadoBD?.IdDepartamento;
                //_empleadoDTO.NombreDepartamento = _empleadoBD?.IdDepartamentoNavigation?.NombreDepartamento ?? string.Empty;
                //_empleadoDTO.Activo = _empleadoBD?.Activo;
                var _empleadoDTO = new EmpleadoDTO
                {
                    IdEmpleado = idEmp,
                    NombreEmpleado = _empleadoBD.NombreEmpleado,
                    IdDepartamento = _empleadoBD.IdDepartamento,
                    NombreDepartamento = _empleadoBD?.IdDepartamentoNavigation?.NombreDepartamento ?? string.Empty,
                    Activo = _empleadoBD!.Activo
                };

                return Ok(_empleadoDTO);

            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GuardarEmleado")]
        public async Task<ActionResult<EmpleadoDTO>> GuardarEmp([FromBody] EmpleadoDTO empdto)
        {
            try
            {
                var _empleadoBD = new Empleado
                {
                    NombreEmpleado = empdto.NombreEmpleado,
                    IdDepartamento = empdto.IdDepartamento,
                };
                await _context.Empleados.AddAsync(_empleadoBD);
                await _context.SaveChangesAsync();
                return Ok(_empleadoBD);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPut]
        [Route("EditarEmpleado")]
        public async Task<ActionResult<EmpleadoDTO>> EditarEmp(EmpleadoDTO empdto)
        {
            try
            {
                //var _empleadoBD = await _context.Empleados.Where(e => e.IdEmpleado == empdto.IdEmpleado).FirstOrDefaultAsync();
                var _empleadoBD = await _context.Empleados.FindAsync(empdto.IdEmpleado);
                if (_empleadoBD == null)
                {
                    return BadRequest($"El usuario con id {empdto.IdEmpleado} no existe");
                }
                else
                {
                    _empleadoBD.NombreEmpleado = empdto.NombreEmpleado;
                    _empleadoBD.IdDepartamento = empdto.IdDepartamento;
                    await _context.SaveChangesAsync();
                    return Ok(_empleadoBD);
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("EliminarEmpleado/{idEmp}")]
        public async Task<ActionResult> EliminarEmp(int idEmp)
        {
            try
            {
                //var _empleadoBD = await _context.Empleados.Where(e => e.IdEmpleado == idEmp).FirstOrDefaultAsync();
                var _empleadoBD = await _context.Empleados.FindAsync(idEmp);
                if (_empleadoBD == null)
                {
                    return BadRequest("El usuario no existe");
                }
                else
                {
                    _context.Empleados.Remove(_empleadoBD);
                    await _context.SaveChangesAsync();
                    return Ok(_empleadoBD);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("EstadoEmpleado")]
        public async Task<ActionResult> EstadoEmp(int idEmp)
        {
            try
            {
                var _estadoEmp = await _context.Database.ExecuteSqlRawAsync("exec sp_EstadoEmpleado {0}", idEmp);
                return Ok(_estadoEmp);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
