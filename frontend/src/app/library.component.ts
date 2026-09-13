import { Component, computed, inject, signal, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService, Course } from './api.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-library', standalone: true,
  imports: [RouterLink, DatePipe, IconComponent],
  templateUrl: './library.component.html',
})
export class LibraryComponent {
  private api = inject(ApiService);
  private destroyRef = inject(DestroyRef);
  courses = signal<Course[]>([]);
  loading = signal(false);
  error = signal('');
  query = signal('');
  category = signal('');
  failedImages = signal<Set<number>>(new Set());
  categories = computed(() => [...new Set(this.courses().map(c => c.category).filter(Boolean))]);
  filtered = computed(() => this.courses().filter(c =>
    (!this.category() || c.category === this.category()) &&
    [c.title, c.description, c.category, c.presentation_title].join(' ').toLowerCase().includes(this.query().trim().toLowerCase())
  ));
  latestUpdate = computed(() => {
    const dates = this.courses().flatMap(c => [c.date_updated, c.date_created])
      .filter((d): d is string => !!d).map(d => Date.parse(d)).filter(Number.isFinite);
    return dates.length ? Math.max(...dates) : null;
  });
  constructor() { this.load(); }
  reset() { this.query.set(''); this.category.set(''); }
  explore(section: HTMLElement) {
    section.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    section.focus({ preventScroll: true });
  }
  imageFailed(id: number) { this.failedImages.update(ids => new Set([...ids, id])); }
  number(course: Course) { return String(this.courses().findIndex(c => c.id === course.id) + 1).padStart(2, '0'); }
  load() {
    if (this.loading()) return;
    this.loading.set(true); this.error.set('');
    this.api.courses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: courses => {
        this.courses.set(courses); this.failedImages.set(new Set()); this.loading.set(false);
        if (!this.categories().includes(this.category())) this.category.set('');
      },
      error: () => { this.error.set('The learning service is temporarily unavailable. Please try again.'); this.loading.set(false); },
    });
  }
}
