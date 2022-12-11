import { BaseExtension } from './BaseExtension.js';
import { HistogramPanel } from './HistogramPanel.js';

class HistogramExtension extends BaseExtension {
    constructor(viewer, options) {
        super(viewer, options);
        this._barChartButton = null;
        this._pieChartButton = null;
        this._barChartButton2 = null;//-my button
        this._barChartPanel = null;
        this._pieChartPanel = null;
        this._barChartPanel2 = null;//-my pannel
    }

    async load() {
        super.load();
        await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.5.1/chart.min.js', 'Chart');
        // Chart.defaults.plugins.legend.display = false;
        console.log('HistogramExtension loaded.');
        return true;
    }

    unload() {
        super.unload();
        for (const button of [this._barChartButton, this._pieChartButton,this._barChartButton2]) {
            this.removeToolbarButton(button);
        }
        this._barChartButton = this._pieChartButton =this._barChartButton2= null;
        for (const panel of [this._barChartPanel, this._pieChartPanel,this._barChartPanel2]) {
            panel.setVisible(false);
            panel.uninitialize();
        }
        this._barChartPanel = this._pieChartPanel =this._barChartPanel2= null;
        console.log('HistogramExtension unloaded.');
        return true;
    }

    onToolbarCreated() {
        this._barChartPanel = new HistogramPanel(this, 'dashboard-barchart-panel', 'Property Histogram', { x: 10, y: 10, chartType: 'bar' });
        this._pieChartPanel = new HistogramPanel(this, 'dashboard-piechart-panel', 'Property Histogram', { x: 10, y: 420, chartType: 'doughnut' });
        this._barChartButton = this.createToolbarButton('dashboard-barchart-button', 'https://img.icons8.com/small/32/bar-chart.png', 'Show Property Histogram (Bar Chart)');
        this._barChartButton.onClick = () => {
            this._barChartPanel.setVisible(!this._barChartPanel.isVisible());
            this._barChartButton.setState(this._barChartPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._barChartPanel.isVisible() && this.viewer.model) {
                this._barChartPanel.setModel(this.viewer.model);
            }
        };
        
        this._pieChartButton = this.createToolbarButton('dashboard-piechart-button', 'https://img.icons8.com/small/32/pie-chart.png', 'הצגת גרף כמות [מ"ר] תעלות פח לפי סוג מערכת');
        this._pieChartButton.onClick = () => {
            this._pieChartPanel.setVisible(!this._pieChartPanel.isVisible());
            this._pieChartButton.setState(this._pieChartPanel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._pieChartPanel.isVisible() && this.viewer.model) {
                this._pieChartPanel.setModel(this.viewer.model);
            }
        };
    
    // my sad try--->
    this._barChartPanel2 = new HistogramPanel(this, 'dashboard-barchart-panel-ducts', 'תדהר גמרים- שטחי תעלות לפי קומה', { x: 10, y: 10, chartType: 'bar' });
    this._barChartButton2 = this.createToolbarButton('dashboard-barchart-button-ducts', 'https://img.icons8.com/external-others-pike-picture/30/FFFFFF/external-Duct-conditioning-others-pike-picture.png', 'Show duct Histogram (Bar Chart)');
    this._barChartButton2.onClick = () => {
        this._barChartPanel2.setVisible(!this._barChartPanel2.isVisible());
        this._barChartButton2.setState(this._barChartPanel2.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
        if (this._barChartPanel2.isVisible() && this.viewer.model) {
            this._barChartPanel2.setModel2(this.viewer.model);//---> CHANGE "setModele() TO ANOTHER METHOD FOR THIS CHART
        }
    };

    // my sad try--->
    
    }

    onModelLoaded(model) {
        super.onModelLoaded(model);
        if (this._barChartPanel && this._barChartPanel.isVisible()) {
            this._barChartPanel.setModel(model);
        }
        if (this._pieChartPanel && this._pieChartPanel.isVisible()) {
            this._pieChartPanel.setModel(model);
        }
         // my sad try--->
         if (this._barChartPanel2 && this._barChartPanel2.isVisible()) {
            this._barChartPanel2.setModel2(model);//---> CHANGE "setModele() TO ANOTHER METHOD FOR THIS CHART
        }
        // my sad try--->
    }

    async findPropertyValueOccurrences(model, propertyName) {// this is being called fromupdateChart() method in "HistogramPanel" file to assign the histogram variable
        const dbids = await this.findLeafNodes(model);//finds the id of all the leaf elements in the model
        return new Promise(function (resolve, reject) {
            model.getBulkProperties(dbids, { propFilter: [propertyName] }, function (results) {
                let histogram = new Map();// map==> A Map holds key-value pairs where the keys can be any datatype.(like a dictionarry)
                for (const result of results) {
                    if (result.properties.length > 0) {
                        const key = result.properties[0].displayValue;
                        if (histogram.has(key)) {
                            histogram.get(key).push(result.dbId);
                        } else {
                            histogram.set(key, [result.dbId]);
                        }
                    }
                }
                resolve(histogram);
            }, reject);
        });
    }

    // WRITE ANOTHE FUNCTION THAT WILL RESEMBLE TO "findPropertyValueOccurrences" FOR OUR CHART

    async findDuctAreaValue(model,levelName) {// this is being called fromupdateChart() method in "HistogramPanel" file to assign the histogram variable
        const dbids = await this.findLeafNodes(model);//finds the id of all the leaf elements in the model
        return new Promise(function (resolve, reject) {
            model.getBulkProperties(dbids, { propFilter: ['Category','System Classification','Area','Reference Level','Level'] }, function (results) {
                let histogram = new Map();// map==> A Map holds key-value pairs where the keys can be any datatype.(like a dictionarry)
                let ocurrence_histogram=new Map();
                for (const result of results) {
                    var arr = Array.apply(null, Array(3));//empty array with the right size for property VALUES
               
                    if(result.properties.length>=3){
                        for(var j=0;j<result.properties.length;j++){            
                            //FIND DUCTS BY SYSTEM TYPE - AND THEIR AREA
                            if((result.properties[j].displayCategory=='Identity Data'||result.properties[j].displayCategory=='Constraints'|| result.properties[j].displayCategory=='Dimensions'|| result.properties[j].displayCategory=='Mechanical'
                            || result.properties[j].displayCategory=='__category__' )&& !arr.includes(result.properties[j].attributeName && result.properties[0].displayValue!='Revit Air Terminals')){
                                switch(result.properties[j].attributeName){
                                    case ('System Classification'):
                                        arr.splice(0,1,result.properties[j].displayValue);//array of system class
                                        break
                                    case ('Area'):
                                        arr.splice(1,1,result.properties[j].displayValue);//array of area
                                        break
                                    case ('Reference Level'):
                                        if(result.properties[j].displayValue==levelName){
                                            arr.splice(2,1,result.properties[j].displayValue);//array of levels
                                        }
                                        break
                                }
                                   
                               
                            // FIND ONLY REVIT AIR TERMINALS - AND THEIR OCCURANCE
                            }else if(result.properties[0].displayValue=='Revit Air Terminals'){
                                arr.splice(0,1,result.properties[0].displayValue);
                                arr.splice(1,1,1);//one unit for each instance
                                arr.splice(2,1,result.properties[2].displayValue);//level
                            }
                        
                        };
                        if (arr.length >= 3 && !arr.includes("")&& !arr.includes(undefined) && arr[2]==levelName) {
                            // if we are inserting an air terminal - use the [0] index to grab its name. else - use the [1] 
                            const key = result.properties[0].displayValue=='Revit Air Terminals'?result.properties[0].displayValue:result.properties[1].displayValue;
                            if (histogram.has(key)) {
                                histogram.set(key,histogram.get(key)+arr[1]);//the sum of area
                                ocurrence_histogram.get(key).push(result.dbId);// the ids of all the elements
                            } else {
                                histogram.set(key, arr[1]);
                                ocurrence_histogram.set(key, [result.dbId]);
                            }
                        }
                    }
                    
                }


                resolve([histogram,ocurrence_histogram]);
            }, reject);
        });
    }






    async findLevels(model, propertyName) {// FINDING THE LEVELS FOR THE DROPDOWN-->this is being called fromupdateChart() method in "HistogramPanel" file to assign the histogram variable
        const dbids = await this.findLeafNodes(model);//finds the id of all the leaf elements in the model
        return new Promise(function (resolve, reject) {
            model.getBulkProperties(dbids, { propFilter: [propertyName] }, function (modelProperties) {
                let levelNames = [];// 
                for (const modelProperty of modelProperties) {
                    if ((modelProperty.properties[0].displayCategory=='Constraints' || modelProperty.properties[0].displayCategory=='Identity Data') && !levelNames.includes(modelProperty.properties[0].displayValue)) {
                        levelNames.push(modelProperty.properties[0].displayValue)
                    }
                }
                resolve(levelNames);
            }, reject);
        });
    }


    //end of mine

}

Autodesk.Viewing.theExtensionManager.registerExtension('HistogramExtension', HistogramExtension);