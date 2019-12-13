import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import {UserService} from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  operation: string = 'login';
  email: string = null;
  password: string = null;
  nick: string = null;
  constructor(private authenticationService: AuthenticationService, private userService: UserService,
    private router: Router) { }

  login() {
    this.authenticationService.loginWithEmail(this.email, this.password).then( (data) => {
      alert('loogeado correctamente');
      console.log(data);
      this.router.navigate(['home']);
    }).catch((error) => {
      alert('Hubo un error');
      console.log(error);
    })
  }

  register() {
    this.authenticationService.registernWithEmail(this.email, this.password).then( (data) => {

      const user = {
        uid: data.user.uid,
        email: this.email,
        nick: this.nick
      }

      this.userService.createUser(user).then(result => {
        alert('registrado correctamente');
        console.log(result);  
      }).catch(error => {
        alert('Hubo un error en la creación del usuario');
        console.log(error);
      })
      
    }).catch((error) => {
      alert('Hubo un error en la autenticación');
      console.log(error);
    })
  }

  ngOnInit() {
  }

}
