import {Ray, transform} from './ray';
import {point, Tuple, vector} from './tuple';
import {Intersection} from '../features/step_definitions/intersect';
import {Matrix} from './matrix';

export class Sphere {
    constructor(public readonly transform: Matrix = Matrix.identity(4)) {
    }
}

export function intersect(s: Sphere, r: Ray): Intersection[] {
    const r2 = transform(r, Matrix.inverse(s.transform));
    const sphere_to_ray = Tuple.subtract(r2.origin, point(0, 0, 0));
    const a = Tuple.dot(r2.direction, r2.direction);
    const b = 2 * Tuple.dot(r2.direction, sphere_to_ray);
    const c = Tuple.dot(sphere_to_ray, sphere_to_ray) - 1;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return [];
    }

    const rootDisc = Math.sqrt(discriminant);
    const t1 = (-b - rootDisc) / (2 * a);
    const t2 = (-b + rootDisc) / (2 * a);

    return [new Intersection(s, t1), new Intersection(s, t2)];
}

export function set_transform(s: Sphere, t: Matrix): Sphere {
    return new Sphere(t);
}

export function normal_at(s: Sphere, p: Tuple): Tuple {
    return Tuple.normalize(vector(p.x, p.y, p.z));
}
