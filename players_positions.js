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
        context.jsscripts = ["deleteplayers.js"];
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

    router.delete('/plID/:plID/poID/:poID', function(req, res){
        console.log(req);
        console.log(req.params.plID);
        console.log(req.params.poID);
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Players_Positions WHERE plID = ? AND poID = ?";
        var inserts = [req.params.plID, req.params.poID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    });

    return router;
}();
