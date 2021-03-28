import {StepDefinitions} from 'jest-cucumber';
import {Cone} from "../../../src/shapes";
import {shapes} from "../steps";

export const coneSteps: StepDefinitions = ({given}) => {

    given(/^([\w\d_]+) ← cone\(\)$/, (shapeId: string) => {
        shapes[shapeId] = new Cone();
    })

}