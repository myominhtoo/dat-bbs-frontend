import { Board } from "./board";

export class User {
      id !: number;
      username !: string;
      bio !: string;
      email !: string;
      password !: string;
      phone !: string;
      imageUrl !: string;
      joinedDate !: Date;
      position !: string;
      gender !: number;
      image : File |  null | undefined;
      deleteStatus !: boolean;
      code! :number | string;
      confirmpassword!:string;

      iconColor !: string;
      // archiveBoards !: Board [] ;
}