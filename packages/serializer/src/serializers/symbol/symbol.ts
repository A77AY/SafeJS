import { ExtraSerializer } from "../../types";

export const symbolSerializer: ExtraSerializer<Symbol, string> = {
    determine: (v) => typeof v === "symbol",
    serialize: (v: any) => (typeof v.description === "string" ? v.description : null),
    deserialize: (description) => (typeof description === "string" ? Symbol(description) : Symbol()),
};
