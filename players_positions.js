module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* get players to populate in dropdown */
    function getPlayers(res, mysql, context, complete){
        mysql.pool.query("SELECT playerID AS plID, firstName, lastName FROM Players", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.players = results;
            complete();
        });
    }

    /* get positionss to populate in dropdown */
    function getPositions(res, mysql, context, complete){
        sql = "SELECT positionID AS poID, positionName FROM Positions";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.positions = results
            complete();
        });
    }

    /* get players with their positions */
    /* TODO: get multiple positions in a single column and group on
     * fname+lname or id column
     */
    function getPlayersWithPositions(res, mysql, context, complete){
        sql = "SELECT plID, poID, CONCAT(firstName,' ',lastName) AS name, positionName AS position FROM Players INNER JOIN Players_Positions on Players.playerID = Players_Positions.plID INNER JOIN Positions on Positions.positionID = Players_Positions.poID ORDER BY name, positions"
         mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.players_positions = results
            complete();
        });
    }
  

    /* List players with positions along with
     * displaying a form to associate a player with multiple positions
     */
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteplayer.js"];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'players_positions'

        getPlayers(res, mysql, context, complete);
        getPositions(res, mysql, context, complete);
        getPlayersWithPositions(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render(handlebars_file, context);
            }
        }
    });

    /* Associate positions or positions with a player and
     * then redirect to the players_with_positions page after adding
     */
    router.post('/', function(req, res){
        console.log("We get the multi-select positions dropdown as ", req.body.positions)
        var mysql = req.app.get('mysql');
        // let's get out the positions from the array that was submitted by the form
        var positions = req.body.positions
        var player = req.body.plID
        for (let p of positions) {
          console.log("Processing positions id " + p)
          var sql = "INSERT INTO Players_Positions (plID, poID) VALUES (?,?)";
          var inserts = [players, positions];
          sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                //TODO: send error messages to frontend as the following doesn't work
                /* 
                res.write(JSON.stringify(error));
                res.end();
                */
                console.log(error)
            }
          });
        } //for loop ends here 
        res.redirect('/players_positions');
    });

    /* Delete a player's position record */
    /* This route will accept a HTTP DELETE request in the form
     * /pid/{{pid}}/positions/{{cid}} -- which is sent by the AJAX form
     */
    router.delete('/plID/:plID/positions/:poID', function(req, res){
        //console.log(req) //I used this to figure out where did pid and cid go in the request
        console.log(req.params.plID)
        console.log(req.params.poID)
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
    })

    return router;
}();
