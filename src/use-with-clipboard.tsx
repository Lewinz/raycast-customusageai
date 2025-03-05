import React from "react";
import { List, ActionPanel, Action, LocalStorage, Clipboard, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { Template } from "./types";
import { ChatView } from "./components/ChatView";

export default function Command() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [clipboardContent, setClipboardContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      await loadTemplates();
      await loadClipboard();
      setIsLoading(false);
    }
    initialize();
  }, []);

  async function loadTemplates() {
    const savedTemplates = await LocalStorage.getItem<string>("templates");
    if (savedTemplates) {
      const parsedTemplates = JSON.parse(savedTemplates);
      parsedTemplates.sort((a: Template, b: Template) => (b.useCount || 0) - (a.useCount || 0));
      setTemplates(parsedTemplates);
    }
  }

  async function loadClipboard() {
    try {
      console.log("Attempting to read clipboard...");
      const text = await Clipboard.readText();
      console.log("Clipboard text:", text);
      
      if (text) {
        console.log("Setting clipboard content:", text);
        setClipboardContent(text);
      } else {
        console.log("No clipboard content found");
        await showToast({
          title: "No clipboard content",
          style: Toast.Style.Failure,
        });
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      await showToast({
        title: "Failed to read clipboard",
        style: Toast.Style.Failure,
      });
    }
  }

  if (isLoading) {
    return (
      <List>
        <List.EmptyView
          title="Loading..."
          description="Reading clipboard content..."
        />
      </List>
    );
  }

  if (templates.length === 0) {
    return (
      <List>
        <List.EmptyView
          title="No Templates Found"
          description="Create a template first using the Manage Templates command"
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
                title="Use Template (Clipboard Content)"
                target={<ChatView template={template} initialInput={clipboardContent} />}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
} 