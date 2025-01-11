import { Component } from "@angular/core";
import { FileListComponent } from "../file-list/file-list.component";

@Component({
  selector: "app-group-files",
  standalone: true,
  imports: [FileListComponent],
  templateUrl: "group-files.component.html",
  styles: ``,
})
export class GroupFilesComponent {}
