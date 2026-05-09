-- DESKTOP-JJ9DM3F\SQLEXPRESS
create database examenCRUDAngularNet1
use examenCRUDAngularNet1
create table Departamento
(
	idDepartamento int identity(1,1) not null,
	nombreDepartamento varchar(100),
	constraint PK_Departamento primary key (idDepartamento)
)
insert into Departamento(nombreDepartamento)
values
('TI'),('Desarrollo de Software'),('Ventas'),
('Contabilidad'),('Recursos Humanos'),('Logística y Almacén'),
('Compras'),('Marketing'),('Operaciones'),('Atención al Client')

create table Empleado
(
	idEmpleado int identity(1,1) not null,
	nombreEmpleado varchar(100) not null,
	idDepartamento int,
	activo bit default 1,
	constraint PK_Empleado primary key (idEmpleado),
	constraint FK_DepartamentoEmpleado foreign key (idDepartamento)
										references Departamento(idDepartamento)
)
insert into Empleado(nombreEmpleado, idDepartamento)
values
('Sofía', 4),('Mateo', 9),('Valeria', 2),('Diego', 7),('Ximena', 1),
('Santiago', 10),('Camila', 5),('Leonardo', 3),('Andrea', 8),('Sebastián', 6)


select * from Empleado
select * from Departamento

create procedure sp_ListarEmpleadosPorIdDepartamento
(
	@idDepartamento int
)
as
begin 
	select e.idEmpleado,e.nombreEmpleado,e.activo,d.idDepartamento,d.nombreDepartamento 
	from Empleado e 
	inner join Departamento d
	on e.idDepartamento = d.idDepartamento
	where d.idDepartamento = @idDepartamento
	order by activo desc
end

create procedure sp_EstadoEmpleado
(
	@idEmpleado int
)
as
begin 
	update Empleado
	set activo = case when activo = 1 then 0 else 1 end
	where idEmpleado = @idEmpleado
end
