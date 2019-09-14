import {Matrix} from './matrix';
import {Material} from './material';

export interface Shape {
    readonly transform: Matrix;
    readonly material: Material;
}

export function test_shape(): Shape {
    return {
        transform: Matrix.identity(),
        material: new Material()
    };
}
