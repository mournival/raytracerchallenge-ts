import {binding} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {CSG, CSGOperation} from '../../src/shapes/csg';
import {then, when} from 'cucumber-tsflow/dist';
import {expect} from 'chai';
import {Shape} from '../../src/shapes';

@binding([Workspace])
class CSGsSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^(\w+) ← csg\("union", ([\w\d]+), ([\w\d]+)\)$/)
    public whenCSG(csgId: string, s1Id: string, s2Id: string) {
        this.workspace.shapes[csgId] = new CSG(
            this.workspace.shapes[s1Id],
            this.workspace.shapes[s2Id],
            CSGOperation.UNION
        );
        this.workspace.shapes[s1Id] = (this.workspace.shapes[csgId] as CSG).left;
        this.workspace.shapes[s2Id] = (this.workspace.shapes[csgId] as CSG).right;
    }

    @then(/^(\w+)\.operation = "([\w]+)"/)
    public thenCsgoperationIs(csgId: string, shapeId: string) {
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

}

function stringToCsgOp(op: string) : CSGOperation {
    switch (op) {
        case 'union':
            return CSGOperation.UNION;
        case 'intersection':
            return CSGOperation.INTERSECTION;
        case 'difference':
            return CSGOperation.DIFFERENCE;
        default:
            throw 'Unexpected Operation Namee: ' + op;
    }
}

export = CSGsSteps;