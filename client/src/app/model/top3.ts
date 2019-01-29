
export class Top3 {
    first: number;
    second: number;
    third: number;

    public constructor(){
        //initialize to infinite like time
        this.first = 9999; 
        this.second = 9999; 
        this.third = 9999;
    }

    public addNewScore(score: number){ // A RETRAVAILLER juste pour le moment pour mocké.. pas optimal
        if(this.first > score){
            this.newScoreIsFirst(score);
        }else{
            if(this.second > score){
                this.newScoreIsSecond(score);
            }else{
                if(this.third > score){
                    this.newScoreIsThird(score);
                }
            }
        }
    }

    private newScoreIsFirst(score: number){
        this.third = this.second;
        this.second = this.first;
        this.first = score;
    }

    private newScoreIsSecond(score: number){
        this.third = this.second;
        this.second = score;
    }

    private newScoreIsThird(score: number){
        this.third = score;
    }


}