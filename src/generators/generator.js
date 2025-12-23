const path = require('path');
const fs = require('fs-extra');
const Handlebars = require('handlebars');

async function renderTemplateFile(srcPath, destPath, context) {
  const content = await fs.readFile(srcPath, 'utf8');
  const tpl = Handlebars.compile(content);
  const out = tpl(context);
  await fs.outputFile(destPath, out);
}

async function copyAndRenderTemplates(templateDir, targetDir, context) {
  const entries = await fs.readdir(templateDir);
  for (const entry of entries) {
    const src = path.join(templateDir, entry);
    const stat = await fs.stat(src);
    if (stat.isDirectory()) {
      await copyAndRenderTemplates(src, path.join(targetDir, entry), context);
    } else {
      const isHbs = entry.endsWith('.hbs');
      const destName = isHbs ? entry.replace(/\.hbs$/, '') : entry;
      const dest = path.join(targetDir, destName);
      if (isHbs) {
        await renderTemplateFile(src, dest, context);
      } else {
        await fs.copy(src, dest);
      }
    }
  }
}

module.exports = {
  generate: async (appName, answers) => {
    const templatesRoot = path.join(__dirname, '..', '..', 'templates');
    const projectTemplateDir = path.join(templatesRoot, answers.projectType);
    const commonDir = path.join(templatesRoot, 'common');
    const targetDir = path.resolve(process.cwd(), appName);
    await fs.ensureDir(targetDir);

    if (await fs.pathExists(projectTemplateDir)) {
      await copyAndRenderTemplates(projectTemplateDir, targetDir, answers);
    }

    if (await fs.pathExists(commonDir)) {
      await copyAndRenderTemplates(commonDir, targetDir, answers);
    }

    return;
  }
};
