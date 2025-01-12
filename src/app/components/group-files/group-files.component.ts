import { Component } from "@angular/core";
import { FileListComponent } from "../file-list/file-list.component";
import { ActivatedRoute, Router } from "@angular/router";
import { GroupService } from "../../services/group.service";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { Group } from "../../classes/group";
import { CommonModule, DatePipe } from "@angular/common";
import { AuthenticationService } from "../../services/authentication.service";
import { User } from "../../classes/user";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-group-files",
  standalone: true,
  imports: [FileListComponent, DatePipe, CommonModule, FormsModule],
  templateUrl: "group-files.component.html",
  styles: ``,
})
export class GroupFilesComponent {
  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  selectedGroupId: number | undefined = undefined;
  group!: Group;
  error = "";
  members!: User[];
  users!: User[];
  currentUser: User | null = null;
  memberToRemove: number | undefined = undefined;
  searchQuery = "";

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.selectedGroupId = +params.get("id")!; 
    });
    this.currentUser = this.authenticationService.getCurrentUser();
    this.getGroup();
    this.getGroupMembers();
  }

  getGroup() {
    this.error = "";
    this.groupService
      .getGroupById(this.selectedGroupId!)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = error.error.message.toString();
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        this.group = data;
        if (this.isAdmin(this.group)) {
          this.getUsersList("");
        }
      });
  }

  isAdmin(group: Group) {
    return this.currentUser && group.admin.id === this.currentUser.id;
  }

  getGroupMembers() {
    this.error = "";
    this.groupService
      .getGroupMembers(this.selectedGroupId!)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = error.error.message.toString();
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        this.members = data;
      });
  }

  setMemberToRemove(memberId: number | undefined) {
   this.memberToRemove = memberId;
  }

  removeMember() {
    if (this.memberToRemove) {
      this.error = "";
      this.groupService
        .removeMember(this.selectedGroupId!, this.memberToRemove)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.error = error.error.message.toString();
            return throwError(() => error);
          })
        )
        .subscribe(() => {
          this.members = this.members.filter(
            (member) => member.id !== this.memberToRemove
          );
          this.group.members -= 1;
        });
    }
  }

  getUsersList(searchQuery: string) {
    this.error = "";
    this.groupService
      .getUsers(searchQuery)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = error.error.message.toString();
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        this.users = data.content.filter(
          (user) => user.id !== this.currentUser?.id
        );
      });
  }

  addMember(userId: number | undefined) {
    if (userId) {
      this.error = "";
      this.groupService
        .addMember(this.selectedGroupId!, userId)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.error = error.error.message.toString();
            return throwError(() => error);
          })
        )
        .subscribe((data) => {
          this.members.push(data);
          this.group.members += 1;
        });
    }
  }

  isMember(userId: number | undefined) {
    return this.members.some((member) => member.id === userId);
  }

  deleteGroup() {
    this.error = "";
    this.groupService
      .deleteGroup(this.selectedGroupId!)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = error.error.message.toString();
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.router.navigate(["/groups"]);
      });
  }
}
