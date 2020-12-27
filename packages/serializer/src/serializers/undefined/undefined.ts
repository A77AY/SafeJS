import { ConstantExtraSerializer } from "../../types";

export const undefinedSerializer: ConstantExtraSerializer<undefined> = {
    determine: (v) => v === undefined,
    deserialize: () => undefined,
};
