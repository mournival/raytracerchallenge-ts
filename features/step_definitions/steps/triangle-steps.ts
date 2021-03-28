import {StepDefinitions} from 'jest-cucumber';
import {Triangle} from "../../../src/shapes";
import {shapes, tuples} from "../steps";
import {point, Tuple, vector} from "../../../src/tuple";
import {parseArg} from "../../../src/util";

export const triangleSteps: StepDefinitions = ({when, then}) => {
    when(/^([\w\d_]+) ← triangle\(([^,]+), ([^,]+), ([^,]+)\)$/, (shapeId: string, p1Id: string, p2Id: string, p3Id: string) => {
        shapes[shapeId] = new Triangle(
            tuples[p1Id],
            tuples[p2Id],
            tuples[p3Id]
        );
    })

    when(/^([\w\d_]+) ← triangle\(point\(([^,]+), ([^,]+), ([^,]+)\), point\(([^,]+), ([^,]+), ([^,]+)\), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/,
        (shapeId: string, p1xId: string, p1yId: string, p1zId: string, p2xId: string, p2yId: string, p2zId: string, p3xId: string, p3yId: string, p3zId: string) => {
            shapes[shapeId] = new Triangle(
                point(parseArg(p1xId), parseArg(p1yId), parseArg(p1zId)),
                point(parseArg(p2xId), parseArg(p2yId), parseArg(p2zId)),
                point(parseArg(p3xId), parseArg(p3yId), parseArg(p3zId))
            );
        })

    then(/^([\w\d_]+).(p[123]) = \2$/, (triangleId: string, vertexId: string) => {
        let actual: Tuple;
        switch (vertexId) {
            case 'p1':
                actual = (shapes[triangleId] as Triangle).p1;
                break;
            case 'p2':
                actual = (shapes[triangleId] as Triangle).p2;
                break;
            case 'p3':
                actual = (shapes[triangleId] as Triangle).p3;
                break;
            default:
                throw new Error('Unexpected vertex id');
        }
        const expected = tuples[vertexId];
        expect(Tuple.equals(actual, expected)).toBeTruthy()
    })

    then(/^([\w\d_]+).(e[123]) = vector\(([^,]+), ([^,]+), ([^,]+)\)$/,
        (triangleId: string, edgeId: string, x: string, y: string, z: string) => {
            let actual: Tuple;
            switch (edgeId) {
                case 'e1':
                    actual = (shapes[triangleId] as Triangle).e1;
                    break;
                case 'e2':
                    actual = (shapes[triangleId] as Triangle).e2;
                    break;
                default:
                    throw new Error('Unexpected edge id');
            }
            const expected = vector(parseArg(x), parseArg(y), parseArg(z));
            expect(Tuple.equals(actual, expected)).toBeTruthy()
        })

    then(/^([\w\d_]+).(normal) = vector\(([^,]+), ([^,]+), ([^,]+)\)$/,
        (triangleId: string, edgeId: string, x: string, y: string, z: string) => {
            const actual = (shapes[triangleId] as Triangle).normal;
            const expected = vector(parseArg(x), parseArg(y), parseArg(z));
            expect(Tuple.equals(actual, expected)).toBeTruthy()
        })

    then(/^([\w\d_]+) = ([\w\d_]+).normal$/, (normalId: string, triangleId: string) => {
        const actual = (shapes[triangleId] as Triangle).normal;
        const expected = tuples[normalId];
        expect(Tuple.equals(actual, expected)).toBeTruthy()
    })
}