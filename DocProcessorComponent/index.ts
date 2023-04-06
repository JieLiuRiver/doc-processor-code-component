import {IInputs, IOutputs} from "./generated/ManifestTypes";
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import App from './App'

export class DocProcessorComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _notifyOutputChanged: () => void;
    private _root: Root;
    private _docHtml: string
    private _reportName: string
    private _isEditorClosed: "Yes" | "No"
    private _docBase64: string
    private _powerbiRequest: string

    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        this._notifyOutputChanged = notifyOutputChanged;
        this._root = createRoot(container);
        this._Render(context);
    }

    
    private _Render(context: ComponentFramework.Context<IInputs>): void {
        const app = createElement(
          App,
          {
            triggerNotifyOutputChanged: (metaInfo) => {
                const { reportName, docHtml, docBase64, isEditorClosed, powerbiRequest} = metaInfo
                this._docHtml = docHtml || ''
                this._docBase64 = docBase64
                this._reportName = reportName || ''
                this._isEditorClosed = isEditorClosed || "No"
                this._powerbiRequest = powerbiRequest || ''
                this._notifyOutputChanged()
            },
            contextParameters: context.parameters
          },
          null,
        );
    
        this._root.render(app);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        this._Render(context);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {
            DocHtml: this._docHtml,
            DocBase64: this._docBase64,
            ReportName: this._reportName,
            IsEditorClosed: this._isEditorClosed
        };
    } 

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        this._root.unmount();
    }
}
