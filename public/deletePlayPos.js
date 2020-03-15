function deleteResult(plID, poID){

    var table = document.getElementById("play_pos_table");
    for (var row = 1;row <= (table.rows.length-1); row++) {
        if((table.rows[row].cells[0].innerHTML == plID) && (table.rows[row].cells[1].innerHTML == poID)){
            table.deleteRow(row);
        }
    }

    var req = new XMLHttpRequest();
    req.open("GET", "delete?plID=" + plID + "&poID=" + poID, true);

    req.addEventListener("load",function(){
        if(req.status >= 200 && req.status < 400){
            console.log("success");
        } else {
            console.log("Error in network request: " + req.statusText);
            if(req.statusText === "Not Found"){
                alert("Error not found");
            }
        }
    });
    req.send(null);
};