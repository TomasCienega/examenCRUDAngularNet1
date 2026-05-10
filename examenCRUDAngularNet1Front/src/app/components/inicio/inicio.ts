import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado, Departamento } from '../../interfaces/res-api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalEditar } from '../modal-editar/modal-editar';
import { ToastrService } from 'ngx-toastr'; // Importación correcta
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalEditar],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private empleadoServicio = inject(EmpleadoService);
  private toastr = inject(ToastrService); // <--- 1. Inyectamos el servicio

  public listaEmpleados: Empleado[] = [];
  public listaDepartamentos: Departamento[] = [];

  public requestNombre: string = "";
  public requestIdDepartamento: number = 0;
  public idEmpleadoEditar: number = 0;
  public idDepartamentoFiltro: number = 0;

  private cdr = inject(ChangeDetectorRef);
  public empleadoParaEditar: any = {
    idEmpleado: 0,
    nombreEmpleado: '',
    idDepartamento: 0
  };
  public empleadoSeleccionado: any;
  
  ngOnInit(): void {
    this.cargarDepartamentos();
    this.cargarEmpleados();
  }

  cargarDepartamentos() {
    this.empleadoServicio.listaDepartamentos().subscribe({
      next: (data) => { this.listaDepartamentos = data; },
      error: (err) => { console.log("Error deptos:", err); }
    });
  }

  cargarEmpleados() {
    this.empleadoServicio.lista(0).subscribe({
      next: (data) => {
        this.listaEmpleados = data;
        this.cdr.detectChanges();
      },
      error: (err) => { console.log("Error empleados:", err); }
    });
  }

  cambiarEstado(emp: Empleado) {
    this.empleadoServicio.cambiarEstado(emp.idEmpleado).subscribe({
      next: () => {
        // 2. Usamos this.toastr
        this.toastr.info('Estado actualizado', 'Sistema');
        this.cargarEmpleados();
      },
      error: (err) => { console.log("Error al cambiar estado:", err); }
    });
  }

  guardarEmpleado() {
    if (this.requestNombre === "" || this.requestIdDepartamento === 0) {
      this.toastr.warning('Llena todos los campos', 'Atención');
      return;
    }

    const modeloNuevo = {
      nombreEmpleado: this.requestNombre,
      idDepartamento: this.requestIdDepartamento
    };

    this.empleadoServicio.guardar(modeloNuevo).subscribe({
      next: () => {
        this.toastr.success('¡Empleado guardado!', 'Éxito');
        this.requestNombre = "";
        this.requestIdDepartamento = 0;
        this.cargarEmpleados();
      },
      error: (err) => { this.toastr.error('Error al guardar', 'Error'); }
    });
  }

  filtrar(event: any) {
    const idDep = Number(event.target.value);
    this.idDepartamentoFiltro = idDep;

    this.empleadoServicio.lista(idDep).subscribe({
      next: (data) => {
        this.listaEmpleados = data;
        this.cdr.detectChanges();
      },
      error: (err) => { console.log("Error al filtrar:", err); }
    });
  }

eliminarEmpleado(emp: Empleado) {
  Swal.fire({
    title: '¿Eliminar empleado?',
    text: `¿Estás seguro de que quieres borrar a ${emp.nombreEmpleado}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    // Esto evita conflictos con el backdrop de Bootstrap
    backdrop: true,
    heightAuto: false 
  }).then((result) => {
    if (result.isConfirmed) {
      this.empleadoServicio.eliminar(emp.idEmpleado).subscribe({
        next: () => {
          this.toastr.error('Empleado eliminado', 'Borrado');
          this.cargarEmpleados();
        },
        error: (err) => {
          this.toastr.error('No se pudo eliminar el registro', 'Error');
        }
      });
    }
  });
}

  editarEmpleado(emp: Empleado) {
    this.empleadoParaEditar = { ...emp };
    const modalElement = document.getElementById('modalEditar');
    if (modalElement) {
      const myModal = new (window as any).bootstrap.Modal(modalElement);
      myModal.show();
    }
  }

  limpiarFiltro() {
    this.idDepartamentoFiltro = 0;
    this.cargarEmpleados();
    this.cdr.detectChanges();
    this.toastr.info('Filtros limpios', 'Información');
  }

  confirmarEdicion() {
    this.empleadoServicio.editar(this.empleadoParaEditar).subscribe({
      next: () => {
        this.toastr.success('Información actualizada', 'Actualizado');
        
        const modalElement = document.getElementById('modalEditar');
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        this.cargarEmpleados();
      },
      error: (err) => { this.toastr.error('Error al actualizar'); }
    });
  }
}