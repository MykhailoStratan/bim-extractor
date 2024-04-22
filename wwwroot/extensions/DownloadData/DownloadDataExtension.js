import { BaseExtension } from "../BaseExtension.js";
import { DownloadDataPanel } from "./DownloadDataPanel.js";

class DownloadDataExtension extends BaseExtension {
    constructor(viewer, options) {
        super(viewer, options);
        this._button = null;
        this._panel = null;
    }

    async load() {
        super.load();
        console.log('DownloadDataExtension loaded.');
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
        console.log('DownloadDataExtension unloaded.');
        return true;
    }

    onToolbarCreated() {
        this._panel = new DownloadDataPanel(this, 'download-data-panel', 'Download Data', { x: 10, y: 10 });
        this._button = this.createToolbarButton('download-data-button', 'https://png.pngtree.com/element_our/20190601/ourmid/pngtree-file-download-icon-image_1344394.jpg', 'Download Data');
        this._button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
        this._button.onClick = () => {
            this._panel.setVisible(!this._panel.isVisible());
            if (this._panel.isVisible() && this.viewer.model) {
                this.update();
            }
        };
    }

    onModelLoaded(model) {
        super.onModelLoaded(model);
        if (this._panel && this._panel.isVisible()) {
            this.update();
        }
    }

    async update() {
        const dbids = await this.findLeafNodes(this.viewer.model);
        this._panel.update(this.viewer.model, dbids);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('DownloadDataExtension', DownloadDataExtension);