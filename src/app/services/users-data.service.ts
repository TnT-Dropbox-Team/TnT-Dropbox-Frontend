import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, retry, throwError } from "rxjs";
import { AuthResponse } from "../classes/auth-response";
import { User } from "../classes/user";

@Injectable({
  providedIn: "root",
})
export class UsersDataService {
  constructor(private http: HttpClient) {}
  private apiUrl = "http://localhost:3000/users";

  public login(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("login", user);
  }
  public register(user: User): Observable<AuthResponse> {
    return this.makeAuthApiCall("register", user);
  }
  private makeAuthApiCall(
    urlPath: string,
    user: User
  ): Observable<AuthResponse> {
    const url: string = `${this.apiUrl}/${urlPath}`;
    const body: any = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    if (user.password) {
      body.password = user.password;
    }
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http
      .post<AuthResponse>(url, body, { headers })
      .pipe(retry(1), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || error.statusText);
  }
}
