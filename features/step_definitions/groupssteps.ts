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
    public whenChildAdded(parentId: string, childId: string) {
        let parent = this.workspace.shapes[parentId] as Group;
        const child = this.workspace.shapes[childId].replace(parent);
        this.workspace.shapes[parentId] = parent.add_child(child);
        parent = this.workspace.shapes[parentId] as Group;
        
        this.workspace.shapes[childId] = parent.children[parent.children.length - 1];
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