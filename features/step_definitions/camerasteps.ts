import {binding, given, then} from 'cucumber-tsflow';
import {shouldEqualMsg, Workspace} from './Workspace';
import {expect} from 'chai';
import {
    Matrix,
    rotation_x,
    rotation_y,
    rotation_z,
    scaling,
    shearing,
    translation,
    view_transform
} from '../../src/matrix';
import {Tuple} from '../../src/tuple';
import {when} from 'cucumber-tsflow/dist';


@binding([Workspace])
class CameraSteps {

    constructor(protected workspace: Workspace) {
    }

}

export = CameraSteps;