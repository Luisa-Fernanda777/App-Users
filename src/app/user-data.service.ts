import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private http: HttpClient){}

  updateUserData(userData: any, iduser: number){
    return this.http.put(`https://65cc0ab5e1b51b6ac4844477.mockapi.io/api/fake/users/${iduser}`, userData);
  }

  deleteUserData(iduser: number){
    return this.http.delete(`https://65cc0ab5e1b51b6ac4844477.mockapi.io/api/fake/users/${iduser}`);
  }

}
