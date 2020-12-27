import { ExtraSerializer } from "../../types";

export const regExpSerializer: ExtraSerializer<RegExp, [string, string]> = {
    determine: (v) => v instanceof RegExp,
    serialize: (v) => [v.source, v.flags],
    deserialize: ([source, flags]) => new RegExp(source, flags),
};
