import { Component, Input } from "@angular/core";
import { FileData } from "../../classes/file-data";
import { FileService } from "../../services/file.service";
import { AuthenticationService } from "../../services/authentication.service";
import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { CommonModule } from "@angular/common";
import { FileCardComponent } from "../file-card/file-card.component";
import { FormsModule } from "@angular/forms";
import { Modal } from "bootstrap";
import { Group } from "../../classes/group";
import { GroupService } from "../../services/group.service";

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

  selectedFile: any = null;

  groups: Group[] = [];
  errorForGroups: string = "";

  successMessage: string | null = null;

  constructor(
    private fileService: FileService,
    private authenticationService: AuthenticationService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.fetchFiles();
  }

  fetchFiles(): void {
    this.error = "";
    this.downloadError = "";
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
      const userId = this.authenticationService.getCurrentUser()?.id ?? 0;
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

  handleShare(file: any) {
    this.selectedFile = file;

    this.getAllGroups();

    const modalElement = document.getElementById("shareModal") as HTMLElement;
    if (modalElement) {
      const bootstrapModal = new Modal(modalElement);
      bootstrapModal.show();
    }
  }

  confirmShare() {
    this.selectedFile = null;
  }

  getAllGroups(): void {
    this.errorForGroups = "";
    this.groupService
      .getAllGroups()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorForGroups = error.toString();
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        if (data.length == 0)
          this.errorForGroups = "You are not part of any groups!";
        this.groups = data;
      });
  }

  shareWithGroup(group: Group) {
    this.error = "";

    if (!this.selectedFile) return;

    this.fileService
      .linkFileToGroup(this.selectedFile.id, group.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = error.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.successMessage = `File "${this.selectedFile?.name}" was successfully shared with group "${group.name}".`;
        const modalElement = document.getElementById(
          "shareModal"
        ) as HTMLElement;
        if (modalElement) {
          const bootstrapModal = Modal.getInstance(modalElement);
          bootstrapModal?.hide();
        }
        this.selectedFile = null;
        this.fetchFiles();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      });
  }

  handleShareDelete(file: any) {
    this.selectedFile = file;

    const modalElement = document.getElementById(
      "deleteConfirmationModal"
    ) as HTMLElement;
    if (modalElement) {
      const bootstrapModal = new Modal(modalElement);
      bootstrapModal.show();
    }
  }

  deleteFile() {
    this.error = "";

    if (!this.selectedFile) return;

    this.fileService
      .deleteFile(this.selectedFile.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = error.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.successMessage = `File "${this.selectedFile?.name}" was successfully deleted.`;
        const modalElement = document.getElementById(
          "deleteConfirmationModal"
        ) as HTMLElement;
        if (modalElement) {
          const bootstrapModal = Modal.getInstance(modalElement);
          bootstrapModal?.hide();
        }
        this.selectedFile = null;
        this.fetchFiles();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      });
  }
}
