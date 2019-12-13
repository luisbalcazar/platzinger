export interface User {
    nick: string;
    subnick?: string; //opcional
    age?: number;
    email: string;
    friend: boolean;
    uid: any;
    status?: string;
    avatar?: string;
    friends?: any;
}