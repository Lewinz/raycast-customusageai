import React from "react";
import { Form, ActionPanel, Action, LocalStorage, showToast, Toast, useNavigation } from "@raycast/api";
import { useState } from "react";
import { Template } from "../types";

interface TemplateFormProps {
  template?: Template;
  onSave: () => void;
}

export function TemplateForm({ template, onSave }: TemplateFormProps) {
  const [name, setName] = useState(template?.name ?? "");
  const [content, setContent] = useState(template?.content ?? "");
  const { pop } = useNavigation();

  async function handleSubmit() {
    try {
      if (!name || !content) {
        await showToast({ 
          title: "请填写所有字段", 
          style: Toast.Style.Failure 
        });
        return;
      }

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
      
      await LocalStorage.setItem("templates", JSON.stringify(templates));
      await showToast({ 
        title: "保存成功", 
        style: Toast.Style.Success 
      });
      await onSave();
      pop();
    } catch (error) {
      console.error(error);
      await showToast({ 
        title: "保存失败", 
        style: Toast.Style.Failure 
      });
    }
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