import React from "react";
import {
  ActionPanel,
  Form,
  List,
  Action,
  useNavigation,
  getPreferenceValues,
  LocalStorage,
  showToast,
  Toast,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { ChatView } from "./components/ChatView";
import { TemplateForm } from "./components/TemplateForm";
import { Template, Preferences } from "./types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Command() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { push } = useNavigation();
  const preferences = getPreferenceValues<Preferences>();

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    const savedTemplates = await LocalStorage.getItem<string>("templates");
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }

  async function handleTemplateSelect(template: Template) {
    push(<ChatView template={template} />);
  }

  return (
    <List>
      <List.Item
        title="New Template"
        actions={
          <ActionPanel>
            <Action.Push title="Create" target={<TemplateForm onSave={loadTemplates} />} />
          </ActionPanel>
        }
      />
      {templates.map((template) => (
        <List.Item
          key={template.id}
          title={template.name}
          actions={
            <ActionPanel>
              <Action title="Use" onAction={() => handleTemplateSelect(template)} />
              <Action.Push
                title="Edit"
                target={<TemplateForm template={template} onSave={loadTemplates} />}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
} 