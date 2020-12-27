import { refs } from "../refs";
import { ExtraSerializersPreset, isConstantExtraSerializer, isRecursiveExtraSerializer } from "../types";

export class BaseDeserializer {
    static deserialize(str: string, extraSerializers: ExtraSerializersPreset = {}) {
        const [value, ...refsList] = JSON.parse(str);
        const resRefs = BaseDeserializer.replaceRefsRefs(refsList, extraSerializers);
        return BaseDeserializer.replaceRefs(value, resRefs, extraSerializers);
    }

    private static replaceRefsRefs(refsList: any[], extraSerializers: ExtraSerializersPreset) {
        const resRefs = new Map<string, any>(refsList.map((ref, idx) => [refs.create(idx), ref]));
        const prevRefs = new Map<string, any>();
        const refsInitilizes = new Map<string, any>();

        // prepare ref links (deserialize without initialize)
        for (const [refId, ref] of resRefs.entries()) {
            const serializerId = resRefs.get(ref?.[0]);
            if (serializerId) {
                const serializer = extraSerializers[serializerId];
                if (serializer) {
                    resRefs.set(refId, serializer.deserialize(ref?.[1]));
                    if (isRecursiveExtraSerializer(serializer)) {
                        refsInitilizes.set(refId, serializer);
                        prevRefs.set(refId, ref?.[1]);
                    }
                } else {
                    console.warn("Serilizer not found");
                }
            }
        }
        // replace refs
        for (const [refId, ref] of resRefs.entries()) {
            if (refsInitilizes.has(refId)) {
                refsInitilizes
                    .get(refId)
                    .initialize(ref, BaseDeserializer.replaceRefs(prevRefs.get(refId), resRefs, extraSerializers));
            } else {
                resRefs.set(refId, BaseDeserializer.replaceRefs(ref, resRefs, extraSerializers));
            }
        }
        return resRefs;
    }

    private static replaceRefs(value: any, known: Map<string, any>, serialziers: ExtraSerializersPreset) {
        const knownValue = known.get(value);
        if (knownValue) {
            if (serialziers[knownValue] && isConstantExtraSerializer(serialziers[knownValue])) {
                return serialziers[knownValue].deserialize(value);
            }
            return knownValue;
        }
        if (typeof value === "object" && value !== null) {
            if (Array.isArray(value)) {
                const serializerId = known.get(value?.[0]);
                if (
                    serializerId &&
                    serialziers.hasOwnProperty(serializerId) &&
                    !isConstantExtraSerializer(serialziers[serializerId])
                ) {
                    const serializer = serialziers[serializerId];
                    const rs = serializer.deserialize(value?.[1]);
                    if (isRecursiveExtraSerializer(serializer)) {
                        serializer.initialize(rs, BaseDeserializer.replaceRefs(value?.[1], known, serialziers));
                    }
                    return rs;
                }
            }
            for (const [key, v] of Object.entries(value)) {
                value[key] = BaseDeserializer.replaceRefs(v, known, serialziers);
            }
        }
        return value;
    }
}
