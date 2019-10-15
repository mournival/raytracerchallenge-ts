import {binding, then, when} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {Group} from '../../src/group';
import {expect} from 'chai';
import {Shape} from '../../src/shape';

@binding([Workspace])
class GroupsSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([\w\d_]+) ← group\(\)$/)
    public whenGroupCreated(groupId: string) {
        this.workspace.shapes[groupId] = new Group();
    }

    @when(/^add_child\(([\w\d_]+), ([\w\d_]+)\)$/)
    public whenChildAdded(groupId: string, shapeId: string) {
        const group = this.workspace.shapes[groupId] as Group;
        const shape = this.workspace.shapes[shapeId].replace(group);
        this.workspace.shapes[shapeId] = shape;
        this.workspace.shapes[groupId] = group.add_child(shape);
    }

    @then(/^([\w\d_]+) is not empty$/)
    public thenGroupIsNotEmpty(groupId: string) {
        expect((this.workspace.shapes[groupId] as Group).empty).to.be.false;
    }

    @then(/^([\w\d_]+) includes ([\w\d_]+)$/)
    public thenGroupIncludesShape(groupId: string, shapeId: string) {
        expect((this.workspace.shapes[groupId] as Group).includes(this.workspace.shapes[shapeId])).to.be.true;
    }

    @then(/^([\w\d_]+).parent = ([\w\d_]+)$/)
    public thenTestShapeHasNoParent(shapeId: string, groupId: string) {
        const actual = this.workspace.shapes[shapeId].parent;
        const expected = this.workspace.shapes[groupId];

        expect(actual !== null && Shape.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }
}

export = GroupsSteps;