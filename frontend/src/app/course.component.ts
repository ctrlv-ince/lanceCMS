import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { switchMap, tap, catchError, of } from "rxjs";
import {
  Title,
  DomSanitizer,
  SafeResourceUrl,
} from "@angular/platform-browser";
import { ApiService, Course } from "./api.service";
import { findTopic } from "./topics/topic-data";
@Component({
  selector: "app-course",
  standalone: true,
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="back-link">← Back to course library</a>
    @if (loading()) {
      <div class="notice" role="status">Loading course…</div>
    } @else if (course(); as c) {
      <header class="reader-header">
        <div class="eyebrow">{{ c.category }} / {{ c.level }}</div>
        <h1>{{ c.title }}</h1>
        @if (!previewUrl()) {
          <p>{{ c.description }}</p>
        }
      </header>
      @if (summary(c.slug)) {
        <a class="secondary-button mt-5" [routerLink]="['/topics', c.slug, 'summary']">View Interactive Summary →</a>
      }
      @if (previewUrl(); as preview) {
        <section class="topic-presentation" aria-label="Topic presentation">
          <div class="presentation-toolbar">
            <div>
              <span class="eyebrow">POWERPOINT PRESENTATION</span>
              <h2>{{ c.presentation_title || c.title }}</h2>
            </div>
            <a
              class="secondary-button"
              [href]="driveUrl()"
              target="_blank"
              rel="noopener noreferrer"
              >Open in Google Drive ↗</a
            >
          </div>
          <div class="topic-viewer">
            <iframe
              [src]="preview"
              [title]="(c.presentation_title || c.title) + ' — slide viewer'"
              allow="fullscreen"
              allowfullscreen
            ></iframe>
          </div>
          <div class="presentation-help">
            <p>
              Use the viewer controls to navigate the slides or enter full
              screen.
            </p>
            <a [href]="driveUrl()" target="_blank" rel="noopener noreferrer"
              >Preview not loading? Open in Drive ↗</a
            >
          </div>
        </section>
      } @else {
        @if (c.presentation_drive_id) {
          <div class="notice" role="alert">
            The presentation link needs updating. Check the Google Drive file ID
            in Directus.
          </div>
        }
        <div class="reader-grid">
          <article class="reading-panel">
            <div class="reading-label">
              <span class="connection-dot online"></span>COURSE NOTES
            </div>
            <h2>Explore the fundamentals</h2>
            <div class="reading-body">
              {{
                c.body ||
                  "Course content will appear here when your instructor adds it in Directus."
              }}
            </div>
          </article>
          <aside class="objectives-panel">
            <span class="objective-symbol">◎</span>
            <h2>What you'll learn</h2>
            <ul>
              @for (objective of c.objectives || []; track $index) {
                <li><span>✓</span>{{ objective.text }}</li>
              }
            </ul>
            <div class="reader-tip">
              <strong>Make it your own.</strong>
              <p>Keep notes, sketch a diagram, and test each idea as you go.</p>
            </div>
            <a routerLink="/" class="secondary-button">Browse all courses ↗</a>
          </aside>
        </div>
      }
    } @else {
      <div class="notice" role="alert">
        <h1>Course unavailable</h1>
        <p>
          It may be unpublished, or the learning service is temporarily
          unavailable.
        </p>
        <a class="primary-button" routerLink="/">Back to library</a>
      </div>
    }
  `,
})
export class CourseComponent {
  summary = findTopic;
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private sanitizer = inject(DomSanitizer);
  course = signal<Course | null>(null);
  loading = signal(true);
  previewUrl = signal<SafeResourceUrl | null>(null);
  driveUrl = signal("");
  constructor() {
    this.route.paramMap
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.course.set(null);
          this.previewUrl.set(null);
          this.driveUrl.set("");
        }),
        switchMap((p) =>
          this.api.course(p.get("slug") || "").pipe(catchError(() => of(null))),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((c) => {
        this.course.set(c);
        this.loading.set(false);
        const fileId = c?.presentation_drive_id;
        if (fileId && /^[A-Za-z0-9_-]{10,200}$/.test(fileId)) {
          // Only trust a fixed Google Drive origin with a validated file ID, never a CMS-supplied URL.
          const base =
            "https://drive.google.com/file/d/" + encodeURIComponent(fileId);
          this.previewUrl.set(
            this.sanitizer.bypassSecurityTrustResourceUrl(base + "/preview"),
          );
          this.driveUrl.set(base + "/view");
        }
        this.title.setTitle(
          c
            ? c.title + " · Directus Learn"
            : "Course unavailable · Directus Learn",
        );
      });
  }
}
