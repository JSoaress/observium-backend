import fs from "fs";
import handlebars from "handlebars";

export function compileHTML(path: string, variables: Record<string, unknown>) {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");
    const templateParse = handlebars.compile(templateFileContent);
    return templateParse(variables);
}
