module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPlayersPositions(res, mysql, context, complete){
        mysql.pool.query("SELECT plID, poID FROM Players_Positions", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players_positions = results;
            complete();
        });
    }

    /*Display all players_positions */
    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getPlayersPositions(res, mysql, context, complete);
        function complete(){
            res.render('players_positions', context);
        }
    });

    /* Adds a players_position M:M relationship, redirects to players_positions page after adding */
    router.post('/', function(req, res){
        console.log(req.body.players_positions)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Players_Positions (plID, poID) VALUES (?,?)";
        var inserts = [req.body.plID, req.body.poID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/players_positions');
            }
        });
    });


    // Delete from player_position
    router.get('/delete',function(req,res,next){
        var context = {};
        mysql.pool.query("DELETE FROM Players_Positions WHERE (plID=? AND poID=?)",
            [req.query.plID, req.query.poID],
            function(err, result){
                if(err){
                    next(err);
                    return;
                }
                res.render('players_positions',context);
            });
    });
    return router;
}();
