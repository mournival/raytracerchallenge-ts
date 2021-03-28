import {StepDefinitions} from 'jest-cucumber';
import {Cube} from "../../../src/shapes";
import {shapes} from "../steps";

export const cubeSteps: StepDefinitions = ({given}) => {

    given(/^([\w\d_]+) ← cube\(\)$/, (shapeId: string) => {
        shapes[shapeId] = new Cube();
    })

}