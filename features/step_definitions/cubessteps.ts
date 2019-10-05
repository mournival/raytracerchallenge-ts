import {binding, given} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {Cube} from '../../src/cube';
import {when} from 'cucumber-tsflow/dist';

@binding([Workspace])
class CubeSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← cube\(\)$/)
    public givenTestCube(cubeId: string) {
        this.workspace.shapes[cubeId] = new Cube();
    }

    @when(/^([\w\d_]+) ← local_normal_at\(([\w\d_]+), ([\w\d_]+)\)$/)
    public whenLocalNormalAt(normalId: string, shapeId: string, point: string) {
        this.workspace.tuples[normalId] = this.workspace.shapes[shapeId].local_normal_at(
            this.workspace.tuples[point]
        );
    }

}

export = CubeSteps;