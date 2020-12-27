import { RecursiveExtraSerializer } from "../../types";

export const setSerializer: RecursiveExtraSerializer<Set<any>, any[]> = {
    determine: (v) => v instanceof Set,
    serialize: (v) => Array.from(v),
    deserialize: () => new Set(),
    initialize: (obj, v) => {
        if (Array.isArray(v)) v.forEach((i) => obj.add(i));
    },
};
