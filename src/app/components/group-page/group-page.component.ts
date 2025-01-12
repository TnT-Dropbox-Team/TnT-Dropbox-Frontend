import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Group } from "../../classes/group";
import { GroupService } from "../../services/group.service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../../services/authentication.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-group-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "group-page.component.html",
  styles: `
      .group-card {
        cursor: pointer;
        transition: transform 0.2s;
      }
      .group-card:hover {
        transform: scale(1.02);
      }
    `,
})
export class GroupPageComponent implements OnInit {
  groups: Group[] = [];
  loading: boolean = true;
  error: string = "";
  inputName: string = "";
  createError: string = "";

  constructor(
    private groupService: GroupService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.fetchGroups();
  }

  fetchGroups(): void {
    this.loading = true;
    this.error = "";

    this.groupService
      .getAllGroups()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.loading = false;
          this.error = error.error.message.toString();
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        if (data.length == 0) this.error = "No Groups!";
        this.groups = data;
        this.loading = false;
      });
  }

  goToGroup(groupId: number): void {
    this.router.navigate([`/groups/${groupId}`]);
  }

  isAdmin(group: Group) {
    const user = this.authenticationService.getCurrentUser();
    return user && group.admin.id === user.id;
  }

  createGroup(inputName: string): void {
    if (!inputName) {
      this.createError = "Name cannot be empty!";
      return;
    }
    if (inputName.length < 3) {
      this.createError = "Name is too short!";
      return;
    }
    if (inputName.length > 100) {
      this.createError = "Name is too long!";
      return;
    }
    this.createError = "";
    this.groupService
      .addGroup(inputName)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.createError = error.error.message.toString();
          return throwError(() => error);
        })
      )
      .subscribe((group) => {
        this.groups.push(group);
        this.inputName = "";
      });
  }
}
