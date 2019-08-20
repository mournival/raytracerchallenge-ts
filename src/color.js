"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color = /** @class */ (function () {
    function Color(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    Color.asString = function (c) {
        return c.red + ' ' + c.green + ' ' + c.blue;
    };
    Color.asPPMString = function (c) {
        return Color.mapColor(c.red) + ' ' + Color.mapColor(c.green) + ' ' + Color.mapColor(c.blue);
    };
    Color.mapColor = function (n) {
        if (n <= 0)
            return 0;
        if (n >= 1)
            return 255;
        return Math.round(255 * n);
    };
    Color.equals = function (lhs, rhs) {
        // console.log(lhs);
        // console.log(rhs);
        return Math.abs(lhs.red - rhs.red) < Color.EPSILON &&
            Math.abs(lhs.green - rhs.green) < Color.EPSILON &&
            Math.abs(lhs.blue - rhs.blue) < Color.EPSILON;
    };
    Color.add = function (lhs, rhs) {
        return new Color(lhs.red + rhs.red, lhs.green + rhs.green, lhs.blue + rhs.blue);
    };
    Color.subtract = function (lhs, rhs) {
        return new Color(lhs.red - rhs.red, lhs.green - rhs.green, lhs.blue - rhs.blue);
    };
    Color.multiply = function (lhs, rhs) {
        return new Color(lhs.red * rhs.red, lhs.green * rhs.green, lhs.blue * rhs.blue);
    };
    Color.multiplyScalar = function (lhs, rhs) {
        return new Color(lhs.red * rhs, lhs.green * rhs, lhs.blue * rhs);
    };
    Color.prototype.getElement = function (e) {
        switch (e) {
            case 'red':
                return this.red;
            case 'green':
                return this.green;
            default:
                return this.blue;
        }
    };
    Color.EPSILON = 0.0001;
    return Color;
}());
exports.Color = Color;
//# sourceMappingURL=color.js.map