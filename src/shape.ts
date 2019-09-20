import {Matrix} from './matrix';
import {Material} from './material';
import {Interceptable, Intersection} from './intersection';
import {Ray} from './ray';

export interface Shape {
    readonly transform: Matrix;
    readonly material: Material;
}

export interface InterceptableShape extends Shape, Interceptable {

}

export class TestShape implements InterceptableShape {
    constructor(
        public readonly transform: Matrix = Matrix.identity(4),
        public readonly material = new Material()
    ) {
    }

    intersect(r: Ray): Intersection[] {
        return [];
    }

}

export function test_shape(): InterceptableShape {
    return new TestShape();
}

export function isShape(arg: any): arg is Shape {
    return true;
}

