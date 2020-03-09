module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTeams(res, mysql, context, complete){
        mysql.pool.query("SELECT teamID, teamName, homeCourt FROM Teams", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams  = results;
            complete();
        });
    }

    /*Display all teams */
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplayers.js","filterplayers.js","searchplayers.js"];
        var mysql = req.app.get('mysql');
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('teams', context);
            }

        }
    });

    /* Adds a team, redirects to team page after adding */
    router.post('/', function(req, res){
        console.log(req.body.teams)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Teams (teamName, homeCourt) VALUES (?,?)";
        var inserts = [req.body.teamName, req.body.homeCourt];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/teams');
            }
        });
    });

    return router;
}();
