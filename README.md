# CustomUsageAI - Raycast Extension

A Raycast extension that allows you to create and use custom prompt templates with any OpenAI-compatible API endpoints.

[中文文档](./README.zh-CN.md)

## Features

### Template Management
- Create custom prompt templates with variables
- Edit existing templates
- Delete templates
- Auto-sort templates by usage frequency
- Quick search and access

### AI Interaction
- Support any OpenAI-compatible API endpoints
- Continuous conversation support
- Variable substitution in templates
- Usage tracking for each template

## Setup

1. Install the extension in Raycast
2. Configure the extension settings:
   - `API Host`: Your OpenAI-compatible API endpoint (e.g., "https://api.openai.com/v1")
   - `Model Name`: The model to use (e.g., "gpt-3.5-turbo")
   - `API Key`: Your API authentication key

## Usage

### Managing Templates

1. Open "Manage Templates" command
2. Create a new template:
   - Click "New Template"
   - Enter template name
   - Write prompt template using `{input}` as variable
   - Save the template

3. Edit or delete existing templates:
   - Select a template
   - Use "Edit" or "Delete" actions
   - Templates are automatically sorted by usage count

### Using Templates

1. Open "Use Template" command (can set hotkey)
2. Select a template:
   - Use search to filter templates
   - Templates are sorted by usage frequency
   - Press Enter or click "Use"
   - Clipboard content will be automatically loaded into input field

3. In the chat interface:
   - Clipboard content is pre-filled
   - Edit the input if needed
   - Press Enter to send
   - Continue the conversation as needed

## Template Tips

- Use `{input}` in your template where you want the user's input to appear
- Example template for translation:
  ```
  Translate the following text to Chinese: {input}
  ```
- Example template for code review:
  ```
  Review this code and suggest improvements: {input}
  ```

## Keyboard Shortcuts

- `Cmd + Enter`: Send message in chat
- `Cmd + Delete`: Delete template (in manage view)
- Set custom shortcut for "Use Template" command in Raycast preferences

## Support

For issues or feature requests, please create an issue in the repository. 