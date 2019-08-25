import {before, binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix, rotation_x, scaling, translation} from "../../src/matrix";
import {Tuple} from "../../src/tuple";


@binding([Workspace])
class TransformationsSteps {

    constructor(protected workspace: Workspace) {
    }

    // Float regex: [+-]?\d*?\.?\d*

    @given(/^(\w+) ← translation\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    public givensTransformation(tId: string, x: string, y: string, z: string) {
        this.workspace.matrices[tId] = translation(parseFloat(x), parseFloat(y), parseFloat(z));
    }

    @given(/^(\w+) ← scaling\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
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


}

export = TransformationsSteps;