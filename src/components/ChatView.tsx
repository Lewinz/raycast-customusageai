import React from "react";
import { Form, ActionPanel, Action, getPreferenceValues, LocalStorage, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import fetch from "node-fetch";
import { Template, ChatMessage, Preferences, APIResponse } from "../types";

interface ChatViewProps {
  template: Template;
  initialInput?: string;
}

export function ChatView({ template, initialInput }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialInput || "");
  const [isLoading, setIsLoading] = useState(false);
  const preferences = getPreferenceValues<Preferences>();

  async function handleSubmit() {
    if (!input.trim()) {
      await showToast({ title: "请输入内容", style: Toast.Style.Failure });
      return;
    }

    setIsLoading(true);
    await showToast({ title: "正在请求 AI...", style: Toast.Style.Animated });

    // 更新使用次数
    const savedTemplates = await LocalStorage.getItem<string>("templates");
    if (savedTemplates) {
      const templates = JSON.parse(savedTemplates);
      const index = templates.findIndex((t: Template) => t.id === template.id);
      if (index !== -1) {
        templates[index].useCount = (templates[index].useCount || 0) + 1;
        await LocalStorage.setItem("templates", JSON.stringify(templates));
      }
    }

    const userMessage = input;
    const prompt = template.content.replace("{input}", input);
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    
    try {
      const response = await fetch(`${preferences.apiHost}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${preferences.apiKey}`,
        },
        body: JSON.stringify({
          model: preferences.modelName,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json() as APIResponse;
      setMessages([...newMessages, { 
        role: "assistant", 
        content: data.choices[0].message.content 
      }]);
      await showToast({ title: "AI 响应成功", style: Toast.Style.Success });
    } catch (error) {
      console.error("API request failed:", error);
      setMessages([...newMessages, { 
        role: "assistant", 
        content: "Error: Failed to get response from AI. Please check your API settings." 
      }]);
      await showToast({ title: "AI 请求失败", style: Toast.Style.Failure });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Send"
            onSubmit={handleSubmit}
            disabled={isLoading}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="input"
        title={`Using Template: ${template.name}`}
        placeholder="Enter your content here..."
        value={input}
        onChange={setInput}
        autoFocus
        disabled={isLoading}
      />
      {messages.map((message, index) => (
        message.role === "user" ? (
          <Form.Description
            key={index}
            title="Input"
            text={message.content}
          />
        ) : (
          <Form.TextArea
            key={index}
            id={`message-${index}`}
            title="AI Response"
            defaultValue={message.content}
            readOnly
            autoHeight
          />
        )
      ))}
      {isLoading && (
        <Form.Description
          title="Status"
          text="AI is thinking..."
        />
      )}
    </Form>
  );
} 