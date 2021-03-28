import {StepDefinitions} from 'jest-cucumber';
import {shapes} from "../steps";
import {Cone, Cylinder} from "../../../src/shapes";
import {parseArg} from "../../../src/util";

export const cylinderSteps: StepDefinitions = ({given, then}) => {

    given(/^([\w\d_]+) ← cylinder\(\)$/, (shapeId: string) => {
        shapes[shapeId] = new Cylinder();
    })

    given(/^([\w\d_]+).minimum ← ([^,]+)$/, (cylId: string, value: string) => {
        const c = shapes[cylId];
        if (c instanceof Cylinder) {
            const cyl = c as Cylinder;
            shapes[cylId] = new Cylinder(cyl.transform, cyl.material, parseArg(value), cyl.maximum);
        } else if (c instanceof Cone) {
            const cn = c as Cone;
            shapes[cylId] = new Cone(cn.transform, cn.material, parseArg(value), cn.maximum);
        }
    })

    given(/^([\w\d_]+).maximum ← ([^,]+)$/, (cylId: string, value: string) => {
        const c = shapes[cylId];
        if (c instanceof Cylinder) {
            const cyl = c as Cylinder;
            shapes[cylId] = new Cylinder(cyl.transform, cyl.material, cyl.minimum, parseArg(value));
        } else if (c instanceof Cone) {
            const cn = c as Cone;
            shapes[cylId] = new Cone(cn.transform, cn.material, cn.minimum, parseArg(value));
        }
    })

    given(/^([\w\d_]+).closed ← ([^,]+)$/, (cylId: string, value: string) => {
        const c = shapes[cylId];
        if (c instanceof Cylinder) {
            const cyl = c as Cylinder;
            shapes[cylId] = new Cylinder(cyl.transform, cyl.material, cyl.minimum, cyl.maximum, !!value);
        } else if (c instanceof Cone) {
            const cn = c as Cone;
            shapes[cylId] = new Cone(cn.transform, cn.material, cn.minimum, cn.maximum, !!value);
        }
    })

    then(/^([\w\d_]+).minimum = -infinity$/, (cylId: string) => {
        expect((shapes[cylId] as Cylinder).minimum).toEqual(Number.NEGATIVE_INFINITY);
    })

    then(/^([\w\d_]+).maximum = infinity$/, (cylId: string) => {
        expect((shapes[cylId] as Cylinder).maximum).toEqual(Number.POSITIVE_INFINITY);
    })

    then(/^([\w\d_]+).closed = ([^,]+)/, (cylId: string, value: string) => {
        expect((shapes[cylId] as Cylinder).closed).toEqual(value === 'true');
    })

}