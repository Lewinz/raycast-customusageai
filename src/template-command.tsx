import React from "react";
import { Form, ActionPanel, Action, getPreferenceValues, LocalStorage } from "@raycast/api";
import { Template } from "./types";
import { ChatView } from "./components/ChatView";

interface Props {
  templateId: string;
}

export default async function Command(props: Props) {
  const savedTemplates = await LocalStorage.getItem<string>("templates");
  const templates = savedTemplates ? JSON.parse(savedTemplates) : [];
  const template = templates.find((t: Template) => t.id === props.templateId);
  
  if (!template) {
    return <Form><Form.Description text="模板不存在" /></Form>;
  }
  
  return <ChatView template={template} />;
} 