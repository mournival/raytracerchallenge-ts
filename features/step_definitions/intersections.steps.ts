import {autoBindSteps, loadFeatures} from 'jest-cucumber';
import {tupleSteps} from "./steps/tuple-steps";
import {matricesSteps} from "./steps/matrices-steps";
import {transformationsSteps} from "./steps/transformations-steps";
import {raysSteps} from "./steps/rays-steps";
import {spheresSteps} from "./steps/spheres-steps";
import {intersectionsSteps} from "./steps/intersections-steps";
import {shapesSteps} from "./steps/shapes-steps";
import {planeSteps} from "./steps/plane-steps";
import {triangleSteps} from "./steps/triangle-steps";

const feature = loadFeatures('./features/intersections.feature');

autoBindSteps(feature, [
    tupleSteps, matricesSteps, transformationsSteps, raysSteps, shapesSteps, planeSteps, spheresSteps, triangleSteps, intersectionsSteps
]);