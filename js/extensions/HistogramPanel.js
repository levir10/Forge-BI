
export class HistogramPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        super(extension.viewer.container, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 650) + 'px';
        this.container.style.height = (options.height || 550) + 'px';
        this.container.style.resize = 'none';
        this.chartType = options.chartType || 'bar'; // See https://www.chartjs.org/docs/latest for all the supported types of charts
        this.chart = this.createChart();
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.initializeMoveHandlers(this.title);
        this.container.appendChild(this.title);
        this.content = document.createElement('div');
        this.content.style.height = '550px';
        this.content.style.height = '650px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `
            <div class="props-container" style="position: relative; height: 25px; padding: 0.5em;">
                <select class="props"></select>
            </div>
            <div class="chart-container" style="position: relative; height: 325px; padding: 0.5em;">
                <canvas class="chart"></canvas>
            </div>
        `;
        this.select = this.content.querySelector('select.props');
        this.canvas = this.content.querySelector('canvas.chart');
        this.container.appendChild(this.content);
    }

    createChart() {
        return new Chart(this.canvas.getContext('2d'), {
            type: this.chartType,
            data: {
                labels: [],
                datasets: [{ data: [], backgroundColor: [], borderColor: [], borderWidth: 1 }],
            },
            options: { maintainAspectRatio: false }
        });
    }
    findLeafNodes(model) {
        return new Promise(function (resolve, reject) {
            model.getObjectTree(function (tree) {
                let leaves = [];
                tree.enumNodeChildren(tree.getRootId(), function (dbid) {
                    if (tree.getChildCount(dbid) === 0) {
                        leaves.push(dbid);
                    }
                }, true);
                resolve(leaves);
            }, reject);
        });
    }
    async setModel(model) {
        const propertyNames = await this.extension.findPropertyNames(model);//FINDS PROPERTY NAMES FROM MODEL AFTER IT'S BEING LOADED
        propertyNames.sort();
        this.select.innerHTML = propertyNames.map(prop => `<option style="color:gray" value="${prop}">${prop}</option>`).join('\n');// propertyNames ==category array ([Category, Area, name...])
        //by using the .map() we loop on all the names in the array (using the "prop" variable) and filling the option  dropdown
        this.select.onchange = () => this.updateChart(model, this.select.value); // on change activates every time we change the dropdown name, or when first opening the extension
        // to o.updateChart() method we pass the model and the name of the property we chose ( by passing "this.select.value")
        this.updateChart(model, this.select.value);
    }
// HERE YOU INSERT THE "setModel"-LIKE METHOD FOR THE DUCTS CHART
async setModel2(model) {

    const levelNames=await this.extension.findLevels(model,'Reference Level');
    this.select.innerHTML = levelNames.map(prop => `<option style="color:gray" value="${prop}">${prop}</option>`).join('\n');// propertyNames ==category array ([Category, Area, name...])
    //by using the .map() we loop on all the names in the array (using the "prop" variable) and filling the option  dropdown
    this.select.onchange = () => this.updateChart2(model, this.select.value); // on change activates every time we change the dropdown name, or when first opening the extension
    // to o.updateChart() method we pass the model and the name of the property we chose ( by passing "this.select.value")
    this.updateChart2(model, this.select.value);

}
//---> HERE YOU INSERT THE "setModel"-LIKE METHOD FOR THE DUCTS CHART-->end
    async updateChart(model, propName) {
        const histogram = await this.extension.findPropertyValueOccurrences(model, propName);// assigning 
        const propertyValues = Array.from(histogram.keys());
        this.chart.data.labels = propertyValues;
        const dataset = this.chart.data.datasets[0];
        dataset.label = propName;
        dataset.data = propertyValues.map(val => histogram.get(val).length);
        if (dataset.data.length > 0) {
            const hslaColors = dataset.data.map((val, index) => `hsla(${Math.round(index * (360 / dataset.data.length))}, 100%, 50%, 0.2)`);
            dataset.backgroundColor = dataset.borderColor = hslaColors;
        }
        this.chart.update();
        this.chart.config.options.onClick = (ev, items) => {
            if (items.length === 1) {
                const index = items[0]._index;
                const dbids = histogram.get(propertyValues[index]);
                this.extension.viewer.isolate(dbids);
                this.extension.viewer.fitToView(dbids);
            }
        };
    }
    // HERE YOU INSERT THE "updateChart"-LIKE METHOD FOR THE DUCTS CHART-->start
    async updateChart2(model, levelName) {
        
        const histogram = await this.extension.findDuctAreaValue(model, levelName);// assigning 
        const propertyValues = Array.from(histogram[0].keys());
        this.chart.data.labels = propertyValues;
        const dataset = this.chart.data.datasets[0];
        dataset.label = levelName;
        dataset.data = propertyValues.map(val => histogram[0].get(val));
        if (dataset.data.length > 0) {
            const hslaColors = dataset.data.map((val, index) => `hsla(${Math.round(index * (360 / dataset.data.length))}, 100%, 50%, 0.2)`);
            dataset.backgroundColor = dataset.borderColor = hslaColors;
        }
        this.chart.update();
        this.chart.config.options.onClick = (ev, items) => {

            if (items.length === 1) {
                const index = items[0]._index;
                const dbids = histogram[1].get(propertyValues[index]);
                this.extension.viewer.isolate(dbids);
                this.extension.viewer.fitToView(dbids);
            }
        };
    }

        // HERE YOU INSERT THE "updateChart"-LIKE METHOD FOR THE DUCTS CHART-->end

}