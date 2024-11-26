/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import { VisualFormattingSettingsModel } from "./settings";
export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private title: HTMLElement;
    private tb: HTMLElement;
    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        if (document) {
            this.title = document.createElement("h");
            this.title.innerHTML = "title";
            this.title.style.color = "white";
            this.title.style.fontSize = "30px";
            this.target.appendChild(this.title);

            this.tb = document.createElement("table");
            this.target.appendChild(this.tb);
            
            this.target.style.backgroundColor = "rgb(50, 50, 51)";
            this.target.style.textAlign = "center";
        }
    }

    public getTop(value: any){
        const top_text: HTMLElement = document.createElement("h");
        top_text.style.marginLeft = "10%";
        top_text.style.marginRight = "10%";
        if(!value){
            value = "";
        }
        top_text.innerHTML = value.toString();
        top_text.style.color = "rgb(90, 200, 250)";
        return top_text;
    }
    public getMid(value: any){
        const middle_text: HTMLElement = document.createElement("p");
        middle_text.style.marginLeft = "10%";
        middle_text.style.marginRight = "10%";
        middle_text.style.textAlign = "center";
        middle_text.style.fontSize = "40px"
        if(!value){
            value = "";
        }
        middle_text.innerHTML = value.toString();
        middle_text.style.color = "rgb(242, 73, 92)";
        return middle_text;
    }
    public getBottom(value: any){
        const bottom_text: HTMLElement = document.createElement("h");
        bottom_text.style.marginLeft = "10%";
        bottom_text.style.marginRight = "10%";
        bottom_text.style.textAlign = "center";
        if(!value){
            value = "";
        }
        bottom_text.innerHTML = value.toString();
        bottom_text.style.color = "rgb(255, 255, 255)";
        return bottom_text;
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);
        this.tb.innerHTML = "";
        let dataView: DataView = options.dataViews[0];
        if(this.title){
            const categorical = options.dataViews[0].categorical;
            const category_title = categorical.categories[0];
            const category_subtitles = categorical.categories[1];
            this.title.innerHTML = category_title.values[0].toString();

            const tr: HTMLElement = document.createElement("tr");
            this.tb.appendChild(tr);
            for (let i = 0, len = category_subtitles.values.length; i < len; i++) {
                const td: HTMLElement = document.createElement("td");
                if(i + 1 < len){
                    td.style.borderRight = "1px dashed #dddddd";
                }
                const top_text: HTMLElement = this.getTop(category_subtitles.values[i].toString());
                td.appendChild(top_text);

                if(categorical.values){
                    const value_values_count = categorical.values.length
                    if(value_values_count > 0)
                    {
                        const mid_text: HTMLElement = this.getMid(categorical.values[0].values[i].toString());
                        td.appendChild(mid_text);
                    }
                    if(value_values_count > 1){
                        const top_text: HTMLElement = this.getTop(categorical.values[1].values[i].toString());
                        td.appendChild(top_text);
                    }
                }
                tr.appendChild(td);
            }
        }
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}