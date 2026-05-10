import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // <--- 1. Importación lista

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService); // <--- 2. Inyectamos el servicio

  public formularioLogin: FormGroup = this.fb.group({
    Correo: ['', [Validators.required, Validators.email]],
    Clave: ['', [Validators.required]]
  });

  iniciarSesion() {
    // Si el formulario es inválido, avisamos de forma elegante
    if (this.formularioLogin.invalid) {
      this.toastr.warning('Por favor, ingresa un correo válido y tu contraseña', 'Datos incompletos');
      return;
    }

    const objetoLogin = this.formularioLogin.value;

    this.authService.login(objetoLogin).subscribe({
      next: (data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          
          // 3. Reemplazamos el alert feo por un Toast de éxito
          this.toastr.success('¡Bienvenido al sistema!', 'Acceso Concedido', {
            timeOut: 2000,
            progressBar: true
          });

          this.router.navigate(['/inicio']);
        } else {
          // Por si el API responde 200 pero sin token (caso raro)
          this.toastr.error('No se recibió una sesión válida', 'Error');
        }
      },
      error: (err) => {
        console.log("Error de conexión:", err);
        // 4. Toast de error para credenciales incorrectas o servidor caído
        this.toastr.error('Correo o contraseña incorrectos', 'Error de Autenticación');
      }
    });
  }
}