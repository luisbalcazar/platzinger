import { Injectable } from '@angular/core';
import {User} from '../interfaces/user';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // friends: User[];
  
  constructor(private angularFireDatabase: AngularFireDatabase) { 
    // let user1: User = {
    //   nick: 'Luis',
    //   age: 20,
    //   email: 'hola@gmail.com',
    //   friend: true,
    //   uid: 1
    // }
    // this.friends = [user1, user2, user3, user4, user5];
  }

  getUsers() {
    return this.angularFireDatabase.list('/users');
  }

  getUserById(uid) {
    return this.angularFireDatabase.object('/users/' + uid);
  }

  createUser(user) {
    return this.angularFireDatabase.object('/users/' + user.uid).set(user);
  }

  editUser(user) {
    return this.angularFireDatabase.object('/users/' + user.uid).set(user);
  }

  setAvatar(avatar, uid) {
    return this.angularFireDatabase.object('/users/' + uid + '/avatar').set(avatar);
  }

  addFriend(userId, friendId) {
    this.angularFireDatabase.object('users/' + userId + '/friends/' + friendId).set(friendId);
    return this.angularFireDatabase.object('users/' +friendId + '/friends/' + userId).set(userId);
  }

  // getFriends() {
  //   return this.friends;
  // }
}
