import {StepDefinitions} from 'jest-cucumber';
import {parseArg} from "../../../src/util";
import {DataTableType, ShapeArray} from "../types";
import {point, Tuple} from "../../../src/tuple";
import {intersections, materials, matrices, patterns, rays, tuples} from "../steps";
import {Matrix, rotation_z, scaling, translation} from "../../../src/matrix";
import {Material} from "../../../src/material";
import {glass_sphere, isShape, Plane, Shape, Sphere, test_shape} from "../../../src/shapes";
import {Color} from "../../../src/color";
import {test_pattern} from "../../../src/pattern";

export let shapes: ShapeArray;

export const shapesSteps: StepDefinitions = ({given, when, then}) => {

    beforeAll(() => {
        shapes = {}
    })

    given(/(.*) ← test_shape\(\)/, (shapeId: string) => {
        shapes[shapeId] = test_shape()
    })

    given(/^([\w\d_]+) ← scaling\(([^,]+), ([^,]+), ([^,]+)\) \* rotation_z\(([^,]+)\)$/, (tId: string, x: string, y: string, z: string, rot: string) => {
        matrices[tId] = Matrix.multiply(scaling(parseArg(x), parseArg(y), parseArg(z)), rotation_z(parseArg(rot)));
    })

    given(/^([\w\d_]+) ← ([\w\d_]+)\(\) with:$/, (shapeId: string, shapeType: string, dataTable: DataTableType) => {
        shapes[shapeId] = parseRawShapeTable(dataTable, shapeType);
    })

    when(/^(\w+).material ← (\w+)$/, (shapeId: string, mId: string) => {
        shapes[shapeId] = shapes[shapeId].replace(materials[mId]);
    })

    when(/^([\w\d_]+) ← normal_at\((\w+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/, (normalId: string, shapeId: string, x: string, y: string, z: string) => {
        tuples[normalId] = shapes[shapeId].normal_at(point(parseArg(x), parseArg(y), parseArg(z)));
    })

    when(/^([\w\d_]+) ← local_intersect\(([\w\d_]+), ([\w\d_]+)\)$/, (intersectionsId: string, shapeId: string, rayId: string) => {
        intersections[intersectionsId] = shapes[shapeId].intersect(rays[rayId]);
    })

    when(/^([\w\d_]+) ← local_normal_at\(([^,]+), ([^,]+)\)$/,
        (normalId: string, shapeId: string, pointId: string) => {
            tuples[normalId] = shapes[shapeId].local_normal_at(tuples[pointId]);
        })

    when(/^([\w\d_]+) ← local_normal_at\(([\w\d_]+), point\(([^,]+), ([^,]+), ([^,]+)\)\)$/,
        (normalId: string, shapeId: string, x: string, y: string, z: string) => {
            tuples[normalId] = shapes[shapeId].local_normal_at(point(parseArg(x), parseArg(y), parseArg(z)));
        })

    then(/^(\w+).count = (\d+)$/, (intersectionsId: string, count: string) => {
        expect(intersections[intersectionsId].length).toEqual(parseInt(count));
    })

    then(/^(\w+)\[(\d+)] = ([^,xs]+)$/, (intersectionsId: string, intersectionIndex: string, value: string) => {
        expect(intersections[intersectionsId][parseInt(intersectionIndex)].t).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^(\w+).transform = ([^,]+)$/, (objectId: string, mId: string) => {
        expect(Matrix.equals(getTransform(objectId), matrices[mId])).toBeTruthy()
    })

    then(/^set_transform\((\w+), scaling\(([^,]+), ([^,]+), ([^,]+)\)\)$/, (shapeId: string, x: string, y: string, z: string) => {
        shapes[shapeId] = shapes[shapeId].replace(scaling(parseArg(x), parseArg(y), parseArg(z)));
    })

    then(/^(\w+)\[(\d+)].t = ([^,]+)$/, (intersectionsId: string, intersectionIndex: string, value: string) => {
        expect(intersections[intersectionsId][parseInt(intersectionIndex)].t).toBeCloseTo(parseArg(value), 0.0001);
    })

    then(/^set_transform\((\w+), translation\(([^,]+), ([^,]+), ([^,]+)\)\)$/, (shapeId: string, x: string, y: string, z: string) => {
        shapes[shapeId] = shapes[shapeId].replace(translation(parseArg(x), parseArg(y), parseArg(z)));
    })

    then(/^set_material\((\w+), (\w+)\)$/, (shapeId: string, materialId: string) => {
        shapes[shapeId] = shapes[shapeId].local_replace_material(materials[materialId]);
    })

    then(/^([^,]+) = normalize\((\w+)\)$/, (lhsId: string, nId: string) => {
        expect(Tuple.equals(tuples[lhsId], tuples[nId].normalize)).toBeTruthy()
    })

    when(/^([\w\d_]+) ← (\w+).material$/, (mId: string, shapeId: string) => {
        materials[mId] = shapes[shapeId].material;
    })

    then(/^([\w\d_]+) = material\(\)$/, (mId: string) => {
        expect(Material.equals(materials[mId], new Material())).toBeTruthy()
    })

    then(/^(\w+).material = (\w+)$/, (shapeId: string, mId: string) => {
        expect(Material.equals(shapes[shapeId].material, materials[mId])).toBeTruthy()
    })

    then(/(\w+).transform = translation\(([^,]+), ([^,]+), ([^,]+)\)/, (shapeId: string, x: string, y: string, z: string) => {
        const actual = getTransform(shapeId);
        expect(Matrix.equals(actual, translation(parseArg(x), parseArg(y), parseArg(z)))).toBeTruthy()
    })

    then(/^(\w+).material.transparency = (.*)$/, (shapeId: string, t: string) => {
        expect(shapes[shapeId].material.transparency).toBeCloseTo(parseArg(t));
    })

    then(/^(\w+).material.refractive_index = (.*)$/, (shapeId: string, ri: string) => {
        expect(shapes[shapeId].material.refractive_index).toBeCloseTo(parseArg(ri));
    })

    then(/^(\w+) shape.equals (.+)/, (lhs: string, rhs: string) => {
        expect(shapes[lhs].equals(shapes[rhs])).toBeTruthy()
    })

    then(/^(\w+) does not shape.equals (.+)/, (lhs: string, rhs: string) => {
        expect(shapes[lhs].equals(shapes[rhs])).toBeFalsy()
    })

    then(/(.*) is a shape/, (id: string) => {
        expect(isShape(shapes[id])).toBeTruthy();
    })

    then(/(.*) is not a shape/, (id: string) => {
        expect(isShape(tuples[id])).toBeFalsy();
    })
}

function getTransform(shapeId: string): Matrix {
    let actual = new Matrix(0, 0);

    if (shapes[shapeId]) {
        actual = shapes[shapeId].transform;
        // } else if (cameras[shapeId]) {
        //     actual = cameras[shapeId].transform;
    } else if (patterns[shapeId]) {
        actual = patterns[shapeId].transform;
    }
    return actual;
}

export function parseRawShapeTable(data: DataTableType, shapeType = 'sphere'): Shape {
    let color: Color = new Color(1, 1, 1);
    let ambient = 0.1;
    let diffuse = 0.9;
    let specular = 0.9;
    let shininess = 200.0;
    let reflective = 0.0;
    let refractive_index = 1.0;
    let transparency = 0.0;
    let pattern = null;
    let t = Matrix.identity(4);

    data.forEach(r => {
            const value = r.value;
            switch (r.field) {
                case 'material.color':
                    color = parseColor(value);
                    break;
                case 'material.ambient':
                    ambient = parseArg(value);
                    break;
                case 'material.diffuse':
                    diffuse = parseArg(value);
                    break;
                case 'material.specular':
                    specular = parseArg(value);
                    break;
                case 'material.shininess':
                    shininess = parseArg(value);
                    break;
                case 'material.reflective':
                    reflective = parseArg(value);
                    break;
                case 'material.transparency':
                    transparency = parseArg(value);
                    break;
                case 'material.refractive_index':
                    refractive_index = parseArg(value);
                    break;
                case 'material.pattern':
                    pattern = test_pattern();
                    break;
                case 'transform':
                    t = parseMatrixOp(value);
                    break;
                default:
                    throw new Error('Unexpected field' + r.field);
                    break;
            }
        }
    )

    const m = new Material(color, ambient, diffuse, specular, shininess, reflective, transparency, refractive_index, pattern);
    if (shapeType === 'sphere') {
        return new Sphere(t, m);
    }
    if (shapeType === 'glass_sphere') {
        return glass_sphere().replace(t).replace(m);
    }
    if (shapeType === 'plane') {
        return new Plane(t, m);
    }
    throw new Error('Unexpected Object type : ' + shapeType);
    return new Sphere();
}

function parseColor(s: string): Color {
    const fields = s.match(/\(([^,]+), ([^,]+), ([^,]+)\)/);
    if (fields) {
        return new Color(parseArg(fields[1]), parseArg(fields[2]), parseArg(fields[3]));
    }
    throw new Error('Unexpected field');
    return Color.BLACK;
}

function parseMatrixOp(s: string): Matrix {
    const fields = s.match(/([\w]+)\(([^,]+), ([^,]+), ([^,]+)\)/);
    if (fields) {
        if (fields[1] === 'scaling') {
            return scaling(parseArg(fields[2]), parseArg(fields[3]), parseArg(fields[4]));
        }
        if (fields[1] === 'translation') {
            return translation(parseArg(fields[2]), parseArg(fields[3]), parseArg(fields[4]));
        }
    }
    throw new Error('Unexpected field');
}
