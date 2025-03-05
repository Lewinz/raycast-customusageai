import React from "react";
import { List, ActionPanel, Action, getPreferenceValues, LocalStorage, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { Template } from "./types";
import { ChatView } from "./components/ChatView";

export default function Command() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const preferences = getPreferenceValues();

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    const savedTemplates = await LocalStorage.getItem<string>("templates");
    if (savedTemplates) {
      const parsedTemplates = JSON.parse(savedTemplates);
      // 按使用次数排序
      parsedTemplates.sort((a: Template, b: Template) => (b.useCount || 0) - (a.useCount || 0));
      setTemplates(parsedTemplates);
    }
  }

  if (templates.length === 0) {
    return (
      <List>
        <List.EmptyView
          title="No Templates Found"
          description="Create a template first using the Manage Templates command"
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                title="Open Manage Templates"
                target="raycast://extensions/custom-usage-ai/manage-templates"
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List>
      {templates.map((template) => (
        <List.Item
          key={template.id}
          title={template.name}
          subtitle={template.content.substring(0, 50) + "..."}
          actions={
            <ActionPanel>
              <Action.Push
                title="Use Template (Empty Input)"
                target={<ChatView template={template} />}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
} 