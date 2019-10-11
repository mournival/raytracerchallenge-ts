import {Matrix} from './matrix';
import {Material} from './material';
import {Tuple, vector} from './tuple';
import {Shape} from './shape';
import {Ray, transform} from './ray';
import {Intersection} from './intersection';
import {Util} from './util';

export class Plane extends Shape {

    constructor(
        public readonly transform: Matrix = Matrix.identity(4),
        public readonly material = new Material()
    ) {
        super(transform, material);
    }

    local_intersection(r: Ray): Intersection[] {
        if (Util.closeTo(r.direction.y, 0) ) {
            return [];
        }

        return [new Intersection(this, -r.origin.y / r.direction.y)];
    }

    local_normal_at(pt: Tuple): Tuple {
        return vector(0, 1, 0);
    }

    local_replace_transform(t: Matrix): Shape {
        return new Plane(t, this.material);
    }

    local_replace_material(m: Material): Shape {
        return  new Plane(this.transform, m);
    }
}

