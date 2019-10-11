import {Matrix} from './matrix';
import {Material} from './material';
import {Tuple, vector} from './tuple';
import {Shape} from './shape';
import {Ray} from './ray';
import {Intersection} from './intersection';
import {Util} from './util';

export class Cone extends Shape {

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
        const a = r.direction.x * r.direction.x
            - r.direction.y * r.direction.y
            + r.direction.z * r.direction.z;
        const b = 2 * r.origin.x * r.direction.x
            - 2 * r.origin.y * r.direction.y
            + 2 * r.origin.z * r.direction.z;
        const c = r.origin.x * r.origin.x - r.origin.y * r.origin.y + r.origin.z * r.origin.z;

        let xs: Intersection[] = this.intersect_cap(r);

        if (Util.closeTo(a, 0)) {
            if (!Util.closeTo(b, 0)) {
                return [
                    new Intersection(this, -c / (2 * b)),
                    ...xs
                ];
            }
            return xs;
        }

        const disc = b * b - 4 * a * c;
        if (disc < 0) {
            return [];
        }

        const t0 = (-b - Math.sqrt(disc)) / (2 * a);
        const t1 = (-b + Math.sqrt(disc)) / (2 * a);

        const y0 = r.origin.y + t0 * r.direction.y;
        if (this.minimum < y0 && y0 < this.maximum) {
            xs = [...xs, new Intersection(this, t0)];
        }

        const y1 = r.origin.y + t1 * r.direction.y;
        if (this.minimum < y1 && y1 < this.maximum) {
            xs = [...xs, new Intersection(this, t1)];
        }

        return xs;
    }

    local_normal_at(pt: Tuple): Tuple {
        const dist = pt.x * pt.x + pt.z * pt.z;
        if (dist < 1 && Util.closeTo(pt.y, this.maximum)) {
            return vector(0, 1, 0);
        }
        if (dist < 1 && Util.closeTo(pt.y, this.minimum)) {
            return vector(0, -1, 0);
        }
        return vector(pt.x, 0, pt.z);
    }

    local_replace_transform(t: Matrix): Shape {
        return new Cone(t, this.material);
    }

    local_replace_material(m: Material): Shape {
        return new Cone(this.transform, m);
    }

    check_cap(ray: Ray, capRadius: number, t: number): boolean {
        const x = ray.origin.x + t * ray.direction.x;
        const z = ray.origin.z + t * ray.direction.z;

        return x * x + z * z <= capRadius * capRadius ;
    }

    intersect_cap(r: Ray): Intersection[] {
        if (!this.closed || Util.closeTo(r.direction.y, 0)) {
            return [];
        }

        let xs: Intersection[] = [];

        let t = (this.minimum - r.origin.y) / r.direction.y;
        let y = r.origin.y + t * r.direction.y;
        if (this.check_cap(r, Math.max(this.minimum, y), t)) {
            xs = [new Intersection(this, t)];
        }

        t = (this.maximum - r.origin.y) / r.direction.y;
        y = r.origin.y + t * r.direction.y;
        if (this.check_cap(r, Math.min(this.maximum, y), t)) {
            xs = [...xs, new Intersection(this, t)];
        }
        return xs;
    }

}

