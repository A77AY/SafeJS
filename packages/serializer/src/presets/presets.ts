import { UnifiedExtraSerializer } from "../types/extra-serializer";
import {
    dateSerializer,
    functionSerializer,
    mapSerializer,
    setSerializer,
    symbolSerializer,
    regExpSerializer,
    undefinedSerializer,
    nanSerializer,
    positiveInfinitySerializer,
    negativeInfinitySerializer,
} from "../serializers";
import { BuiltIn } from "./built-in";

type PartialPreset = Partial<{ [N in BuiltIn]: UnifiedExtraSerializer }>;

export const functionPreset: PartialPreset = {
    [BuiltIn.function]: functionSerializer,
};

export const constantsPreset: PartialPreset = {
    [BuiltIn.undefined]: undefinedSerializer,
    [BuiltIn.nan]: nanSerializer,
    [BuiltIn.positiveInfinity]: positiveInfinitySerializer,
    [BuiltIn.negativeInfinity]: negativeInfinitySerializer,
};

export const es5Preset: PartialPreset = {
    ...constantsPreset,
    [BuiltIn.date]: dateSerializer,
    [BuiltIn.regExp]: regExpSerializer,
};

export const es2015Preset: PartialPreset = {
    ...es5Preset,
    [BuiltIn.map]: mapSerializer,
    [BuiltIn.set]: setSerializer,
    [BuiltIn.symbol]: symbolSerializer,
};

export type Preset = "none" | "constants" | "es5" | "es2015";

export const presets: { [P in Preset]: PartialPreset } = {
    none: {},
    constants: constantsPreset,
    es5: es5Preset,
    es2015: es2015Preset,
};
