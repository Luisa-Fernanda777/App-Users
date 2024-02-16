import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDataService } from '../user-data.service';
import { User } from '../models/user.models';
import { catchError, finalize, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const PHONE_VALIDATOR = /^[0-9+\-]*$/;

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
      email: [this.userData.email , [Validators.required, Validators.email]],
      celular: [this.userData.celular , [Validators.required, Validators.pattern(PHONE_VALIDATOR)]],
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
      if(file.size > 1048576){
        alert('Error al editar el usuario, limite 1MB');
        event.target.value ='';
        return;
      }
      if(file.type.split('/')[0] !== 'image'){
        alert('Error al editar el usuario, tipo de archivo no admitido');
        event.target.value ='';
        return;
      }
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

    if (this.baseImage64) {
      editedUserData.foto = this.baseImage64 as string;
    } else {    // Si no selecciona una nueva foto entonces conserva la foto preexistente
      editedUserData.foto = this.userData.foto;
    }

    this.userDataService.updateUserData(editedUserData, this.userData.id)
    .pipe(
      catchError((error) => {
        alert('Error Inesperado');
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(editedUser => {
      if(editedUser) {
        this.dialogRef.close(editedUser);
      } else {
        alert('No fue posible editar el usuario');
      }
    });
    }


  }


