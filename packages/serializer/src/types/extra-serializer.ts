interface DeterminedExtraSerializer {
    determine: (value: any) => boolean;
}

export interface ExtraSerializer<T = any, S = any> extends DeterminedExtraSerializer {
    serialize: (value: T) => S;
    deserialize: (serializedValue: S) => T;
}

export interface ConstantExtraSerializer<T = any> extends DeterminedExtraSerializer {
    deserialize: () => T;
}

export interface RecursiveExtraSerializer<T = any, S = any> extends ExtraSerializer<T, S> {
    initialize: (created: T, serializedValue: S) => void;
}

export type UnifiedExtraSerializer<T = any, S = any> =
    | ConstantExtraSerializer<T>
    | ExtraSerializer<T, S>
    | RecursiveExtraSerializer<T, S>;

export function isExtraSerializer(serializer: UnifiedExtraSerializer): serializer is ExtraSerializer {
    return !isConstantExtraSerializer(serializer) && !isRecursiveExtraSerializer(serializer);
}

export function isConstantExtraSerializer(serializer: UnifiedExtraSerializer): serializer is ConstantExtraSerializer {
    return !(serializer as ExtraSerializer).serialize;
}

export function isRecursiveExtraSerializer(serializer: UnifiedExtraSerializer): serializer is RecursiveExtraSerializer {
    return !!(serializer as RecursiveExtraSerializer).initialize;
}

export type ExtraSerializerRef = {};
export type ExtraSerializerId = string;

export type ExtraSerializersPreset = {
    [Id in ExtraSerializerId]: UnifiedExtraSerializer;
};
