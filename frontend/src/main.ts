import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { AppComponent } from "./app/app.component";
import { LibraryComponent } from "./app/library.component";
import { CourseComponent } from "./app/course.component";
import { TopicSummaryPageComponent } from "./app/topics/topic-summary.component";
import { NewContentComponent } from "./app/topics/new-content.component";

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
      { path: "topics/:slug/summary", component: TopicSummaryPageComponent },
      { path: "summary/:slug", component: TopicSummaryPageComponent },
      { path: "topics/:slug", component: TopicSummaryPageComponent },
      { path: "new-content", component: NewContentComponent, title: "New Learning Content · Directus Learn" },
      { path: "**", redirectTo: "" },
    ]),
  ],
}).catch((error) =>
  console.error("Unable to start the learning platform", error),
);
