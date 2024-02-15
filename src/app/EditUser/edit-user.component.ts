import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from '../user-data.service';
import { User } from '../models/user.models';
import { catchError, finalize, lastValueFrom, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {

  userData: User;
  editForm!: FormGroup;
  loading = false;
  baseImage64: string | ArrayBuffer | null = '';
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userDataService: UserDataService,
    private formBuilder: FormBuilder
  ) {
    this.userData = {...data};

    this.editForm = this.formBuilder.group({
      nombres: [this.userData.nombres , Validators.required],
      apellidos: [this.userData.apellidos , Validators.required],
      email: [this.userData.email , Validators.required],
      celular: [this.userData.celular , Validators.required],
      foto: [this.userData.foto]
    })
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.convertImageToBase64(file);
    }
  }

  private convertImageToBase64(file: File): any {
    if(file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {
        this.baseImage64 = reader.result;
      };

    }
  }

  onSaveClick(): void {
    if (!this.editForm.valid) {
      this.dialogRef.close();
      return;
    }
    this.loading = true;
    const editedUserData = this.editForm.value;
    editedUserData.foto = this.baseImage64 as string;

    this.userDataService.updateUserData(editedUserData, this.userData.id)
    .pipe(
      catchError((error) => {
        console.log('Error en la edicion de usuario', error);
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(editedUser => {
      if(editedUser) {
        console.log('Usuario editado', editedUser);
        this.dialogRef.close(editedUser);
        //window.location.reload();
      } else {
        console.error('Usuario no editado');
      }
    });
    }


  }


