function deletePlayer(id){
    $.ajax({
        url: '/players/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletePlayers_Positions(plID, poID){
  $.ajax({
      url: '/players_positions/plID/' + plID + '/poID/' + poID,
      type: 'DELETE',
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
