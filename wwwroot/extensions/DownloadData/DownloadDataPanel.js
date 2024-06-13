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
        this.container.style.width = (options.width || 100) + '%';
        this.container.style.height = (options.height || 400) + 'px';
        this.container.style.resize = 'none';
        this.dataContainer = null;
        this.downloadButton = null;
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.initializeMoveHandlers(this.title);
        this.container.appendChild(this.title);
        this.content = document.createElement('div');
        this.content.style.height = '350px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `<div class="download-data-container" style="position: relative; height: 350px;">
            <button class="download-data-button"> Download data </button>
        </div>`;

        this.container.appendChild(this.content);

    }

    async update (model, dbids) {
        const instanceTree = model.getData().instanceTree
        const rootId = instanceTree.getRootId()
        console.log('instance treee',instanceTree)
        console.log('rootId', rootId)

        this.downloadButton = document.getElementsByClassName('download-data-button')[0];
        console.log(this.downloadButton)
        this.downloadButton.onclick = () => {
            console.log('here', model)
            this.download(model, dbids);
        }
        // model.getBulkProperties(dbids, {}, (results) => {
        //     const gridData = results.map((result) => DATAGRID_CONFIG.createCustomRow(result.dbId, result.name, result.externalId, result.properties, ['Volume', 'Level', 'Category', 'Area']));
        //     const firstRow = this.getColumTitltes(['ID', 'ExternalId', 'Name', 'Volume', 'Level', 'Category', 'Area']);
        //     JSONToCSVConvertor([{...firstRow}, ...gridData]); 
        // }, (err) => {
        //     console.error(err);
        // });
    }

    download(model, dbids) {

      // model.getBulkProperties(dbids, {}, function (results) {
      //   let propNames = new Set();
      //   for (const result of results) {
      //       for (const prop of result.properties) {
      //           propNames.add(prop.displayName);
      //       }
      //   }
      //   resolve(Array.from(propNames.values()));
      // }, (err) => {
      //   console.error(err);
      // });

        model.getBulkProperties(dbids, {}, (results) => {
            const requiredProps = ['Volume', 'Level', 'Category', 'Area', 'CategoryId', 'parent', 'Type Name', 'Type Mark'];
            const gridDataAssets = results.reduce((total, resultItem) => {
              const dataRow = DATAGRID_CONFIG.createCustomRow(resultItem.dbId, resultItem.name, resultItem.externalId, resultItem.properties, requiredProps);
              if (resultItem.properties.find(p => p.displayName === 'Category')?.displayValue !== 'Revit Level') {
                // console.log(resultItem.properties)
                total.push(dataRow);
              }
              return total;
            }, [])
            const firstRowAssets = this.getColumTitltes(['ID', 'ExternalId', 'Name', 'Family', ...requiredProps]);
            JSONToCSVConvertor([{...firstRowAssets}, ...gridDataAssets], 'assets'); 

            const requiredLevelsProps = ['Level'];
            const gridDataLevels = results.reduce((total, resultItem) => {
              const dataRow = DATAGRID_CONFIG.createCustomRow(resultItem.dbId, resultItem.name, resultItem.externalId, resultItem.properties, requiredLevelsProps);
              if (resultItem.properties.find(p => p.displayName === 'Category')?.displayValue !== 'Revit Level') {
                // console.log(resultItem.properties)
                total.push(dataRow);
              }
              return total;
            }, [])

            const firstRowLevels = this.getColumTitltes(['ID','Name', ...requiredLevelsProps]);
            JSONToCSVConvertor([{...firstRowLevels}, ...gridDataLevels], 'levels'); 
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