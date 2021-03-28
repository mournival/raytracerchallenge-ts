import {StepDefinitions} from 'jest-cucumber';
import {matrices, shapes} from "../steps";
import {glass_sphere, Sphere} from "../../../src/shapes";

export const spheresSteps: StepDefinitions = ({given, then}) => {

    given(/^([\w\d_]+) ← sphere\(\)$/, (shapeId: string) => {
        shapes[shapeId] = new Sphere();
    })

    given(/^(\w+) ← glass_sphere\(\)$/, (shapeId: string) => {
        shapes[shapeId] = glass_sphere();
    })

    then(/^set_transform\((\w+), (\w+)\)$/, (shapeId: string, matrixId: string) => {
        shapes[shapeId] = new Sphere(matrices[matrixId]);
    })
}