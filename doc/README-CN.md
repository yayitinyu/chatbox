<p align="right">
  <a href="../README.md">English</a> |
  <a href="README-CN.md">简体中文</a>
</p>

<h1 align="center">
<img src='../assets/icon.svg' width='42' alt='SakuraBox Logo'>
<span>
    SakuraBox
</span>
</h1>
<p align="center">
    <em>一个可爱、专注且重视隐私的多模型 AI 聊天工作台，支持 Windows、macOS、Linux、Web、iOS 与 Android。</em>
</p>

## 特性

-   **本地数据存储**  
    :floppy_disk: 您的数据保留在您的设备上，确保数据永不丢失并保护您的隐私。

-   **无需部署、直接安装的安装包**  
    :package: 通过可下载的安装包快速开始使用。无需复杂设置！

-   **支持多个 LLM 提供商**  
    :gear: 支持 OpenAI、Azure OpenAI、Claude、Google Gemini、DeepSeek、OpenRouter、Ollama 与自定义 OpenAI 兼容渠道。

-   **灵活的图片生成**
    :art: 支持内置或自定义生图模型、参考图输入，以及针对不同模型优化的输出尺寸。

-   **可调节思考强度**
    :brain: 兼容的 OpenAI 推理模型可选择自动、低、中、高或极高思考强度。

-   **键盘快捷键**  
    :keyboard: 使用加速您工作流程的快捷键保持高效。

-   **Markdown、Latex 和代码高亮**  
    :scroll: 彩色 Markdown 支持荧光笔式粗体、稳定的强调语法、LaTeX 和使用 Google Sans Code 的代码高亮。

-   **提示库和消息引用**  
    :books: 保存和组织提示以供重复使用，并引用消息以在讨论中提供上下文。

-   **流式回复**  
    :arrow_forward: 通过即时、渐进式回复快速响应您的互动。

-   **人体工程学 UI 和深色主题**  
    :new_moon: 樱花主题的明暗界面，并可切换无衬线与衬线阅读字体。

-   **跨平台可用性**  
    :computer: 支持 Windows、macOS、Linux 和 Web。

-   **通过 Web 版本随处访问**  
    :globe_with_meridians: 在任何设备上使用带有浏览器的 Web 应用程序，随时随地。

-   **iOS 和 Android**  
    :phone: 使用 Capacitor 构建移动应用；当前分支需要先生成原生 Android 工程，步骤见下文。

-   **多语言支持**  
    :earth_americas: 通过提供多种语言的支持，迎合全球受众：

    -   English
    -   简体中文 (Simplified Chinese)
    -   繁體中文 (Traditional Chinese)
    -   日本語 (Japanese)
    -   한국어 (Korean)
    -   Français (French)
    -   Deutsch (German)
    -   Русский (Russian)

## 常见问题解答

-   [常见问题](./FAQ-CN.md)

## 桌面端开发与构建

环境要求：Node.js `>=22.12.0 <25`、pnpm `>=10.17.0` 和 Git。

1. 从 Github 克隆仓库

```bash
git clone https://github.com/chatboxai/chatbox.git
```

2. 安装依赖

```bash
corepack enable
pnpm install --frozen-lockfile
```

3. 启动应用程序（开发模式）

```bash
pnpm run dev
```

4. 构建应用程序，为当前平台打包安装程序

```bash
pnpm run package
```

5. 构建应用程序，为所有平台打包安装程序

```bash
pnpm run package:all
```

提交前建议运行：

```bash
pnpm run check
pnpm run test
pnpm run build
```

## 构建 Android 应用

SakuraBox 使用 Capacitor 7。当前分支包含移动端 Web 运行时和构建脚本，但没有提交 `capacitor.config.*` 和生成后的 `android/` 原生工程，因此首次构建需要初始化一次。

### 环境要求

- Android Studio
- Android SDK Platform 35 和 SDK Command-line Tools
- JDK 17，或 Android Studio 自带的兼容 JDK
- Android 模拟器，或已开启 USB 调试的真机

### 首次初始化

在仓库根目录创建 `capacitor.config.json`。发布前请将示例包名替换为你确定长期使用的反向域名应用 ID：

```json
{
  "appId": "com.example.sakurabox",
  "appName": "SakuraBox",
  "webDir": "release/app/dist/renderer"
}
```

然后生成 Android 工程和应用图标：

```bash
pnpm exec cap add android
pnpm run mobile:assets
```

Capacitor 7 默认生成的工程使用 `minSdkVersion 23`、`compileSdkVersion 35` 和 `targetSdkVersion 35`。

### 同步与运行

每次修改前端代码后运行：

```bash
pnpm run mobile:sync:android
```

同步并在 Android Studio 中打开：

```bash
pnpm run mobile:android
```

在 Windows PowerShell 中直接构建 Debug APK：

```powershell
cd android
.\gradlew.bat assembleDebug
```

输出文件：`android/app/build/outputs/apk/debug/app-debug.apk`。

构建用于应用商店的 AAB：

```powershell
cd android
.\gradlew.bat bundleRelease
```

输出文件：`android/app/build/outputs/bundle/release/app-release.aab`。正式发布前请通过 Android Studio 或私有 Gradle 配置完成签名，切勿把 keystore、密码或密钥提交到 Git。
