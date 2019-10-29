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

}

export = CSGsSteps;