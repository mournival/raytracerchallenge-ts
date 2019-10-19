import {binding, given} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {Cone} from '../../src/cone';

@binding([Workspace])
class ConeSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← cone\(\)$/)
    public givenTestCone(coneId: string) {
        this.workspace.shapes[coneId] = new Cone();
    }

}

export = ConeSteps;