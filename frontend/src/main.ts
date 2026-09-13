import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { AppComponent } from "./app/app.component";
import { LibraryComponent } from "./app/library.component";
import { CourseComponent } from "./app/course.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([
      {
        path: "",
        component: LibraryComponent,
        title: "Course library · Directus Learn",
      },
      { path: "courses/:slug", component: CourseComponent },
      { path: "**", redirectTo: "" },
    ]),
  ],
}).catch((error) =>
  console.error("Unable to start the learning platform", error),
);
