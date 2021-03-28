import {point, Tuple, vector, VectorElement} from '../../../src/tuple';

import {StepDefinitions} from 'jest-cucumber';
import {parseArg, Util} from "../../../src/util";
import {Color, RGBElement} from "../../../src/color";
import {Matrix} from "../../../src/matrix";
import {matrices} from "../steps";
import {ColorArray, NumberArray, TupleArray} from "../types";

export let tuples: TupleArray
export let colors: ColorArray

export const tupleSteps: StepDefinitions = ({given, and, when, then}) => {

    let numbers: NumberArray;
    beforeAll(() => {
        tuples = {}
        colors = {}
        numbers = {}
    })

    given(/([\w\d_]+) ← (tuple|point|vector)\(([^,]+), ([^,]+), ([^,]+)[, ]*(.*)\)/,
        (name: string, tupleType: string, x: string, y: string, z: string, w: string) => {
            tuples[name] = createExpectedTupleType(tupleType, x, y, z, w);
        })

    given(/^([\w\d_]+) ← color\(([^,]+), ([^,]+), ([^,]+)\)$/,
        (id: string, x: string, y: string, z: string) => {
            colors[id] = new Color(parseArg(x), parseArg(y), parseArg(z));
        }
    )

    given(/color value of (\w+) ← (.*)$/, (id: string, value: string) => {
        numbers[id] = parseArg(value)
    })

    and(/^([\w\d_]+) ← normalize\(vector\(([^,]+), ([^,]+), ([^,]+)\)\)$/, (normalizedId: string, x: string, y: string, z: string) => {
        tuples[normalizedId] = vector(parseArg(x), parseArg(y), parseArg(z)).normalize;
    })

    when(/^([\w\d_]+) ← normalize\(([\w\d_]+)\)$/, (id: string, src: string) => {
        tuples[id] = tuples[src].normalize;
    })

    when(/color (.*) ← (.*) \* (.*)/, (productId: string, lhs: string, rhs: string) => {
        colors[productId] = Color.multiply(colors[lhs], colors[rhs])
    })

    when(/^([\w\d_]+) ← reflect\(([\w\d_]+), ([\w\d_]+)\)/, (id: string, vId: string, nId: string) => {
        tuples[id] = Tuple.reflect(tuples[vId], tuples[nId]);
    })

    then(/^(\w+)\.([xyzw]) = (.*)$/, (arg0: string, arg1: VectorElement, arg2: string) => {
        expect(tuples[arg0].getElement(arg1)).toBe(parseArg(arg2));
    })

    then(/^(\w+) is (\w* *)a point/, (id: string, not?: string) => {
        expect(tuples[id].isPoint).toEqual(not !== 'not ');
    })

    then(/^(\w+) is (\w* *)a vector/, () => (id: string, not?: string) => {
        expect(tuples[id].isVector).toEqual(not !== 'not ');
    })

    then(/^([\w\d_]+) = (tuple|point|vector)\(([^,]+), ([^,]+), ([^,]+)[, ]*(.*)\)$/,
        (id: string, expectedType: string, x: string, y: string, z: string, w: string) => {
            const expected = createExpectedTupleType(expectedType, x, y, z, w);
            const actual = tuples[id];
            expect(Tuple.equals(actual, expected)).toBeTruthy();
        })

    then(/^([\w\d_]+) = (color)\(([^,]+), ([^,]+), ([^,]+)\)$/,
        (id: string, expectedType: string, x: string, y: string, z: string) => {
            const expected = new Color(parseArg(x), parseArg(y), parseArg(z));
            const actual = colors[id];
            expect(Color.equals(actual, expected)).toBeTruthy();
        })

    then(/tuple (.*) is not equal to (.*)/, (lhs: string, rhs: string) => {
        expect(Tuple.equals(tuples[lhs], tuples[rhs])).toBeFalsy();
    })

    then(/tuple (.*) equals (.*)/, (lhs: string, rhs: string) => {
        expect(Tuple.equals(tuples[lhs], tuples[rhs])).toBeTruthy();
    })

    then(/^([\w\d_]+)\s+([+-/*])\s+(.+) = (\w*)\(([^,]+), ([^,]+), ([^,]+)[, ]*([^,]*)\)$/,
        (lhs: string, op: string, rhs: string, expectedType: string, x: string, y: string, z: string, w: string) => {
            if (expectedType === 'color') {
                colorOp(op, lhs, rhs, x, y, z);
            } else {
                tupleOp(op, lhs, rhs, x, y, z, w, expectedType);
            }
        })

    then(/^-([\w\d_]+) = tuple\(([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/, (id: string, x: string, y: string, z: string, w: string) => {
        expect(Tuple.equals(tuples[id].negative, new Tuple(parseArg(x), parseArg(y), parseArg(z), parseArg(w)))).toBeTruthy();
    })

    then(/^(\w+)\.(red|green|blue) = (.*)$/, (id: string, field: RGBElement, value: string) => {
        expect(colors[id].getElement(field)).toEqual(parseArg(value));
    })

    then(/^magnitude\(([\w\d_]+)\) = (.*)$/, (id: string, m: string) => {
        expect(tuples[id].magnitude).toBeCloseTo(parseArg(m));
    })

    then(/^normalize\(([\w\d_]+)\) = (approximately )?vector\(([^,]+), ([^,]+), ([^,]+)\)$/,
        (id: string, approx: string, x: string, y: string, z: string) => {
            const actualVal = tuples[id].normalize;
            const expectedVal = vector(parseArg(x), parseArg(y), parseArg(z));
            expect(Tuple.equals(actualVal, expectedVal)).toBeTruthy();
        }
    )

    then(/^dot\(([\w\d_]+), ([\w\d_]+)\) = ([^,]+)$/,
        (lhs: string, rhs: string, product: string) => {
            expect(
                Util.closeTo(Tuple.dot(tuples[lhs], tuples[rhs]), parseArg(product))
            ).toBeTruthy();
        })

    then(/^cross\(([\w\d_]+), ([\w\d_]+)\) = vector\(([^,]+), ([^,]+), ([^,]+)\)$/,
        (lhs: string, rhs: string, x: string, y: string, z: string) => {
            const actualVal = Tuple.cross(tuples[lhs], tuples[rhs]);
            const expectedVal = vector(parseArg(x), parseArg(y), parseArg(z));
            expect(Tuple.equals(actualVal, expectedVal)).toBeTruthy();
        })

    then(/mapColor\((.*)\) = (.*)$/, (id: string, expected: string) => {
        expect(Color.mapColor(numbers[id])).toBeCloseTo(parseArg(expected))
    })

    then(/color (.*) does not equal color (.*)/, (lhs: string, rhs: string) => {
        expect(Color.equals(colors[lhs], colors[rhs])).toBeFalsy()
    })

    then(/color (.*) = color\(([^,]+), ([^,]+), ([^,]+)\)/, (colorId: string, r: string, g: string, b: string) => {
        const expected = new Color(parseArg(r), parseArg(g), parseArg(b))
        expect(Color.equals(colors[colorId], expected)).toBeTruthy()
    })

    then(/color (.*) as string is (.*)/, (id: string, expected: string) => {
        expect(colors[id].asString()).toEqual(expected)
    })

    function tupleOp(op: string, lhs: string, rhs: string, x: string, y: string, z: string, w: string, expectedType: string) {
        switch (op) {
            case '+':
                expect(
                    Tuple.equals(Tuple.add(tuples[lhs], tuples[rhs]), new Tuple(parseArg(x), parseArg(y), parseArg(z), parseArg(w)))
                ).toBeTruthy();
                break;
            case '-':
                expect(
                    Tuple.equals(Tuple.subtract(tuples[lhs], tuples[rhs]), createExpectedTupleType(expectedType, x, y, z, w))
                ).toBeTruthy();
                break;
            case '*':
                if (matrices && matrices[lhs]) {
                    const actual = Matrix.multiplyVector(matrices[lhs], tuples[rhs]);
                    const expected = createExpectedTupleType(expectedType, x, y, z, w);
                    expect(Tuple.equals(actual, expected)).toBeTruthy();
                } else {
                    expect(
                        Tuple.equals(Tuple.multiply(tuples[lhs], parseArg(rhs)), new Tuple(parseArg(x), parseArg(y), parseArg(z), parseArg(w)))
                    ).toBeTruthy();
                }
                break;
            case '/':
                expect(
                    Tuple.equals(Tuple.divide(tuples[lhs], parseArg(rhs)), new Tuple(parseArg(x), parseArg(y), parseArg(z), parseArg(w)))
                ).toBeTruthy();
                break;
            default:
                throw new Error('Unexpected op code');
        }
    }

    function colorOp(op: string, lhs: string, rhs: string, x: string, y: string, z: string) {
        switch (op) {
            case '+':
                expect(
                    Color.equals(Color.add(colors[lhs], colors[rhs]), new Color(parseArg(x), parseArg(y), parseArg(z)))
                ).toBeTruthy();
                break;
            case '-':
                expect(
                    Color.equals(Color.subtract(colors[lhs], colors[rhs]), new Color(parseArg(x), parseArg(y), parseArg(z)))
                ).toBeTruthy();
                break;
            case '*':
                if (colors[rhs]) {
                    expect(
                        Color.equals(Color.multiply(colors[lhs], colors[rhs]), new Color(parseArg(x), parseArg(y), parseArg(z)))
                    ).toBeTruthy();
                } else {
                    expect(
                        Color.equals(colors[lhs].scale(parseArg(rhs)), new Color(parseArg(x), parseArg(y), parseArg(z)))
                    ).toBeTruthy();
                }
                break;
            default:
                throw new Error('Unexpected op code');
        }
    }

    function createExpectedTupleType(typ: string, xs: string, ys: string, zs: string, w = ''): Tuple {
        const x = parseArg(xs);
        const y = parseArg(ys);
        const z = parseArg(zs);
        if (typ === 'vector') {
            return vector(x, y, z);
        }
        if (typ === 'point') {
            return point(x, y, z);
        }
        if (typ === 'tuple') {
            return new Tuple(x, y, z, parseArg(w));
        }

        throw new Error('Unexpected type');
    }
}
