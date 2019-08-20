"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tuple = /** @class */ (function () {
    function Tuple(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    Tuple.equals = function (lhs, rhs) {
        // console.log(lhs);
        // console.log(rhs);
        return Math.abs(lhs.x - rhs.x) < Tuple.EPSILON &&
            Math.abs(lhs.y - rhs.y) < Tuple.EPSILON &&
            Math.abs(lhs.z - rhs.z) < Tuple.EPSILON &&
            Math.abs(lhs.w - rhs.w) < Tuple.EPSILON;
    };
    Tuple.add = function (lhs, rhs) {
        return new Tuple(lhs.x + rhs.x, lhs.y + rhs.y, lhs.z + rhs.z, lhs.w + rhs.w);
    };
    Tuple.subtract = function (lhs, rhs) {
        return new Tuple(lhs.x - rhs.x, lhs.y - rhs.y, lhs.z - rhs.z, lhs.w - rhs.w);
    };
    Tuple.isPoint = function (t) {
        return 1.0 - Tuple.EPSILON < t.w &&
            t.w < 1.0 + Tuple.EPSILON;
    };
    Tuple.isVector = function (t) {
        return Math.abs(t.w) < Tuple.EPSILON;
    };
    Tuple.multiply = function (t, s) {
        return new Tuple(t.x * s, t.y * s, t.z * s, t.w * s);
    };
    Tuple.divide = function (t, s) {
        return new Tuple(t.x / s, t.y / s, t.z / s, t.w / s);
    };
    Tuple.negate = function (t) {
        return Tuple.multiply(t, -1);
    };
    Tuple.magnitude = function (t) {
        return Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z);
    };
    Tuple.normalize = function (t) {
        return Tuple.divide(t, Tuple.magnitude(t));
    };
    Tuple.dot = function (lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
    };
    Tuple.cross = function (lhs, rhs) {
        return vector(lhs.y * rhs.z - lhs.z * rhs.y, lhs.z * rhs.x - lhs.x * rhs.z, lhs.x * rhs.y - lhs.y * rhs.x);
    };
    Tuple.reflect = function (v, n) {
        var vDotn = Tuple.dot(v, n);
        var coeff = 2 * vDotn;
        var a = Tuple.multiply(n, coeff);
        return Tuple.subtract(v, a);
    };
    Tuple.prototype.getElements = function (e) {
        switch (e) {
            case 'x':
                return this.x;
            case 'y':
                return this.y;
            case 'z':
                return this.z;
            default:
                return this.w;
        }
    };
    Tuple.EPSILON = 0.0001;
    return Tuple;
}());
exports.Tuple = Tuple;
function point(x, y, z) {
    return new Tuple(x, y, z, 1.0);
}
exports.point = point;
function vector(x, y, z) {
    return new Tuple(x, y, z, 0.0);
}
exports.vector = vector;
//# sourceMappingURL=tuple.js.map