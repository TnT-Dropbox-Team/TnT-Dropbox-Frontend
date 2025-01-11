import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { FrameworkComponent } from "./app/framework/framework.component";

bootstrapApplication(FrameworkComponent, appConfig).catch((err) =>
  console.error(err)
);
