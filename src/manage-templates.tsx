import React from "react";
import {
  ActionPanel,
  Form,
  List,
  Action,
  useNavigation,
  getPreferenceValues,
  LocalStorage,
  confirmAlert,
  showToast,
  Toast,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { ChatView } from "./components/ChatView";
import { TemplateForm } from "./components/TemplateForm";
import { Template, Preferences } from "./types";

export default function Command() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const { push } = useNavigation();
  const preferences = getPreferenceValues<Preferences>();

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    const savedTemplates = await LocalStorage.getItem<string>("templates");
    if (savedTemplates) {
      const templates = JSON.parse(savedTemplates);
      templates.sort((a: Template, b: Template) => (b.useCount || 0) - (a.useCount || 0));
      setTemplates(templates);
    }
  }

  async function handleTemplateSelect(template: Template) {
    push(<ChatView template={template} />);
  }

  async function handleDeleteTemplate(template: Template) {
    const options = {
      title: "Delete Template",
      message: `Are you sure to delete template "${template.name}"?`,
      primaryAction: {
        title: "Delete",
        style: Action.Style.Destructive,
      },
    };

    if (await confirmAlert(options)) {
      const newTemplates = templates.filter(t => t.id !== template.id);
      await LocalStorage.setItem("templates", JSON.stringify(newTemplates));
      setTemplates(newTemplates);
      await showToast({
        style: Toast.Style.Success,
        title: "Delete successful",
      });
    }
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
          subtitle={`Used: ${template.useCount || 0} times`}
          actions={
            <ActionPanel>
              <Action title="Use" onAction={() => handleTemplateSelect(template)} />
              <Action.Push
                title="Edit"
                target={<TemplateForm template={template} onSave={loadTemplates} />}
              />
              <Action
                title="Delete"
                style={Action.Style.Destructive}
                onAction={() => handleDeleteTemplate(template)}
                shortcut={{ modifiers: ["cmd"], key: "delete" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
} 