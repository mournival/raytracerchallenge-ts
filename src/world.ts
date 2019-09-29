import {Sphere} from './sphere';
import {Light} from './light';
import {point, Tuple} from './tuple';
import {Color} from './color';
import {Matrix, scaling} from './matrix';
import {Material} from './material';
import {Ray} from './ray';
import {Intersection} from './intersection';
import {PreComputations, prepare_computations} from './pre-computations';
import {Shape} from './shape';

export class World {
    constructor(public readonly lights: Light[] = [], public readonly objects: Shape[] = []) {
    }

    public contains(o: Shape | Light): boolean {
        if (o instanceof Sphere) {
            return this.objects.find(os => Sphere.equals(os, o)) != undefined;
        }
        if (o instanceof Light) {
            return this.lights.find(os => Light.equals(os, o)) != undefined;
        }
        return false;
    }

    public replace(oldShape: Shape, newShape: Shape): World {
        const map = this.objects.map(o => JSON.stringify(o) === JSON.stringify(oldShape) ? newShape : o);
        return new World(this.lights, map);
    }

    color_at(r: Ray, remaining: number = 5): Color {
        const xs = this.intersect_world(r);
        if (xs.length === 0) {
            return Color.BLACK;
        }
        return this.shade_hit(prepare_computations(xs[0], r), remaining);
    }

    intersect_world(r: Ray): Intersection[] {
        // Require Node Version 11+
        return this.objects.flatMap(o => o.intersect(r)).filter(i => i.t >= 0).sort((a, b) => a.t - b.t);

        // for Node Version < 11
        // const xs: Intersection[] = [];
        // this.objects.map(o => o.intersect(r)).forEach(xss => xs.push(...xss));
        // xs.sort((a, b) => a.t - b.t);
        // return xs;
    }

    shade_hit(pc: PreComputations, remaining: number): Color {
        const surface = pc.object.material.lighting(pc.point, pc.eyev, pc.normalv, this.lights[0], this.is_shadowed(pc.over_point), pc.object);
        const reflected = this.reflected_color(pc, remaining);
        return Color.add(surface, reflected);
    }

    is_shadowed(p: Tuple): boolean {
        const v = Tuple.subtract(this.lights[0].position, p);
        const distance = v.magnitude;
        const direction = v.normalize;
        const r = new Ray(p, direction);
        const intersections = this.intersect_world(r);

        return intersections.length > 0 && intersections[0].t < distance;
    }

    reflected_color(comps: PreComputations, remaining: number): Color {
        if (remaining <= 0 || comps.object.material.reflective === 0) {
            return Color.BLACK;
        }
        const reflect_ray = new Ray(comps.over_point, comps.reflectv);
        const color = this.color_at(reflect_ray, remaining - 1);
        return Color.multiplyScalar(color, comps.object.material.reflective);

    }
}

export function default_world(): World {
    return new World(
        [
            new Light(point(-10, 10, -10), new Color(1, 1, 1))
        ],
        [
            new Sphere(Matrix.identity(4),
                new Material(new Color(0.8, 1.0, 0.6), 0.1, 0.7, 0.2)),
            new Sphere(scaling(0.5, 0.5, 0.5))
        ]
    );

}
