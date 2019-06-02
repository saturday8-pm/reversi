
$(function () {

    var socketio = io();
    var userName = document.getElementById('username');

    // submitでメッセージを送信
    $('#message_form').submit(function () {

        chatdata = {
            user: userName.textContent,
            message: $('#input_msg').val()
        }

        socketio.json.emit('chat', chatdata);
        $('#input_msg').val('');
        return false;
    });
    // 受信したメッセージを表示
    socketio.on('chat', function (chatdata) {
        $('#messages').append($('<li>')
            .text(chatdata.user + '：' + chatdata.message));
    });

    //---------------------------------------------------------

    var mySocketId;
    var playerData;

    socketio.emit('userName', userName.textContent);

    // 自分のIDを受信
    socketio.on('mySocketId', function (id) {
        mySocketId = id;
        console.log(mySocketId);
    });

    //　対戦プレイヤーの情報を受信
    socketio.on('idData', function (idData) {
        playerData = idData;
        console.log(playerData);
        $('#player1').text("");
        $('#player2').text("");
        if (playerData[1]) {
            $('#player1').append(playerData[1].name);
        }
        if (playerData[2]) {
            $('#player2').append(playerData[2].name);
        }
        $('#next-player').text("");
        if (playerData[turn]) {
            $('#next-player').append(playerData[turn].name);
        }
    })

    // 変数定義

    // ボードの縦×横
    var BOARD_TYPE = {
        'WIDTH': 8,
        'HEIGHT': 8,
    };
    //　ピースの状態
    var PIECE_TYPE = {
        'NONE': 0,
        'BLACK': 1,
        'WHITE': 2,
        'MAX': 3,
    };

    var stone;
    var board = [];
    var turn = PIECE_TYPE.BLACK;

    //　ひっくり返す判定
    var checkTurnOver = function (x, y, flip) {

        var ret = 0;

        for (var dx = -1; dx <= 1; dx++) {
            for (var dy = -1; dy <= 1; dy++) {
                if (dx == 0 && dy == 0) {
                    continue;
                }

                var nx = x + dx;
                var ny = y + dy;
                var n = 0;
                while (board[nx][ny] == PIECE_TYPE.MAX - turn) {
                    n++;
                    nx += dx;
                    ny += dy;
                }

                if (n > 0 && board[nx][ny] == turn) {
                    ret += n;

                    if (flip) {
                        nx = x + dx;
                        ny = y + dy;

                        while (board[nx][ny] == PIECE_TYPE.MAX - turn) {
                            board[nx][ny] = turn;
                            nx += dx;
                            ny += dy;
                        }
                    }
                }
            }
        }
        return ret;
    };

    // ボードを表示する関数
    var showBoard = function () {

        // ボードの要素を取得
        var b = document.getElementById("board");

        //　divの子要素を削除
        while (b.firstChild) {
            b.removeChild(b.firstChild);
        }
        // board[0][0]から順番に指定していく
        for (var y = 1; y <= BOARD_TYPE.HEIGHT; y++) {
            for (var x = 1; x <= BOARD_TYPE.WIDTH; x++) {
                //ボードの複製をcellにセット
                var cell = stone[board[x][y]].cloneNode(true);

                cell.style.left = ((x - 1) * 45) + "px";
                cell.style.top = ((y - 1) * 45) + "px";

                //　boardに子要素を追加
                b.appendChild(cell);

                // もしなにも指定されていないセルだったら
                if (board[x][y] == PIECE_TYPE.NONE) {
                    (function () {
                        var _x = x;
                        var _y = y;

                        // クリックしたらsocket通信でクリックした位置を送信
                        cell.onclick = function () {
                            var checkName = playerData[turn].id;
                            if (checkName !== mySocketId) {
                                alert("クリックできません");
                                return false;
                            } else
                                socketio.json.emit('data', { x: _x, y: _y });
                        };
                    })();
                }
            }
        }
    };

    // 誰かがクリックしたら受信したx,yで処理
    socketio.on('clickData', function (data) {
        console.log(data);
        clickCell(data.position.x, data.position.y);

    });

    // クリック時の処理
    function clickCell(_x, _y) {
        // 戻り値のretが0より大きかったら
        if (checkTurnOver(_x, _y, true) > 0) {
            //　クリックしたセルが自分の色になる
            board[_x][_y] = turn;
            //　ボードの表示
            showBoard();
            // 相手のターンに変わる
            turn = PIECE_TYPE.MAX - turn;
            console.log("turn" + turn);
            $('#next-player').text("");
            $('#next-player').append(playerData[turn].name);
        }
    };

    onload = function () {

        // 0:石無し, 1:黒, 2:白
        stone = [
            document.getElementById("cell"),
            document.getElementById("black"),
            document.getElementById("white")
        ];

        // PIECE種別の凍結
        Object.freeze(PIECE_TYPE);

        // 盤面を初期化
        for (var i = 0; i < 10; i++) {
            board[i] = [];
            for (var j = 0; j < 10; j++) {
                board[i][j] = PIECE_TYPE.NONE;
            }
        }

        // 黒白の初期配置
        board[4][5] = PIECE_TYPE.BLACK;
        board[5][4] = PIECE_TYPE.BLACK;
        board[4][4] = PIECE_TYPE.WHITE;
        board[5][5] = PIECE_TYPE.WHITE;

        // 盤面表示
        showBoard();
    };
    //---------------------------------------------------

    // ゲーム終了を送信
    $('#finish').on('click', function () {
        socketio.emit('finish');
    });
    //　勝ち負けの判定
    socketio.on('finish', function () {
        var black = document.getElementsByClassName("black");
        var white = document.getElementsByClassName("white");
        $('#result').text("");
        if (black.length > white.length) {
            // alert("黒の勝ち！");
            $('#result').append("黒の勝ち！");
        } else if (white.length > black.length) {
            // alert("白の勝ち！");
            $('#result').append("白の勝ち！");
        } else {
            // alert("引き分け！");
            $('#result').append("引き分け！");
        }
        $('#player1').text("");
        $('#player2').text("");

    })
});