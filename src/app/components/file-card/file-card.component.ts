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
  @Output() onShare = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  downloadFile() {
    if (!this.fileData) {
      this.errorOccurred.emit("File data is not available for download.");
    }

    this.fileService
      .getFile(this.fileData!.id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = `Failed to download file: ${error.error.message.toString()}`;
          this.errorOccurred.emit(errorMessage);
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        // Convert base64 string to a byte array
        const byteArray = this.convertBase64ToArrayBuffer(data.data);

        // Create a Blob from the byte array
        const blob = new Blob([byteArray], {
          type: "application/octet-stream",
        });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create an anchor element and trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = this.fileData?.name || "downloadedFile.txt"; // Set the desired file name and extension
        a.click();

        // Release the Blob URL
        window.URL.revokeObjectURL(url);
      });
  }

  private convertBase64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
