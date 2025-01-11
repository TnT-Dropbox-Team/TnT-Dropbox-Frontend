import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Group } from "../classes/group";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root",
})
export class GroupService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  private apiUrl = "http://localhost:3000/groups";

  getAllGroups(): Observable<Group[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.get<Group[]>(`${this.apiUrl}`, { headers });
  }
}
