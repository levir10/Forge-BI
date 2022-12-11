

//Buttons
function switchButton(buttonName){
//כרגע זה מעדכן את הגרפים של מיזוג אוויר. במידה ונרצה - אפשר להעביר לפונקציה הזו מערך שמכיל את כל שמות הקונטיינרים ולמחוק את הילדים שלהם
  // document.getElementById("row01").replaceChildren();
  // document.getElementById("row02").replaceChildren();
  // document.getElementById("row03").replaceChildren();
  // document.getElementById("row004").replaceChildren();
 


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


  var buttons = document.getElementById("containerButtons").childNodes;
  for (i = 0; i < buttons.length; i++) {
      if(buttons[i].id != buttonName)
      {
          buttons[i].style.background='white';
          buttons[i].style.color='#2d2d2d';
      }
      else
      {
          buttons[i].style.background='#2d2d2d';
          buttons[i].style.color='white'
      }
  } 



}



async function Quantities(input){// i turned Quantities to async at 1/11/22
  var _this = this;
  createBarChart('position02', 'Amounts of ducts by system type[m²]', input.quantities);
  createBarChart('position04', 'Length of pipes by system type[m]', input.Elements);
  createCFM_BarChart('position03', 'CFM By Floor', input.Elements.mechanical);
  createDataChart('#dataTable',input['Elements']['grills'],_this);
  createDataChart('#dataTable2',input['Elements']['mechanical'],_this);
  createDataChart('#dataTable3',input['Elements']['areas'],_this);
  createDataChart('#dataTable4', input['Elements']['cost_factors'],_this);
  createDoughnutChart('position01', 'Costs by system type[₪]', input.Elements.costs);
  
  
  
   var table = document.getElementById("dataTable");
   table.style.width = "50%";
   var table2 = document.getElementById("dataTable2");
   table2.style.width = "50%";
   var table3 = document.getElementById("dataTable3");
   table3.style.width = "50%";


}
// async function electricity(input){
//   createBarChart('position01','Try one',input)

// }

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