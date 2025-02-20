import React from "react";
import { Form, ActionPanel, Action, getPreferenceValues, LocalStorage } from "@raycast/api";
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
  const preferences = getPreferenceValues<Preferences>();

  async function handleSubmit() {
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

    const prompt = template.content.replace("{input}", input);
    const newMessages = [...messages, { role: "user", content: prompt }];
    setMessages(newMessages);
    
    try {
      const response = await fetch(`${preferences.apiHost}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${preferences.apiKey}`,
        },
        body: JSON.stringify({
          model: preferences.modelName,
          messages: [{ role: "user", content: prompt }],  // 只发送当前消息
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
    } catch (error) {
      console.error("API request failed:", error);
      // 可以添加错误提示
      setMessages([...newMessages, { 
        role: "assistant", 
        content: "Error: Failed to get response from AI. Please check your API settings." 
      }]);
    }
    
    setInput("");
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Send" onSubmit={handleSubmit}/></ActionPanel>
      }>
      <Form.TextArea
        id="input"
        title="Input"
        placeholder="Enter your content here..."
        value={input}
        onChange={setInput}
        autoFocus
      />
      {messages.map((message, index) => (
        <Form.Description
          key={index}
          title={message.role === "user" ? "You" : "AI"}
          text={message.content}
        />
      ))}
    </Form>
  );
} 