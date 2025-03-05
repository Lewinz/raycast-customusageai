/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** AI Provider - Select your AI service provider */
  "provider": "openai" | "qianwen" | "custom",
  /** API Host - API endpoint URL

Examples:
- OpenAI: https://api.openai.com/v1
- Qianwen: https://dashscope.aliyuncs.com/api/v1 */
  "apiHost": string,
  /** Model Name - Name of the AI model to use

Examples:
- OpenAI: gpt-3.5-turbo
- Qianwen: qwen-max-latest */
  "modelName": string,
  /** API Key - API authentication key

Examples:
- OpenAI: sk-...
- Qianwen: sk-... */
  "apiKey": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `manage-templates` command */
  export type ManageTemplates = ExtensionPreferences & {}
  /** Preferences accessible in the `use-template` command */
  export type UseTemplate = ExtensionPreferences & {}
  /** Preferences accessible in the `use-with-clipboard` command */
  export type UseWithClipboard = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `manage-templates` command */
  export type ManageTemplates = {}
  /** Arguments passed to the `use-template` command */
  export type UseTemplate = {}
  /** Arguments passed to the `use-with-clipboard` command */
  export type UseWithClipboard = {}
}

