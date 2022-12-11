async function showPowerBIReport(levelNames){//-->dash(2) 
    var propNames = await findPropertyNames(viewer.model);//calls function inside forgeViewer file that gets the array of properties 
    if(modData["Load"] == "Done"){
        if(document.getElementById("maindashcontainer") != null){
            var myobj = document.getElementById("maindashcontainer");
            myobj.remove();
            viewer.resize();
        }
        else{
            addElement();
            setDropDown(levelNames,"id-select-level");
            setDropDown(propNames,"id-select-prop");
            viewer.resize();
            switchButton("button01");
            Quantities(modData); //modData is an object containing the  category names, ocurances etc..
            // modData.design = DesignData(modData.Elements);
            // modData.manufacture = ManufactureData(modData.Elements);
        }
    }
    else{
        alert("Data not loaded yet");
    } 
}

//set the dropdown list that we have given 
function setDropDown(list,dropdownId) {
    var selectList = document.getElementById(dropdownId);//"id-select-level"
    list.sort();
    for (var i = 0; i < list.length; i++) {
        var option = document.createElement("option");
        option.value = list[i];
        option.text = list[i];
        selectList.appendChild(option);
        }
  
    $('#'+dropdownId).on('change', async function() {
        var selectedValue = this.value;// get value from CURRENT selection change
        var selectedLevel = document.getElementById("id-select-level").value ;
        var selectedProperty = document.getElementById("id-select-prop").value;
        //update canvases
        updateCanvas("position01","col01");
        updateCanvas("position02","col02");
        updateCanvas("position03","col03");
        updateCanvas("position04","col04");
        //update tables
        updateDataTable("dataTable","row01","50%");// grills
        updateDataTable("dataTable2","row01","50%");// mechanical
        updateDataTable("dataTable3","row004","50%");//area
        updateDataTable("dataTable4","row004","50%");
    
      
        
            
        const modDataUpdate =  await onChangeLevel(selectedLevel,selectedProperty);// go to this function ( should fnish running befor rest of code. that is why it is in await)
        await Async();
        Quantities(modDataUpdate);
          
          

        });
}

function Async(){
    return new Promise((res)=>{
    setTimeout(()=>{
    res();} , 1000);});
    }

//update tables by deleting the old table content, and inserting new content       
function updateDataTable(table_id,parentElement_id,table_width){//table_id -->string name. parentElement_id-->string name of row, table_width--> string of number in precentage like "50%"

    var dataTableDOM = document.getElementById(table_id);
    //first table
            if(dataTableDOM.parentElement.id != parentElement_id)
            {
                var firstRowChild = document.getElementById(parentElement_id).firstChild;
                firstRowChild.remove();
            }
            else{
                dataTableDOM.remove();
            }
            var row = document.getElementById(parentElement_id);
            //Add data table
            const table = document.createElement("table");
            table.setAttribute("id", table_id);
            table.classList.add("display");
            table.style.width = table_width;
            row.appendChild(table);
}
// update chart canvases by deleting the old canvas, and updating the new one
function updateCanvas(canvas_id,parentElement_id){// canvas_id-->string of canvas id like "position04" . parentElement_id--> the id string of the parent element "col01"
    document.getElementById(canvas_id).remove();
     //update canvas
     var col = document.getElementById(parentElement_id);

     const canvas = document.createElement("canvas");
     canvas.setAttribute("id", canvas_id);
     canvas.classList.add("canvasfill");
     col.appendChild(canvas);


}