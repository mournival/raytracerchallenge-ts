import {autoBindSteps, loadFeatures} from 'jest-cucumber';
import {tupleSteps} from "./steps/tuple-steps";
import {matricesSteps} from "./steps/matrices-steps";
import {transformationsSteps} from "./steps/transformations-steps";
import {raysSteps} from "./steps/rays-steps";

const feature = loadFeatures('./features/math/*.feature');

autoBindSteps(feature, [tupleSteps, matricesSteps, raysSteps, transformationsSteps]);