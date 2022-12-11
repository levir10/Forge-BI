function addElement () {
    // create the main div
    const newDiv = document.createElement("div");
    newDiv.classList.add("col");
    newDiv.classList.add("fill");
    newDiv.setAttribute("id", "maindashcontainer");

    // Add row 01
    const row01 = document.createElement("div");
    row01.classList.add("row");
    row01.classList.add("rowfillDatatable");
    row01.setAttribute("id", "row01");
    // Add top row - and make new select row
    const row00 = document.createElement("select");
    row00.setAttribute("id", "id-select-level");
    row00.classList.add("select");
    row00.style.width = "30%";

    // Add top row - and make new select row
    const propSelect = document.createElement("select");
    propSelect.setAttribute("id", "id-select-prop");
    propSelect.classList.add("select-prop");
    propSelect.style.width = "20%";
    
    //add Lable to the dropdown
    const newlabel = document.createElement("Label");
    newlabel.setAttribute("for","id-select-prop");
    newlabel.innerHTML = "Here goes the text";
    propSelect.appendChild(newlabel);

    newTable("dataTable",row01,"50%","100%");// grill table
    newTable("dataTable2",row01,"50%","100%");//air flow table

    newDiv.appendChild(row01);
    newDiv.appendChild(propSelect);
    
   // Add row 02
    const row02 = document.createElement("div");
    row02.classList.add("row");
    row02.classList.add("rowfill");
    //Add column01
    const col01 = document.createElement("div");
    col01.classList.add("col");
    col01.classList.add("collfill");
    col01.setAttribute("id", "col01");
    
    //add canvas
    const canvas01 = document.createElement("canvas");
    canvas01.setAttribute("id", "position01");
    canvas01.classList.add("canvasfill");
    col01.appendChild(row00);//moved this row from row 27 ( from  row01.appendChild(row00); to this)
    col01.appendChild(canvas01);

    //Add column02
    const col02 = document.createElement("div");
    col02.classList.add("col");
    col02.setAttribute("id", "col02");
    col02.classList.add("collfill");
    
    //add canvas
    const canvas02 = document.createElement("canvas");
    canvas02.setAttribute("id", "position02");
    canvas02.classList.add("canvasfill");
    // col02.appendChild(propSelect);
    col02.appendChild(canvas02);
    row02.appendChild(col01);
    row02.appendChild(col02);
 
    // Add row 03
    const row03 = document.createElement("div");
    row03.classList.add("row");
    row03.classList.add("rowfill");
//////////////////////////////////////////////////////////////////
    //Add column03
    const col03 = document.createElement("div");
    col03.classList.add("col");
    col03.classList.add("collfill");
    col03.setAttribute("id", "col03");
    
    //add canvas03
    const canvas03 = document.createElement("canvas");
    canvas03.setAttribute("id", "position03");
    canvas03.classList.add("canvasfill");


    //Add column04
    const col04 = document.createElement("div");
    col04.classList.add("col");
    col04.setAttribute("id", "col04");
    col04.classList.add("collfill");
    
    //add canvas04
    const canvas04 = document.createElement("canvas");
    canvas04.setAttribute("id", "position04");
    canvas04.classList.add("canvasfill");
    
    col03.appendChild(canvas03);
    col04.appendChild(canvas04);
    row03.appendChild(col03);
    row03.appendChild(col04);
//////////////////////////////////////////////////////////////////
//02.12.22
 // Add row 01
 const row004 = document.createElement("div");
 row004.classList.add("row");
 row004.classList.add("rowfillDatatable");
 row004.setAttribute("id", "row004");
 
 newTable("dataTable3",row004,"50%","100%");// area table
 newTable("dataTable4",row004,"50%","100%");



//////////////////////////////////////////////////////////////////
//02.12.22

    newDiv.appendChild(row02);
    newDiv.appendChild(row03);

//////////////////////////////////////////////////////////////////
//02.12.22
    newDiv.appendChild(row004);
//////////////////////////////////////////////////////////////////
//02.12.22

    // Add row 04
    const row04 = document.createElement("div");
    row04.classList.add("row");
    row04.classList.add("containerbuttons");

    const containerButtons = document.createElement("div");
    containerButtons.classList.add("multi-button");
    containerButtons.setAttribute("id", "containerButtons");

    const button01 = document.createElement("button");
    button01.setAttribute("id", "button01");
    button01.textContent = 'מערכת מיזוג';
    button01.style.borderRadius = "4px 0px 0px 4px";

    button01.onclick = function(event) {
        switchButton("button01");
        Quantities(modData);
      }

    const button02 = document.createElement("button");
    button02.setAttribute("id", "button02");
    button02.textContent = 'חשמל';
    button02.style.borderRadius = "0px"

    button02.onclick = function(event) {
        switchButton("button02");

        Quantities(modData);//---> temporerraly placed this functin here, when we  would have new functions to put we would delete this row!
        // Design(modData); //---> this function activates different graphs
      }

    const button03 = document.createElement("button");
    button03.setAttribute("id", "button03");
    button03.textContent = 'אינסטלציה';
    button03.style.borderRadius = "0px"

    button03.onclick = function(event) {
      switchButton("button03");
      Quantities(modData);//---> temporerraly placed this functin here, when we  would have new functions to put we would delete this row!
      // Manufacture(modData);//---> this function activates different graphs
    }

    const button04 = document.createElement("button");
    button04.setAttribute("id", "button04");
    button04.textContent = 'שטחים';
    button04.style.borderRadius = "0px"

    button04.onclick = function(event) {
      switchButton("button04");
      // Manufacture(modData);//---> this function activates different graphs
    }
    const button05 = document.createElement("button");
    button05.setAttribute("id", "button05");
    button05.textContent = 'חדרים';
    button05.style.borderRadius = "0px"

    button05.onclick = function(event) {
      switchButton("button05");
      // Manufacture(modData);//---> this function activates different graphs
    }
    const button06 = document.createElement("button");
    button06.setAttribute("id", "button06");
    button06.textContent = 'דלתות';
    button06.style.borderRadius = "0px"

    button06.onclick = function(event) {
      switchButton("button06");
      // Manufacture(modData);//---> this function activates different graphs
    }
    const button07 = document.createElement("button");
    button07.setAttribute("id", "button07");
    button07.textContent = 'חיפויים';
    button07.style.borderRadius = "0px"

    button06.onclick = function(event) {
      switchButton("button07");
      // Manufacture(modData);//---> this function activates different graphs
    }
    const button08 = document.createElement("button");
    button08.setAttribute("id", "button08");
    button08.textContent = 'ריצופים';
    button08.style.borderRadius = "0px"

    button08.onclick = function(event) {
      switchButton("button08");
      // Manufacture(modData);//---> this function activates different graphs
    }
    const button09 = document.createElement("button");
    button09.setAttribute("id", "button09");
    button09.textContent = 'FTC';
    button09.style.borderRadius = "0px"

    button09.onclick = function(event) {
      switchButton("button09");
      // Manufacture(modData);//---> this function activates different graphs
    }
    const button10 = document.createElement("button");
    button10.setAttribute("id", "button10");
    button10.textContent = 'רשימת דלתות';
    button10.style.borderRadius = "0px"

    button10.onclick = function(event) {
      switchButton("button10");
      // Manufacture(modData);//---> this function activates different graphs
    }
    const button11 = document.createElement("button");
    button11.setAttribute("id", "button11");
    button11.textContent = 'מחיצות גבס';
    button11.style.borderRadius = "0px"

    button11.onclick = function(event) {
      switchButton("button11");
      // Manufacture(modData);//---> this function activates different graphs
    }

    const button12 = document.createElement("button");
    button12.setAttribute("id", "button12");
    button12.textContent = 'חיפויים';
    button12.style.borderRadius = "0px"

    button12.onclick = function(event) {
      switchButton("button12");
      // Manufacture(modData);//---> this function activates different graphs
    }
    const button13 = document.createElement("button");
    button13.setAttribute("id", "button13");
    button13.textContent = 'תקרות';
    button13.style.borderRadius = "0px"

    button13.onclick = function(event) {
      switchButton("button13");
      // Manufacture(modData);//---> this function activates different graphs
    }

    containerButtons.appendChild(button01);
    containerButtons.appendChild(button02);
    containerButtons.appendChild(button03);
    containerButtons.appendChild(button04);
    containerButtons.appendChild(button05);
    containerButtons.appendChild(button06);
    containerButtons.appendChild(button07);
    containerButtons.appendChild(button08);
    containerButtons.appendChild(button09);
    containerButtons.appendChild(button10);
    containerButtons.appendChild(button11);
    containerButtons.appendChild(button12);
    containerButtons.appendChild(button13);
   

    row04.appendChild(containerButtons);

    newDiv.appendChild(row04);

    // add the newly created element and its content into the DOM
    const currentDiv = document.getElementById("main-container");
    currentDiv.appendChild(newDiv);
  
 
  
  }

  function sectionButton(){
    

  }
function newTable(table_id,parentElement,table_width,table_height){

  const table = document.createElement("table");
  table.setAttribute("id", table_id);
  table.setAttribute("table-layout", "fixed");
  table.classList.add("display");
  table.style.width = table_width; // string percent like this: "25%"
  table.style.height = table_height; // string percent like this: "25%"

  parentElement.appendChild(table);//parentElement is the object that was defined as parent (row or col or div etc...)

}