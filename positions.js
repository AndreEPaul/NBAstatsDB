module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTeams(res, mysql, context, complete){
        mysql.pool.query("SELECT positionID, positionName FROM Positions", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.positions  = results;
            complete();
        });
    }

    /*Display all positions */
    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getPositions(res, mysql, context, complete);
        function complete(){
                res.render('positions', context);
            }
    });

    /* Adds a position, redirects to position page after adding */
    router.post('/', function(req, res){
        console.log(req.body.positions)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Positions (positionName) VALUES (?)";
        var inserts = [req.body.positionName];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/positions');
            }
        });
    });

    return router;
}();
