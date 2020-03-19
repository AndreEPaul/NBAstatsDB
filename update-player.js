module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTeams(res, mysql, context, complete){
        mysql.pool.query("SELECT teamID, teamName FROM Teams", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams  = results;
            complete();
        });
    }

    function getPlayer(res, mysql, context, complete){
        mysql.pool.query("SELECT Players.playerID, height, weight, firstName, lastName, Teams.teamName FROM Players INNER JOIN Teams ON Players.teamID = Teams.teamID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        });
    }

    /*Display all players. Requires web based javascript to delete users with AJAX*/
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplayers.js","filterplayers.js","searchplayers.js"];
        var mysql = req.app.get('mysql');
        getPlayer(res, mysql, context, complete);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('players', context);
            }

        }
    });

    /* update? */
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Players SET height=?, weight=?, firstName=?, lastName=?, teamID=? WHERE playerID=?";
        var inserts = [req.body.upheight, req.body.upweight, req.body.upfirstName, req.body.uplastName, req.body.upteamID, req.body.upplayerID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/update-player');
            }
        });
    });

return router;
}();