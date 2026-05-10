using System;
using System.Collections.Generic;

namespace examenCRUDAngularNet1Back.Models;

public partial class Usuario
{
    public int IdUsuario { get; set; }

    public string? Nombre { get; set; }

    public string Correo { get; set; } = null!;

    public string Clave { get; set; } = null!;
}
