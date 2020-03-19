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

    function getPlayerbyTeam(req, res, mysql, context, complete){
      var query = "SELECT Players.playerID, height, weight, firstName, lastName, Teams.teamName FROM Players INNER JOIN Teams ON Players.teamID = Teams.teamID WHERE Teams.teamName = ?";
      console.log(req.params)
      var inserts = [req.params.teams]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        });
    }

    /* Find players whose fname starts with a given string in the req */
    function getPlayerWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT Players.playerID, height, weight, firstName, lastName, Teams.teamName FROM Players INNER JOIN Teams ON Players.teamID = Teams.teamID WHERE Players.firstName LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        });
    }

    function getPlayerbyID(res, mysql, context, id, complete){
        var sql = "SELECT playerID, height, weight, firstName, lastName, teamID FROM Players WHERE playerID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.player = results[0];
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

    /*Display all players from a given team. Requires web based javascript to delete users with AJAX*/
    router.get('/filter/:team', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplayer.js","filterplayers.js","searchplayers.js"];
        var mysql = req.app.get('mysql');
        getPlayerbyTeam(req, res, mysql, context, complete);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('players', context);
            }

        }
    });

    /*Display all players whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplayer.js","filterplayers.js","searchplayers.js"];
        var mysql = req.app.get('mysql');
        getPlayerWithNameLike(req, res, mysql, context, complete);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('players', context);
            }
        }
    });

    /* Display one player for the specific purpose of updating players */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedteam.js", "updateplayer.js"];
        var mysql = req.app.get('mysql');
        getPlayerbyID(res, mysql, context, req.params.id, complete);
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-player', context);
            }

        }
    });

    /* Adds a player, redirects to the players page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Players (height, weight, firstName, lastName, teamID) VALUES (?,?,?,?,?)";
        var inserts = [req.body.addheight, req.body.addweight, req.body.addfirstName, req.body.addlastName, req.body.addteamID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/players');
            }
        });
    });

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
                res.redirect('/players');
            }
        });
    });

    /* The URI that update data is sent to in order to update a player */
/*
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Players SET height=?, weight=?, firstName=?, lastName=?, teamID=? WHERE playerID=?";
        var inserts = [req.body.height, req.body.weight, req.body.firstName, req.body.lastName, req.body.teamID, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

*/
    return router;
}();
