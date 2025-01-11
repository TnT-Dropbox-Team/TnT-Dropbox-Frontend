import { Inject, Injectable } from "@angular/core";
import { BROWSER_STORAGE } from "../classes/storage";
import { Observable, tap } from "rxjs";
import { User } from "../classes/user";
import { AuthResponse } from "../classes/auth-response";
import { UsersDataService } from "./users-data.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private readonly storage: Storage,
    private readonly usersDataService: UsersDataService,
    private router: Router
  ) {}
  public login(user: User): Observable<AuthResponse> {
    return this.usersDataService.login(user).pipe(
      tap((authResponse: AuthResponse) => {
        this.saveToken(authResponse.token);
      })
    );
  }
  public register(user: User): Observable<AuthResponse> {
    return this.usersDataService.register(user).pipe(
      tap((authResponse: AuthResponse) => {
        this.saveToken(authResponse.token);
      })
    );
  }
  public logout(): void {
    this.storage.removeItem("tnt-token");
    this.router.navigateByUrl("/login");
  }
  public getToken(): string | null {
    return this.storage.getItem("tnt-token");
  }
  public saveToken(token: string): void {
    this.storage.setItem("tnt-token", token);
  }
  private b64Utf8(input: string): string {
    return decodeURIComponent(
      Array.prototype.map
        .call(window.atob(input), (character: string) => {
          return "%" + ("00" + character.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }
  public isLoggedIn(): boolean {
    const token: string | null = this.getToken();
    if (token) {
      const payload = JSON.parse(this.b64Utf8(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } else return false;
  }
  public getCurrentUser(): User | null {
    let user!: User;
    if (this.isLoggedIn()) {
      let token: string | null = this.getToken();
      if (token) {
        let { userId, firstName, lastName, username } = JSON.parse(
          this.b64Utf8(token.split(".")[1])
        );
        user = { userId, firstName, lastName, username };
      }
    }
    return user;
  }
}
