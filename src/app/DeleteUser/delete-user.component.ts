import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, finalize, of } from 'rxjs';
import { UserDataService } from '../user-data.service';


@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css'
})
export class DeleteUserComponent {
  loading = false;
  iduser: number = 0;

  constructor(public dialogref: MatDialogRef<DeleteUserComponent>,
    private userDataService: UserDataService,
    @Inject(MAT_DIALOG_DATA) public data: number){
      this.iduser = data;
    }

  onCancelClick(): void {
      this.dialogref.close(false);
  }

  onSaveClick(): void {
        this.loading = true;
        this.userDataService.deleteUserData(this.iduser)
        .pipe(
          catchError((error) => {
            console.error('Error al editar usuario', error);
            return of(null);
          }),
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(() => {
            console.log('Usuario Eliminado', this.iduser);
            this.dialogref.close(true);
          }

        );

    }

}
