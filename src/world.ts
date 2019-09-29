import {Sphere} from './sphere';
import {Light} from './light';
import {point, Tuple} from './tuple';
import {Color} from './color';
import {Matrix, scaling} from './matrix';
import {lighting, Material} from './material';
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
}

export function color_at(w: World, r: Ray): Color {
    const xs = intersect_world(w, r);
    if (xs.length === 0) {
        return Color.BLACK;
    }
    return shade_hit(w, prepare_computations(xs[0], r));
}

export function intersect_world(w: World, r: Ray): Intersection[] {
    // Require Node Version 11+
    return w.objects.flatMap(o => o.intersect(r)).filter(i => i.t >= 0).sort((a, b) => a.t - b.t);

    // for Node Version < 11
    // const xs: Intersection[] = [];
    // w.objects.map(o => o.intersect(r)).forEach(xss => xs.push(...xss));
    // xs.sort((a, b) => a.t - b.t);
    // return xs;
}

export function shade_hit(w: World, pc: PreComputations): Color {
    const surface = lighting(pc.object.material, w.lights[0], pc.point, pc.eyev, pc.normalv, is_shadowed(w, pc.over_point));
    const reflected = reflected_color(w, pc);
    return Color.add(surface, reflected);
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

export function is_shadowed(w: World, p: Tuple): boolean {
    const v = Tuple.subtract(w.lights[0].position, p);
    const distance = v.magnitude;
    const direction = v.normalize;
    const r = new Ray(p, direction);
    const intersections = intersect_world(w, r);

    return intersections.length > 0 && intersections[0].t < distance;
}

export function reflected_color(w: World, comps: PreComputations): Color {
    if (comps.object.material.reflective === 0) {
        return Color.BLACK;
    }
    const reflect_ray = new Ray(comps.over_point, comps.reflectv);
    const color = color_at(w, reflect_ray);
    return Color.multiplyScalar(color, comps.object.material.reflective);

}