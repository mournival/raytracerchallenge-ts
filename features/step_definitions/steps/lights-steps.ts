import {StepDefinitions} from "jest-cucumber";
import {LightsArray} from "../types";
import {colors, tuples} from "../steps";
import {Light} from "../../../src/light";
import {Color} from "../../../src/color";
import {Tuple} from "../../../src/tuple";

export let lights: LightsArray

export const lightsSteps: StepDefinitions = ({when, then}) => {

    beforeAll(() => {
        lights = {}
    })
    when(/^([\w\d_]+) ← point_light\(([^,]+), ([^,]+)\)$/, (lightId: string, posId: string, intensityId: string) => {
        lights[lightId] = new Light(
            tuples[posId],
            colors[intensityId]
        );
    })

    then(/^([\w\d_]+).position = ([^,]+)$/, (lightId: string, posId: string) => {
        expect(Tuple.equals(lights[lightId].position, tuples[posId])).toBeTruthy()
    })

    then(/^([\w\d_]+).intensity = ([^,]+)$/, (lightId: string, intensityId: string) => {
        expect(Color.equals(lights[lightId].intensity, colors[intensityId])).toBeTruthy()
    })

    then(/^([\w\d_]+) does not light.equals ([\w\d_]+)$/, (lhs: string, rhs: string) => {
        expect(Light.equals(lights[lhs], lights[rhs])).toBeFalsy()
    })

}