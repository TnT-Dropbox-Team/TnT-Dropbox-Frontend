import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthenticationService } from "../../services/authentication.service";
import { User } from "../../classes/user";

@Component({
  selector: "app-framework",
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: "framework.component.html",
  styles: ``,
})
export class FrameworkComponent {
  constructor(private readonly authenticationService: AuthenticationService) {}
  public logout(): void {
    this.authenticationService.logout();
  }
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
  public getCurrentUser(): string {
    const user: User | null = this.authenticationService.getCurrentUser();
    return user ? user.firstName + " " + user.lastName : "Guest";
  }
}
