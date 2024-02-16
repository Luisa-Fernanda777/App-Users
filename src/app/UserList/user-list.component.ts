import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { EditUserComponent } from '../EditUser/edit-user.component';
import { MatDialog } from '@angular/material/dialog';
import { UserDataService } from '../user-data.service';
import { DeleteUserComponent } from '../DeleteUser/delete-user.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit{
  users: any[] = [];
  displayedColumns: string[] = ['id','nombres', 'apellidos', 'email', 'celular', 'foto', 'acciones'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private http: HttpClient, private dialog: MatDialog,
    private userDataService: UserDataService,
     ){
    this.dataSource = new MatTableDataSource<any>(this.users);
  }

  ngOnInit(): void {
      this.http.get('https://65cc0ab5e1b51b6ac4844477.mockapi.io/api/fake/users').subscribe((data: any) =>{
        this.users = data;
        this.dataSource.data = this.users;
        this.dataSource.paginator = this.paginator;
      })
  }

  editAndReload(idUser: number): void {
    this.http.get('https://65cc0ab5e1b51b6ac4844477.mockapi.io/api/fake/users').subscribe((data: any) => {
      this.users = data;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
    });
  }
  openEditUserDialog(user: any): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.users.findIndex((u) => u.id === result.id);
        if (index !== -1) {
          this.users[index] = result;
          this.dataSource.connect().next(this.users);
          this.dataSource.paginator = this.paginator;
        }
      }
    });
  }

  deleteAndReload(userId: number): void {
    this.http.get<any[]>('https://65cc0ab5e1b51b6ac4844477.mockapi.io/api/fake/users').subscribe(data => {
      this.users = data;
      this.dataSource.data = this.users;
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteuser(userId: number): void {

    const dialogref = this.dialog.open(DeleteUserComponent, {
      width : '350px',
      data: userId
    });

    dialogref.afterClosed().subscribe(result =>{
      if (result) {
        this.deleteAndReload(userId);
      }else{
        alert('No fue posible eliminar el usuario');
      }
    })
  }
}
