import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { noAuthGuard } from "./guards/no-auth.guard";
import { FilePageComponent } from "./components/file-page/file-page.component";
import { LoginComponent } from "./components/login/login.component";
import { GroupPageComponent } from "./components/group-page/group-page.component";
import { GroupFilesComponent } from "./components/group-files/group-files.component";

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
  {
    path: "groups/:id",
    component: GroupFilesComponent,
    canActivate: [authGuard],
  },
  { path: "**", redirectTo: "/login" },
];
