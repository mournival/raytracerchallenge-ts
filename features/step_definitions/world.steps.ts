import {autoBindSteps, loadFeatures} from 'jest-cucumber';
import {worldSteps} from "./steps/world-steps";
import {materialsSteps} from "./steps/materials-steps";
import {lightsSteps} from "./steps/lights-steps";
import {spheresSteps} from "./steps/spheres-steps";
import {shapesSteps} from "./steps/shapes-steps";
import {raysSteps} from "./steps/rays-steps";
import {intersectionsSteps} from "./steps/intersections-steps";
import {tupleSteps} from "./steps/tuple-steps";
import {matricesSteps} from "./steps/matrices-steps";

const feature = loadFeatures('./features/world.feature');

autoBindSteps(feature, [tupleSteps, matricesSteps, materialsSteps, lightsSteps, intersectionsSteps, raysSteps, shapesSteps, spheresSteps, worldSteps]);