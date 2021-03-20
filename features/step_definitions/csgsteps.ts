import {binding} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {CSG, CSGOperation} from '../../src/shapes/csg';
import {given, then, when} from 'cucumber-tsflow/dist';
import {expect} from 'chai';
import {Cube, Shape, Sphere} from '../../src/shapes';

@binding([Workspace])
class CSGsSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^(\w+) ← csg\("(\w+)", ([\w\d]+), ([\w\d]+)\)$/)
    public whenCSG(csgId: string, op: string, s1Id: string, s2Id: string) {
        this.workspace.shapes[csgId] = new CSG(
            this.workspace.shapes[s1Id],
            this.workspace.shapes[s2Id],
            stringToCsgOp(op)
        );
        this.workspace.shapes[s1Id] = (this.workspace.shapes[csgId] as CSG).left;
        this.workspace.shapes[s2Id] = (this.workspace.shapes[csgId] as CSG).right;
    }

    @then(/^(\w+)\.operation = "([\w]+)"/)
    public thenCsgOperationIs(csgId: string, shapeId: string) {
        const actual = (this.workspace.shapes[csgId] as CSG).operation;
        const expected = CSGOperation.UNION;

        expect(actual).to.be.equal(expected);
    }

    @then(/^(\w+)\.left = ([\w\d]+)/)
    public thenCsgLeftIs(csgId: string, shapeId: string) {
        const actual = (this.workspace.shapes[csgId] as CSG).left;
        const expected = this.workspace.shapes[shapeId];

        expect(Shape.equals(actual, expected)).to.be.true;
    }

    @then(/^(\w+)\.right = ([\w\d]+)/)
    public thenCsgRightIs(csgId: string, shapeId: string) {
        const actual = (this.workspace.shapes[csgId] as CSG).right;
        const expected = this.workspace.shapes[shapeId];

        expect(Shape.equals(actual, expected)).to.be.true;
    }

    @when(/^(\w+) ← intersection_allowed\("(\w+)", (\w+), (\w+), (\w+)\)$/)
    public intersectionAllowed(resultId: string, op: string, lhit: string, inl: string, inr: string) {
        this.workspace.tests[resultId] = CSG.intersectionAllowed(stringToCsgOp(op), lhit === 'true', inl === 'true', inr === 'true');
    }

    @then(/^result = (\w+)$/)
    public intersectionResultId(result: string) {
        expect(this.workspace.tests['result']).to.be.equal(result === 'true');
    }

    @when(/^(\w+) ← filter_intersections\((\w+), (\w+)\)$/)
    public whenFilterIntersections(filteredIntersection: string, shapeId: string, intersectionsId: string) {
        this.workspace.intersections[filteredIntersection] = (this.workspace.shapes[shapeId] as CSG).filter_intersections(
            this.workspace.intersections[intersectionsId]
        );
    }

    @then(/^(\w+)\[(\d+)] = xs\[([^,xs]+)]$/)
    public thenIntersectionValue(intersectionsId: string, intersectionIndex: string, value: string) {
        const actual = this.workspace.intersections[intersectionsId][parseInt(intersectionIndex)];
        const expected = this.workspace.intersections['xs'][parseInt(value)];

        expect(actual.t).to.be.closeTo(expected.t, 0.0001);
        expect(Shape.equals(actual.obj, expected.obj)).to.be.true;
    }

    @given(/c ← csg\("(\w+)", sphere\(\), cube\(\)\)/)
    public givenCSGUnion(op: string) {
        this.workspace.shapes['c'] = new CSG(new Sphere(), new Cube(), stringToCsgOp(op));
    }

}

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

export = CSGsSteps;