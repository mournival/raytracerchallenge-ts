import {StepDefinitions} from 'jest-cucumber';
import {parseArg, Util} from "../../../src/util";
import {IntersectionArray, IntersectionArrayArray, NumberArray} from "../types";
import {Shape} from "../../../src/shapes";
import {colors, rays, shapes, worlds} from "../steps";
import {PreComputations, prepare_computations} from "../../../src/pre-computations";
import {Intersection} from "../../../src/intersection";
import {point, Tuple, vector} from "../../../src/tuple";
import {hit} from "../../../src/world";

export let intersections: IntersectionArrayArray;
export let intersection: IntersectionArray;

export const intersectionsSteps: StepDefinitions = ({given, when, then}) => {
    let numbers: NumberArray

    beforeEach(() => {
        intersections = {}
        intersection = {}
        numbers = {}
    })

    when(/^([\w\d_]+) ← intersect\((\w+), (\w+)\)$/, (interactionId: string, shapeId: string, rayId: string) => {
        intersections[interactionId] = shapes[shapeId].intersect(rays[rayId]);
    })

    given(/^([\w\d_]+) ← intersections\(([^,:]+)\)$/, (intersectionsId: string, intersectionId: string) => {
        intersections[intersectionsId] = [intersection[intersectionId]];
    })

    given(/^([\w\d_]+) ← prepare_computations\(([^,]+), ([^,]+)\)$/, (pcId: string, intersectId: string, rayId: string) => {
        intersection[pcId] = prepare_computations(intersection[intersectId], rays[rayId], []);
    })

    given(/xs ← intersections\(2:A, 2.75:B, 3.25:C, 4.75:B, 5.25:C, 6:A\)/, () => {

        const A = shapes['A'];
        const B = shapes['B'];
        const C = shapes['C'];

        intersections['xs'] = [
            new Intersection(A, 2),
            new Intersection(B, 2.75),
            new Intersection(C, 3.25),
            new Intersection(B, 4.75),
            new Intersection(C, 5.25),
            new Intersection(A, 6),
        ];
    })

    given(/^([\w\d_]+) ← intersections\(([^,:]+), ([^,:]+)\)$/, (intersectionsId: string, i1: string, i2: string) => {
        intersections[intersectionsId] = [intersection[i1], intersection[i2]];
    })

    given(/^([\w\d_]+) ← intersections\(([^,:]+), ([^,:]+), ([^,:]+), ([^,:]+)\)$/, (intersectionsId: string, i1: string, i2: string, i3: string, i4: string) => {
        intersections[intersectionsId] = [intersection[i1], intersection[i2], intersection[i3], intersection[i4]];
    })

    given(/^([\w\d_]+) ← intersections\(([^,]+):([\w\d_]+)\)$/, (intersectionsId: string, t1: string, s1: string) => {
        intersections[intersectionsId] = [new Intersection(shapes[s1], parseArg(t1)),];
    })

    given(/([\w\d_]+) ← intersections\(([^,]+):([\w\d_]+), ([^,]+):([\w\d_]+), ([^,]+):([\w\d_]+), ([^,]+):([\w\d_]+)\)/, (intersectionsId: string, t1: string, s1: string, t2: string, s2: string, t3: string, s3: string, t4: string, s4: string) => {
        intersections[intersectionsId] = [
            new Intersection(shapes[s1], parseArg(t1)),
            new Intersection(shapes[s2], parseArg(t2)),
            new Intersection(shapes[s3], parseArg(t3)),
            new Intersection(shapes[s4], parseArg(t4))
        ];
    })

    given(/([\w\d_]+) ← intersections\(([^,]+):([\w\d_]+), ([^,]+):([\w\d_]+)\)/, (intersectionsId: string, t1: string, s1: string, t2: string, s2: string) => {
        intersections[intersectionsId] = [
            new Intersection(shapes[s1], parseArg(t1)),
            new Intersection(shapes[s2], parseArg(t2))
        ]
    })

    when(/^([\w\d_]+) ← intersection\(([^,]+), ([^,]+)\)$/, (intersectionId: string, t: string, objId: string) => {
        intersection[intersectionId] = new Intersection(shapes[objId], parseArg(t));
    })

    when(/^([\w\d_]+) ← refracted_color\(([\w\d_]+), ([\w\d_]+), ([\w\d_]+)\)$/, (colorId: string, worldId: string, pcId: string, remaining: string) => {
        colors[colorId] = worlds[worldId].refracted_color(
            intersection[pcId] as PreComputations,
            parseArg(remaining)
        );
    })

    when(/^([\w\d_]+) ← schlick\(([\w\d_]+)\)$/, (numId: string, pcId: string) => {
        numbers[numId] = (intersection[pcId] as PreComputations).schlick();
    })

    when(/^([\w\d_]+) ← prepare_computations\(([\w\d_]+), ([\w\d_]+), ([\w\d_]+)\)$/, (pcId: string, intersectionId: string, rayId: string, xsId: string) => {
        intersection[pcId] = prepare_computations(intersection[intersectionId], rays[rayId], intersections[xsId]);
    })

    when(/^([\w\d_]+) ← prepare_computations\(([^,]+)\[([^,]+)], ([\w\d_]+), (.*)\)$/, (pcId: string, intersectionsId: string, index: string, rayId: string, iId2) => {
        const xs = intersections[intersectionsId];
        intersection[pcId] = prepare_computations(xs[parseArg(index)], rays[rayId], intersections[iId2])
    })

    when(/^([\w\d_]+) ← hit\(([\w\d_]+)\)$/, (intersectionId: string, xsId: string) => {
        const h = hit(intersections[xsId]);
        if (h !== null) {
            intersection[intersectionId] = h;
        }
    })

    when(/^i ← intersection_with_uv\(([^,]+), ([\w]+), ([^,]+), ([^,]+)\)$/, (t: string, shapeId: string, u: string, v: string) => {
        intersection['i'] = new Intersection(shapes[shapeId], parseArg(t), parseArg(u), parseArg(v));
    })

    then(/^([\w\d_]+)\.t = ([^t]+)$/, (intersectionId: string, t: string) => {
        expect(intersection[intersectionId].t).toBeCloseTo(parseArg(t), 0.0001);
    })

    then(/^(\w+)\[(\d+)].object = ([^,]+)$/, (intersectionsId: string, intersectionIndex: string, objectId: string) => {
        const actual = intersections[intersectionsId][parseInt(intersectionIndex)].obj;
        expect(Shape.equals(actual, shapes[objectId])).toBeTruthy()
    })

    then(/^([\w\d_]+)\.object = ([^,.]+)$/, (intersectionId: string, objId: string) => {
        expect(Shape.equals(intersection[intersectionId].obj, shapes[objId])).toBeTruthy()
    })

    then(/^([\w\d_]+)\.t = ([\w\d_]+).t$/, (pcId: string, intersectId: string) => {
        expect(intersection[pcId].t).toBeCloseTo(intersection[intersectId].t, 0.0001);
    })

    then(/^([\w\d_]+)\.normalv = vector\(([^,]+), ([^,]+), ([^,]+)\)$/, (pcId: string, x: string, y: string, z: string) => {
        expect(Tuple.equals((intersection[pcId] as PreComputations).normalv, vector(parseArg(x), parseArg(y), parseArg(z)))).toBeTruthy()
    })

    then(/^([\w\d_]+)\.object = ([^,]+).object$/, (pcId: string, intersectId: string) => {
        expect(Shape.equals(intersection[pcId].obj, intersection[intersectId].obj)).toBeTruthy()
    })

    then(/^([\w\d_]+)\.point = point\(([^,]+), ([^,]+), ([^,]+)\)/, (pcId: string, x: string, y: string, z: string) => {
        const actual = (intersection[pcId] as PreComputations).point;
        const expected = point(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected)).toBeTruthy()
    })

    then(/^([\w\d_]+)\.eyev = vector\(([^,]+), ([^,]+), ([^,]+)\)$/, (pcId: string, x: string, y: string, z: string) => {
        const actual = (intersection[pcId] as PreComputations).eyev;
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected)).toBeTruthy()
    })

    then(/^([\w\d_]+)\.inside = ([^,]+)$/, (pcId: string, inside: string) => {
        const actual = (intersection[pcId] as PreComputations).inside;
        const expected = inside === 'true';
        expect(actual).toEqual(expected);
    })

    then(/^([\w\d_]+)\.over_point\.z < -EPSILON\/2$/, (pcId: string) => {
        expect((intersection[pcId] as PreComputations).over_point.z).toBeLessThan(-Util.EPSILON / 2);
    })

    then(/^([\w\d_]+)\.point\.z > [^.]+\.over_point\.z$/, (pcId: string) => {
        const pc = intersection[pcId] as PreComputations;
        expect(pc.point.z).toBeGreaterThan(pc.over_point.z);
    })

    then(/^([\w\d_]+)\.reflectv = vector\(([^,]+), ([^,]+), ([^,]+)\)/, (pcId: string, x: string, y: string, z: string) => {
        const actual = (intersection[pcId] as PreComputations).reflectv;
        const expected = vector(parseArg(x), parseArg(y), parseArg(z));
        expect(Tuple.equals(actual, expected)).toBeTruthy()
    })

    then(/^([\w\d_]+).n1 = (.+)$/, (pcId: string, expected: string) => {
        expect((intersection[pcId] as PreComputations).n1).toBeCloseTo(parseArg(expected), 0.001);
    })

    then(/^([\w\d_]+).n2 = (.+)$/, (pcId: string, expected: string) => {
        expect((intersection[pcId] as PreComputations).n2).toBeCloseTo(parseArg(expected), 0.001);
    })

    then(/^([\w\d_]+)\.under_point\.z > EPSILON\/2$/, (pcId: string) => {
        expect((intersection[pcId] as PreComputations).under_point.z).toBeGreaterThan(Util.EPSILON / 2);
    })

    then(/^([\w\d_]+)\.point\.z < [^.]+\.under_point\.z$/, (pcId: string) => {
        expect((intersection[pcId] as PreComputations).point.z).toBeLessThan((intersection[pcId] as PreComputations).under_point.z);
    })

    then(/^reflectance = ([^,]+)$/, (value: string) => {
        expect(numbers['reflectance']).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^i = ([^,]+)$/, (intersectionId: string) => {
        expect(intersection['i'].t).toEqual(intersection[intersectionId].t);
    })

    then(/^i is nothing$/, () => {
        expect(intersection['i']).toBeUndefined();
    })

    then(/^([\w\d_]+)\.u = ([^t]+)$/, (intersectionId: string, expected: string) => {
        expect(intersection[intersectionId].u).toBeCloseTo(parseArg(expected), 0.0001);
    })

    then(/^([\w\d_]+)\.v = ([^t]+)$/, (intersectionId: string, expected: string) => {
        expect(intersection[intersectionId].v).toBeCloseTo(parseArg(expected), 0.0001);
    })
}
