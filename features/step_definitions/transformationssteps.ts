import {before, binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix, rotation_x, rotation_y, rotation_z, scaling, shearing, translation} from '../../src/matrix';
import {Tuple} from '../../src/tuple';


@binding([Workspace])
class TransformationsSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^(\w+) ← translation\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public givensTransformation(tId: string, x: string, y: string, z: string) {
        this.workspace.matrices[tId] = translation(parseFloat(x), parseFloat(y), parseFloat(z));
    }

    @given(/^(\w+) ← scaling\(([^,]+), ([^,]+), ([^,*]+)\)$/)
    public givensScaling(tId: string, x: string, y: string, z: string) {
        this.workspace.matrices[tId] = scaling(parseFloat(x), parseFloat(y), parseFloat(z));
    }

    @then(/^transform \* (\w+) = (\w+)$/)
    public thenTransformVectorToVectorName(rhsId: string, productId: string) {
        const actual = Matrix.multiplyVector(this.workspace.matrices['transform'], this.workspace.tuples[rhsId]);
        const expected = this.workspace.tuples[productId];
        expect(Tuple.equals(actual, expected)).to.be.true;
    }

    @given(/^([\w_]+) ← rotation_x\(π \/ (\d+)\)$/)
    public givensRotationX(tId: string, x: string) {
        this.workspace.matrices[tId] = rotation_x(Math.PI / parseInt(x));
    }

    @given(/^([\w_]+) ← rotation_y\(π \/ (\d+)\)$/)
    public givensRotationY(tId: string, x: string) {
        this.workspace.matrices[tId] = rotation_y(Math.PI / parseInt(x));
    }

    @given(/^([\w_]+) ← rotation_z\(π \/ (\d+)\)$/)
    public givensRotationZ(tId: string, x: string) {
        this.workspace.matrices[tId] = rotation_z(Math.PI / parseInt(x));
    }

    @given(/^(\w+) ← shearing\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/)
    public givenShearing(tId: string, x_y: string, x_z: string, y_x: string, y_z: string, z_x: string, z_y: string) {
        this.workspace.matrices[tId] = shearing(
            parseFloat(x_y), parseFloat(x_z), parseFloat(y_x),
            parseFloat(y_z), parseFloat(z_x), parseFloat(z_y)
        );
    }
}

export = TransformationsSteps;