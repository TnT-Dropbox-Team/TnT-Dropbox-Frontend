import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthenticationService } from "../services/authentication.service";
import { User } from "../classes/user";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "login.component.html",
  styles: ``,
})
export class LoginComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}
  protected formError!: string;
  protected credentials: User = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  };

  public onLoginSubmit(): void {
    this.formError = "";
    if (!this.credentials.username || !this.credentials.password)
      this.formError = "All fields are required, please try again.";
    else this.doLogin();
  }
  private doLogin(): void {
    this.authenticationService
      .login(this.credentials)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.formError = error.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.router.navigateByUrl("/files");
      });
  }
}
