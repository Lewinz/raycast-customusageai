import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPreferenceValues, LocalStorage } from "@raycast/api";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function updateCommands() {
  try {
    // 从 LocalStorage 读取模板
    const savedTemplates = await LocalStorage.getItem<string>("templates");
    const templates = savedTemplates ? JSON.parse(savedTemplates) : [];
    
    const packagePath = path.join(__dirname, "../package.json");
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
    
    // 保留管理模板的命令
    pkg.commands = pkg.commands.filter((cmd: any) => cmd.name === "manage-templates");
    
    // 为每个模板添加命令
    templates.forEach((template: any) => {
      pkg.commands.push({
        name: `template-${template.id}`,
        title: template.name,
        description: `使用${template.name}模板`,
        mode: "view",
        arguments: [
          {
            name: "templateId",
            type: "text",
            default: template.id
          }
        ]
      });
    });
    
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
    console.log("Commands updated successfully!");
  } catch (error) {
    console.error("Error updating commands:", error);
  }
}

updateCommands(); 