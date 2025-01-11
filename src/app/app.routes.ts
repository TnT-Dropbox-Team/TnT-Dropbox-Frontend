import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { FilePageComponent } from "./file-page/file-page.component";
import { GroupPageComponent } from "./group-page/group-page.component";
import { authGuard } from "./guards/auth.guard";
import { noAuthGuard } from "./guards/no-auth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/files",
    pathMatch: "full",
  },
  { path: "login", component: LoginComponent, canActivate: [noAuthGuard] },
  {
    path: "files",
    component: FilePageComponent,
    canActivate: [authGuard],
  },
  {
    path: "groups",
    component: GroupPageComponent,
    canActivate: [authGuard],
  },
  { path: "**", redirectTo: "/login" },
];
