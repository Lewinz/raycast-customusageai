import React from "react";
import { List, ActionPanel, Action, LocalStorage, Clipboard } from "@raycast/api";
import { Template } from "./types";
import { ChatView } from "./components/ChatView";

export default function Command() {
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [clipboardContent, setClipboardContent] = React.useState<string>("");

  React.useEffect(() => {
    loadTemplates();
    loadClipboard();
  }, []);

  async function loadTemplates() {
    const savedTemplates = await LocalStorage.getItem<string>("templates");
    if (savedTemplates) {
      const templates = JSON.parse(savedTemplates);
      templates.sort((a: Template, b: Template) => (b.useCount || 0) - (a.useCount || 0));
      setTemplates(templates);
    }
  }

  async function loadClipboard() {
    const text = await Clipboard.readText();
    if (text) {
      setClipboardContent(text);
    }
  }

  if (!clipboardContent) {
    return (
      <List>
        <List.EmptyView
          title="No Clipboard Content"
          description="Please copy some text first"
        />
      </List>
    );
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
          accessories={[
            {
              text: clipboardContent.length > 50 
                ? clipboardContent.substring(0, 50) + "..." 
                : clipboardContent
            }
          ]}
          actions={
            <ActionPanel>
              <Action.Push
                title="Use"
                target={<ChatView template={template} initialInput={clipboardContent} />}
                shortcut={{ modifiers: ["cmd"], key: "enter" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
} 