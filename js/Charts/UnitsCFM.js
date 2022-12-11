function createCFM_BarChart(name, title, input){
    //input is: object.Element.mechanical
    //input is: [HVAC_Unit,level,count,flow,id]
    //sort by level
    var _this = this;
    var units_cfm=[];
    var x_axis=[];// floors
    var sum_cfm=0;
    var id_cfm=[];// array of arrays
    var floorId=[];// local array for each floor 
    var y_axis=[];//sum of cfm for each floor sum id
    input.map(p=>units_cfm.push([p[1],p[3]*p[2],p[4]]));// the CFM value for each unit IN A FLOOR
    units_cfm.shift()//cut the first headers row
    units_cfm.pop();//remove the last element of sums
    units_cfm.sort(sortFunction);//sort by level
    for( var i=1;i<units_cfm.length;i++){
        if(units_cfm[i][0]==units_cfm[i-1][0]){// if the level is the same level  
            if(!isNaN(units_cfm[i-1][1]))
            {
                sum_cfm+=units_cfm[i-1][1]// CHECCK IF THE FLOW PARAMETR IS INDEED A NUMBER
                floorId=floorId.concat(units_cfm[i-1][2])
            }
              
        }else{
            x_axis.push(units_cfm[i-1][0]);
            y_axis.push(sum_cfm);
            sum_cfm=0;
            id_cfm.push(floorId);
            floorId=[];
        }
    }

    if(sum_cfm!=0)// if it has value==> there are no different level names
    {   !isNaN(units_cfm[units_cfm.length-1][1])?sum_cfm+=units_cfm[units_cfm.length-1][1]:sum_cfm+=0;
        x_axis.push(units_cfm[0][0]);
        y_axis.push(sum_cfm);
        floorId=floorId.concat(units_cfm[units_cfm.length-1][2]);
        id_cfm.push(floorId);
    }
    var ctx = document.getElementById(name);

    var data = {
        labels: x_axis,//try histogram  keys?
        datasets: [
            {
            label:'CFM:',
            data: y_axis,//try  histogram values
            backgroundColor: DashBoardColors.background.slice(0, x_axis.length),// GENERATE AS MUCH COLOR AS THERE IS IN THE X AXIS length
            borderColor: DashBoardColors.background.slice(0, x_axis.length),//"" " """
            borderWidth: 1,
            order:1
            },
            {
            label:'CFM line:',
            data: y_axis,//try  histogram values
            borderColor: DashBoardColors.background.slice(0, x_axis.length),//"" " """
            type:'line',
            order:0
            }
    ]
    };

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        display: true
                    },            
                }],
                yAxes: [{
                    gridLines: {
                        display:true
                    },
                }]
            },
            title: {
                display: true,
                text: title
            },
            legend: {
                display: false
            },
            'onClick': function (evt, items) {
                // GraphOnClick(input.elements, _this, item);
                
                if (items.length ===2) {
                    const index = items[0]._index;
                    const dbids = id_cfm[index];
                    const red =  new THREE.Color(1,0,0);
                    _this.viewer.clearSelection();
                    _this.viewer.setSelectionColor(red,Autodesk.Viewing.SelectionType.OVERLAYED );
                    _this.viewer.select(dbids);
                    _this.viewer.isolate(dbids);
                    _this.viewer.fitToView(dbids);
                }
            },
        },
    });
}

//sort by column 1 -> level
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

