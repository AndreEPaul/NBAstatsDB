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
