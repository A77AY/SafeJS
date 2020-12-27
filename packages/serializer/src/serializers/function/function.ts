import { ExtraSerializer } from "../../types";

export const functionSerializer: ExtraSerializer<(...v: any[]) => any, string> = {
    determine: (v) => typeof v === "function",
    serialize: (v) => v.toString(),
    deserialize: (v) => new Function(`return ${v}`)(),
};
