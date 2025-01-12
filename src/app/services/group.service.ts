import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Group } from "../classes/group";
import { AuthenticationService } from "./authentication.service";
import { environment } from "../../environments/environment";
import { User } from "../classes/user";

@Injectable({
  providedIn: "root",
})
export class GroupService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  // test version:
  // private apiUrl = "http://localhost:3000/groups";

  private apiUrl = environment.groupServiceURL;

  getAllGroups(): Observable<Group[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.get<Group[]>(`${this.apiUrl}`, { headers });
  }

  getGroupById(id: number): Observable<Group> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.get<Group>(`${this.apiUrl}/${id}`, { headers });
  }

  getGroupMembers(id: number): Observable<User[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.get<User[]>(`${this.apiUrl}/${id}/members`, { headers });
  }

  removeMember(groupId: number, memberId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.delete<void>(
      `${this.apiUrl}/${groupId}/remove/${memberId}`,
      { headers }
    );
  }

  getUsers(searchQuery?: string): Observable<{
    content: User[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
  }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    let params = new HttpParams().set("searchQuery", searchQuery || "");

    return this.http.get<{
      content: User[];
      totalPages: number;
      totalElements: number;
      pageNumber: number;
    }>(`${environment.userServiceURL}`, {
      headers,
      params,
    });
  }

  addMember(groupId: number, userId: number): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.put<User>(
      `${this.apiUrl}/${groupId}/add/${userId}`,
      {},
      { headers }
    );
  }

  addGroup(name: string): Observable<Group> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.post<Group>(
      `${this.apiUrl}`,
      { name: name },
      { headers }
    );
  }

  deleteGroup(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authenticationService.getToken()}`,
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
