/*
function updatePlayer(id){
    $.ajax({
        url: '/players/' + id,
        type: 'PUT',
        data: $('#update-player').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
*/

/*
function newUpdatePlayer(){
    var height = document.getElementById('upHeight');
    var weight = document.getElementById('upWeight');
    var firstName = document.getElementById('upFname');
    var lastName = document.getElementById('upLname');
    var teamID = document.getElementById('upTeamID');
    var playerID = document.getElementById('upPlayerID');
    $.ajax({
        url: '/players/height/' + height + '/weight/' + weight + '/firstName/' + firstName + '/lastName/' + lastName + '/teamID/' + teamID + '/playerID/' + playerID,
        type: 'UPDATE',
        success: function(result){
            if(result.responseText != undefined){
                alert(result.responseText)
            }
            else {
                window.location.reload(true)
            }
        }
    })
};
*/