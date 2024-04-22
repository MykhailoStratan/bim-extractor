import { BaseExtension } from "../BaseExtension.js";

export class IsolationExtension extends BaseExtension {
    constructor(viewer, options) {
        super(viewer, options);

        this._previouslyIsolated = [];
        
    }

    load() {
        super.load();
        console.log('IsolationExtension loaded.');

        this.viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, (ev) => {
            const isNewEqualOld = this.comparison(ev.nodeIdArray, this._previouslyIsolated);
            if (!isNewEqualOld) {
                this.updateIsolation(ev.nodeIdArray);
            } else {
                this.viewer.showAll();
                this.updateIsolation([]);
            }
        });

        return true;
    }

    unload() {
        super.unload();
        return true;
    }


    updateIsolation(dbids) {
        this._previouslyIsolated = [...dbids];
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

Autodesk.Viewing.theExtensionManager.registerExtension('IsolationExtension', IsolationExtension);