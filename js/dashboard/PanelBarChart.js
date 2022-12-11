// a class for the Bar CHART
class BarChart extends DashboardPanelChart {
    constructor(property) {
        super();
        this.propertyToUse = property;
    }
//load method for the extended class ( DashboardPanelChart )
    load(parentDivId, viewer, modelData) {
        if (!super.load(parentDivId, this.constructor.name, viewer, modelData)) return;
        this.drawChart();
    }

    drawChart() {//here we create the new instance of the chart object from the chart js librery
        var _this = this; // need this for the onClick event

        var ctx = document.getElementById(this.canvasId).getContext('2d');
        var colors = this.generateColors(this.modelData.getLabels(this.propertyToUse).length);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.modelData.getLabels(this.propertyToUse),// inlables we use the modelDeta class( That we wrote in the DashboardPanel.js file  )and use the property 
                //.getLabelst() that returns a list of the keys for an object property. for example: 
                // we have a material property, it contains a list of keys (concrete,wood,glass) and we will use this different keys as the lables. 
                datasets: [{//the actual dataset -->where we count the objects,keys etc..
                    data: this.modelData.getCountInstances(this.propertyToUse),
                    backgroundColor: colors.background,
                    borderColor: colors.borders,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: {
                    display: false
                },
                'onClick': function (evt, item) {/// we are using a viewer api property to  isolate the 
                    _this.viewer.isolate(_this.modelData.getIds(_this.propertyToUse, item[0]._model.label));
                    //base on the property that we are showing the bars for ( Materials as we defined), get a specific value (which is a material name - concrete,wood etc..) that we get from the label 
                   // get the id of all those materials with this property and isolate them 
                }
            }
        });
    }
}
