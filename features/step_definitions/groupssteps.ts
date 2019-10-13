import {binding, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {Group} from '../../src/group';

@binding([Workspace])
class GroupsSteps {

    constructor(protected workspace: Workspace) {
    }

    @when(/^([\w\d_]+) ← group\(\)$/)
    public whenGroupCreated(groupId: string) {
        this.workspace.shapes[groupId] = new Group();
    }

}

export = GroupsSteps;