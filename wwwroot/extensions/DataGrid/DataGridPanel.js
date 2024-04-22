// import { TabulatorFull as Tabulator } from 'tabulator-tables';
// import {SelectRowModule} from 'tabulator-tables';

export const DATAGRID_CONFIG = {
    requiredProps: ['name', 'Volume', 'Level', 'Category'],
    columns: [
        { title: 'ID', field: 'dbid' },
        { title: 'Name', field: 'name', width: 150 },
        { title: 'Volume', field: 'volume', hozAlign: 'left', formatter: 'progress' },
        { title: 'Level', field: 'level' },
        { title: 'Category', field: 'category', sorter: 'string'},
    ],
    groupBy: 'level',
    createRow: (dbid, name, props) => {
        const volume = props.find(p => p.displayName === 'Volume')?.displayValue;
        const level = props.find(p => p.displayName === 'Level' && p.displayCategory === 'Constraints')?.displayValue;
        const category = props.find(p => p.displayName === 'Category')?.displayValue;
        return { dbid, category, name, volume, level };
    },
    createCustomRow: (dbid, name, externalId, props, requiredProps) => {
        const result = {};
        for (const requiredProp of requiredProps) {
            const reqPropValue = props.find(p => p.displayName.toLowerCase() === requiredProp.toLowerCase())?.displayValue;
            result[requiredProp] = reqPropValue;
        }

        return { dbid, externalId, name, ...result };
    },
    extractProperties: (dbid, name, externalId, props) => {
        const result = {};
        for (const prop of props) {
            const propName = prop.displayName;
            result[propName] = prop.displayValue;
        }

        return { dbid, name, externalId, ...result };

    },
    onRowClick: (row, viewer) => {
        viewer.isolate([row.dbid]);
        viewer.fitToView([row.dbid]);
    }
};

export class DataGridPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        const dashboardContainer = document.getElementById('dashboard');
        super(dashboardContainer, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 100) + '%';
        this.container.style.height = (options.height || 400) + 'px';
        this.container.style.resize = 'none';
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.initializeMoveHandlers(this.title);
        this.container.appendChild(this.title);
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
            selectableRows: true,
            rowClick: (e, row) => { 
                DATAGRID_CONFIG.onRowClick(row.getData(), this.extension.viewer);
                row.toggleSelect();
            },
        });

    }

    update(model, dbids) {
        model.getBulkProperties(dbids, { propFilter: DATAGRID_CONFIG.requiredProps }, (results) => {
            const gridData = results.map((result) => DATAGRID_CONFIG.createRow(result.dbId, result.name, result.properties));
            this.table.replaceData(gridData);
        }, (err) => {
            console.error(err);
        });
    }

    getColumTitltes(columnsConfig) {
        const columnTitles = {};
        columnsConfig.map((column => columnTitles[column.field] = column.title));

        return columnTitles;
    }
}