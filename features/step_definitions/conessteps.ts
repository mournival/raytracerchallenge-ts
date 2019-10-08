import {binding, given} from 'cucumber-tsflow';
import {parseArg, Workspace} from './Workspace';
import {Cone} from '../../src/cone';
import {point, vector} from '../../src/tuple';
import {Ray} from '../../src/ray';
import {then} from 'cucumber-tsflow/dist';
import {expect} from 'chai';

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