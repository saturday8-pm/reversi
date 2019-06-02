var mysql = require('mysql');　　//mysqlを要求

// var connection = mysql.createConnection({   　　//hostの情報でDBへアクセス
// 　　host: 'localhost', port : 3306,   user: 'root',   
// 　　　　　password: 'mysql', database: 'janken-game'
// });
var connection = mysql.createConnection({   　　//hostの情報でDBへアクセス
    　　host: 'us-cdbr-iron-east-02.cleardb.net', port : 3306,   user: 'b18bd15dc7f445',   
    　　　　　password: '24df30c2', database: 'heroku_238a25c455e90d5'
    });

exports.connection = connection;

connection.connect((err) => {   　//DB接続テスト用。アクセス成功でメッセージ返す。
　　if(err){ console.log('Error connecting to Db');        
　　　　　　　console.error(err);
　　}
　　else{ console.log('Connection established(DB)');} 
});