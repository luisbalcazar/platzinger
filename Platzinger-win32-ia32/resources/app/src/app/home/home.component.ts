import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestsService } from '../services/requests.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 friends: User[];
 query: string = '';
 user: User;
 friendEmail: string = '';
 message: string = '';

  constructor(private userService: UserService, private authenticationService: AuthenticationService,
    private router: Router, private modalService: NgbModal, private requestService: RequestsService) { 
    // let c: number = 1;
    // let b: number = 2;
    // console.log(c + b);
    // let d: boolean = true;
    // let e: object = {}
    // let y: any[] = []

   this.userService.getUsers().valueChanges().subscribe((data: User[]) => {
      this.friends = data;
    }, (error)=>{
      console.log(error);
    });

    this.authenticationService.getStatus().subscribe((status)=>{
      this.userService.getUserById(status.uid).valueChanges().subscribe((data: User)=>{
        this.user = data;

        if(this.user.friends) {
          this.user.friends = Object.values(this.user.friends);
          console.log(this.user);
        }
      }, (error)=>{
        console.log(error)
      })
    }, (error)=>{
      console.log(error)
    });
    
  }
    
  ngOnInit() {
  }

  logout() {
    this.authenticationService.logOut().then(() => {
      this.router.navigate(['login']);
    }).catch((error)=>{
      console.log(error)
    })
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  sendRequest() {
    const request = {
      timestamp: Date.now(),
      receiver_email: this.friendEmail,
      sender: this.user.uid,
      nick: this.user.nick,
      avatar: this.user.avatar,
      message: this.message,
      status: 'pending'
    };

    this.requestService.createRequest(request).then( () => {
      alert('solicitud enviada!');
    }).catch( (error) => {
      alert('Hubo un error');
      console.log(error);
    })
  }

}
