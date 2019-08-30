import {before, binding, given, then, when} from 'cucumber-tsflow';
import {assert, expect} from 'chai';

import {point, Tuple, vector, VectorElement} from '../../src/tuple';
import {Color, RGBElement} from '../../src/color';
import {Workspace} from './Workspace';
import {Matrix} from "../../src/matrix";

@binding([Workspace])
class TupleSteps {

    constructor(protected workspace: Workspace) {
    }

    @then(/^(\w+)\.([xyzw]) = (.*)$/)
    public tupleFieldEquals(id: string, field: VectorElement, value: string) {
        expect(this.workspace.tuples[id].getElements(field)).to.eq(TupleSteps.parseArg(value));
    }

    @then(/^(\w+)\.(red|green|blue) = (.*)$/)
    public colorFieldEquals(id: string, field: RGBElement, value: string) {
        expect(this.workspace.colors[id].getElement(field)).to.eq(TupleSteps.parseArg(value));
    }

    @then(/^(\w+) is (\w* *)a point/)
    public testPoint(id: string, not?: string) {
        expect(Tuple.isPoint(this.workspace.tuples[id])).to.eq(not !== 'not ');
    }

    @then(/^(\w+) is (\w* *)a vector/)
    public testVector(id: string, not?: string) {
        expect(Tuple.isVector(this.workspace.tuples[id])).to.eq(not !== 'not ');
    }

    @given(/^(\w+) ← (tuple|point|vector)\(([^,]+), ([^,]+), ([^,]+)[, ]*(.*)\)$/)
    public givenATupleType(id: string, expectedType: string, x: string, y: string, z: string, w: string): void {
        this.workspace.tuples[id] = TupleSteps.createExpected(expectedType, x, y, z, w);
    }

    @given(/^(\w+) ← (color)\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public givenAColor(id: string, expectedType: string, x: string, y: string, z: string): void {
        this.workspace.colors[id] = new Color(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z));
    }

    @then(/^(\w+) = tuple\(([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenTupleEquals(id: string, x: string, y: string, z: string, w: string): void {
        expect(
            Tuple.equals(this.workspace.tuples[id], new Tuple(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z), TupleSteps.parseArg(w)))
        ).to.be.true;
    }

    @then(/^(\w+) = (\w+)\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenTypedTupleEquals(id: string, expectedType: string, x: string, y: string, z: string): void {
        let expectedValue = TupleSteps.createExpected(expectedType, x, y, z);
        expect(
            Tuple.equals(this.workspace.tuples[id], expectedValue)
        ).to.be.true;
    }

    @then(/^(\w+) (.) (.+) = (\w*)\(([^,]+), ([^,]+), ([^,]+)[, ]*([^,]*)\)$/)
    public testMixedOperation(lhs: string, op: string, rhs: string, expectedType: string, x: string, y: string, z: string, w: string): void {
        switch (expectedType) {
            case 'color':
                this.colorOp(op, lhs, rhs, x, y, z);
                break;
            default:
                this.tupleOp(op, lhs, rhs, x, y, z, w, expectedType);
                break;
        }
    }

    private colorOp(op: string, lhs: string, rhs: string, x: string, y: string, z: string) {
        switch (op) {
            case '+':
                expect(
                    Color.equals(Color.add(this.workspace.colors[lhs], this.workspace.colors[rhs]), new Color(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z)))
                ).to.be.true;
                break;
            case '-':
                expect(
                    Color.equals(Color.subtract(this.workspace.colors[lhs], this.workspace.colors[rhs]), new Color(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z)))
                ).to.be.true;
                break;
            case '*':
                if (this.workspace.colors[rhs]) {
                    expect(
                        Color.equals(Color.multiply(this.workspace.colors[lhs], this.workspace.colors[rhs]), new Color(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z)))
                    ).to.be.true;
                } else {
                    expect(
                        Color.equals(Color.multiplyScalar(this.workspace.colors[lhs], TupleSteps.parseArg(rhs)), new Color(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z)))
                    ).to.be.true;
                }
                break;
            default:
                assert.fail('Unexpected op code');

        }
    }

    private tupleOp(op: string, lhs: string, rhs: string, x: string, y: string, z: string, w: string, expectedType: string) {
        switch (op) {
            case '+':
                expect(
                    Tuple.equals(Tuple.add(this.workspace.tuples[lhs], this.workspace.tuples[rhs]), new Tuple(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z), TupleSteps.parseArg(w)))
                ).to.be.true;
                break;
            case '-':
                expect(
                    Tuple.equals(Tuple.subtract(this.workspace.tuples[lhs], this.workspace.tuples[rhs]), TupleSteps.createExpected(expectedType, x, y, z))
                ).to.be.true;
                break;
            case '*':
                if (this.workspace.matrices[lhs]) {
                    const actual = Matrix.multiplyVector(this.workspace.matrices[lhs], this.workspace.tuples[rhs]);
                    const expected = TupleSteps.createExpected(expectedType, x, y, z, w);
                    expect(Tuple.equals(actual, expected),
                        JSON.stringify(actual) + ' should equal ' + JSON.stringify(expected) + ' ' + x+ ' ' + y + ' ' + z).to.be.true;
                } else {
                    expect(
                        Tuple.equals(Tuple.multiply(this.workspace.tuples[lhs], TupleSteps.parseArg(rhs)), new Tuple(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z), TupleSteps.parseArg(w)))
                    ).to.be.true;
                }
                break;
            case '/':
                expect(
                    Tuple.equals(Tuple.divide(this.workspace.tuples[lhs], TupleSteps.parseArg(rhs)), new Tuple(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z), TupleSteps.parseArg(w)))
                ).to.be.true;
                break;
            default:
                assert.fail('Unexpected op code');
        }
    }

    @then(/^-(\w+) = tuple\(([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenNegateTest(id: string, x: string, y: string, z: string, w: string): void {
        expect(
            Tuple.equals(Tuple.negate(this.workspace.tuples[id]), new Tuple(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z), TupleSteps.parseArg(w)))
        ).to.be.true;
    }

    @then(/^magnitude\((.*)\) = (√?)(.*)$/)
    public thenMagnitudeEquals(id: string, radical: string, m: string): void {
        let mag = radical ? Math.sqrt(TupleSteps.parseArg(m)) : TupleSteps.parseArg(m);
        expect(Tuple.magnitude(this.workspace.tuples[id])).to.be.eq(mag);
    }

    @then(/^normalize\((.*)\) = (approximately )?vector\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenVectorEquals(id: string, approx: string, x: string, y: string, z: string): void {
        let actualVal = Tuple.normalize(this.workspace.tuples[id]);
        let expectedVal = vector(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z));
        expect(Tuple.equals(actualVal, expectedVal)).to.be.true;
    }

    @when(/^(\w+) ← normalize\((\w+)\)$/)
    public whenNormed(id: string, src: string): void {
        this.workspace.tuples[id] = Tuple.normalize(this.workspace.tuples[src]);
    }

    @then(/^dot\((.*), (.*)\) = ([^,]+)$/)
    public thenDotEquals(lhs: string, rhs: string, product: string): void {
        expect(
            Math.abs(Tuple.dot(this.workspace.tuples[lhs], this.workspace.tuples[rhs]) - TupleSteps.parseArg(product)) < Tuple.EPSILON
        ).to.be.true;
    }

    @when(/^(\w+) ← reflect\((\w+), (\w+)\)/)
    public thenVectorOperation(id: string, vId: string, nId: string): void {
        this.workspace.tuples[id] = Tuple.reflect(this.workspace.tuples[vId], this.workspace.tuples[nId]);
    }

    @then(/^cross\((.*), (.*)\) = vector\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenCrossEquals(lhs: string, rhs: string, x: string, y: string, z: string): void {
        let actualVal = Tuple.cross(this.workspace.tuples[lhs], this.workspace.tuples[rhs]);
        let expectedVal = vector(TupleSteps.parseArg(x), TupleSteps.parseArg(y), TupleSteps.parseArg(z));
        expect(Tuple.equals(actualVal, expectedVal)).to.be.true;
    }

    private static createExpected(typ: string, xs: string, ys: string, zs: string, w = ''): Tuple {
        const x = TupleSteps.parseArg(xs);
        const y = TupleSteps.parseArg(ys);
        const z = TupleSteps.parseArg(zs);
        if (typ === 'vector') {
            return vector(x, y, z);
        }
        if (typ === 'point') {
            return point(x, y, z);
        }
        if (typ === 'tuple') {
            return new Tuple(x, y, z, TupleSteps.parseArg(w));
        }
        assert.fail('Unexpected type');
        return new Tuple(NaN, NaN, NaN, NaN);
    }

    public static parseArg(s: string): number {
        // int
        if (s.match(/^[+-]?\d+$/))
            return parseInt(s);

        // simple float
        if (s.match(/^([+-]?\d*?\.\d*)$/))
            return parseFloat(s);

        // rational
        if (s.match(/^[+-]?\d+\s*\/\s*\d+$/)) {
            const matchArray = s.split('/');
            return parseInt(matchArray[0]) / parseInt(matchArray[1]);
        }
        if (s.match(/^√\d+\s*\/\s*\d+$/)) {
            const matchArray = s.split('/');
            return Math.sqrt(parseInt(matchArray[0].slice(1))) / parseInt(matchArray[1]);
        }
        if (s.match(/^-√\d+\s*\/\s*\d+$/)) {
            const matchArray = s.split('/');
            return -Math.sqrt(parseInt(matchArray[0].slice(2))) / parseInt(matchArray[1]);
        }
        // irrational ratio
        throw 'Parse error: ' + s;

    }
}


export = TupleSteps;