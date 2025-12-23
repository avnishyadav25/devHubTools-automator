const prompts = require('../prompts/projectPrompts');
const generator = require('../generators/generator');
const chalk = require('chalk');

module.exports = async function create(appName, options) {
  console.log(chalk.cyan(`Scaffolding ${appName} — interactive prompts starting...`));
  const answers = await prompts.ask(appName);
  await generator.generate(appName, answers);
  console.log(chalk.green(`Project ${appName} created successfully.`));
};
