
$(function () {

    var socketio = io();
    // submitでメッセージを送信
    $('#message_form').submit(function () {
        socketio.emit('message', $('#input_msg').val());
        $('#input_msg').val('');
        return false;
    });
    // 受信したメッセージを表示
    socketio.on('message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
    //---------------------------------------------------

    // 数字をクリックしてidを送信
    $('.box').click(function () {
        socketio.emit('id', $(this).attr('id'));
        return false;
    });
    // 受信したidで処理
    socketio.on('id', function (id) {
        console.log("IDです" + id);
        $('#'+id).addClass('black');
    });


    //---------------------------------------------------------

    // 変数定義

    // ボードの大きさ
    var BOARD_TYPE = {
        'WIDTH': 8,
        'HEIGHT': 8,
    };

    var PIECE_TYPE = {
        'NONE': 0,
        'BLACK': 1,
        'WHITE': 2,
        'MAX': 3,
    };

    var stone;
    var board = [];
    var turn = PIECE_TYPE.BLACK;

    //　ひっくり返す処理
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

    // ボードを表示するメソッド
    var showBoard = function () {

        // ボードの要素を取得
        var b = document.getElementById("board");
        console.log(b);

        //　一回子要素を削除
        while (b.firstChild) {
            b.removeChild(b.firstChild);
        }

        // board[0][0]から順番に指定していく
        for (var y = 1; y <= BOARD_TYPE.HEIGHT; y++) {
            for (var x = 1; x <= BOARD_TYPE.WIDTH; x++) {
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

                        //　セルをクリックしたときの処理
                        cell.onclick = function () {
                            if (checkTurnOver(_x, _y, true) > 0) {

                                //　クリックしたセルが自分の色になる
                                board[_x][_y] = turn;
                                //　ボードの表示
                                showBoard();
                                // 相手のターンに変わる
                                turn = PIECE_TYPE.MAX - turn;
                            }
                        };
                    })();
                }
            }
        }

    };
    onload = function () {

        // 0:石無し, 1:黒, 2:白
        stone = [
            document.getElementById("cell"),
            document.getElementById("black"),
            document.getElementById("white")
        ];

        // PIECE種別の凍結(念のため)
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



});