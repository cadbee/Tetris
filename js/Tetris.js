const STEP = 30;
const SQUARES_WIDTH = 10;
const SQUARES_HEIGHT = 20;
const SQUARE_CENTER = STEP / 2;

let MOVE_OPPORTUNITY = true;
let PAUSED = false;

let SCORE = 0;
let LEVEL = 1;
let SPEED = 800;

let CUR_FIG;
let NEXT_FIG;
let INTERVAL;
let FIELD = [];

FIGURES_LIST = [FigureI, FigureJ, FigureO, FigureL, FigureZ, FigureS, FigureT];


function setField() {
    for (let i = 0; i < SQUARES_HEIGHT + 2; i++) {
        FIELD[i] = [];
        for (let j = 0; j < SQUARES_WIDTH + 2; j++) {
            FIELD[i][j] = (j === 0 || i === SQUARES_HEIGHT + 1 || j === SQUARES_WIDTH + 1) ? 1 : 0;
        }
    }
}

function checkLinesToClear() {
    let for_delete = [];
    for (let i = SQUARES_HEIGHT; i > 1; i--) {
        let counter = 0;
        for (let j = 1; j <= SQUARES_WIDTH; j++)
            if (FIELD[i][j])
                counter++;
        if (counter === SQUARES_WIDTH)
            for_delete.push(i);
    }
    if (for_delete.length) {
        repaintFullLines(for_delete);
        resetFullLines(for_delete);
        updateScoreAndSpeed(for_delete.length);
    }
}


function updateScoreAndSpeed(full_lines_count) {
    switch (full_lines_count) {
        case 1:
            SCORE += 100;
            break;
        case 2:
            SCORE += 300;
            break;
        case 3:
            SCORE += 700;
            break;
        case 4:
            SCORE += 1500;
            break;
        default:

    }
    let new_level = Math.floor(SCORE/2000)+1;
    if((new_level - LEVEL) >= 1){
        LEVEL = new_level
        SPEED = Math.floor(SPEED * 0.9);
    }
    level_context.textContent = "Level: " + LEVEL;
    clearInterval(INTERVAL);
    INTERVAL = setInterval(mainAction, SPEED);
    score_context.clearRect(0, 0, score_canvas.width, score_canvas.height);
    score_context.fillText(SCORE, score_canvas.width / 10, 2 * score_canvas.height / 3);

}

function resetFullLines(full_lines_list) {
    for (let line of full_lines_list)
        for (let j = line; j > 1; j--)
            FIELD[j] = FIELD[j - 1].slice();
    for (let i = 0; i < full_lines_list.length; i++)
        for (let j = 0; j < SQUARES_WIDTH + 2; j++)
            FIELD[i][j] = (j === 0 || j === SQUARES_WIDTH + 1) ? 1 : 0;
}

function repaintFullLines(full_lines_list) {
    for (let line of full_lines_list.reverse()) {
        let data = main_context.getImageData(0, 0, main_canvas.width, (line - 1) * STEP);
        main_context.clearRect(0, 0, main_canvas.width, line * STEP);
        main_context.putImageData(data, 0, STEP);
    }
}

function canSpawnCheck() {
    for (let sq of NEXT_FIG.squares)
        if (FIELD[Math.floor(sq.coordinates[1] / STEP) + 1][Math.floor(sq.coordinates[0] / STEP) + 1])
            return false;
    return true;
}

function mainAction() {
    if (PAUSED === false) {
        if (CUR_FIG.canMove())
            CUR_FIG.moveDown();
        else {
            checkLinesToClear();
            if (!canSpawnCheck()) {
                exit();
            } else {
                CUR_FIG = NEXT_FIG;
                CUR_FIG.fillField();
                NEXT_FIG = new FIGURES_LIST[Math.floor(Math.random() * FIGURES_LIST.length)]();
                next_figure_context.clearRect(0, 0, next_figure_canvas.width, next_figure_canvas.height);
                let position = nextFigurePosition();
                NEXT_FIG.fillField(next_figure_context, position[0], position[1]);
                drawNextGrid(STEP, STEP, 'grey', 0.7)
                MOVE_OPPORTUNITY = true;
            }
        }
    } else {

    }
}

function newGame() {
    MOVE_OPPORTUNITY = true;
    clearInterval(INTERVAL);
    setField();
    score_context.fillStyle = 'white';
    score_context.font = "200% Arial";
    score_context.fillText(SCORE, score_canvas.width / 10, 2 * score_canvas.height / 3);
    CUR_FIG = new FIGURES_LIST[Math.floor(Math.random() * FIGURES_LIST.length)](main_context);
    CUR_FIG.fillField();
    NEXT_FIG = new FIGURES_LIST[Math.floor(Math.random() * FIGURES_LIST.length)](next_figure_context);
    let position = nextFigurePosition();
    NEXT_FIG.fillField(next_figure_context, position[0], position[1]);
    drawGrid(STEP, STEP, 'grey', 0.7)
    drawNextGrid(STEP, STEP, 'grey', 0.7)
    INTERVAL = setInterval(mainAction, SPEED); //скорость игры, мс
}

document.addEventListener('keydown', (event) => {
    const keyCode = event.keyCode;
    if (MOVE_OPPORTUNITY && !PAUSED)
        switch (keyCode) {
            case 27:
            case 80:
                event.preventDefault();
                pause();
                break;
            case 65:
            case 37:
                event.preventDefault();
                if (CUR_FIG.canMove(-1, false))
                    CUR_FIG.moveLeft();
                break;
            case 68:
            case 39:
                event.preventDefault();
                if (CUR_FIG.canMove(1, false))
                    CUR_FIG.moveRight();
                break;
            case 87:
            case 38:
                event.preventDefault();
                if (CUR_FIG.canRotate())
                    CUR_FIG.rotate();
                break;
            case 83:
            case 40:
                event.preventDefault();
                if (CUR_FIG.canMove(0, true))
                    CUR_FIG.moveDown();
                break;
            case 32:
                event.preventDefault();
                MOVE_OPPORTUNITY = false;
                while (CUR_FIG.canMove(0, true))
                    CUR_FIG.moveDown();
                break;
            default:
        }
});

function exit() {
    MOVE_OPPORTUNITY = false;
    clearInterval(INTERVAL);
    main_context.clearRect(0, 0, main_canvas.width, main_canvas.height);
    next_figure_context.clearRect(0, 0, next_figure_canvas.width, next_figure_canvas.height);
    main_context.textAlign = "center";
    main_context.font = "350% Tetris";
    main_context.fillText('Game over', main_canvas.width / 2, main_canvas.height / 2);
    grid_context.clearRect(0, 0, main_canvas.width, main_canvas.height);
    document.getElementById('startButton').disabled = false;
    document.getElementById('mainButton').disabled = false;
    document.getElementById('pauseButton').disabled = true;
    SPEED = 800;
    updateScoreTable();
}


function nextFigurePosition() {
    let figure_name = NEXT_FIG.constructor.name;
    switch (figure_name) {
        case 'FigureI':
            return [2, 2];
        default://j,l t,z s
            return [3, 1];
    }
}


function updateScoreTable() {
    if (localStorage['current_score'] < SCORE)
        localStorage['current_score'] = SCORE;
    let records = localStorage['SCORE'];
    if (records !== undefined && records.length) {
        records = JSON.parse(records);
        if (records[localStorage['current_user']]) {
            if (records[localStorage['current_user']] < SCORE)
                records[localStorage['current_user']] = SCORE;
        } else {
            records[localStorage['current_user']] = SCORE;
        }
    } else {
        records = {};
        records[localStorage['current_user']] = SCORE;
    }
    console.log(records);
    localStorage['SCORE'] = JSON.stringify(records);
    LEVEL = 0;
    SCORE = 0;
}

function restart() {
    document.getElementById('mainButton').disabled = true;
    document.getElementById('pauseButton').disabled = false;
    document.getElementById('startButton').disabled = true;
    main_context.clearRect(0, 0, main_canvas.width, main_canvas.height);
    next_figure_context.clearRect(0, 0, next_figure_context.width, next_figure_context.height);
    score_context.clearRect(0, 0, score_canvas.width, score_canvas.height);
    newGame();
}


function drawNextGrid(stepX, stepY, color, lineWidth) {
    for (let i = 0.5 + stepX; i < next_figure_canvas.width; i += stepX) {
        next_figure_context.moveTo(i, 0);
        next_figure_context.lineTo(i, next_figure_canvas.height);
    }
    for (let j = 0.5 + stepY; j < next_figure_canvas.height; j += stepY) {
        next_figure_context.moveTo(0, j);
        next_figure_context.lineTo(next_figure_canvas.width, j);
    }
    next_figure_context.strokeStyle = color;
    next_figure_context.lineWidth = lineWidth;
    next_figure_context.stroke();
    next_figure_context.beginPath();
}

function drawGrid(stepX, stepY, color, lineWidth) {
    for (let i = 0.5 + stepX; i < grid_canvas.width; i += stepX) {
        grid_context.moveTo(i, 0);
        grid_context.lineTo(i, grid_canvas.height);
    }
    for (let j = 0.5 + stepY; j < grid_canvas.height; j += stepY) {
        grid_context.moveTo(0, j);
        grid_context.lineTo(grid_canvas.width, j);
    }
    grid_context.strokeStyle = color;
    grid_context.lineWidth = lineWidth;
    grid_context.stroke();
    grid_context.beginPath();
}

function pause() {
    if (PAUSED === false) {
        PAUSED = true;
        next_figure_context.clearRect(0, 0, next_figure_canvas.width, next_figure_canvas.height);
        next_figure_context.font = "230% Tetris";
        next_figure_context.textAlign = "center";
        next_figure_context.fillText('Pause', next_figure_canvas.width / 2, next_figure_canvas.height / 1.8);
    } else {
        PAUSED = false;
        next_figure_context.clearRect(0, 0, next_figure_canvas.width, next_figure_canvas.height);
        let position = nextFigurePosition();
        NEXT_FIG.fillField(next_figure_context, position[0], position[1]);
    }

}

function toMain() {
    window.location = 'index.html';
}