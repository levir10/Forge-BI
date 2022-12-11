const DATAGRID_CONFIG = {
    requiredProps: ['name', 'Category', 'Level','Area','Assembly Code','Assembly Description'], // Which properties should be requested for each object
    columns: [ // Definition of individual grid columns (see http://tabulator.info for more details)
        { title: 'ID', field: 'dbid' },
        { title: 'Level', field: 'level' },
        { title: 'Name', field: 'name', width: 150 },
        { title: 'Category', field: 'category', width: 150 },
        { title: 'Assembly Code', field: 'code' , width: 80},
        { title: 'Assembly Description', field: 'description', width: 200 },
        { title: 'Area', field: 'area', hozAlign: 'left', formatter: 'progress' },
        { title:'Dropdown Filter', field: 'variable' },
        
    ],
    groupBy: 'level', // Optional column to group by
    createRow: (dbid, name, props) => { // Function generating grid rows based on recieved object properties
        const area = props.find(p => p.displayName === 'Area')?.displayValue;
        const areaValue =  props.find(p => p.displayName === 'Area')?.displayValue;
        const code = props.find(p => p.displayName === 'Assembly Code')?.displayValue;
        const category = props.find(p => p.displayName === 'Category')?.displayValue;
        const description = props.find(p => p.displayName === 'Assembly Description')?.displayValue;
        const level = props.find(p => p.displayName === 'Level' && p.displayCategory === 'Constraints')?.displayValue;
        const  variable = props.find(p=>p.displayName===DATAGRID_CONFIG.requiredProps[DATAGRID_CONFIG.requiredProps.length-1])?.displayValue;
        
        return { dbid,level,name,category,code,description, area,variable};
    },
    onRowClick: (row, viewer) => {
        viewer.isolate([row.dbid]);
        viewer.fitToView([row.dbid]);
    }
};

export class DataGridPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        super(extension.viewer.container, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 1000) + 'px';
        this.container.style.height = (options.height || 400) + 'px';
        this.container.style.resize = 'none';
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.initializeMoveHandlers(this.title);
        this.container.appendChild(this.title);
        //--------------------------------------------10.10.22 ADDED THIS TI MAKE DYNAMIC TABLE - IF U DELETE, THE DROPDOWN WOULD BE REMOVED
        this.content = document.createElement('div');
        this.content.style.height = '30px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `<div class="props-container" style="position: relative; height: 25px; padding: 0.5em;">
        <select class="props"></select>
         </div>`;
        this.select = this.content.querySelector('select.props');
        this.container.appendChild(this.content);
        //--------------------------------------------10.10.22 ADDED THIS TI MAKE DYNAMIC TABLE
        this.content = document.createElement('div');
        this.content.style.height = '350px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `<div class="datagrid-container" style="position: relative; height: 350px;"></div>`;
        this.container.appendChild(this.content);
        // See http://tabulator.info
        this.table = new Tabulator('.datagrid-container', {
            height: '100%',
            layout: 'fitColumns',
            columns: DATAGRID_CONFIG.columns,
            groupBy: DATAGRID_CONFIG.groupBy,
            rowClick: (e, row) => DATAGRID_CONFIG.onRowClick(row.getData(), this.extension.viewer)
            
        });
    }

  
    update(model, dbids) {
        model.getBulkProperties(dbids, { propFilter: DATAGRID_CONFIG.requiredProps }, (results) => {
            this.table.replaceData(results.map((result) => DATAGRID_CONFIG.createRow(result.dbId, result.name, result.properties)));
        }, (err) => {
            console.error(err);
        });
    }

    setPropNames(model,propertyNames,dbids) { 
       
        this.select.innerHTML = propertyNames.map(prop => `<option style="color:gray" value="${prop}">${prop}</option>`).join('\n');// propertyNames ==category array ([Category, Area, name...])
        // const propArray= ['name', 'Category', 'Level','Area','Assembly Code','Assembly Description',this.select.value]
        //by using the .map() we loop on all the names in the array (using the "prop" variable) and filling the option  dropdown
        this.select.onchange = () =>this.dropdownUpdate(model,dbids,['name', 'Category', 'Level','Area','Assembly Code','Assembly Description',this.select.value]); // on change activates every time we change the dropdown name, or when first opening the extension
        // to o.updateChart() method we pass the model and the name of the property we chose ( by passing "this.select.value")
        // this.update(model, dbids);
    }
    dropdownUpdate(model, dbids,reqProp) {
        model.getBulkProperties(dbids, { propFilter: reqProp }, (results) => {
            DATAGRID_CONFIG.requiredProps = reqProp;
            this.table.replaceData(results.map((result) => DATAGRID_CONFIG.createRow(result.dbId, result.name, result.properties)));
        }, (err) => {
            console.error(err);
        });
    }
}
