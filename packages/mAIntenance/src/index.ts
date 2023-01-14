#!/usr/bin/env node --loader ts-node/esm --experimental-specifier-resolution=node

// import inquirer from "inquirer";
// import {
//   // readdirSync,
//   writeFile,
// } from "fs";
// import { Configuration, OpenAIApi } from "openai";
// import * as fs from "fs";
// import doAsync from "doasync";
// import glob from "glob";

//TODO: GET YOUR OWN API KEY
// const openAiAuthKey = 'YOUR OPENAI AUTH KEY HERE';

// type task = {
//   name: string;
//   prompt: string;
//   fileExtension: string;
//   icon?: string;
// };

// type tasks = task[];

// const docs: task = {
//   name: "documentation",
//   icon: "📜",
//   prompt:
//     "Write neatly formatted markdown documentation detailing the prop definitions in a table, as well as providing a simple integration guide",
//   fileExtension: "docs.md",
// };

// const tests: task = {
//   name: "test",
//   icon: "🧪",
//   prompt: "Write jest unit tests",
//   fileExtension: "test.js",
// };

// const stories: task = {
//   name: "storybook",
//   icon: "📖",
//   prompt:
//     "Using Storybook.js, write a stories file with the component story format in typescript",
//   fileExtension: "stories.tsx",
// };

// const mAIntenance = async (componentFilePath: string) => {
//   const componentFilePathArr = componentFilePath.split("/");
//   componentFilePathArr.pop();
//   const componentName = componentFilePathArr.slice(-1)[0];
//   console.log(`🚧 ${componentName} mAIntenance started!`);
//   // configure openai & auth
//   const configuration = new Configuration({ apiKey: openAiAuthKey });

//   // instantiate openai instance
//   const openai = new OpenAIApi(configuration);

//   // assign component text content to variable
//   const component = await doAsync(fs).readFile(componentFilePath, "utf8");

//   const tasks: tasks = [docs, tests, stories];

//   tasks.forEach(async ({ name, icon, fileExtension, prompt }) => {
//     console.log(`${icon} ${componentName} ${name} mAIntenance started!`);

//     // request text completion from openai to write markdown docs
//     const completion = await openai
//       .createCompletion({
//         model: "text-davinci-003",
//         prompt: `${prompt} for the following react component: ${component}`,
//         max_tokens: 256,
//       })
//       .catch((err) => {
//         if (err) throw err;
//       });

//     // assign response from openai to variable
//     const response: string = await completion?.data.choices[0].text;

//     //   write openai response to markdown file
//     writeFile(
//       `${componentFilePathArr.join("/")}/${componentName}.${fileExtension}`,
//       response,
//       (err) => {
//         if (err) throw err;
//         console.log(`✅ ${componentName} ${name} mAIntenance completed!`);
//       }
//     );
//   });
// };

export const testFunction = (text: string) => {
  console.log("Message...: ", text);
  return text;
};

// const getDirectories = (source: string) =>
//   readdirSync(source, { withFileTypes: true })
//     .filter((dirent) => dirent.isDirectory())
//     .map((dirent) => dirent.name);

// console.log(process.cwd);

// inquirer
//   .prompt([
//     /* Pass your questions in here */
//     {
//       type: "list",
//       name: "package",
//       message: "Which package would you like to mAIntain?",
//       //dynamically find the 'packages' directory in a monorepo
//       choices: getDirectories("E:/2023/domain-monorepo/packages"),
//     },
//     {
//       type: "input",
//       name: "packageSrcDir",
//       message: "Provide file path to components folder",
//     },
//   ])
//   .then((answers) => {
//     const components = glob(
//       answers.packageSrcDir + "/**/*",
//       (err: any, res: any[]) => {
//         if (err) {
//           console.log("Error", err);
//         } else {
//           return res.filter((childDirectory) =>
//             childDirectory.includes("src/components")
//           );
//         }
//       }
//     );

//     console.log(answers);

//     // Use user feedback for... whatever!!
//     // const componentsInPackage = getDirectories(
//     //   `E:/2023/domain-monorepo/packages/${answers.package}/src/components`
//     // );
//     // console.log(
//     //   `🚀 Starting mAIntenance for components: ${componentsInPackage.map(
//     //     (component: string) => `${component} `
//     //   )}`
//     // );

//     // componentsInPackage.forEach(async (component) => {
//     //   const componentPath = `E:/2023/domain-monorepo/packages/${answers.package}/src/components/${component}/${component}.tsx`;
//     //   await mAIntenance(componentPath);
//     // });
//   })
//   .catch((error) => {
//     if (error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//     } else {
//       // Something else went wrong
//     }
//   });

// export default {};
