import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FileData } from "../../classes/file-data";
import { CommonModule } from "@angular/common";
import { FileService } from "../../services/file.service";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { saveAs } from "file-saver";

@Component({
  selector: "app-file-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "file-card.component.html",
  styles: ``,
})
export class FileCardComponent {
  constructor(private fileService: FileService) {}

  @Input() fileData: FileData | undefined;
  @Output() errorOccurred = new EventEmitter<string>();

  downloadFile() {
    if (!this.fileData) {
      this.errorOccurred.emit("File data is not available for download.");
    }

    this.fileService
      .getFile(this.fileData!.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = `Failed to download file: ${error.message}`;
          this.errorOccurred.emit(errorMessage);
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        const blob = new Blob([data.data], {
          type: "application/octet-stream",
        });
        saveAs(blob, this.fileData?.name || "downloaded-file");
      });
  }

  deleteFile() {}

  linkFile() {}
}
