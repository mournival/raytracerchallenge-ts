import {Matrix} from './matrix';
import {Material} from './material';
import {Tuple, vector} from './tuple';
import {Shape} from './shape';
import {Ray} from './ray';
import {Intersection} from './intersection';
import {Util} from './util';

export class Cube extends Shape {

    constructor(
        public readonly transform: Matrix = Matrix.identity(4),
        public readonly material = new Material(),
        public readonly parent: Shape | null = null
    ) {
        super(transform, material, parent);
    }

    local_intersection(r: Ray): Intersection[] {
        const [xtmin, xtmax] = this.check_axis(r.origin.x, r.direction.x);
        const [ytmin, ytmax] = this.check_axis(r.origin.y, r.direction.y);
        const [ztmin, ztmax] = this.check_axis(r.origin.z, r.direction.z);

        const tmin = Math.max(xtmin, ytmin, ztmin);
        const tmax = Math.min(xtmax, ytmax, ztmax);

        if (tmin > tmax) {
            return [];
        }
        return [new Intersection(this, tmin), new Intersection(this, tmax)];
    }

    local_normal_at(pt: Tuple): Tuple {
        const maxc = Math.max(Math.abs(pt.x), Math.abs(pt.y), Math.abs(pt.z));

        if (maxc === Math.abs(pt.x)) {
            return vector(pt.x, 0, 0);
        }
        if (maxc === Math.abs(pt.y)) {
            return vector(0, pt.y, 0);
        }

        return vector(0, 0, pt.z);
    }

    local_replace_transform(t: Matrix): Shape {
        return new Cube(t, this.material, this.parent);
    }

    local_replace_material(m: Material): Shape {
        return new Cube(this.transform, m, this.parent);
    }

    local_replace_parent(s: Shape): Shape {
        return new Cube(this.transform, this.material, s);
    }

    check_axis(origin: number, direction: number): number[] {
        const tmin_numerator = (-1 - origin);
        const tmax_numerator = (1 - origin);

        let tmin, tmax;

        if (!Util.closeTo(direction, 0)){
            tmin = tmin_numerator / direction;
            tmax = tmax_numerator / direction;
        } else {
            tmin = tmin_numerator * Number.POSITIVE_INFINITY;
            tmax = tmax_numerator * Number.POSITIVE_INFINITY;
        }

        if (tmin > tmax) {
            return [tmax, tmin];
        }
        return [tmin, tmax];

    }
}

