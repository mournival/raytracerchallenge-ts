"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tuple_1 = require("./tuple");
var Matrix = /** @class */ (function () {
    function Matrix(row, col) {
        this.data = [];
        for (var c = 0; c < col; ++c) {
            var newRow = [];
            for (var r = 0; r < row; ++r) {
                newRow.push(0);
            }
            this.data.push(newRow);
        }
    }
    Matrix.equals = function (lhs, rhs) {
        if (lhs.data.length !== rhs.data.length ||
            lhs.data[0].length !== rhs.data[0].length) {
            return false;
        }
        for (var r = 0; r < lhs.data.length; ++r) {
            for (var c = 0; c < lhs.data[0].length; ++c) {
                if (Math.abs(lhs.get(r, c) - rhs.get(r, c)) > Matrix.EPSILON) {
                    return false;
                }
            }
        }
        return true;
    };
    Matrix.multiply = function (lhs, rhs) {
        var product = new Matrix(4, 4);
        for (var r = 0; r < 4; ++r) {
            for (var c = 0; c < 4; ++c) {
                product.data[r][c] = Matrix.dot4(lhs, r, rhs, c);
            }
        }
        return product;
    };
    Matrix.multiplyVector = function (lhs, rhs) {
        return new tuple_1.Tuple(this.vectorDot(lhs, rhs, 0), this.vectorDot(lhs, rhs, 1), this.vectorDot(lhs, rhs, 2), this.vectorDot(lhs, rhs, 3));
    };
    Matrix.vectorDot = function (lhs, rhs, r) {
        return lhs.data[r][0] * rhs.x +
            lhs.data[r][1] * rhs.y +
            lhs.data[r][2] * rhs.z +
            lhs.data[r][3] * rhs.w;
    };
    Matrix.dot4 = function (lhs, row, rhs, col) {
        var sum = 0;
        for (var i = 0; i < 4; ++i) {
            sum += lhs.data[row][i] * rhs.data[i][col];
        }
        return sum;
    };
    Matrix.identity = function (dim) {
        var m = new Matrix(dim, dim);
        for (var i = 0; i < dim; ++i) {
            m.data[i][i] = 1;
        }
        return m;
    };
    Matrix.transpose = function (m) {
        var mPrime = new Matrix(m.data[0].length, m.data.length);
        for (var r = 0; r < 4; ++r) {
            for (var c = 0; c < 4; ++c) {
                mPrime.data[c][r] = m.data[r][c];
            }
        }
        return mPrime;
    };
    Matrix.prototype.get = function (row, col) {
        return this.data[row][col];
    };
    Matrix.prototype.set = function (row, col, value) {
        this.data[row][col] = value;
    };
    Matrix.EPSILON = 0.0001;
    return Matrix;
}());
exports.Matrix = Matrix;
//# sourceMappingURL=matrix.js.map