import {Matrix} from './matrix';
import {Material} from './material';
import {Tuple, vector} from './tuple';
import {Shape} from './shape';
import {Ray} from './ray';
import {Intersection} from './intersection';
import {Util} from './util';

export class Cylinder extends Shape {
    
    constructor(
        public readonly transform: Matrix = Matrix.identity(4),
        public readonly material = new Material(),
        public readonly minimum = Number.NEGATIVE_INFINITY,
        public readonly maximum = Number.POSITIVE_INFINITY,
        public readonly closed = false
    ) {
        super(transform, material);
    }

    local_intersection(r: Ray): Intersection[] {
        const a = r.direction.x * r.direction.x + r.direction.z * r.direction.z;

        if (Math.abs(a) < Util.EPSILON) {
            return this.intersect_cap(r, []);
        }

        const b = 2 * r.origin.x * r.direction.x
            + 2 * r.origin.z * r.direction.z;
        const c = r.origin.x * r.origin.x + r.origin.z * r.origin.z - 1;

        const disc = b * b - 4 * a * c;
        if (disc < 0) {
            return [];
        }

        const t0 = (-b - Math.sqrt(disc)) / (2 * a);
        const t1 = (-b + Math.sqrt(disc)) / (2 * a);

        let xs: Intersection[] = [];
        const y0 = r.origin.y + t0 * r.direction.y;
        if (this.minimum < y0 && y0 < this.maximum) {
            xs = [new Intersection(this, t0)];
        }

        const y1 = r.origin.y + t1 * r.direction.y;
        if (this.minimum < y1 && y1 < this.maximum) {
            xs = [...xs, new Intersection(this, t1)];
        }

        xs = this.intersect_cap(r, xs);
        return xs;
    }

    local_normal_at(pt: Tuple): Tuple {
        const dist = pt.x * pt.x + pt.z * pt.z;
        if (dist < 1 && pt.y >= this.maximum - Util.EPSILON) {
            return vector(0, 1, 0);
        }
        if (dist < 1 && pt.y <= this.minimum + Util.EPSILON) {
            return vector(0, -1, 0);
        }
        return vector(pt.x, 0, pt.z);
    }

    local_replace_transform(t: Matrix): Shape {
        return new Cylinder(t, this.material);
    }

    local_replace_material(m: Material): Shape {
        return new Cylinder(this.transform, m);
    }

    check_cap(r: Ray, t: number): boolean {
        const x = r.origin.x + t * r.direction.x;
        const z = r.origin.z + t * r.direction.z;
        return x * x + z * z <= 1;
    }

    intersect_cap(r: Ray, xs: Intersection[]): Intersection[] {
        if (!this.closed || Math.abs(r.direction.y) < Util.EPSILON) {
            return xs;
        }

        let t = (this.minimum - r.origin.y) / r.direction.y;
        if (this.check_cap(r, t)) {
            xs = [...xs, new Intersection(this, t)];
        }

        t = (this.maximum - r.origin.y) / r.direction.y;
        if (this.check_cap(r, t)) {
            xs = [...xs, new Intersection(this, t)];
        }
        return xs;
    }

}
