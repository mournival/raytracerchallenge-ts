"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var cucumber_tsflow_1 = require("cucumber-tsflow");
var chai_1 = require("chai");
var tuple_1 = require("../../src/tuple");
var color_1 = require("../../src/color");
var Workspace_1 = require("./Workspace");
var matrix_1 = require("../../src/matrix");
// Float regex: [+-]?\d*?\.?\d*
var TupleSteps = /** @class */ (function () {
    function TupleSteps(workspace) {
        this.workspace = workspace;
    }
    TupleSteps_1 = TupleSteps;
    TupleSteps.prototype.givenATuple = function (id, x, y, z, w) {
        this.workspace.tuples[id] = new tuple_1.Tuple(parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(w));
    };
    TupleSteps.prototype.tupleFieldEquals = function (id, field, value) {
        chai_1.expect(this.workspace.tuples[id].getElements(field)).to.eq(parseFloat(value));
    };
    TupleSteps.prototype.colorFieldEquals = function (id, field, value) {
        chai_1.expect(this.workspace.colors[id].getElement(field)).to.eq(parseFloat(value));
    };
    TupleSteps.prototype.testPoint = function (id, not) {
        chai_1.expect(tuple_1.Tuple.isPoint(this.workspace.tuples[id])).to.eq(not !== 'not ');
    };
    TupleSteps.prototype.testVector = function (id, not) {
        chai_1.expect(tuple_1.Tuple.isVector(this.workspace.tuples[id])).to.eq(not !== 'not ');
    };
    TupleSteps.prototype.givenATupleType = function (id, expectedType, x, y, z) {
        this.workspace.tuples[id] = TupleSteps_1.createExpected(expectedType, x, y, z);
    };
    TupleSteps.prototype.givenAColor = function (id, expectedType, x, y, z) {
        this.workspace.colors[id] = new color_1.Color(parseFloat(x), parseFloat(y), parseFloat(z));
    };
    TupleSteps.prototype.thenTupleEquals = function (id, x, y, z, w) {
        chai_1.expect(tuple_1.Tuple.equals(this.workspace.tuples[id], new tuple_1.Tuple(parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(w)))).to.be.true;
    };
    TupleSteps.prototype.thenTypedTupleEquals = function (id, expectedType, x, y, z) {
        var expectedValue = TupleSteps_1.createExpected(expectedType, x, y, z);
        chai_1.expect(tuple_1.Tuple.equals(this.workspace.tuples[id], expectedValue)).to.be.true;
    };
    TupleSteps.prototype.testMixedOperation = function (lhs, op, rhs, expectedType, x, y, z, w) {
        switch (expectedType) {
            case 'color':
                this.colorOp(op, lhs, rhs, x, y, z);
                break;
            default:
                this.tupleOp(op, lhs, rhs, x, y, z, w, expectedType);
                break;
        }
    };
    TupleSteps.prototype.colorOp = function (op, lhs, rhs, x, y, z) {
        switch (op) {
            case '+':
                chai_1.expect(color_1.Color.equals(color_1.Color.add(this.workspace.colors[lhs], this.workspace.colors[rhs]), new color_1.Color(parseFloat(x), parseFloat(y), parseFloat(z)))).to.be.true;
                break;
            case '-':
                chai_1.expect(color_1.Color.equals(color_1.Color.subtract(this.workspace.colors[lhs], this.workspace.colors[rhs]), new color_1.Color(parseFloat(x), parseFloat(y), parseFloat(z)))).to.be.true;
                break;
            case '*':
                if (this.workspace.colors[rhs]) {
                    chai_1.expect(color_1.Color.equals(color_1.Color.multiply(this.workspace.colors[lhs], this.workspace.colors[rhs]), new color_1.Color(parseFloat(x), parseFloat(y), parseFloat(z)))).to.be.true;
                }
                else {
                    chai_1.expect(color_1.Color.equals(color_1.Color.multiplyScalar(this.workspace.colors[lhs], parseFloat(rhs)), new color_1.Color(parseFloat(x), parseFloat(y), parseFloat(z)))).to.be.true;
                }
                break;
            default:
                chai_1.assert.fail('Unexpected op code');
        }
    };
    TupleSteps.prototype.tupleOp = function (op, lhs, rhs, x, y, z, w, expectedType) {
        switch (op) {
            case '+':
                chai_1.expect(tuple_1.Tuple.equals(tuple_1.Tuple.add(this.workspace.tuples[lhs], this.workspace.tuples[rhs]), new tuple_1.Tuple(parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(w)))).to.be.true;
                break;
            case '-':
                chai_1.expect(tuple_1.Tuple.equals(tuple_1.Tuple.subtract(this.workspace.tuples[lhs], this.workspace.tuples[rhs]), TupleSteps_1.createExpected(expectedType, x, y, z))).to.be.true;
                break;
            case '*':
                if (this.workspace.matrices[lhs]) {
                    var actual = matrix_1.Matrix.multiplyVector(this.workspace.matrices[lhs], this.workspace.tuples[rhs]);
                    chai_1.expect(tuple_1.Tuple.equals(actual, new tuple_1.Tuple(parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(w)))).to.be.true;
                }
                else {
                    chai_1.expect(tuple_1.Tuple.equals(tuple_1.Tuple.multiply(this.workspace.tuples[lhs], parseFloat(rhs)), new tuple_1.Tuple(parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(w)))).to.be.true;
                }
                break;
            case '/':
                chai_1.expect(tuple_1.Tuple.equals(tuple_1.Tuple.divide(this.workspace.tuples[lhs], parseFloat(rhs)), new tuple_1.Tuple(parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(w)))).to.be.true;
                break;
            default:
                chai_1.assert.fail('Unexpected op code');
        }
    };
    TupleSteps.prototype.thenNegateTest = function (id, x, y, z, w) {
        chai_1.expect(tuple_1.Tuple.equals(tuple_1.Tuple.negate(this.workspace.tuples[id]), new tuple_1.Tuple(parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(w)))).to.be.true;
    };
    TupleSteps.prototype.thenMagnitudeEquals = function (id, radical, m) {
        var mag = radical ? Math.sqrt(parseFloat(m)) : parseFloat(m);
        chai_1.expect(tuple_1.Tuple.magnitude(this.workspace.tuples[id])).to.be.eq(mag);
    };
    TupleSteps.prototype.thenVectorEquals = function (id, approx, x, y, z) {
        var actualVal = tuple_1.Tuple.normalize(this.workspace.tuples[id]);
        var expectedVal = tuple_1.vector(parseFloat(x), parseFloat(y), parseFloat(z));
        chai_1.expect(tuple_1.Tuple.equals(actualVal, expectedVal)).to.be.true;
    };
    TupleSteps.prototype.whenNormed = function (id, src) {
        this.workspace.tuples[id] = tuple_1.Tuple.normalize(this.workspace.tuples[src]);
    };
    TupleSteps.prototype.thenDotEquals = function (lhs, rhs, product) {
        chai_1.expect(Math.abs(tuple_1.Tuple.dot(this.workspace.tuples[lhs], this.workspace.tuples[rhs]) - parseFloat(product)) < tuple_1.Tuple.EPSILON).to.be.true;
    };
    TupleSteps.prototype.thenVectorOperation = function (id, vId, nId) {
        this.workspace.tuples[id] = tuple_1.Tuple.reflect(this.workspace.tuples[vId], this.workspace.tuples[nId]);
    };
    TupleSteps.prototype.thenCrossEquals = function (lhs, rhs, x, y, z) {
        var actualVal = tuple_1.Tuple.cross(this.workspace.tuples[lhs], this.workspace.tuples[rhs]);
        var expectedVal = tuple_1.vector(parseFloat(x), parseFloat(y), parseFloat(z));
        chai_1.expect(tuple_1.Tuple.equals(actualVal, expectedVal)).to.be.true;
    };
    TupleSteps.createExpected = function (typ, x, y, z) {
        if (typ === 'vector') {
            return tuple_1.vector(parseFloat(x), parseFloat(y), parseFloat(z));
        }
        if (typ === 'point') {
            return tuple_1.point(parseFloat(x), parseFloat(y), parseFloat(z));
        }
        chai_1.assert.fail('Unexpected type');
        return new tuple_1.Tuple(NaN, NaN, NaN, NaN);
    };
    var TupleSteps_1;
    __decorate([
        cucumber_tsflow_1.given(/^(\w+) ← tuple\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    ], TupleSteps.prototype, "givenATuple", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+)\.([xyzw]) = (.*)$/)
    ], TupleSteps.prototype, "tupleFieldEquals", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+)\.(red|green|blue) = (.*)$/)
    ], TupleSteps.prototype, "colorFieldEquals", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+) is (\w* *)a point/)
    ], TupleSteps.prototype, "testPoint", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+) is (\w* *)a vector/)
    ], TupleSteps.prototype, "testVector", null);
    __decorate([
        cucumber_tsflow_1.given(/^(\w+) ← (tuple|point|vector)\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    ], TupleSteps.prototype, "givenATupleType", null);
    __decorate([
        cucumber_tsflow_1.given(/^(\w+) ← (color)\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    ], TupleSteps.prototype, "givenAColor", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+) = tuple\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    ], TupleSteps.prototype, "thenTupleEquals", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+) = (\w+)\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    ], TupleSteps.prototype, "thenTypedTupleEquals", null);
    __decorate([
        cucumber_tsflow_1.then(/^(\w+) (.) (.+) = (\w*)\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)(, ([+-]?\d*?\.?\d*))?\)$/)
    ], TupleSteps.prototype, "testMixedOperation", null);
    __decorate([
        cucumber_tsflow_1.then(/^-(\w+) = tuple\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    ], TupleSteps.prototype, "thenNegateTest", null);
    __decorate([
        cucumber_tsflow_1.then(/^magnitude\((.*)\) = (\D?)(.*)$/)
    ], TupleSteps.prototype, "thenMagnitudeEquals", null);
    __decorate([
        cucumber_tsflow_1.then(/^normalize\((.*)\) = (approximately )?vector\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    ], TupleSteps.prototype, "thenVectorEquals", null);
    __decorate([
        cucumber_tsflow_1.when(/^(\w+) ← normalize\((\w+)\)$/)
    ], TupleSteps.prototype, "whenNormed", null);
    __decorate([
        cucumber_tsflow_1.then(/^dot\((.*), (.*)\) = ([+-]?\d*?\.?\d*)$/)
    ], TupleSteps.prototype, "thenDotEquals", null);
    __decorate([
        cucumber_tsflow_1.when(/^(\w+) ← reflect\((\w+), (\w+)\)/)
    ], TupleSteps.prototype, "thenVectorOperation", null);
    __decorate([
        cucumber_tsflow_1.then(/^cross\((.*), (.*)\) = vector\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    ], TupleSteps.prototype, "thenCrossEquals", null);
    TupleSteps = TupleSteps_1 = __decorate([
        cucumber_tsflow_1.binding([Workspace_1.Workspace])
    ], TupleSteps);
    return TupleSteps;
}());
module.exports = TupleSteps;
//# sourceMappingURL=tuplesteps.js.map