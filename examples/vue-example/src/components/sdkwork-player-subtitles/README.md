开发一个功能完善的sdkwork-subtitles字幕组件，该组件需要实现以下功能：

1. 属性定义：

- 支持多种字幕输入方式：完整的string字幕内容、URL地址或Subtitles对象

- 字幕格式支持：srt、lrc等SubtitleFormat类型

- 多种显示模式：全屏、卡片、line（可指定行数），支持动态切换

- 当前播放时间同步显示

2. 事件定义：

- 定义清晰的emit事件，包括但不限于：

- 播放到特定字幕条目时触发

- 字幕加载完成事件

- 字幕切换事件

- 其他常用字幕相关事件

3. 方法定义：

- 提供完整的字幕操作方法：

- 整体加载字幕

- 动态添加字幕（支持实时翻译、语音识别等场景）

- 字幕内容更新

- 显示模式切换

4. 组件架构：

- 将不同显示模式拆分为独立子组件，存放在当前vue组件目录下的components目录中

- 整体采用组件化拆分策略

- 使用 sdkwork-icon.vue 组件处理图标显示

- 全屏模式使用 sdkwork-popup.vue 组件实现popup效果

5. 技术要求：

- 基于Vue3开发

- 使用setup语法糖

- 采用TypeScript

- 实现字幕播放时的动态效果

- 提供高端易用的界面设计

6. 使用场景支持：

- 音乐播放字幕显示

- 实时语音识别字幕

- 实时翻译字幕

7. 文件结构：

- 主组件： sdkwork-subtitles.vue

- 核心字幕处理文件：

index.ts

lrc_subtitle_generator.ts

lrc_subtitle_parser.ts

srt_subtitle_generator.ts

srt_subtitle_parser.ts

subtitles_factory.ts

subtitles.ts

Builder