import {Matrix} from './matrix';
import {Material} from './material';
import {Tuple, vector} from './tuple';
import {InterceptableShape} from './shape';
import {Ray} from './ray';
import {Intersection} from './intersection';

export class Plane implements InterceptableShape {

    constructor(
        public readonly transform: Matrix = Matrix.identity(4),
        public readonly material = new Material()
    ) {
    }

    intersect(r: Ray): Intersection[] {
        // const local_ray = transform(r, this.transform.inverse);
        const local_ray = r;

        if (Math.abs(local_ray.direction.y) < Tuple.EPSILON) {
            return [];
        }

        return [new Intersection(this, -local_ray.origin.y / local_ray.direction.y)];
    }
}

export function normal_at(p: Plane, pt: Tuple): Tuple {
    return vector(0, 1, 0);
}

