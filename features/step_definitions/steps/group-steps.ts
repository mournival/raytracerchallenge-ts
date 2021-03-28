import {StepDefinitions} from 'jest-cucumber';
import {Group, Shape} from "../../../src/shapes";
import {intersections, shapes} from "../steps";
import {CSG, CSGOperation} from "../../../src/shapes/csg";

export const groupSteps: StepDefinitions = ({given, when, then}) => {
    let tests: { [index: string]: boolean; } = {}
    beforeAll(() => {
        tests = {}
    })

    given(/^([\w\d_]+) ← group\(\)$/, (shapeId: string) => {
        shapes[shapeId] = new Group();
    })

    when(/^add_child\(([\w\d_]+), ([\w\d_]+)\)$/, (parentId: string, childId: string) => {
        let parent = shapes[parentId] as Group;
        const child = shapes[childId].replace(parent);
        shapes[parentId] = parent.add_child(child);
        parent = shapes[parentId] as Group;

        shapes[childId] = parent.children[parent.children.length - 1];
    })

    when(/^(\w+) ← intersection_allowed\("(\w+)", (\w+), (\w+), (\w+)\)$/,
        (resultId: string, op: string, lhit: string, inl: string, inr: string) => {
            tests[resultId] = CSG.intersectionAllowed(stringToCsgOp(op), lhit === 'true', inl === 'true', inr === 'true');
        })

    when(/^(\w+) ← filter_intersections\((\w+), (\w+)\)$/, (filteredIntersection: string, shapeId: string, intersectionsId: string) => {
        intersections[filteredIntersection] = (shapes[shapeId] as CSG).filter_intersections(
            intersections[intersectionsId]
        );
    })

    then(/^([\w\d_]+) is not empty$/, (groupId: string) => {
        expect((shapes[groupId] as Group).empty).toBeFalsy();
    })

    then(/^([\w\d_]+) is empty$/, (id: string) => {
        if (intersections[id] != null) {
            expect(intersections[id].length).toEqual(0);
        } else if (shapes[id] != null) {
            expect((shapes[id] as Group).empty).toBeTruthy();
        } else {
            throw new Error('Not sure what to test')
        }
    })

    then(/^([\w\d_]+) includes ([\w\d_]+)$/, (groupId: string, shapeId: string) => {
        expect((shapes[groupId] as Group).local_includes(shapes[shapeId])).toBeTruthy()
    })

    then(/^([\w\d_]+).parent = ([\w\d_]+)$/, (shapeId: string, expected: string) => {
        const actual = shapes[shapeId].parent;
        expect(actual !== null && Shape.equals(actual, shapes[expected])).toBeTruthy();
    })

    then(/^result = (\w+)$/, (result: string) => {
        expect(tests['result']).toEqual(result === 'true');
    })

    then(/^(\w+)\[(\d+)] = xs\[([^,xs]+)]$/, (intersectionsId: string, intersectionIndex: string, value: string) => {
        const actual = intersections[intersectionsId][parseInt(intersectionIndex)];
        const expected = intersections['xs'][parseInt(value)];

        expect(actual.t).toBeCloseTo(expected.t, 0.0001);
        expect(Shape.equals(actual.obj, expected.obj)).toBeTruthy();
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
}