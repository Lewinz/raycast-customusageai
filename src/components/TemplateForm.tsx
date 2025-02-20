import React from "react";
import { Form, ActionPanel, Action, LocalStorage } from "@raycast/api";
import { useState } from "react";
import { Template } from "../types";
import fs from "fs";

interface TemplateFormProps {
  template?: Template;
  onSave: () => void;
}

export function TemplateForm({ template, onSave }: TemplateFormProps) {
  const [name, setName] = useState(template?.name ?? "");
  const [content, setContent] = useState(template?.content ?? "");

  async function handleSubmit() {
    const savedTemplates = await LocalStorage.getItem<string>("templates");
    const templates = savedTemplates ? JSON.parse(savedTemplates) : [];
    
    if (template) {
      const index = templates.findIndex((t: Template) => t.id === template.id);
      templates[index] = { ...template, name, content, useCount: template.useCount };
    } else {
      templates.push({
        id: Date.now().toString(),
        name,
        content,
        useCount: 0
      });
    }
    
    // 保存到 LocalStorage
    await LocalStorage.setItem("templates", JSON.stringify(templates));
    
    // 同时保存到文件系统
    const templatesPath = ".raycast/templates.json";
    fs.writeFileSync(templatesPath, JSON.stringify(templates, null, 2));
    
    onSave();
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Template Name"
        value={name}
        onChange={setName}
      />
      <Form.TextArea
        id="content"
        title="Prompt Template"
        value={content}
        onChange={setContent}
        placeholder="Enter your prompt template here, use {input} as user input variable"
      />
    </Form>
  );
} 