import { Component, inject, signal, viewChild, ElementRef, DestroyRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, Health } from './api.service';
import { IconComponent } from './icon.component';
@Component({
  selector: 'app-root', standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive, NgTemplateOutlet, IconComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private api = inject(ApiService);
  health = signal<Health | null>(null);
  collapsed = signal(matchMedia('(max-width: 1279px)').matches);
  drawer = viewChild<ElementRef<HTMLDialogElement>>('drawer');
  private previousOverflow = '';
  private drawerIsOpen = false;
  openDrawer() {
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    this.drawerIsOpen = true;
    this.drawer()?.nativeElement.showModal();
  }
  closeDrawer() { this.drawer()?.nativeElement.close(); this.restoreScroll(); }
  restoreScroll() {
    if (this.drawerIsOpen) document.body.style.overflow = this.previousOverflow;
    this.drawerIsOpen = false;
  }
  constructor() {
    const desktop = matchMedia('(min-width: 768px)');
    const resize = () => { if (desktop.matches) this.closeDrawer(); };
    desktop.addEventListener('change', resize);
    inject(DestroyRef).onDestroy(() => { desktop.removeEventListener('change', resize); this.restoreScroll(); });
    this.api.health().pipe(takeUntilDestroyed()).subscribe({
      next: h => this.health.set(h),
      error: () => this.health.set({ status: 'offline', backend: 'Feathers Core', database: 'PostgreSQL', databaseName: '', databaseVersion: '', directus: 'unavailable' }),
    });
  }
}
