import fs from "fs";
import path from "path";

async function updateCommands() {
  try {
    // 读取本地存储的模板文件
    const templatesPath = path.join(__dirname, "../.raycast/templates.json");
    const templates = fs.existsSync(templatesPath) 
      ? JSON.parse(fs.readFileSync(templatesPath, "utf-8"))
      : [];
    
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