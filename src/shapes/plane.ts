import {Matrix} from '../matrix';
import {Material} from '../material';
import {Shape} from './shape';
import {Ray} from '../ray';
import {Intersection} from '../intersection';
import {Util} from '../util';
import {Tuple, vector} from '../tuple';

export class Plane extends Shape {

    constructor(
        public readonly transform: Matrix = Matrix.identity(4),
        public readonly material = new Material(),
        public readonly parent: Shape | null = null
    ) {
        super(transform, material, parent);
    }

    local_intersection(r: Ray): Intersection[] {
        if (Util.closeTo(r.direction.y, 0)) {
            return [];
        }

        return [new Intersection(this, -r.origin.y / r.direction.y)];
    }

    local_normal_at(pt: Tuple): Tuple {
        return vector(0, 1, 0);
    }

    local_replace_transform(t: Matrix): Shape {
        return new Plane(t, this.material, this.parent);
    }

    local_replace_material(m: Material): Shape {
        return new Plane(this.transform, m, this.parent);
    }

    local_replace_parent(s: Shape): Shape {
        return new Plane(this.transform, this.material, s);
    }

    equals(rhs: Shape): boolean {
        return rhs instanceof Plane
            && Matrix.equals(this.transform, rhs.transform)
            && Material.equals(this.material, rhs.material)
            // && this.parent.equals(rhs.parent)
            ;
    }

}

