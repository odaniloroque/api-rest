const mysql =  require('mysql');

var pool = mysql.createPool({

    "connectionLimit" : 1000,
    "user"      : process.env.MYSQL_USER,
    "password"  : process.env.MYSQL_PASSWORD,
    "database"  : process.env.MYSQL_DATABASE,
    "host"      : process.env.MYSQL_HOST,
    "port"      : process.env.MYSQL_PORT

});

exports.execute = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result, fileds) => {
            if(error){
                reject(error);
            } else {
                resolve(result)
            }
        })
    })
}


// exports.execute = (query, params = []) => {
//     return new Promise((resolve, reject) => {
//         pool.getConnection((error, conn)=> {
//             if(error) {
//                 reject(error);
//             } else {
//                 conn.query(query, params, (error, result, fileds) => {
//                     conn.release();
//                     if(error){
//                         reject(error);
//                     }else {
//                         resolve(result)
//                     }
//                 })
//             }
//         })
//     })
// }

exports.pool = pool;