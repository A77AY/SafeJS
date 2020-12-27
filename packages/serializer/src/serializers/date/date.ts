import { ExtraSerializer } from "../../types";

export const dateSerializer: ExtraSerializer<Date, string> = {
    determine: (v) => v instanceof Date,
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Date(v),
};
