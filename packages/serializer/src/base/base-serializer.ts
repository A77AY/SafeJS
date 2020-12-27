import { refs } from "../refs";
import {
    ExtraSerializersPreset,
    ExtraSerializerRef,
    UnifiedExtraSerializer,
    ExtraSerializerId,
    isConstantExtraSerializer,
} from "../types";

interface Known {
    idx?: number;
    serialized?: any;
    include: boolean;
}

type IdentifiedExtraSerializer = UnifiedExtraSerializer & {
    id: ExtraSerializerId;
    ref: ExtraSerializerRef;
};

class Knowns {
    nextIdx = 0;
    list = new Map<any, Known>();

    include(ref: any, known: Partial<Known> = {}) {
        let v = this.list.get(ref);
        if (v) {
            Object.assign(v, known);
        } else {
            v = this.add(ref, known);
        }
        if (!v.include) {
            v.include = true;
            v.idx = this.nextIdx;
            this.nextIdx++;
        }
        return v;
    }

    has(ref: any) {
        return this.list.has(ref);
    }

    get(ref: any) {
        return this.list.get(ref);
    }

    add(ref: any, known: Partial<Known> = {}) {
        const v = { include: false, ...known };
        this.list.set(ref, v);
        return v;
    }

    getIncludes() {
        return Array.from(this.list.values())
            .filter((o) => o.include)
            .sort((a, b) => a.idx - b.idx)
            .map((o) => o.serialized);
    }
}

export class BaseSerializer {
    static serialize(value: any, extraSerializers: ExtraSerializersPreset = {}) {
        const serializers: IdentifiedExtraSerializer[] = Object.entries(extraSerializers).map(([id, s]) => ({
            ...s,
            ref: {},
            id,
        }));
        const knowns = BaseSerializer.getKnowns(value, serializers);
        const serialized = [value, ...knowns.getIncludes()];
        return JSON.stringify(serialized, function (k) {
            const v = this[k];
            if (this === serialized && k !== "0") {
                if (serializers.find((s) => s.ref === v)) {
                    return serializers.find((s) => s.ref === v).id;
                }
                return v;
            }
            const knownValue = knowns.get(v);
            if (knownValue) {
                if (knownValue.include) return refs.create(knownValue.idx);
                return knownValue.serialized;
            }
            const serializer = BaseSerializer.findExtraSerializer(v, serializers);
            if (serializer) {
                const serialized = BaseSerializer.serializeByExtraSerializer(v, serializer);
                if (knowns.has(serialized)) {
                    return refs.create(knowns.get(serialized).idx);
                }
                return BaseSerializer.serializeByExtraSerializer(v, serializer);
            }
            return v;
        });
    }

    private static getKnowns(value: any, serializers: IdentifiedExtraSerializer[]) {
        const knowns = new Knowns();
        JSON.stringify(value, function (k) {
            const v = this[k];
            if (knowns.has(v)) {
                const known = knowns.include(v);
                return refs.create(known.idx);
            }
            if (refs.test(v)) {
                const known = knowns.include(v, { serialized: v });
                return refs.create(known.idx);
            }
            const serializer = BaseSerializer.findExtraSerializer(v, serializers);
            let serialized = v;
            if (serializer) {
                knowns.include(serializer.ref, { serialized: serializer.ref });
                serialized = BaseSerializer.serializeByExtraSerializer(v, serializer);
            }

            if ((typeof v === "object" && v !== null) || typeof v === "symbol") {
                knowns.add(v, { serialized });
            }
            return serialized;
        });
        return knowns;
    }

    private static findExtraSerializer(v: any, serializers: IdentifiedExtraSerializer[]) {
        for (const serializer of serializers) {
            if (serializer.determine(v)) {
                return serializer;
            }
        }
    }

    private static serializeByExtraSerializer(v: any, serializer: IdentifiedExtraSerializer) {
        return isConstantExtraSerializer(serializer) ? serializer.ref : [serializer.ref, serializer.serialize(v)];
    }
}
