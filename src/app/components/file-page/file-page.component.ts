import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FileListComponent } from "../file-list/file-list.component";

@Component({
  selector: "app-file-page",
  standalone: true,
  imports: [CommonModule, FileListComponent],
  templateUrl: "file-page.component.html",
  styles: ``,
})
export class FilePageComponent {}
