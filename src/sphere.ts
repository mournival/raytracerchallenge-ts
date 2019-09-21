import {Ray, transform} from './ray';
import {point, Tuple, vector} from './tuple';
import {Intersection} from './intersection';
import {Matrix} from './matrix';
import {Material} from './material';
import {Shape, TestShape} from './shape';
import {Plane} from './plane';

export class Sphere extends Shape {

    constructor(
        public readonly transform: Matrix = Matrix.identity(4),
        public readonly material = new Material()
    ) {
        super(transform, material);
    }

    public static equals(lhs: Sphere, rhs: Sphere): boolean {
        return Matrix.equals(lhs.transform, rhs.transform) && Material.equals(lhs.material, rhs.material);
    }

    public local_intersection(r: Ray): Intersection[] {
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

        return [new Intersection(this, t1), new Intersection(this, t2)];
    }

    local_normal_at(object_point: Tuple): Tuple {
        const object_normal = Tuple.subtract(object_point, point(0, 0, 0));
        return vector(object_normal.x, object_normal.y, object_normal.z).normalize;
    }

}

export function set_transform(s: Shape, t: Matrix): Shape {
    if (s instanceof Sphere)
        return new Sphere(t);

    if (s instanceof Plane)
        return new Plane(t);

    if (s instanceof TestShape)
        return new TestShape(t);

    throw 'Unknown class for set_transform: ' + typeof s;
}

export function set_material(s: Shape, m: Material): Shape {
    if (s instanceof Sphere)
        return new Sphere(s.transform, m);

    if (s instanceof Plane)
        return new Plane(s.transform, m);

    if (s instanceof TestShape)
        return new TestShape(s.transform, m);

    throw 'Unknown class for set_transform: ' + typeof s;
}
