import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FileData } from "../classes/file-data";
import { AuthenticationService } from "./authentication.service";
import { FileDataOnly } from "../classes/file-data-only";

@Injectable({
  providedIn: "root",
})
export class FileService {
  private apiUrl = `http://localhost:3000/files`;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  getUserFiles(
    userId: number,
    searchQuery?: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ["createdAt,desc"]
  ): Observable<{
    content: FileData[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
  }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    let params = new HttpParams()
      .set("searchQuery", searchQuery || "")
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sort", sort.join(","));

    return this.http.get<{
      content: FileData[];
      totalPages: number;
      totalElements: number;
      pageNumber: number;
    }>(`${this.apiUrl}/user/${userId}`, {
      headers,
      params,
    });
  }

  getFile(fileId: number): Observable<FileDataOnly> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.get<FileDataOnly>(`${this.apiUrl}/${fileId}`, { headers });
  }

  getGroupFiles(
    groupId: number,
    searchQuery?: string,
    page: number = 0,
    size: number = 10,
    sort: string[] = ["createdAt,desc"]
  ): Observable<{
    content: FileData[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
  }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    let params = new HttpParams()
      .set("searchQuery", searchQuery || "")
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sort", sort.join(","));

    return this.http.get<{
      content: FileData[];
      totalPages: number;
      totalElements: number;
      pageNumber: number;
    }>(`${this.apiUrl}/group/${groupId}`, {
      headers,
      params,
    });
  }

  uploadNewFile(file: File): Observable<FileData> {
    const formData = new FormData();
    formData.append("file", file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.post<FileData>(`${this.apiUrl}`, formData, { headers });
  }

  linkFileToGroup(fileId: number, groupId: number): Observable<FileData> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.post<FileData>(
      `${this.apiUrl}/${fileId}/groups/${groupId}`,
      {},
      { headers }
    );
  }

  deleteFile(fileId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.delete<void>(`${this.apiUrl}/${fileId}`, { headers });
  }
}
