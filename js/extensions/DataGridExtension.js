
import { BaseExtension } from './BaseExtension.js';
import { DataGridPanel } from './DataGridPanel.js';

class DataGridExtension extends BaseExtension {
    constructor(viewer, options) {
        super(viewer, options);
        this._button = null;
        this._panel = null;
    }

    async load() {
        super.load();
        await Promise.all([
            this.loadScript('https://unpkg.com/tabulator-tables@4.9.3/dist/js/tabulator.min.js', 'Tabulator'),
            this.loadStylesheet('https://unpkg.com/tabulator-tables@4.9.3/dist/css/tabulator.min.css')
        ]);
        console.log('DataGridExtension loaded.');
        return true;
    }

    unload() {
        super.unload();
        if (this._button) {
            this.removeToolbarButton(this._button);
            this._button = null;
        }
        if (this._panel) {
            this._panel.setVisible(false);
            this._panel.uninitialize();
            this._panel = null;
        }
        console.log('DataGridExtension unloaded.');
        return true;
    }

    onToolbarCreated() {
        this._panel = new DataGridPanel(this, 'dashboard-datagrid-panel', 'תדהר גמרים - טבלת סעיפים תקציביים לאלמנטים במודל', { x: 10, y: 10 });
        this._button = this.createToolbarButton('dashboard-datagrid-button', 'https://img.icons8.com/small/32/activity-grid.png', 'טבלת סעיפים תקציביים לאלמנטים במודל');
        this._button.onClick = () => {
            this._panel.setVisible(!this._panel.isVisible());
            this._button.setState(this._panel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._panel.isVisible() && this.viewer.model) {
                this.update();
                this.updateDropDown();
            }
        };
    }

    onModelLoaded(model) {
        super.onModelLoaded(model);
        if (this._panel && this._panel.isVisible()) {
            this.update();
            this.updateDropDown();
            
        }
       
    }

    async update() {
        const dbids = await this.findLeafNodes(this.viewer.model);
        this._panel.update(this.viewer.model, dbids);
        
    }
    async updateDropDown() {
        const dbids = await this.findLeafNodes(this.viewer.model);
        const propertyNames = await this.findPropertyNames(this.viewer.model);//FINDS PROPERTY NAMES FROM MODEL AFTER IT'S BEING LOADED
        propertyNames.sort();//new update 22.11
        this._panel.setPropNames(this.viewer.model, propertyNames,dbids);
        
    }
    

}

Autodesk.Viewing.theExtensionManager.registerExtension('DataGridExtension', DataGridExtension);