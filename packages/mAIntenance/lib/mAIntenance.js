#!/usr/bin/env node --loader ts-node/esm --experimental-specifier-resolution=node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Configuration, OpenAIApi } from "openai";
import * as fs from "fs";
import doAsync from "doasync";
const openAiAuthKey = "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";
const docs = {
    prompt: "Write neatly formatted markdown documentation with prop definitions and an integration guide",
    fileExtension: "docs.md",
};
const tests = {
    prompt: "Write jest unit tests",
    fileExtension: "test.js",
};
const stories = {
    prompt: "Using Storybook.js, write a stories file",
    fileExtension: "stories.jsx",
};
const mAIntenance = (componentFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const configuration = new Configuration({ apiKey: openAiAuthKey });
    const openai = new OpenAIApi(configuration);
    const component = yield doAsync(fs).readFile(componentFilePath, "utf8");
    const tasks = [
        docs,
        stories,
    ];
    tasks.forEach((task) => __awaiter(void 0, void 0, void 0, function* () {
        const completion = yield openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${task.prompt} for the following react component: ${component}`,
            max_tokens: 256,
        });
        const response = yield completion.data.choices[0].text;
        const componentFilePathArr = componentFilePath.split("/");
        componentFilePathArr.pop();
        const componentName = componentFilePathArr.slice(-1);
        fs.writeFile(`${componentFilePathArr.join("/")}/${componentName}.${task.fileExtension}`, response, (err) => {
            if (err)
                throw err;
            console.log("File created successfully");
        });
    }));
});
export default mAIntenance;
//# sourceMappingURL=mAIntenance.js.map