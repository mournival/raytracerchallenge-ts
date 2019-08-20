"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var chai_1 = require("chai");
var canvas_1 = require("../../src/canvas");
var color_1 = require("../../src/color");
var Workspace_1 = require("./Workspace");
var CanvasSteps = /** @class */ (function () {
    function CanvasSteps(workspace) {
        this.workspace = workspace;
        this.ppm = {};
    }
    CanvasSteps.prototype.givenACanvas = function (id, x, y) {
        this.workspace.canvases[id] = new canvas_1.Canvas(parseInt(x), parseInt(y));
    };
    CanvasSteps.prototype.canvasWidthEquals = function (id, value) {
        chai_1.expect(this.workspace.canvases[id].width).to.eq(parseInt(value));
    };
    CanvasSteps.prototype.canvasHeightEquals = function (id, value) {
        chai_1.expect(this.workspace.canvases[id].height).to.eq(parseInt(value));
    };
    CanvasSteps.prototype.testDefaultColor = function () {
        var canvas = this.workspace.canvases['c'];
        for (var col = canvas.width; col < 10; ++col)
            for (var row = canvas.height; row < 20; ++row)
                chai_1.expect(color_1.Color.equals(canvas.colors[row][col], new color_1.Color(0, 0, 0))).to.be.true;
    };
    CanvasSteps.prototype.doWritePixel = function (canvasId, col, row, colorId) {
        canvas_1.Canvas.write_pixel(this.workspace.canvases[canvasId], parseInt(row), parseInt(col), this.workspace.colors[colorId]);
    };
    CanvasSteps.prototype.checkPixelAt = function (canvasId, col, row, colorId) {
        var pixel = this.workspace.canvases[canvasId].colors[parseInt(row)][parseInt(col)];
        chai_1.expect(color_1.Color.equals(pixel, this.workspace.colors[colorId])).to.be.true;
    };
    CanvasSteps.prototype.createPPMFromCanvas = function (ppmId, canvasId) {
        this.ppm[ppmId] = canvas_1.Canvas.canvas_to_ppm(this.workspace.canvases[canvasId]);
    };
    CanvasSteps.prototype.checkPPMLines = function (start, end, ppmID, contents) {
        var f = this.ppm[ppmID];
        var strings = contents.split('\n');
        var j = 0;
        for (var i = parseInt(start) - 1; i < parseInt(end); ++i) {
            chai_1.expect(f[i]).to.be.eq(strings[j++]);
        }
    };
    CanvasSteps.prototype.ppmEndsWIthNewline = function (ppmId) {
        var f = this.ppm[ppmId];
        chai_1.expect(f[f.length - 1]).to.be.eq('');
    };
    CanvasSteps.prototype.everyPixelSetToColor = function (canvasId, red, green, blue) {
        var color = new color_1.Color(parseFloat(red), parseFloat(green), parseFloat(blue));
        var canvas = this.workspace.canvases[canvasId];
        for (var c = 0; c < canvas.width; ++c) {
            for (var r = 0; r < canvas.height; ++r) {
                canvas_1.Canvas.write_pixel(canvas, r, c, color);
            }
        }
    };
    __decorate([
        cucumber_tsflow_1.given(/^(\w+) ← canvas\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    ], CanvasSteps.prototype, "givenACanvas", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+)\.width = (.*)$/)
    ], CanvasSteps.prototype, "canvasWidthEquals", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+)\.height = (.*)$/)
    ], CanvasSteps.prototype, "canvasHeightEquals", null);
    __decorate([
        cucumber_tsflow_1.then(/^every pixel of c is color\(0, 0, 0\)$/)
    ], CanvasSteps.prototype, "testDefaultColor", null);
    __decorate([
        cucumber_tsflow_1.when(/^write_pixel\((\w+), (\d+), (\d+), (\w+)\)$/)
    ], CanvasSteps.prototype, "doWritePixel", null);
    __decorate([
        cucumber_tsflow_1.then(/^pixel_at\((\w+), (\d+), (\d+)\) = (\w+)$/)
    ], CanvasSteps.prototype, "checkPixelAt", null);
    __decorate([
        cucumber_tsflow_1.when(/^(\w+) ← canvas_to_ppm\((\w+)\)$/)
    ], CanvasSteps.prototype, "createPPMFromCanvas", null);
    __decorate([
        cucumber_tsflow_1.then(/^lines (\d+)-(\d+) of (\w+) are$/)
    ], CanvasSteps.prototype, "checkPPMLines", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+) ends with a newline character$/)
    ], CanvasSteps.prototype, "ppmEndsWIthNewline", null);
    __decorate([
        cucumber_tsflow_1.when(/^every pixel of (\w+) is set to color\((.*), (.*), (.*)\)$/)
    ], CanvasSteps.prototype, "everyPixelSetToColor", null);
    CanvasSteps = __decorate([
        cucumber_tsflow_1.binding([Workspace_1.Workspace])
    ], CanvasSteps);
    return CanvasSteps;
}());
module.exports = CanvasSteps;
//# sourceMappingURL=canvassteps.js.map