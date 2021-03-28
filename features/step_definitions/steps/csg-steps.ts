import {StepDefinitions} from 'jest-cucumber';
import {shapes} from "../steps";
import {CSG, CSGOperation} from "../../../src/shapes/csg";
import {Cube, Shape, Sphere} from "../../../src/shapes";

export const csgSteps: StepDefinitions = ({given, when, then}) => {

    given(/(\w+) ← csg\("(\w+)", sphere\(\), cube\(\)\)/, (id: string, op: string) => {
        shapes[id] = new CSG(new Sphere(), new Cube(), stringToCsgOp(op));
    })

    when(/^(\w+) ← csg\("(\w+)", ([\w\d]+), ([\w\d]+)\)$/, (csgId: string, op: string, s1Id: string, s2Id: string) => {
        shapes[csgId] = new CSG(
            shapes[s1Id],
            shapes[s2Id],
            stringToCsgOp(op)
        );
        shapes[s1Id] = (shapes[csgId] as CSG).left;
        shapes[s2Id] = (shapes[csgId] as CSG).right;
    })

    function stringToCsgOp(op: string): CSGOperation {
        switch (op) {
            case 'union':
                return CSGOperation.UNION;
            case 'intersection':
                return CSGOperation.INTERSECTION;
            case 'difference':
                return CSGOperation.DIFFERENCE;
            default:
                throw 'Unexpected Operation Name: ' + op;
        }
    }

    then(/^(\w+)\.operation = "([\w]+)"/, (csgId: string, shapeId: string) => {
        const actual = (shapes[csgId] as CSG).operation;
        const expected = CSGOperation.UNION;
        expect(actual).toEqual(expected);
    })

    then(/^(\w+)\.left = ([\w\d]+)/, (csgId: string, shapeId: string) => {
        const actual = (shapes[csgId] as CSG).left;
        const expected = shapes[shapeId];
        expect(Shape.equals(actual, expected)).toBeTruthy()
    })

    then(/^(\w+)\.right = ([\w\d]+)/, (csgId: string, shapeId: string) => {
        const actual = (shapes[csgId] as CSG).right;
        const expected = shapes[shapeId];
        expect(Shape.equals(actual, expected)).toBeTruthy()
    })
}