import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Empleado, Departamento } from '../../interfaces/res-api';

@Component({
  selector: 'app-modal-editar',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-editar.html',
  styleUrl: './modal-editar.css',
  standalone: true,
})
export class ModalEditar {

// Estos son los "puertos" de entrada
  @Input() empleadoParaEditar: any; 
  @Input() listaDepartamentos: Departamento[] = [];

  // Este es el "puerto" de salida
  @Output() onGuardar = new EventEmitter<any>();

  confirmarEdicion() {
    // Cuando el usuario da clic, mandamos el objeto de vuelta al padre
    this.onGuardar.emit(this.empleadoParaEditar);
  }
}
