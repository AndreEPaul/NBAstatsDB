module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getGameStats(res, mysql, context, complete){
        mysql.pool.query("SELECT statsID, points, assists, rebounds, steals, blocks, plusMinus, playerID, gameID FROM GameStatistics", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.games  = results;
            complete();
        });
    }

    /*Display all gamestats */
    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getGameStats(res, mysql, context, complete);
        function complete(){
            res.render('gameStats', context);
        }
    });

    /* Adds a gamestats, redirects to gamestats page after adding */
    router.post('/', function(req, res){
        console.log(req.body.gameStats)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO GameStatistics (points, assists, rebounds, steals, blocks, plusMinus, playerID, gameID) VALUES (?,?,?,?,?,?,?,?)";
        var inserts = [req.body.points, req.body.assists, req.body.rebounds, req.body.steals, req.body.blocks, req.body.plusMinus, req.body.playerID, req.body.gameID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/gameStats');
            }
        });
    });

    return router;
}();

