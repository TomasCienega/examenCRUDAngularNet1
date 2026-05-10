namespace examenCRUDAngularNet1Back.DTOs
{
    public class EmpleadoDTO
    {
        public int IdEmpleado { get; set; }

        public string NombreEmpleado { get; set; } = string.Empty;

        public int? IdDepartamento { get; set; }

        public string NombreDepartamento { get; set; } = string.Empty;

        public bool Activo { get; set; }
    }
}
