import React, { useState, useEffect } from "react";
import { Form, ActionPanel, Action, getPreferenceValues, LocalStorage, showToast, Toast } from "@raycast/api";
import fetch from "node-fetch";
import { Template, ChatMessage, Preferences, APIResponse, APIConfig, API_PROVIDERS } from "../types";

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
      const provider = preferences.provider;
      const apiConfig = API_PROVIDERS[provider];
      const endpoint = apiConfig.endpoint(preferences.apiHost);
      const headers = apiConfig.headers(preferences.apiKey);
      const requestBody = apiConfig.requestBody(
        [{ role: "user", content: prompt }],
        preferences.modelName
      );

      console.log("API Request Details:", {
        provider,
        endpoint,
        headers,
        requestBody,
        fullUrl: endpoint
      });
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorData
        });
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      let aiResponse: string;

      // 处理不同服务商的响应格式
      switch (provider) {
        case "qianwen":
          aiResponse = data.output.text;
          break;
        case "openai":
          aiResponse = data.choices[0].message.content;
          break;
        default:
          aiResponse = data.choices?.[0]?.message?.content || data.output?.text || data.response;
      }

      if (!aiResponse) {
        console.error("Invalid API Response:", data);
        throw new Error("Invalid API response format");
      }

      setMessages([...newMessages, { 
        role: "assistant", 
        content: aiResponse
      }]);
      await showToast({ title: "AI 响应成功", style: Toast.Style.Success });
    } catch (error) {
      console.error("API request failed:", error);
      let errorMessage = "Failed to get response from AI. Please check your settings:\n\n";
      
      if (error.message.includes("404")) {
        errorMessage += "• API host URL might be incorrect\n";
      } else if (error.message.includes("401") || error.message.includes("403")) {
        errorMessage += "• API key might be invalid or expired\n";
      } else if (error.message.includes("model")) {
        errorMessage += "• Model name might be incorrect\n";
      } else {
        errorMessage += `• Error details: ${error.message}\n`;
      }
      
      errorMessage += "\nPlease check your extension settings in Raycast.";
      
      setMessages([...newMessages, { 
        role: "assistant", 
        content: errorMessage
      }]);
      await showToast({ 
        title: "AI Request Failed", 
        style: Toast.Style.Failure,
        message: "Check your settings" 
      });
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
          />
        </ActionPanel>
      }
      navigationTitle={`Using Template: ${template.name}`}
    >
      <Form.TextField
        id="input"
        title="Input"
        placeholder="Enter your content here..."
        value={input}
        onChange={setInput}
        autoFocus
      />
      <Form.Separator />
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
            enableMarkdown
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