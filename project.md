这是一个 raycast 插件，插件名称叫`CustomUsageAI`

插件安装之后，可以用过界面设置符合 OpenAI 接口规范的模型调用参数，参数有：
1. apiHost
2. ModelName
3. key

设置好 model 规范之后，可以添加固定的提示语模板，模板可以保存，保存之后可以设置快捷键快速唤起；

提示语中存在一个变量，这个变量的值是每次唤起提示语模板之后在界面输入框输入的内容；回车之后将内容带入提示语然后请求我们预设的模型地址和参数请求 AI 模型；

单次唤起的多次请求为连续对话