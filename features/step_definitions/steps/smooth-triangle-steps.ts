import {StepDefinitions} from 'jest-cucumber';
import {SmoothTriangle} from "../../../src/shapes";
import {intersection, intersections, shapes, tuples} from "../steps";
import {point, Tuple} from "../../../src/tuple";
import {parseArg} from "../../../src/util";

export const smoothTriangleSteps: StepDefinitions = ({when, then}) => {

    when(/^([\w\d_]+) ← smooth_triangle\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/,
        (shapeId: string, p1Id: string, p2Id: string, p3Id: string, n1Id: string, n2Id: string, n3Id: string) => {
            shapes[shapeId] = new SmoothTriangle(
                tuples[p1Id], tuples[p2Id], tuples[p3Id],
                tuples[n1Id], tuples[n2Id], tuples[n3Id]
            );
        })

    then(/^smooth triangle ([\w\d_]+).(n[123]) = \2$/, (smoothTriangleId: string, vertexId: string) => {
        let actual: Tuple;
        switch (vertexId) {
            case 'n1':
                actual = (shapes[smoothTriangleId] as SmoothTriangle).n1;
                break;
            case 'n2':
                actual = (shapes[smoothTriangleId] as SmoothTriangle).n2;
                break;
            case 'n3':
                actual = (shapes[smoothTriangleId] as SmoothTriangle).n3;
                break;
            default:
                throw new Error('Unexpected normal id');
        }
        expect(Tuple.equals(actual, tuples[vertexId])).toBeTruthy()
    })

    then(/^(\w+)\[(\d+)].u = ([^,]+)$/, (intersectionsId: string, intersectionIndex: string, expected: string) => {
        const actual = intersections[intersectionsId][parseInt(intersectionIndex)].u;
        expect(actual).toBeCloseTo(parseArg(expected), 0.0001);
    })

    then(/^(\w+)\[(\d+)].v = ([^,]+)$/, (intersectionsId: string, intersectionIndex: string, expected: string) => {
        const actual = intersections[intersectionsId][parseInt(intersectionIndex)].v;
        expect(actual).toBeCloseTo(parseArg(expected), 0.0001);
    })

    when(/^([\w\d_]+) ← normal_at\((\w+), point\(([^,]+), ([^,]+), ([^,]+)\), i\)$/,
        (normalId: string, shapeId: string, x: string, y: string, z: string) => {
            tuples[normalId] = shapes[shapeId].normal_at(
                point(parseArg(x), parseArg(y), parseArg(z)),
                intersection['i']
            );
        })
}