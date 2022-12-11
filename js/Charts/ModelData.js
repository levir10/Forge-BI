function getListCategories (elements, _callback){
 
  var cateElem = [];
  var object = {}
  var levNam =[];
  object["Elements"] = []
  // object["Elements"]["Areas"] = []// area of element if it has value
  // object["Elements"]["Reference_Level"] = []// reference Level of element if it has value
  // object["Elements"]["SystemClassification"] = []// reference Level of element if it has value
  object["quantities"] = {};
  object["quantities"]["elements"] = {};
  object["quantities"]["Family"] = [];

  var nonRenderingCategories = ["Revit ","Revit <Sketch>","Revit <Room Separation>", "Revit <Space Separation>", "Revit <Stair/Ramp Sketch: Boundary>",
  "Revit <Stair/Ramp Sketch: Landing Center>","Revit <Stair/Ramp Sketch: Riser>","Revit <Stair/Ramp Sketch: Run>","Revit Air Terminal Tags","Revit Analytical Columns",
  "Revit Analytical Nodes", "Revit Automatic Sketch Dimensions", "Revit Building Type Settings", "Revit Category", "Revit Center Line", "Revit Duct Systems",
  "Revit Duct Tags", "Revit Family Type", "Revit Cameras", "Revit Center line","Revit Constraints","Revit Curtain Wall Grids","Revit Zone Tags", "Revit Work Plane Grid",
  "Revit Wires", "Revit Wire Tags", "Revit Viewports", "Revit View", "Revit Title Blocks", "Revit Text Notes", "Revit Survey Point", "Revit Sun Path", "Revit Structural Load Cases",
  "Revit Spot Elevation Symbols", "Revit Spaces", "Revit Space Type Settings", "Revit Space Tags", "Revit Shared Site", "Revit Section Boxes", "Revit Schedules", "Revit Schedule Graphics",
  "Revit Revision", "Revit Reference Planes", "Revit Project Information", "Revit Project Base Point", "Revit Primary Contours", "Revit Piping Systems", "Revit Pipe Tags",
  "Revit Area Schemes", "Revit Color Fill Legends", "Revit Color Fill Schema", "Revit Conduit Runs", "Revit Detail Items", "Revit Dimensions","Revit Document","Revit Electrical Circuits",
  "Revit Electrical Demand Factor Definitions", "Revit Electrical Equipment Tags", "Revit Electrical Load Classification Parameter Element", "Revit Electrical Load Classifications",
  "Revit Elevations","Revit Family Name","Revit Generic Annotations", "Revit Grids", "Revit Group", "Revit HVAC Load Schedules", "Revit HVAC Zones", "Revit Legend",
  "Revit Legend Components", "Revit Level", "Revit Lighting Fixture Tags", "Revit Lines", "Revit Mass","Revit Matchline","Revit Material Assets","Revit Materials",
  "Revit Mechanical Equipment Tags", "Revit Panel Schedule Templates - Branch Panel", "Revit Panel Schedule Templates - Data Panel", "Revit Panel Schedule Templates - Switchboard",
  "Revit Phases","Revit Sheet","Revit Views","Revit Rooms","Revit Analytical Walls","Revit Gutters","Revit Railing Rail Path Extension Lines","Revit Rectangular Straight Wall Opening",
  "Revit Spot Elevations","Return Air","Supply Air","Sanitary","Other"
 ];
  
   for(var i=0; i<elements.length; i++){
    
    
       temString = String(elements[i].properties[0].displayValue);
       if(temString != "" && !nonRenderingCategories.includes(temString))
       {          
          object["Elements"].push(elements[i].dbId)
          object["quantities"]["Family"].push(temString);

          if(typeof object["quantities"]["elements"][temString] == 'undefined' ) 
          {
            object["quantities"]["elements"][temString] = []; 
          }
           object["quantities"]["elements"][temString].push(elements[i].dbId)
        }
       
   }

  
   _callback(object);//this callback is an object that contains this 2 properties: 
   //1) object.quantities ( which contains 2 lists: elements IDs and category names) for example: object.quantities.Family[0]=='Revit Internal Origin'.  and: object.quantities.elements['Revit Internal Origin']==[1207]
   //2)object.Elements (which contains a list of elements IDs)
}

function getProps(elements,levelName,property){
  let duct_histogram = new Map();//FOR DUCTS
  let duct_ocurrence_histogram = new Map();//FOR DUCTS
  let pipe_histogram = new Map();//FOR PIPES
  let pipe_ocurrence_histogram = new Map();//FOR PIPES
  const grill_histogram = Array(1).fill(Array(5).fill(0));// instance array for each instance of grill in the model
  const mechanical_instance_array = Array(1).fill(Array(5).fill(0));// instance array for each instance of mechanical equipment in the model
  const mechanical_final_array = Array(1).fill(Array(5).fill(0));//amounts array for each mechanical type
  const totalLevelArea = Array(1).fill(Array(2).fill(0)); //array of level areas [level,total area]
  for(const element of elements ){
    var arr = Array.apply(null, Array(3));//empty array with the right size for property VALUES
    if(element.properties.length>=3){
      for(var j=0;j<element.properties.length;j++){
        //FIND DUCTS BY SYSTEM TYPE - AND THEIR AREA                   
        if((element.properties[j].displayCategory=='Identity Data'||element.properties[j].displayCategory=='Constraints'|| element.properties[j].displayCategory=='Dimensions'|| element.properties[j].displayCategory=='Mechanical'
          || element.properties[j].displayCategory=='__category__' )&& (element.properties[0].displayValue=="Revit Ducts" || element.properties[0].displayValue=="Revit Pipes")){
              switch(element.properties[j].attributeName){
                 
                  case ('System Type'):
                      arr.splice(0,1,element.properties[j].displayValue);//array of system class
                      break
                  case ('Area'):
                    if(element.properties[0].displayValue=="Revit Pipes"){
                          arr.splice(1,1,element.properties.find(p => (p.displayName=="Length"))?.displayValue);//array of length
                        }else{
                          arr.splice(1,1,element.properties[j].displayValue);//array of area
                        }
                      break
                  case ('Reference Level'):
                      if(element.properties[j].displayValue==levelName || levelName=="Select All Levels"){
                          arr.splice(2,1,element.properties[j].displayValue);//array of levels
                      }
                      break
              }

              
          // FIND ONLY REVIT AIR TERMINALS - AND THEIR OCCURANCE
        // }else if(element.properties[0].displayValue=='Revit Air Terminals'){
        }else if((((element.properties.find(p => (p.displayName.includes("Level") && p.displayCategory ==='Constraints')))?.displayValue==levelName || levelName=="Select All Levels" ) && element.properties[0].displayValue=='Revit Air Terminals')){
            //explain this if: if the properties includes level property ,from "constraints" category, AND  also is revit terminal
            arr.splice(0,1,element.properties[0].displayValue);
            arr.splice(1,1,1);//one unit for each instance
            arr.splice(2,1,element.properties.find(p => (p.displayName.includes("Level") && p.displayCategory ==='Constraints'))?.displayValue);//level
            
            // data for the grid table of grills
            if(element.properties.find(p => (p.displayName=="Type Name"))?.displayValue!=undefined && element.properties[0].displayValue=='Revit Air Terminals' ){
                  const unit = 1;// unit count 
                  const size = element.properties.find(p => (p.displayName=="Size"))?.displayValue!=undefined?element.properties.find(p => (p.displayName=="Size"))?.displayValue:"Not Defined";// size property
                  const type = element.properties.find(p => (p.displayName=="Type Name"))?.displayValue!=undefined?element.properties.find(p => (p.displayName=="Type Name"))?.displayValue:"Not Defined";//Type name 
                  const level = element.properties.find(p => (p.displayName.includes("Level") && p.displayCategory ==='Constraints'))?.displayValue?element.properties.find(p => (p.displayName.includes("Level") && p.displayCategory ==='Constraints'))?.displayValue:"Not Defined";// level
                  const id = element.dbId;//ID
                
                  grill_histogram.push([size,type,level,unit,id]);
              
            }
            break;            
        }//mechanical equipment table
        else if(element.properties.find(p => (p.displayName=="Type Name"))?.displayValue!=undefined && element.properties[0].displayValue=='Revit Mechanical Equipment' ){

          if((element.properties.find(p => (p.displayName.includes("Level") && p.displayCategory ==='Constraints')))?.displayValue==levelName || levelName=="Select All Levels" ){

              const mechanical_unit = 1;// unit count 
              const mechanical_type = element.properties.find(p => (p.displayName=="Type Name"))?.displayValue!=undefined?element.properties.find(p => (p.displayName=="Type Name"))?.displayValue:"Not Defined";//Type name 
              const mechanical_level = element.properties.find(p => (p.displayName.includes("Level") && p.displayCategory ==='Constraints'))?.displayValue?element.properties.find(p => (p.displayName.includes("Level") && p.displayCategory ==='Constraints'))?.displayValue:"Not Defined";// level
              const mechanical_id = element.dbId;//ID
              const mechanical_prop =element.properties.find(p => (p.displayName==property))?.displayValue!=undefined?element.properties.find(p => (p.displayName==property))?.displayValue:"Not Defined";//Type name 
              mechanical_instance_array.push([mechanical_type,mechanical_level,mechanical_unit,mechanical_id,mechanical_prop]);
              
          
          }
         
            break;
        }// נוסף בתאריך 29.11.22
        else if(element.properties.find(p => (p.displayName=="Category"))?.displayValue.includes('Revit Area') && element.properties.find(p => (p.displayName=="Area"))!=undefined && element.properties.find(p => (p.displayCategory=="Constraints")).displayValue!=''){
          console.log(element.properties.find(p => (p.displayName=="Category"))?.displayValue);
          console.log(element.properties.find(p => (p.displayName=="Area")).displayValue);
          console.log(element.properties.find(p => (p.displayName=="Level") && (p.displayCategory=="Constraints")).displayValue);
          if((element.properties.find(p => (p.displayName.includes("Level") && p.displayCategory ==='Constraints')))?.displayValue==levelName || levelName=="Select All Levels" ){
              const areaLevel = element.properties.find(p => (p.displayName=="Level") && (p.displayCategory=="Constraints")).displayValue;
              const areaType = element.properties.find(p => (p.displayName=="Category"))?.displayValue;
              const areaPart = element.properties.find(p => (p.displayName=="Area")).displayValue;
              const areaUnit = 1;
              const areaElementId = element.dbId;
              totalLevelArea.push([areaType,areaLevel,areaUnit,areaElementId,areaPart]);
          }
          // צריך לייצר מטריצה שלוקחת לכל שורה שטח של קומה ע"י סכימה של כלל השטחים של הקומה הנ"ל

          break;
        }// נוסף בתאריך 29.11.22

      };
      if(element.properties.find(p => (p.displayValue=="Revit Pipes"))?.displayValue=="Revit Pipes"){
        histogramMaker(arr,element,levelName,pipe_histogram,pipe_ocurrence_histogram);
      }else{
        histogramMaker(arr,element,levelName,duct_histogram,duct_ocurrence_histogram);
      }

    }
  }                
  
   var final_grill_arr=instanceToSum(grill_histogram,["Grill Size","Type","Level","Count","ID"],4,5,"grills");// make instances array to sum of types
   var final_area = instanceToSum(totalLevelArea,["Area Type","Level","Area's Amount","Area","ID"],3,5,"area");
   var final_mechanical_arr=instanceToSum(mechanical_instance_array,["HVAC Unit","Level","Count","Flow","ID"],3,5,"mechanical");// make instances array to sum of types
  
   // add last row with the sum of a desired  parameter
   var sumOfFlow=sumOfParameter(final_mechanical_arr,3);// 3 IS THE INDEX OF THE "Flow"  (sums how many cfm IS THERE)
   var sumOfUnits=sumOfParameter(final_mechanical_arr,2);// 2 IS THE INDEX OF THE "COUNT"  (sums how many units are there)
   var sumOfAreas = sumOfParameter(final_area,3)// 3 IS THE INDEX OF THE "AREA"  (sums how many area)
   final_mechanical_arr.push(["Units count:",sumOfUnits,"Sum of flow:",sumOfFlow,""]);
   final_area.push(["Area count:",sumOfAreas,"","",""]);
   var sumOfGrills=sumOfParameter(final_grill_arr,3);
   final_grill_arr.push(["Sum Of grills:","","",sumOfGrills,""]);
 
  return([duct_histogram,duct_ocurrence_histogram,final_grill_arr,final_mechanical_arr,pipe_histogram,pipe_ocurrence_histogram,final_area]);
  // return([histogram,ocurrence_histogram]);
}

//returns the histogram for the pipes or ducts 
function histogramMaker(arr,element,levelName,histogram,ocurrence_histogram){
 
  if (arr.length == 3 && !arr.includes("")&& !arr.includes(undefined) && (arr[2]==levelName || levelName=="Select All Levels")) {
    // if we are inserting an air terminal - use the [0] index to grab its name. else - use the [1] 
    const key = arr[0];
    if (histogram.has(key)) {
        histogram.set(key,histogram.get(key)+arr[1]);//the sum of area
        ocurrence_histogram.get(key).push(element.dbId);// the ids of all the elements
    } else {
        histogram.set(key, arr[1]);
        ocurrence_histogram.set(key, [element.dbId]);
    }
  }
}

//returns final array - headers should be the size of the columns amount. array needs to be at least in the size of 3
function instanceToSum(array,headers,id_index,arrSize,chart_purpose){
    array.shift();
    var final_arr= Array(1).fill(Array(arrSize).fill(0));
    var units_count=0;//represents the number of unitsof grills
    var IdArray=[];// list of id for each grill
    var finalArr=[];
    var areas=0;
    array.sort();
    for(var i=1; i<array.length;i++){
      //check if the i and the (i-1) elements in the SORTED ARRAY are the same. if so: add 1 unit to the count. if not: make new final array row
      
      if(array[i][0]==array[i-1][0] && array[i][1]==array[i-1][1] && i!=array.length-1){// if type and level is the same then :
        if(i==1)
        {
          units_count+=2;
          IdArray.push(array[i][id_index]);
          IdArray.push(array[i-1][id_index]);
          chart_purpose=="area"? areas+=array[i-1][4]+array[i][4]:areas+=0;
          

        }else{
          units_count+=1;
          IdArray.push(array[i][id_index]);
          chart_purpose=="area"? areas+=array[i][4]:areas+=0;

        }
        
      }else{// if the current type or level is not equal to the former, it is a new one. or if we are  in the last iteration
        //close the former collection (of (i-1) index)
        if(array[i][0]==array[i-1][0] && array[i][1]==array[i-1][1] && i==array.length-1)// we are at the last iteration, and the level and type are the same
        {
          units_count+=1;
          IdArray.push(array[i][id_index]);
          chart_purpose=="area"? areas+=array[i][4]:areas+=0;
        }
        chart_purpose=="area"? array[i-1][4]=areas:0;
        areas=0;
        chart_purpose=="grills"?final_arr.push([array[i-1][0],array[i-1][1],array[i-1][2],units_count,IdArray]):final_arr.push([array[i-1][0],array[i-1][1],units_count,array[i-1][4],IdArray]);
        units_count=1;// start new count for the new index
        IdArray=[array[i][id_index]];// start new collection of dbIds
      }
    }

    //remove first array of [0,0,0,0,] from array 
    final_arr.shift();
    final_arr.unshift(headers);// add first row with names for the dataTable
    return final_arr;
    
}

function sumOfParameter(array,index){
  //array is the 2d array you want to sum one of its columns
  //index is the column array
  var sumParameter = 0;
  var countUnits = 1;
  for(var i=1; i<array.length;i++)
   {
    if(!isNaN(array[i][index])){// IF IT IS A NUMBER- ADD IT TO THE SUM
    isNaN(array[i][index-1])?countUnits=1:countUnits=array[i][index-1];// if it is the units table(thus the "count" column is a number) give its value to countUnits parameter
    array[0][0]=="HVAC Unit"?sumParameter+=array[i][index]*countUnits:sumParameter+=array[i][index];
    }
  }
   return parseFloat(sumParameter.toFixed(2));
}

async function arraySimplify(elements,levelName,property,obj, _callback){//-->obj is an object that contains what i explaind above, and _callback has come here from powerBI report and contains the data about
  // modData.quantities = object.quantities, and modData.Elements = object.Elements and that modData["Load"] =="Done"]etc..
  var arr = obj["quantities"]["Family"];// this is a list of categories in the project by name
  const histo = getProps(elements,levelName,property);
  // console.log(histo);
  // console.log(histo.keys);
  arr.sort();//sort by category names ( list of sorted category names, FOR EACH INSTANCE OF ELEMENT IN THE MODEL!)
  var object = obj, element =arr[0] ,count = 0 ; 
  var rsltel = [];//revit list of category names in the project ( ['Revit Air Terminals', 'Revit Ceilings', 'Revit Curtain Panels', ...])
  var rsltcount = [];//ocurenaces od each instance from this category ([21, 1, 139, 124, 1, 6,....])
  const ductSystemNames = Array.from(histo[0].keys());//names of duct system types - [ 'Supply Air','Return Air',...]
  const ductValueArraysForSystemNames = ductSystemNames.map(val => histo[0].get(val));// sum of duct area for each system name[100,45.3524,4564]
  var ductIdArrayOfElements=Array.from(ductSystemNames.map(val => histo[1].get(val)));// array of arrays of the id for each system type
  const pipeSystemNames = Array.from(histo[4].keys());//names of pipe system types - [ 'Supply Air','Return Air',...]
  const pipeValueArraysForSystemNames = pipeSystemNames.map(val => histo[4].get(val)/100);// sum of pipe area for each system name[100,45.3524,4564]
  var pipeIdArrayOfElements=Array.from(pipeSystemNames.map(val => histo[5].get(val)));// array of arrays of the id for each system type
 
  // create workable arrays from histograms ( pipes and ducts) 
  var pipes = [];
  pipes.push(pipeSystemNames);
  pipes.push(pipeValueArraysForSystemNames);
  var ducts =[];
  ducts.push(ductSystemNames);
  ducts.push(ductValueArraysForSystemNames);

  var idList=[];
  var grills = histo[2];// got this array from "grtProps" Method and move it to modData object in the forgeViewer file, in onGeometryLoaded
  var mechanical = histo[3];
  var areaArray = histo[6];
  // define variables to compute the HVAC units cost factors array:
  var CostFactors =Array(1).fill(["CFM/m²","Avg[CFM Cost]","Avg[CFM/Unit]","Avg[Units Cost]"]);
  CostFactors.push(calculateHvacCostFactors(mechanical,areaArray));
   // define variables to compute the duct cost factors array:
  CostFactors.push(["Pipes Length/m²","Pipe Length","Avg[Pipe Cost]",""]);
  CostFactors.push(calculatePipeCostFactors(pipes,areaArray));
   // define variables to compute the HVAC ducts  cost factors array:
  CostFactors.push(["Ducts Area/m²","Ducts Area","Avg[Ducts Cost]",""]);
  CostFactors.push(calculateDuctsCostFactors(ducts,areaArray));
  // define variables to compute the grills cost factors array:
  CostFactors.push(["Grills/m²","Grills Count","Avg[Grills Cost]",""]);
  CostFactors.push(calculateGrillsCostFactors(grills,areaArray));
  var costs =Array(1).fill(["Ducts","Pipes","Units","Grills"]);
  // costs.push([parseFloat(CostFactors[5][2]),parseFloat(CostFactors[3][2]),parseFloat( CostFactors[1][3]),parseFloat( CostFactors[7][2])]);
  costs.push([parseFloat(CostFactors[5][2].slice(0,-3).replaceAll(",", "")),parseFloat(CostFactors[3][2].slice(0,-3).replaceAll(",", "")),parseFloat( CostFactors[1][3].slice(0,-3).replaceAll(",", "")),parseFloat( CostFactors[7][2].slice(0,-3).replaceAll(",", ""))]);
  // var hvacCostFactors = [mechanical[mechanical.length-1][3]/
  if(elements.length===0) return;

  for(var i = 0;i<ductValueArraysForSystemNames.length-1;i++){
    for(var j=0;j<ductIdArrayOfElements[i].length-1;j++){
      idList.push(ductIdArrayOfElements[i][j]);
    }
  };
  for(var i = 0;i<pipeValueArraysForSystemNames.length-1;i++){
    for(var j=0;j<pipeIdArrayOfElements[i].length-1;j++){
      idList.push(pipeIdArrayOfElements[i][j]);
    }
  };
  
  object["quantities"]["labels"] = ductSystemNames;//revit list of category names in the project ( ['Revit Air Terminals', 'Revit Ceilings', 'Revit Curtain Panels', ...])
  object["quantities"]['Family'] = ductSystemNames;//revit list of category names in the project ( ['Revit Air Terminals', 'Revit Ceilings', 'Revit Curtain Panels', ...])
  object["quantities"]['data'] = ductValueArraysForSystemNames;//ocurenaces od each instance from this category ([21, 1, 139, 124, 1, 6,....])
  object["quantities"]['elements'] = ductIdArrayOfElements;// array of arrays

  object['Elements']=idList;
  object['Elements']['sorted']=pipeIdArrayOfElements;
  object['Elements']['grills']=grills;
  object['Elements']['mechanical']=mechanical;
  object['Elements']['areas']=areaArray;
  object['Elements']['costs']=CostFactors;
  object['Elements']["pipe_names"] = pipeSystemNames;//revit list of category names in the project ( ['Revit Air Terminals', 'Revit Ceilings', 'Revit Curtain Panels', ...])
  object['Elements']["pipe_data"] = pipeValueArraysForSystemNames;//ocurenaces od each instance from this category ([21, 1, 139, 124, 1, 6,....])
  object['Elements']["pipe_elements"] = pipeIdArrayOfElements;// array of arrays
  object['Elements']["costs"] = costs;// array of arrays
  object['Elements']["cost_factors"] = CostFactors;// array of arrays
  
  console.log("Quantities Data Loaded");

  _callback(object);

  
}
//calculate units cost factors for the summery datatable 
function calculateHvacCostFactors(mechanical,areaArray){

  var totalFloorCfm = isNaN(mechanical[mechanical.length-1][3])?0:mechanical[mechanical.length-1][3]; // if the total  CFM is not a number, it will be ZERO
  var totalFloorArea = isNaN(areaArray[areaArray.length-1][1])?1:areaArray[areaArray.length-1][1];// if the total  area is not a number, it will be 1 (in order to not create error of 0/0)
  var numberOfUnits = (mechanical[mechanical.length-1][1]==0 || isNaN(mechanical[mechanical.length-1][1]))?1:mechanical[mechanical.length-1][1]; // if the total units is not a number or zero , it will be 1 to prevent 0/0
  
  var cfm_per_m=(totalFloorCfm/totalFloorArea).toFixed(2);
  var cfm_avg_cost =( 11.6385498992717- (totalFloorCfm/numberOfUnits)*0.00342379513404618).toFixed(2);
  var avg_amount_per_unit = (totalFloorCfm/numberOfUnits).toFixed(2);
  var avg_cost_all_units=(cfm_avg_cost*totalFloorCfm).toFixed(2);
  
  // return [cfm_per_m +"[cfm/m²]",numberWithCommas(cfm_avg_cost) + "[₪/cfm]",avg_amount_per_unit + "[cfm]",(avg_cost_all_units)];
  return [cfm_per_m +"[cfm/m²]",numberWithCommas(cfm_avg_cost) + "[₪/cfm]",avg_amount_per_unit + "[cfm]",numberWithCommas(avg_cost_all_units) + "[₪]"];

}
//calculate pipes cost factors for the summery datatable
function calculatePipeCostFactors(pipes,areaArray){
  var sumOFPipesLength=0;
  pipes[1].map(p=>sumOFPipesLength+=p);// sum of pipes length
  var totalFloorArea = isNaN(areaArray[areaArray.length-1][1])?1:areaArray[areaArray.length-1][1];// if the total  area is not a number, it will be 1 (in order to not create error of 0/0)
  var pipe_per_m = sumOFPipesLength/totalFloorArea;// length of pipe for project area
  var pipe_avg_cost = (sumOFPipesLength*350).toFixed(2);
  // return [pipe_per_m.toFixed(2)+"[1/m]",sumOFPipesLength.toFixed(2)+"[m]",(pipe_avg_cost),""];
  return [pipe_per_m.toFixed(2)+"[1/m]",sumOFPipesLength.toFixed(2)+"[m]",numberWithCommas(pipe_avg_cost) + "[₪]",""];
}
//calculate ducts cost factors for the summery datatable
function calculateDuctsCostFactors(ducts,areaArray){
  var sumOFDuctsArea=0;
  ducts[1].map(p=>sumOFDuctsArea+=p);// sum of pipes length
  var totalFloorArea = isNaN(areaArray[areaArray.length-1][1])?1:areaArray[areaArray.length-1][1];// if the total  area is not a number, it will be 1 (in order to not create error of 0/0)
  var duct_per_m = sumOFDuctsArea/totalFloorArea;// length of pipe for project area
  var duct_avg_cost = (sumOFDuctsArea*200).toFixed(2);
  // return [duct_per_m.toFixed(2)+"[-]",sumOFDuctsArea.toFixed(2)+"[m]",(duct_avg_cost),""];
  return [duct_per_m.toFixed(2)+"[-]",sumOFDuctsArea.toFixed(2)+"[m]",numberWithCommas(duct_avg_cost) + "[₪]",""];
}
//calculate grills cost factors for the summery datatable
function calculateGrillsCostFactors(grills,areaArray){
  var numberOfGrills = (grills[grills.length-1][3]==0 || isNaN(grills[grills.length-1][3]))?1:grills[grills.length-1][3]; // if the total units is not a number or zero , it will be 1 to prevent 0/0
  var totalFloorArea = isNaN(areaArray[areaArray.length-1][1])?1:areaArray[areaArray.length-1][1];// if the total  area is not a number, it will be 1 (in order to not create error of 0/0)
  var grill_per_m = numberOfGrills/totalFloorArea;// length of pipe for project area
  var grill_avg_cost = (numberOfGrills*2000).toFixed(2);
  // return [grill_per_m.toFixed(2)+"[1/m²]",numberOfGrills+"[-]",(grill_avg_cost) ,""];
  return [grill_per_m.toFixed(2)+"[1/m²]",numberOfGrills+"[-]",numberWithCommas(grill_avg_cost) + "[₪]",""];
}
// formatting function : format as a price
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
} 




//29.10.22
//find level names
function FindLevelNames(elements){
  var levelNames=[];
  for(var i=0; i<elements.length; i++){
    for(var j=0;j<elements[i].properties.length;j++){
      //FIND LEVELS                  
      if((elements[i].properties[j].displayCategory=='Constraints')&& (!levelNames.includes(elements[i].properties[j].displayValue))&& 
      (elements[i].properties[j].attributeName=='Reference Level' || elements[i].properties[j].attributeName=='Level' ) && (elements[i].properties[j].displayValue!="" && elements[i].properties[j].displayValue!="None")){
      levelNames.push(elements[i].properties[j].displayValue);     
      }
      // console.log("the list of level names is: " + levelNames);

    };
    
  }
  levelNames.push("Select All Levels");// adds the option of selecting all of the levels

  return levelNames;
}


 function onChangeLevel(levelName,property){

    console.log("Geometry Updated");
    return new Promise((resolve, reject) => {
      viewer.search(
        "",
        function (dbIds) {
          viewer.model.getBulkProperties(
            dbIds,
            // ["Category"],
           {propFilter:["Category","System Classification",'System Type',"Area","Reference Level",'Level','Type Name','Size',property,'Length']},
            function (elements) {
              getListCategories(elements, function (cateElem) {
                arraySimplify(elements,levelName,property,cateElem, function (object) {
                  modData.quantities = object.quantities;
                  modData.Elements = object.Elements;

                  modData["Load"] = "Done";
                  // showPowerBIReport();
                });
              });
            }
          );
        },
        null,
        ["Comments"]
      );
      
      DashBoardColors = generateColorsRandom();
  
      resolve(modData);

    });
    
  }
//29.10.22
