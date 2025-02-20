import React from "react";
import { List, ActionPanel, Action, LocalStorage } from "@raycast/api";
import { Template } from "./types";
import { ChatView } from "./components/ChatView";

export default function Command() {
  const [templates, setTemplates] = React.useState<Template[]>([]);

  React.useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    const savedTemplates = await LocalStorage.getItem<string>("templates");
    if (savedTemplates) {
      const templates = JSON.parse(savedTemplates);
      // 按使用次数排序
      templates.sort((a: Template, b: Template) => (b.useCount || 0) - (a.useCount || 0));
      setTemplates(templates);
    }
  }

  if (templates.length === 0) {
    return (
      <List>
        <List.EmptyView
          title="No Templates"
          description="Please create a template first in Manage Templates"
        />
      </List>
    );
  }

  return (
    <List searchBarPlaceholder="Search templates...">
      {templates.map((template) => (
        <List.Item
          key={template.id}
          title={template.name}
          subtitle={`Used: ${template.useCount || 0} times`}
          actions={
            <ActionPanel>
              <Action.Push
                title="Use"
                target={<ChatView template={template} />}
                shortcut={{ modifiers: ["cmd"], key: "enter" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
} 