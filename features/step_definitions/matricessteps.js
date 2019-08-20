"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var Workspace_1 = require("./Workspace");
var chai_1 = require("chai");
var matrix_1 = require("../../src/matrix");
var tuple_1 = require("../../src/tuple");
// Float regex: [+-]?\d*?\.?\d*
var MatricesSteps = /** @class */ (function () {
    function MatricesSteps(workspace) {
        this.workspace = workspace;
    }
    MatricesSteps_1 = MatricesSteps;
    MatricesSteps.prototype.beforeAllScenarios = function () {
        this.workspace.matrices['identity_matrix'] = matrix_1.Matrix.identity(4);
    };
    MatricesSteps.prototype.givenANxMMatrix = function (rows, cols, matId, dataTable) {
        this.workspace.matrices[matId] = new matrix_1.Matrix(parseInt(rows), parseInt(cols));
        var data = dataTable.rawTable;
        for (var r = 0; r < parseInt(rows); ++r) {
            for (var c = 0; c < parseInt(cols); ++c) {
                this.workspace.matrices[matId].set(r, c, parseFloat(data[r][c]));
            }
        }
    };
    ;
    MatricesSteps.prototype.checkMatrixElement = function (matId, row, col, expectedValue) {
        var actual = this.workspace.matrices[matId].get(parseInt(row), parseInt(col));
        chai_1.expect(actual).to.be.closeTo(parseFloat(expectedValue), matrix_1.Matrix.EPSILON);
    };
    MatricesSteps.prototype.givenAMatrix = function (matId, dataTable) {
        this.workspace.matrices[matId] = MatricesSteps_1.createMatrixFromDataTable(dataTable);
    };
    ;
    MatricesSteps.prototype.matrixAEqualsB = function () {
        chai_1.expect(matrix_1.Matrix.equals(this.workspace.matrices['A'], this.workspace.matrices['B'])).to.be.true;
    };
    MatricesSteps.prototype.matrixANotEqualsB = function () {
        chai_1.expect(matrix_1.Matrix.equals(this.workspace.matrices['A'], this.workspace.matrices['B'])).to.be.false;
    };
    MatricesSteps.prototype.matrixMultiplicationEquals = function (matAId, matBId, dataTable) {
        var expected = MatricesSteps_1.createMatrixFromDataTable(dataTable);
        var actual = matrix_1.Matrix.multiply(this.workspace.matrices[matAId], this.workspace.matrices[matBId]);
        chai_1.expect(matrix_1.Matrix.equals(actual, expected)).to.be.true;
    };
    MatricesSteps.prototype.multiplyIdentityMatrixEqualsSame = function (matAId, matBId) {
        var A = this.workspace.matrices[matAId];
        var actual = matrix_1.Matrix.multiply(A, matrix_1.Matrix.identity(4));
        chai_1.expect(matrix_1.Matrix.equals(actual, A)).to.be.true;
    };
    MatricesSteps.prototype.multiplyIdentityMatrixVectorEqualsSame = function (vectorAId, vectorBId) {
        var a = this.workspace.tuples[vectorAId];
        var actual = matrix_1.Matrix.multiplyVector(matrix_1.Matrix.identity(4), a);
        chai_1.expect(tuple_1.Tuple.equals(actual, a)).to.be.true;
    };
    MatricesSteps.prototype.transposeM = function (matAId, dataTable) {
        var actual = matrix_1.Matrix.transpose(this.workspace.matrices[matAId]);
        var expected = MatricesSteps_1.createMatrixFromDataTable(dataTable);
        chai_1.expect(matrix_1.Matrix.equals(actual, expected)).to.be.true;
    };
    MatricesSteps.prototype.givenTransposeIdentity = function () {
    };
    MatricesSteps.prototype.transposeI = function () {
        var actual = matrix_1.Matrix.transpose(matrix_1.Matrix.identity(4));
        var expected = matrix_1.Matrix.identity(4);
        chai_1.expect(matrix_1.Matrix.equals(actual, expected)).to.be.true;
    };
    MatricesSteps.createMatrixFromDataTable = function (dataTable) {
        var data = dataTable.rawTable;
        var rows = data.length;
        var cols = data[0].length;
        var expected = new matrix_1.Matrix(rows, cols);
        for (var r = 0; r < rows; ++r) {
            for (var c = 0; c < cols; ++c) {
                expected.set(r, c, parseFloat(data[r][c]));
            }
        }
        return expected;
    };
    var MatricesSteps_1;
    __decorate([
        cucumber_tsflow_1.before()
    ], MatricesSteps.prototype, "beforeAllScenarios", null);
    __decorate([
        cucumber_tsflow_1.given(/the following (\d+)x(\d+) matrix (\w+):/)
    ], MatricesSteps.prototype, "givenANxMMatrix", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+)\[(\d+),(\d+)] = ([+-]?\d*?\.?\d*)$/)
    ], MatricesSteps.prototype, "checkMatrixElement", null);
    __decorate([
        cucumber_tsflow_1.given(/the following matrix (\w+):/)
    ], MatricesSteps.prototype, "givenAMatrix", null);
    __decorate([
        cucumber_tsflow_1.then(/^A = B$/)
    ], MatricesSteps.prototype, "matrixAEqualsB", null);
    __decorate([
        cucumber_tsflow_1.then(/^A != B$/)
    ], MatricesSteps.prototype, "matrixANotEqualsB", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+) \* (\w+) is the following 4x4 matrix:$/)
    ], MatricesSteps.prototype, "matrixMultiplicationEquals", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+) \* identity_matrix = (\w+)$/)
    ], MatricesSteps.prototype, "multiplyIdentityMatrixEqualsSame", null);
    __decorate([
        cucumber_tsflow_1.then(/^identity_matrix \* (\w+) = (\w+)$/)
    ], MatricesSteps.prototype, "multiplyIdentityMatrixVectorEqualsSame", null);
    __decorate([
        cucumber_tsflow_1.then(/^transpose\((\w+)\) is the following matrix:$/)
    ], MatricesSteps.prototype, "transposeM", null);
    __decorate([
        cucumber_tsflow_1.given(/^A ← transpose\(identity_matrix\)$/)
    ], MatricesSteps.prototype, "givenTransposeIdentity", null);
    __decorate([
        cucumber_tsflow_1.then(/^A = identity_matrix$/)
    ], MatricesSteps.prototype, "transposeI", null);
    MatricesSteps = MatricesSteps_1 = __decorate([
        cucumber_tsflow_1.binding([Workspace_1.Workspace])
    ], MatricesSteps);
    return MatricesSteps;
}());
module.exports = MatricesSteps;
//# sourceMappingURL=matricessteps.js.map