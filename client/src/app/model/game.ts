import { Top3 } from "./top3";

export class Game {
    name: String;
    imageURL: String;
    solo: Top3;
    multi: Top3;

    public constructor(name:String, imageURL:String){
        this.solo = new Top3();
        this.multi = new Top3();
        this.name = name;
        this.imageURL = imageURL;
    }

    public addSoloScore(score:number){
        this.solo.addNewScore(score);
    }

    public addMultiScore(score:number){
        this.multi.addNewScore(score);
    }

}