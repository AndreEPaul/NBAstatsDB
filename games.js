module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getGames(res, mysql, context, complete){
        mysql.pool.query("SELECT  date, location, team1Points, team2Points, team1ID, team2ID FROM Games", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.games  = results;
            complete();
        });
    }

    /*Display all games */
    router.get('/', function(req, res){
        var context = {};
        context.jsscripts = ["deleteplayers.js","filterplayers.js","searchplayers.js"];
        var mysql = req.app.get('mysql');
        getGames(res, mysql, context, complete);
        function complete(){
            res.render('games', context);
        }
    });

    /* Adds a game, redirects to game page after adding */
    router.post('/', function(req, res){
        console.log(req.body.games)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Games (date, location, team1Points, team2Points, team1ID, team2ID) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.date, req.body.location, req.body.team1Points, req.body.team2Points, req.body.team1ID, req.body.team2ID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/games');
            }
        });
    });

    return router;
}();

