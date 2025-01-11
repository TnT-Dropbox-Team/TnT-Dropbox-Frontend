import { Component, Input } from "@angular/core";
import { FileData } from "../../classes/file-data";
import { FileService } from "../../services/file.service";
import { AuthenticationService } from "../../services/authentication.service";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { CommonModule } from "@angular/common";
import { FileCardComponent } from "../file-card/file-card.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-file-list",
  standalone: true,
  imports: [CommonModule, FileCardComponent, FormsModule],
  templateUrl: "file-list.component.html",
  styles: ``,
})
export class FileListComponent {
  @Input() groupId?: number;
  files: FileData[] = [];
  loading: boolean = true;
  error: string = "";
  downloadError: string = "";
  searchQuery: string = "";
  sortOrder: string = "desc";
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;

  constructor(
    private fileService: FileService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.fetchFiles();
  }

  fetchFiles(): void {
    if (this.groupId) {
      this.fileService
        .getGroupFiles(
          this.groupId,
          this.searchQuery,
          this.currentPage,
          this.pageSize,
          [this.sortOrder === "desc" ? "createdAt,desc" : "createdAt,asc"]
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.loading = false;
            this.error = error.toString();
            return throwError(() => error);
          })
        )
        .subscribe((data) => {
          if (data.content.length === 0) this.error = "No files!";
          this.files = data.content;
          this.totalPages = data.totalPages;
          this.loading = false;
        });
    } else {
      this.error = "";
      this.downloadError = "";
      const userId = this.authenticationService.getCurrentUser()?.userId ?? 0;
      this.fileService
        .getUserFiles(
          userId,
          this.searchQuery,
          this.currentPage,
          this.pageSize,
          [this.sortOrder === "desc" ? "createdAt,desc" : "createdAt,asc"]
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.loading = false;
            this.error = error.toString();
            return throwError(() => error);
          })
        )
        .subscribe((data) => {
          if (data.content.length == 0) this.error = "No files!";
          this.files = data.content;
          this.totalPages = data.totalPages;
          this.loading = false;
        });
    }
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.fetchFiles();
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.fetchFiles();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    this.fetchFiles();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.fetchFiles();
    }
  }

  handleDownloadError(message: string): void {
    this.downloadError = message;
  }
}
