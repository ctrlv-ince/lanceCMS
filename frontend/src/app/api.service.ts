import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
export interface Course {
  id: number;
  slug: string;
  title: string;
  category: string;
  level: string;
  description: string;
  body: string;
  objectives: { text: string }[] | null;
  sort: number;
  presentation_title: string | null;
  presentation_drive_id: string | null;
  thumbnail_url?: string | null;
  thumbnail_alt?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
}
export interface Health {
  status: string;
  backend: string;
  database: string;
  databaseName: string;
  databaseVersion: string;
  directus: string;
}
@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);
  courses() {
    return this.http.get<Course[]>("/api/courses");
  }
  course(slug: string) {
    return this.http.get<Course>("/api/courses/" + encodeURIComponent(slug));
  }
  health() {
    return this.http.get<Health>("/api/health");
  }
}

