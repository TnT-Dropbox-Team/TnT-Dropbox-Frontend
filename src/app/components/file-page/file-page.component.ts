import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { FileListComponent } from "../file-list/file-list.component";
import { Modal } from "bootstrap";
import { FormsModule } from "@angular/forms";
import { FileService } from "../../services/file.service";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-file-page",
  standalone: true,
  imports: [CommonModule, FileListComponent, FormsModule],
  templateUrl: "file-page.component.html",
  styles: ``,
})
export class FilePageComponent implements AfterViewInit {
  @ViewChild("fileInput") fileInput!: ElementRef;
  @ViewChild("modalElement") modalElement!: ElementRef;
  triggerAction = false;

  fileName: string = "";
  selectedFile: File | null = null;
  isDragging: boolean = false;
  uploadError: string | null = null;

  private modalInstance!: Modal;

  private apiUrl = "http://localhost:3000/files";

  constructor(private fileService: FileService) {}

  ngAfterViewInit(): void {
    this.modalInstance = new Modal(this.modalElement.nativeElement, {
      backdrop: "static",
    });
  }

  openModal(): void {
    this.modalInstance.show();
  }

  closeModal(): void {
    this.modalInstance.hide();

    this.fileName = "";
    this.selectedFile = null;
    this.uploadError = null;
  }

  triggerFileInput(): void {
    const fileInput =
      this.modalElement.nativeElement.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files[0]) {
      this.selectedFile = event.dataTransfer.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  onSubmit(): void {
    this.uploadError = "";
    if (!this.selectedFile) {
      this.uploadError = "Please select a file before submitting.";
      return;
    }

    const formData = new FormData();
    formData.append("file", this.selectedFile);

    this.fileService
      .uploadNewFile(this.selectedFile)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.uploadError = error.error.message.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.closeModal();
        this.triggerAction = !this.triggerAction;
      });
  }
}
