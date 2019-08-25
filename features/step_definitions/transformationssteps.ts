import {before, binding, given, then, when} from 'cucumber-tsflow';
import {Workspace} from './Workspace';
import {expect} from 'chai';
import {Matrix, translation} from "../../src/matrix";
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
        return 'pending';
    }


    @then(/^transform \* (\w+) = vector\(([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*), ([+-]?\d*?\.?\d*)\)$/)
    public thenTransformVectorToExplicitVector(rhsId: string, x: string, y: string, z: string) {
        return 'pending';
    }

    @then(/^transform \* (\w+) = (\w+)$/)
    public thenTransformVectorToVectorName(rhsId: string, x: string, y: string, z: string) {
        return 'pending';
    }

}

export = TransformationsSteps;