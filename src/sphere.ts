import {Ray} from './ray';
import {point, Tuple} from "./tuple";

export class Sphere {

}

export function intersect(s: Sphere, r: Ray): number[] {
    const sphere_to_ray = Tuple.subtract(r.origin, point(0, 0, 0));
    const a = Tuple.dot(r.direction, r.direction);
    const b = 2 * Tuple.dot(r.direction, sphere_to_ray);
    const c = Tuple.dot(sphere_to_ray, sphere_to_ray) - 1;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return [];
    }

    const rootDisc = Math.sqrt(discriminant);
    const t1 = (-b - rootDisc) / (2 * a);
    const t2 = (-b + rootDisc) / (2 * a);

    return [t1, t2];
}