import { functionPreset, Preset, presets } from "./presets";
import { BaseSerializer, BaseDeserializer } from "./base";
import { ExtraSerializersPreset } from "./types";

interface SerializerOptions {
    /**
     * Preset
     */
    preset?: Preset;
    /**
     * Serialize functions
     */
    functions?: boolean;
    /**
     * Extra serializers
     */
    extra?: ExtraSerializersPreset;
}

const DEFAULT_SERIALIZER_OPTIONS: SerializerOptions = {
    preset: "es5",
    functions: false,
    extra: {},
};

export class Serializer {
    private serializers: ExtraSerializersPreset = {};

    constructor(options: SerializerOptions = {}) {
        this.setOptions(options);
    }

    setOptions({
        preset = DEFAULT_SERIALIZER_OPTIONS.preset,
        functions: f = DEFAULT_SERIALIZER_OPTIONS.functions,
        extra = DEFAULT_SERIALIZER_OPTIONS.extra,
    }: SerializerOptions = DEFAULT_SERIALIZER_OPTIONS) {
        this.serializers = {
            ...(f ? functionPreset : {}),
            ...(preset ? presets[preset] : {}),
            ...extra,
        };
    }

    serialize(obj: any): string {
        return BaseSerializer.serialize(obj, this.serializers);
    }

    deserialize<T = any>(str: string): T {
        return BaseDeserializer.deserialize(str, this.serializers);
    }
}
