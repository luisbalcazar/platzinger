import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  friendId: any;
  friend: User;
  user: User;
  conversation_id: string;
  textMessage: string;
  conversation: any;
  shake: boolean = false;
  
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private conversationService: ConversationService, 
    private authenticationService: AuthenticationService) {

    this.friendId = this.activatedRoute.snapshot.params['uid'];
  
    // this.friend= this.friends.find((record) => {
    //   return record.uid == this.friendId
    // })

    this.userService.getUserById(this.friendId).valueChanges().subscribe( (data: User) => {
      this.friend = data;
    }, (error) => {
      console.log(error)
    });

    this.authenticationService.getStatus().subscribe( (session) => {
      this.userService.getUserById(session.uid).valueChanges().subscribe((user: User) => {
        this.user = user;

        const ids = [this.user.uid, this.friend.uid].sort();
        this.conversation_id = ids.join('|');
        this.getConversation();
      });
    });

    
   }

  ngOnInit() {
  }

  sendMessage() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'text'
    }

    this.conversationService.createConversation(message).then(() => {
      this.textMessage = '';
    });
  }

  sendZumbido() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: 'Zumbido',
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'zumbido'
    }

    this.conversationService.createConversation(message).then(() => {});

    this.doZumbido();
  }

  doZumbido() {
    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout( ()=>{
      this.shake = false;
    }, 500);
  }

  getConversation() {
    this.conversationService.getConversation(this.conversation_id).valueChanges().subscribe( (data)=> {
      console.log(data);
      this.conversation = data;

      this.conversation.forEach(message => {

        if(!message.seen) {
          message.seen = true;
          this.conversationService.editConversation(message);

          if(message.type == 'text') {
            
            const audio = new Audio('assets/sound/new_message.m4a');
            audio.play();
          } else if(message.type == 'zumbido') {
            this.doZumbido();
          }

          
        }
      });
    }, (error) => {
      console.log(error);
    });
  }

}
