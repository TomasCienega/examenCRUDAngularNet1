using examenCRUDAngularNet1Back.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Obtener la clave desde appsettings.json
var secretKey = builder.Configuration.GetValue<string>("Jwt:Key");
var keyBytes = Encoding.ASCII.GetBytes(secretKey!);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AngularNetCrudContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("CadenaSQL"))
);

builder.Services.AddCors(options=>
{
    options.AddPolicy("PoliticaAngular", app =>
    {
        //withorigin
        app.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
// 2. Configurar el servicio de Autenticación
builder.Services.AddAuthentication(config => {
    config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(config => {
    config.RequireHttpsMetadata = false;
    config.SaveToken = true;
    config.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = false, // Puedes ponerlo en true si quieres validar el Issuer
        ValidateAudience = false
    };
});
var app = builder.Build();
app.UseCors("PoliticaAngular");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
