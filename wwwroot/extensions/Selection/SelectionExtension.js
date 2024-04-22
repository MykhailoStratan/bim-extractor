import { BaseExtension } from "../BaseExtension.js";

export class SelectionExtension extends BaseExtension {
    constructor(viewer, options) {
        super(viewer, options);

        this._previouslySelected = [];
        
    }

    load() {
        super.load();
        console.log('SelectionExtension loaded.');

        this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (ev) => {
            const isNewEqualOld = this.comparison(ev.dbIdArray, this._previouslySelected);

            if (!isNewEqualOld) {
                this.updateSelection(ev.dbIdArray);
            } else {
                this.viewer.clearSelection();
                this.updateSelection([]);
                
            }
        });

        return true;
    }

    unload() {
        super.unload();
        return true;
    }


    updateSelection(dbids) {
        this._previouslySelected = [...dbids];
    }

    comparison = (arrayA, arrayB) => {
        // Check if the lengths of the arrays are equal
        // and if every corresponding value in the arrays is identical
        return (
          arrayA.length === arrayB.length &&
          arrayA.every((value, index) => value === arrayB[index])
        );
    };

}

Autodesk.Viewing.theExtensionManager.registerExtension('SelectionExtension', SelectionExtension);