// import { TabulatorFull as Tabulator } from 'tabulator-tables';
// import {SelectRowModule} from 'tabulator-tables';
import JSONToCSVConvertor from "../CSVConverter.js";
import { DATAGRID_CONFIG } from "../DataGrid/DataGridPanel.js";

export class DownloadDataPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        super(extension.viewer.container, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 500) + 'px';
        this.container.style.height = (options.height || 400) + 'px';
        this.container.style.resize = 'none';
    }

    initialize() {
        // this.title = this.createTitleBar(this.titleLabel || this.container.id);
        // this.initializeMoveHandlers(this.title);
        // this.container.appendChild(this.title);
        // this.content = document.createElement('div');
        // this.content.style.height = '350px';
        // this.content.style.backgroundColor = 'white';
        // this.content.innerHTML = `<div class="datagrid-container" style="position: relative; height: 350px;"></div>`;
        // this.container.appendChild(this.content);

    }

    update(model, dbids) {
        model.getBulkProperties(dbids, {}, (results) => {
            const gridData = results.map((result) => DATAGRID_CONFIG.createCustomRow(result.dbId, result.name, result.externalId, result.properties, ['Volume', 'Level', 'Category', 'Area']));
            const firstRow = this.getColumTitltes(['ID', 'ExternalId', 'Name', 'Volume', 'Level', 'Category', 'Area']);
            JSONToCSVConvertor([{...firstRow}, ...gridData]); 
        }, (err) => {
            console.error(err);
        });
    }

    getColumTitltes(titles) {
        const columnTitles = {};
        titles.map((title => columnTitles[title] = title));

        return columnTitles;
    }
}