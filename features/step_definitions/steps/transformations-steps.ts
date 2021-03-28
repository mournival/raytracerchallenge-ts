import {StepDefinitions} from "jest-cucumber";
import {Matrix, rotation_y, rotation_z, scaling, shearing, translation, view_transform} from "../../../src/matrix";
import {parseArg} from "../../../src/util";
import {Tuple} from "../../../src/tuple";
import {matrices, tuples} from "../steps";

export const transformationsSteps: StepDefinitions = ({given, when, then}) => {

    then(/^transform \* ([\w\d_]+) = (\w+)$/, (rhsId: string, productId: string) => {
        const actual = Matrix.multiplyVector(matrices['transform'], tuples[rhsId]);
        const expected = tuples[productId];
        expect(Tuple.equals(actual, expected)).toBeTruthy()
    })

    given(/^([\w_]+) ← rotation_y\(π \/ (\d+)\)$/, (tId: string, x: string) => {
        matrices[tId] = rotation_y(Math.PI / parseInt(x));
    })

    given(/^([\w_]+) ← rotation_z\(π \/ (\d+)\)$/, (tId: string, x: string) => {
        matrices[tId] = rotation_z(Math.PI / parseInt(x));
    })

    given(/^([\w\d_]+) ← shearing\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+)\)$/, (tId: string, x_y: string, x_z: string, y_x: string, y_z: string, z_x: string, z_y: string) => {
        matrices[tId] = shearing(
            parseArg(x_y), parseArg(x_z), parseArg(y_x),
            parseArg(y_z), parseArg(z_x), parseArg(z_y)
        );
    })

    when(/^([\w]+) ← view_transform\(([\w]+), ([\w]+), ([\w]+)\)$/, (tId: string, fromId: string, toId: string, upId: string) => {
        matrices[tId] = view_transform(
            tuples[fromId],
            tuples[toId],
            tuples[upId]
        );
    })

    then(/^([\w]+) = scaling\(([^,]+), ([^,]+), ([^,]+)\)$/, (tId: string, x: string, y: string, z: string) => {
        const actual = matrices[tId];
        const expected = scaling(parseArg(x), parseArg(y), parseArg(z));

        expect(Matrix.equals(actual, expected)).toBeTruthy()
    })

    then(/^([\w]+) = translation\(([^,]+), ([^,]+), ([^,]+)\)$/, (tId: string, x: string, y: string, z: string) => {
        const actual = matrices[tId];
        const expected = translation(parseArg(x), parseArg(y), parseArg(z));

        expect(Matrix.equals(actual, expected)).toBeTruthy()
    })
}