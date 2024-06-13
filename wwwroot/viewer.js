/// import * as Autodesk from "@types/forge-viewer";
import './extensions/Logger/LoggerExtension.js';
import './extensions/Summary/SummaryExtension.js';
import './extensions/Histogram/HistogramExtension.js';
import './extensions/Selection/SelectionExtension.js';
import './extensions/Isolation/IsolationExtension.js';
import './extensions/DataGrid/DataGridExtension.js';
import './extensions/DownloadData/DownloadDataExtension.js';

let viewer;

async function getAccessToken(callback) {
    try {
        const resp = await fetch('/api/auth/token');
        if (!resp.ok)
            throw new Error(await resp.text());
        const { access_token, expires_in } = await resp.json();
        callback(access_token, expires_in);
    } catch (err) {
        alert('Could not obtain access token. See the console for more details.');
        console.error(err);        
    }
}

export function initViewer(container) {
    return new Promise(function (resolve, reject) {
            Autodesk.Viewing.Initializer({ env: 'AutodeskProduction', getAccessToken }, function () {
            const config = {
                extensions: [
                    'Autodesk.DocumentBrowser',
                    'Autodesk.VisualClusters',
                    'Autodesk.AEC.LevelsExtension',
                    'LoggerExtension',
                    'SummaryExtension',
                    'HistogramExtension',
                    'SelectionExtension',
                    'IsolationExtension',
                    'DataGridExtension',
                    'DownloadDataExtension',]
            };
            viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
            viewer.start();
            viewer.setTheme('light-theme');

            viewer.setSelectionColor("green", Autodesk.Viewing.SelectionType.MIXED);
            
            resolve(viewer);
        });
    });
}

export function loadModel(viewer, urn) {
    Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);

    function onDocumentLoadSuccess(doc) {
        const node = doc.getRoot().getDefaultGeometry();
        doc.downloadAecModelData();
        console.log(doc)
        console.log('Loading viewable', node.data);
        viewer.loadDocumentNode(doc, node);
    }
    function onDocumentLoadFailure(code, message) {
        alert('Could not load model. See console for more details.');
        console.error(message);
    }
}


