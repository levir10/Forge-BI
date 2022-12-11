    function createBarChart(name, title, input){
    var _this = this;
    var ctx = document.getElementById(name);
    var dataToolTips = [];
    // input.data!=undefined?input.data.map(p=>dataToolTips.push(p.toFixed(2))):0;
    var myLabels = input['pipe_names']!=undefined?input['pipe_names']:input.labels;//labels (names of columns)
    var myData = input['pipe_data']!=undefined?input['pipe_data'].map(p=>dataToolTips.push(p.toFixed(2))):input.data.map(p=>dataToolTips.push(p.toFixed(2)));// y values for each label (numbers)
    var id_elements = input.elements!=undefined?input.elements:input["pipe_elements"];
    var data = {
        labels: myLabels,//try histogram  keys?
        datasets: [{
            label:'Amount:',
            data: dataToolTips,//try  histogram values
            backgroundColor: DashBoardColors.background.slice(0, myData.length),// histogram length
            borderColor: DashBoardColors.background.slice(0, myData.length),//"" " """
            borderWidth: 1
            
        }]
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
                
                if (items.length === 1) {
                    const index = items[0]._index;
                    const dbids = id_elements[index];
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

