import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Asegúrate de que diga esto si no lo tiene
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // ? Aquí no necesitamos código por ahora, 
  // ? solo que sirva de puente para las rutas.

}