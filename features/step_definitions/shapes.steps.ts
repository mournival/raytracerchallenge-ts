import {autoBindSteps, loadFeatures} from 'jest-cucumber';
import {tupleSteps} from "./steps/tuple-steps";
import {matricesSteps} from "./steps/matrices-steps";
import {transformationsSteps} from "./steps/transformations-steps";
import {shapesSteps} from "./steps/shapes-steps";
import {spheresSteps} from "./steps/spheres-steps";
import {materialsSteps} from "./steps/materials-steps";
import {planeSteps} from "./steps/plane-steps";
import {raysSteps} from "./steps/rays-steps";
import {intersectionsSteps} from "./steps/intersections-steps";
import {cubeSteps} from "./steps/cube-steps";
import {cylinderSteps} from "./steps/cylinder-steps";
import {coneSteps} from "./steps/cone-steps";
import {csgSteps} from "./steps/csg-steps";
import {groupSteps} from "./steps/group-steps";
import {triangleSteps} from "./steps/triangle-steps";
import {smoothTriangleSteps} from "./steps/smooth-triangle-steps";

const feature = loadFeatures('features/shapes/**/*.feature')
autoBindSteps(feature, [
    tupleSteps,
    matricesSteps,
    transformationsSteps,
    materialsSteps,
    intersectionsSteps,
    raysSteps,
    coneSteps,
    csgSteps,
    cubeSteps,
    cylinderSteps,
    groupSteps,
    planeSteps,
    smoothTriangleSteps,
    spheresSteps,
    triangleSteps,
    shapesSteps
]);