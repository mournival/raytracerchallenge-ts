import {binding, given, then} from 'cucumber-tsflow';
import {parseArg, shouldEqualMsg, Workspace} from './Workspace';
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
class TransformationsSteps {

    constructor(protected workspace: Workspace) {
    }

    @given(/^([\w\d_]+) ← translation\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public givensTransformation(tId: string, x: string, y: string, z: string) {
        this.workspace.matrices[tId] = translation(parseArg(x), parseArg(y), parseArg(z));
        this.workspace.matrices[tId] = translation(parseArg(x), parseArg(y), parseArg(z));
    }

    @given(/^([\w\d_]+) ← scaling\(([^,]+), ([^,]+), ([^,*]+)\)$/)
    public givensScaling(tId: string, x: string, y: string, z: string) {
        this.workspace.matrices[tId] = scaling(parseArg(x), parseArg(y), parseArg(z));
    }

    @then(/^transform \* ([\w\d_]+) = (\w+)$/)
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

    @given(/^([\w\d_]+) ← shearing\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/)
    public givenShearing(tId: string, x_y: string, x_z: string, y_x: string, y_z: string, z_x: string, z_y: string) {
        this.workspace.matrices[tId] = shearing(
            parseArg(x_y), parseArg(x_z), parseArg(y_x),
            parseArg(y_z), parseArg(z_x), parseArg(z_y)
        );
    }

    @when(/^([\w]+) ← view_transform\(([\w]+), ([\w]+), ([\w]+)\)$/)
    public whenViewTransformation(tId: string, fromId: string, toId: string, upId: string) {
        this.workspace.matrices[tId] = view_transform(
            this.workspace.tuples[fromId],
            this.workspace.tuples[toId],
            this.workspace.tuples[upId]
        );
    }

    @then(/^([\w]+) = scaling\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenEqualsScaling(tId: string, x: string, y: string, z: string) {
        const actual = this.workspace.matrices[tId];
        const expected = scaling(parseArg(x), parseArg(y), parseArg(z));

        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }

    @then(/^([\w]+) = translation\(([^,]+), ([^,]+), ([^,]+)\)$/)
    public thenEqualsTranslation(tId: string, x: string, y: string, z: string) {
        const actual = this.workspace.matrices[tId];
        const expected = translation(parseArg(x), parseArg(y), parseArg(z));

        expect(Matrix.equals(actual, expected), shouldEqualMsg(actual, expected)).to.be.true;
    }
}

export = TransformationsSteps;