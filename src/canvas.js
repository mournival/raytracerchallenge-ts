"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("./color");
var Canvas = /** @class */ (function () {
    function Canvas(width, height) {
        this.width = width;
        this.height = height;
        this.data = [];
        for (var h = 0; h < height; h++) {
            var row = [];
            for (var w = 0; w < width; w++) {
                row[w] = new color_1.Color(0, 0, 0);
            }
            this.data[h] = row;
        }
    }
    Canvas.write_pixel = function (canvas, row, col, color) {
        canvas.colors[row][col] = color;
    };
    Canvas.canvas_to_ppm = function (canvas) {
        var ppm = ['P3', canvas.width.toString() + ' ' + canvas.height.toString(), '255'];
        for (var h = 0; h < canvas.height; h++) {
            var r = '';
            for (var w = 0; w < canvas.width; w++) {
                if (w > 0) {
                    r += ' ';
                }
                r += color_1.Color.asPPMString(canvas.colors[h][w]);
            }
            var i = 0;
            while (i < r.length) {
                var items = r.substring(i, i + 67);
                if (items.length !== 0) {
                    ppm.push(items);
                }
                i += 68;
            }
        }
        ppm.push('');
        return ppm;
    };
    Object.defineProperty(Canvas.prototype, "colors", {
        get: function () {
            return this.data;
        },
        enumerable: true,
        configurable: true
    });
    return Canvas;
}());
exports.Canvas = Canvas;
//# sourceMappingURL=canvas.js.map