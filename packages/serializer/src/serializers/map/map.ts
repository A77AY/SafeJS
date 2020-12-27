import { RecursiveExtraSerializer } from "../../types";

export const mapSerializer: RecursiveExtraSerializer<Map<any, any>, [any, any][]> = {
    determine: (v) => v instanceof Map,
    serialize: (v) => Array.from(v),
    deserialize: () => new Map(),
    initialize: (obj, v) => {
        if (Array.isArray(v)) v.forEach(([k, v]) => obj.set(k, v));
    },
};
