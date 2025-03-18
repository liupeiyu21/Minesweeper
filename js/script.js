var board = [];
var rows = 8;//行
var columns = 8;//列

var minesCount = 5;//地雷の数
var minesLocation = [];//"2-2","3-4","2-1"

var tilesClicked = 0; //クリックされたタイルの数
var flagEnabled = false;
var gameOver = false;

//ゲーム開始
window.onload = function() {
    startGame();
} 


//地雷を設定する
function setMines() {
    // minesLocation.push("2-2");
    // minesLocation.push("2-3");
    // minesLocation.push("5-6");
    // minesLocation.push("3-4");
    // minesLocation.push("1-1");
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString(); //toString 文字列に変換

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;//地雷の数を表示する
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    //8x8 のタイルを作成
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++ ) {
            //<div id="0-0"></div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile); 
        }
        board.push(row);
    }
}

// 旗のボタンを切り替える
function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }
    if (minesLocation.includes(tile.id)) {
        alert("GAME OVER");
        gameOver = true;
        revealMines();
        return;
    }
    //タイルの id は "2-3" のような形式なので、split("-") で ["2", "3"] に分解
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]); //parseInt() を使って 文字列 → 数値 に変換
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for ( let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    minesFound += checkTile(r-1, c-1);//上の左
    minesFound += checkTile(r-1, c);//上
    minesFound += checkTile(r-1, c+1);

    minesFound += checkTile(r, c-1);
    minesFound += checkTile(r, c+1);

    minesFound += checkTile(r+1, c-1);
    minesFound += checkTile(r+1, c);
    minesFound += checkTile(r+1, c+1);

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        checkMine(r-1, c-1); 
        checkMine(r-1, c);
        checkMine(r-1, c+1);

        checkMine(r, c-1);
        checkMine(r, c+1);

        checkMine(r+1, c-1);
        checkMine(r+1, c);
        checkMine(r+1, c+1);

    }

    if (tilesClicked == rows * columns - minesCount ) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }

}

function checkTile(r, c){
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}