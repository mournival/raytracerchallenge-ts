import {autoBindSteps, loadFeatures} from 'jest-cucumber';
import {tupleSteps} from "./steps/tuple-steps";
import {lightsSteps} from "./steps/lights-steps";

const feature = loadFeatures('./features/lights.feature');

autoBindSteps(feature, [tupleSteps, lightsSteps]);