module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function serveTeams(req, res){
        console.log("You asked me for some teams?")
        var query = 'SELECT teamID, teamName, homeCourt FROM Teams';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfTeams(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store ti inside context
          context.teams = results;
          //pass it to handlebars to put inside a file
          res.render('teams', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfTeams)

        res.send('Here you go!');
    }

    router.get('/', serveTeams);
    return router;
}();
