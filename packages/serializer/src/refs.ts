export class Refs {
    private prefix: string;
    private regExp: RegExp;
    private count: number = 0;

    constructor({ prefix = "" }: { prefix?: string } = {}) {
        this.prefix = prefix;
        this.regExp = this.createRegExp();
    }

    test(value: any) {
        return typeof value === "string" && this.regExp.test(value);
    }

    get(idx: number) {
        return idx < this.count ? this.create(idx) : null;
    }

    create(value: string | number) {
        return `${this.prefix}${value}`;
    }

    private createRegExp() {
        return new RegExp(`^${this.prefix}\\d+$`);
    }
}

export const refs = new Refs({ prefix: "°" });
