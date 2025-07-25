# Rainy Mood - 雨声播放器

这是一个模仿 Rainy Mood 的雨声播放器网页应用，提供舒缓的雨声和美观的视觉效果，帮助用户放松、集中注意力或入睡。

## 功能特点

1. **毛玻璃背景 & 雨滴特效**：背景采用毛玻璃效果，并模拟雨滴在玻璃窗上流动的视觉效果
2. **响应式设计**：适配各种屏幕尺寸，在电脑和手机上都能正常显示
3. **简洁的播放控制**：一键播放/暂停雨声，并可调节音量
4. **多种场景选择**：提供雨声、森林、海洋和城市四种不同的环境音效和背景
5. **定时关闭功能**：支持设置倒计时，到时自动停止播放
6. **美观的界面**：简约现代的设计风格

## 使用方法

1. 克隆或下载本项目到本地
2. 在 `audio` 文件夹中添加以下音频文件（参见 audio 文件夹中的说明文件）：
   - `rain-sound.mp3`：雨声音效
   - `forest-sound.mp3`：森林环境音效
   - `ocean-sound.mp3`：海洋环境音效
   - `city-sound.mp3`：城市雨声音效
3. 使用浏览器打开 `index.html` 文件即可使用
4. 点击播放按钮开始播放音效
5. 使用音量滑块调节音量大小
6. 点击底部的场景缩略图切换不同的环境音效和背景
7. 点击无限符号（∞）按钮设置定时关闭功能：
   - 在弹出的时间选择器中设置小时和分钟
   - 点击"设置"按钮开始倒计时
   - 倒计时结束后，音频将自动停止播放
   - 点击倒计时文本可随时取消倒计时

## 自定义选项

- **背景图片**：替换以下SVG文件可更换对应场景的背景图片
  - `img/rainy-background.svg`：雨天背景
  - `img/forest-background.svg`：森林背景
  - `img/ocean-background.svg`：海洋背景
  - `img/city-background.svg`：城市背景
- **场景缩略图**：替换以下SVG文件可更换播放列表中的缩略图
  - `img/rain-thumbnail.svg`：雨天缩略图
  - `img/forest-thumbnail.svg`：森林缩略图
  - `img/ocean-thumbnail.svg`：海洋缩略图
  - `img/city-thumbnail.svg`：城市缩略图
- **环境音效**：替换以下音频文件可更换对应场景的音效
  - `audio/rain-sound.mp3`：雨声音效
  - `audio/forest-sound.mp3`：森林环境音效
  - `audio/ocean-sound.mp3`：海洋环境音效
  - `audio/city-sound.mp3`：城市雨声音效
- **Logo**：修改 `index.html` 中的 Logo 部分可自定义显示文字或图片
- **计时器设置**：修改 `js/script.js` 中的计时器相关代码可自定义计时器行为

## 技术栈

- HTML5
- CSS3 (动画、响应式设计、毛玻璃效果)
- JavaScript (原生 JS，无依赖)

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

注意：IE 浏览器可能不支持部分 CSS 效果。

## 许可证

本项目仅供学习和个人使用。

## 致谢

灵感来源于 [Rainy Mood](https://rainymood.com/) 网站。