class Square {
    constructor(x, y, color) {
        this.coordinates = [x + SQUARE_CENTER, y + SQUARE_CENTER];
        this.color = color;
    }
    clear() {
        main_context.clearRect(this.coordinates[0] - SQUARE_CENTER, this.coordinates[1] - SQUARE_CENTER, STEP, STEP);
    }
    draw(context, offset_x = 0, offset_y = 0){
        context.fillStyle = this.color;
        context.fillRect(this.coordinates[0]-SQUARE_CENTER+1-offset_x*STEP,
            this.coordinates[1]-SQUARE_CENTER+1+offset_y*STEP, STEP-2, STEP-2);
        context.strokeStyle = "white";
        context.strokeRect(this.coordinates[0]-SQUARE_CENTER+1-offset_x*STEP,
            this.coordinates[1]-SQUARE_CENTER+1+offset_y*STEP, STEP-2,STEP-2);
    }
    moveDown() {
        this.coordinates[1] += STEP;
    }
    moveLeft() {
        this.coordinates[0] -= STEP;
    }
    moveRight() {
        this.coordinates[0] += STEP;
    }
    canRotate(center){
        let tmp_y = this.coordinates[1] - center.y;
        let tmp_x = this.coordinates[0] - center.x;
        let new_x = center.x - tmp_y;
        let new_y = center.y + tmp_x;
        return [new_x, new_y];
    }
    rotate(center) {
        let tmp_y = this.coordinates[1] - center.y;
        let tmp_x = this.coordinates[0] - center.x;
        this.coordinates[0] = center.x - tmp_y;
        this.coordinates[1] = center.y + tmp_x;
    }
}

class Figure{
    constructor(){
        this.color = '#ffffff';
        this.center = null;
        this.squares = [];
    }
    canMove(move_to = 0, move_down = true){
        let coordinates = [];
        for(let sq of this.squares)
            coordinates.push(sq.coordinates);
        for(let sq of this.squares){
            let log = true;
            for(let val of coordinates){
                if (val[0] === sq.coordinates[0]+STEP*move_to && val[1] === sq.coordinates[1]+STEP*move_down) {
                    log = false;
                    break;
                }
            }
            if (log && FIELD[Math.floor((sq.coordinates[1]+SQUARE_CENTER*move_down)/STEP)+1]
                [Math.floor((sq.coordinates[0]+STEP*move_to)/STEP)+1] === 1)
                return false;
        }
        return true;
    }

    canRotate() {
        let coordinates = [];
        for(let sq of this.squares)
            coordinates.push(sq.coordinates);
        for (let sq of this.squares) {
            let imposition = false;
            let new_coordinates = sq.canRotate(this.center);
            if (new_coordinates[0] < 0 || new_coordinates[1] < 0 || new_coordinates[1] > main_canvas.height)
                return false;
            for( let val of coordinates) {
                if (new_coordinates[0] === val[0] && new_coordinates[1] === val[1] ) {
                    imposition = true;
                    break;
                }
            }
            if (!imposition &&
                FIELD[(new_coordinates[1]-SQUARE_CENTER)/STEP+1][(new_coordinates[0]-SQUARE_CENTER)/STEP+1] === 1)
                return false;
        }
        return true;
    }

    moveDown(need_draw = true) {
        if(need_draw) {
            this.matrixClear();
            this.clear();
        }
        for(let sq of this.squares)
            sq.moveDown();
        if(need_draw) {
            this.draw(main_context);
            this.matrixFill();
        }
        this.center.y += STEP;
    };
    moveLeft(need_draw = true) {
        if(need_draw) {
            this.matrixClear();
            this.clear();
        }
        for(let sq of this.squares)
            sq.moveLeft();
        this.center.x -= STEP;
        if(need_draw) {
            this.draw(main_context);
            this.matrixFill();
        }
    };
    moveRight(need_draw = true) {
        if(need_draw) {
            this.matrixClear();
            this.clear();
        }
        for(let sq of this.squares)
            sq.moveRight();
        if(need_draw) {
            this.matrixFill();
            this.draw(main_context);
        }
        this.center.x += STEP;
    };
    rotate() {
        this.matrixClear();
        this.clear();
        for(let sq of this.squares)
        {
            let res = sq.rotate(this.center);
            switch(res){
                case 'left':
                    this.moveLeft(false);
                    break;
                case 'right':
                    this.moveRight(false);
                    break;
                case 'down':
                    this.moveDown(false);
                    break;
            }
        }
        this.draw(main_context);
        this.matrixFill();
    }
    draw(context = main_context) {
        for(let sq of this.squares)
            sq.draw(context);
    }
    clear() {
        for(let sq of this.squares)
            sq.clear();
    }
    matrixClear() {
        for(let sq of this.squares)
            FIELD[Math.floor(sq.coordinates[1]/STEP) + 1][Math.floor(sq.coordinates[0]/STEP) + 1] = 0
    }
    matrixFill(){
        for(let sq of this.squares)
            FIELD[Math.floor(sq.coordinates[1]/STEP) + 1][Math.floor(sq.coordinates[0]/STEP) + 1] = 1;
    }

    fillField(context = main_context, offset_x = 0, offset_y = 0){
        if (context === main_context)
            this.matrixFill();
        for(let sq of this.squares)
            sq.draw(context, offset_x, offset_y);
    }
}

class FigureL extends Figure{
    constructor(){
        super();
        this.color = '#ff8800';
        this.center = {x: STEP*5.5, y: STEP*0.5};
        this.squares.push(new Square(STEP*4, STEP, this.color));
        this.squares.push(new Square(STEP*4, 0, this.color));
        this.squares.push(new Square(STEP*5, 0, this.color));
        this.squares.push(new Square(STEP*6, 0, this.color));
    }
}
class FigureJ extends Figure{
    constructor(){
        super();
        this.color = '#0005ee';
        this.center = {x: STEP*5.5, y: STEP*0.5};
        this.squares.push(new Square(STEP*6, STEP, this.color));
        this.squares.push(new Square(STEP*4, 0, this.color));
        this.squares.push(new Square(STEP*5, 0, this.color));
        this.squares.push(new Square(STEP*6, 0, this.color));
    }
}
class FigureO extends Figure{
    constructor(){
        super();
        this.color = '#eeff00';
        this.center = {x: STEP*5, y: STEP};
        this.squares.push(new Square(STEP*4, STEP, this.color));
        this.squares.push(new Square(STEP*4, 0, this.color));
        this.squares.push(new Square(STEP*5, STEP, this.color));
        this.squares.push(new Square(STEP*5, 0, this.color));
    }
}
class FigureZ extends Figure{
    constructor(){
        super();
        this.color = '#78ff4c';
        this.center = {x: STEP*5.5, y: STEP*1.5};
        this.squares.push(new Square(STEP*4, 0, this.color));
        this.squares.push(new Square(STEP*5, 0, this.color));
        this.squares.push(new Square(STEP*5, STEP, this.color));
        this.squares.push(new Square(STEP*6, STEP, this.color));
    }
}
class FigureS extends Figure{
    constructor(){
        super();
        this.color = '#ff0017';
        this.center = {x: STEP*5.5, y: STEP*1.5};
        this.squares.push(new Square(STEP*4, STEP, this.color));
        this.squares.push(new Square(STEP*5, STEP, this.color));
        this.squares.push(new Square(STEP*5, 0, this.color));
        this.squares.push(new Square(STEP*6, 0, this.color));
    }
}
class FigureT extends Figure{
    constructor(){
        super();
        this.color = '#9200ff';
        this.center = {x: STEP*5.5, y: STEP*0.5};
        this.squares.push(new Square(STEP*4, 0, this.color));
        this.squares.push(new Square(STEP*5, 0, this.color));
        this.squares.push(new Square(STEP*6, 0, this.color));
        this.squares.push(new Square(STEP*5, STEP, this.color));

    }
}
class FigureI extends Figure{
    constructor(){
        super();
        this.color = '#00ffba';
        this.center = {x: STEP*5, y: STEP};
        this.squares.push(new Square(STEP*3, 0, this.color));
        this.squares.push(new Square(STEP*4, 0, this.color));
        this.squares.push(new Square(STEP*5, 0, this.color));
        this.squares.push(new Square(STEP*6, 0, this.color));
    }
}
