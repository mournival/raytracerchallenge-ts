import {StepDefinitions} from 'jest-cucumber';
import {Plane} from "../../../src/shapes";
import {shapes} from "../steps";

export const planeSteps: StepDefinitions = ({given}) => {

    given(/^([\w\d_]+) ← plane\(\)$/, (shapeId: string) => {
        shapes[shapeId] = new Plane();
    })

}