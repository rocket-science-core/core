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
import { writeFile } from "fs";
import { Configuration, OpenAIApi } from "openai";
import * as fs from "fs";
import doAsync from "doasync";
const openAiAuthKey = "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";
const docs = {
    taskName: "documentation",
    icon: "📜",
    prompt: "Write neatly formatted markdown documentation detailing the prop definitions in a table, as well as providing a simple integration guide",
    fileExtension: "docs.md",
};
const tests = {
    taskName: "test",
    icon: "🧪",
    prompt: "Write jest unit tests",
    fileExtension: "test.js",
};
const stories = {
    taskName: "storybook",
    icon: "📖",
    prompt: "Using Storybook.js, write a stories file with the component story format in typescript",
    fileExtension: "stories.tsx",
};
const mAIntenance = (componentFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    const componentFilePathArr = componentFilePath.split("/");
    componentFilePathArr.pop();
    const componentName = componentFilePathArr.slice(-1)[0];
    console.log(`🚧 ${componentName} mAIntenance started!`);
    const configuration = new Configuration({ apiKey: openAiAuthKey });
    const openai = new OpenAIApi(configuration);
    const component = yield doAsync(fs).readFile(componentFilePath, "utf8");
    const tasks = [docs, tests, stories];
    tasks.forEach(({ taskName, icon, fileExtension, prompt }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`${icon} ${componentName} ${taskName} mAIntenance started!`);
        const completion = yield openai
            .createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt} for the following react component: ${component}`,
            max_tokens: 256,
        })
            .catch((err) => {
            if (err)
                throw err;
        });
        const response = yield (completion === null || completion === void 0 ? void 0 : completion.data.choices[0].text);
        writeFile(`${componentFilePathArr.join("/")}/${componentName}.${fileExtension}`, response, (err) => {
            if (err)
                throw err;
            console.log(`✅ ${componentName} ${taskName} mAIntenance completed!`);
        });
    }));
});
export const testFunction = (text) => {
    console.log("Message...: ", text);
    return text;
};
//# sourceMappingURL=index.js.map