import { Component } from "@angular/core";
import { FileListComponent } from "../file-list/file-list.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-group-files",
  standalone: true,
  imports: [FileListComponent],
  templateUrl: "group-files.component.html",
  styles: ``,
})
export class GroupFilesComponent {
  constructor(private route: ActivatedRoute) {}

  selectedGroupId: number | undefined = undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.selectedGroupId = +params.get("id")!;
    });
  }
}
