import {StepDefinitions} from 'jest-cucumber';
import {parseArg} from "../../../src/util";
import {RayArray} from "../types";
import {position, Ray, transform} from "../../../src/ray";
import {point, Tuple, vector} from "../../../src/tuple";
import {matrices, tuples} from "../steps";

export let rays: RayArray;

export const raysSteps: StepDefinitions = ({given, when, then}) => {
    beforeAll(() => {
        rays = {}
    })

    given(/^([\w\d_]+) ← ray\(point\(([^,]+), ([^,]+), ([^,]+)\), ([\w\d_]+)\)$/, (rayId: string, x: string, y: string, z: string, directionId: string) => {
        rays[rayId] = new Ray(point(parseArg(x), parseArg(y), parseArg(z)), tuples[directionId]);
    })

    when(/^([\w\d_]+) ← ray\((\w+), (\w+)\)$/, (rayId: string, originId: string, directionId: string) => {
        rays[rayId] = new Ray(tuples[originId], tuples[directionId]);
    })

    then(/^(\w+).origin = (\w+)$/, (rayId: string, originId: string) => {
        expect(Tuple.equals(rays[rayId].origin, tuples[originId])).toBeTruthy();
    })

    then(/^(\w+).direction = (\w+)$/, (rayId: string, directionId: string) => {
        expect(Tuple.equals(rays[rayId].direction, tuples[directionId])).toBeTruthy();
    })

    when(/^([\w\d_]+) ← ray\(point\(([^,]+), ([^,]+), ([^,]+)\), vector\(([^,]+), ([^,]+), ([^,]+)\)\)$/, (
        rayId: string, px: string, py: string, pz: string, vx: string, vy: string, vz: string) => {
        rays[rayId] = new Ray(
            point(parseArg(px), parseArg(py), parseArg(pz)),
            vector(parseArg(vx), parseArg(vy), parseArg(vz))
        );
    })

    then(/^position\((\w+), ([^,]+)\) = point\(([^,]+), ([^,]+), ([^,]+)\)$/,
        (rayId: string, distance: string, px: string, py: string, pz: string) => {
            const actual = position(rays[rayId], parseArg(distance));
            const expected = point(parseArg(px), parseArg(py), parseArg(pz));
            expect(Tuple.equals(actual, expected)).toBeTruthy();
        })

    when(/^([\w\d_]+) ← transform\(([^,]+), ([^,]+)\)$/, (r2Id: string, rId: string, tId: string,) => {
        rays[r2Id] = transform(rays[rId], matrices[tId]);
    })

    then(/^(\w+).origin = point\(([^,]+), ([^,]+), ([^,]+)\)$/, (rayId: string, px: string, py: string, pz: string) => {
        const actual = rays[rayId].origin;
        const expected = point(parseArg(px), parseArg(py), parseArg(pz));
        expect(Tuple.equals(actual, expected)).toBeTruthy();
    })

    then(/^(\w+).direction = vector\(([^,]+), ([^,]+), ([^,]+)\)$/, (rayId: string, vx: string, vy: string, vz: string) => {
        const actual = rays[rayId].direction;
        const expected = vector(parseArg(vx), parseArg(vy), parseArg(vz));
        expect(Tuple.equals(actual, expected)).toBeTruthy();
    })
}