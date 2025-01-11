import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Group } from "../../classes/group";
import { GroupService } from "../../services/group.service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: "app-group-page",
  standalone: true,
  imports: [CommonModule],
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
          this.error = error.toString();
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
}
