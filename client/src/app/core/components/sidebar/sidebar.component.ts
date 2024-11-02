import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  encapsulation: ViewEncapsulation.None, // Cambia a None para desactivar el encapsulamiento
})
export class SidebarComponent {}
