<p align="right">
  <a href="README.md">English</a> |
  <a href="./doc/README-CN.md">简体中文</a>
</p>

<h1 align="center">
<img src='./assets/icon.svg' width='42' alt='SakuraBox logo'>
<span>
    SakuraBox
</span>
</h1>
<p align="center">
    <em>A cute, focused, and private workspace for conversations with your AI models.<br />Built for Windows, macOS, Linux, Web, iOS, and Android.</em>
</p>

## Features

### 🤖 Model and Reasoning Support
-   **Support for Multiple LLM Providers**  
    :gear: Connect OpenAI, Azure OpenAI, Anthropic Claude, Google Gemini, DeepSeek, OpenRouter, Ollama, and custom OpenAI-compatible providers.

-   **Configurable Reasoning Effort**
    :brain: Select automatic, low, medium, high, or extreme reasoning for compatible OpenAI reasoning models.

-   **Flexible Image Generation**
    :art: Use built-in or custom image models, attach reference images, and generate model-aware output sizes.

-   **Bring Your Own Credentials**
    :key: Provider configuration stays under your control without commercial-plan prompts in the normal product flow.

### 🖥️ User Experience
-   **Local Data Storage**  
    :floppy_disk: Your data remains on your device, ensuring it never gets lost and maintains your privacy.

-   **No-Deployment Installation Packages**  
    :package: Get started quickly with downloadable installation packages. No complex setup necessary!

-   **Ergonomic UI & Dark Theme**  
    :new_moon: A Sakura-inspired light and dark interface with responsive desktop and mobile layouts.

-   **Selectable Interface Typography**
    :capital_abcd: Switch between sans-serif and serif reading modes. Code, emoji, and mathematical content use dedicated font stacks.

-   **Keyboard Shortcuts**  
    :keyboard: Stay productive with shortcuts that speed up your workflow.

-   **Streaming Reply**  
    :arrow_forward: Provide rapid responses to your interactions with immediate, progressive replies.

### 📄 Content & Formatting
-   **Markdown, Latex & Code Highlighting**  
    :scroll: Colorful Markdown rendering includes marker-style bold text, resilient emphasis parsing, LaTeX, and syntax highlighting with Google Sans Code.

-   **Prompt Library & Message Quoting**  
    :books: Save and organize prompts for reuse, and quote messages for context in discussions.

### 🌐 Platform Availability
-   **Cross-Platform Desktop**  
    :computer: SakuraBox is ready for Windows, macOS, and Linux users.

-   **Web Version**  
    :globe_with_meridians: Use the web application on any device with a browser, anywhere.

-   **Mobile Apps**  
    :phone: Capacitor-based iOS and Android support. This branch does not include generated native projects; see [Android build](#android-build) for one-time initialization.

### 🌍 Localization
-   **Multilingual Support**  
    :earth_americas: Catering to a global audience by offering support in multiple languages:
    -   English
    -   简体中文 (Simplified Chinese)
    -   繁體中文 (Traditional Chinese)
    -   日本語 (Japanese)
    -   한국어 (Korean)
    -   Français (French)
    -   Deutsch (German)
    -   Русский (Russian)
    -   Español (Spanish)

## FAQ

-   [Frequently Asked Questions](./doc/FAQ.md)

## Development

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (`>=22.12.0 <25`) - [Download here](https://nodejs.org/)
- **pnpm** (`>=10.17.0`; the repository pins pnpm 10.33.0)
- **Git** - [Download here](https://git-scm.com/)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/chatboxai/chatbox.git
   cd chatbox
   ```

2. **Install dependencies**
   ```bash
   corepack enable
   pnpm install --frozen-lockfile
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   ```
   The application will start in development mode with hot-reload enabled.

### Build Commands

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server with hot-reload |
| `pnpm run package` | Build and package for current platform |
| `pnpm run package:all` | Build and package for all platforms |
| `pnpm run build` | Build for production without packaging |
| `pnpm run lint` | Run Biome to check code quality |
| `pnpm run test` | Run Vitest test suite |
| `pnpm run check` | Run the TypeScript type checker |

### Android build

SakuraBox uses Capacitor 7 for Android. The current branch contains the mobile web runtime and build scripts, but it intentionally does not contain a `capacitor.config.*` file or generated `android/` project. Complete the following initialization once before using the Android scripts.

#### Prerequisites

- Android Studio with Android SDK Platform 35 and the Android SDK command-line tools
- JDK 17 or a compatible JDK bundled with Android Studio
- An Android emulator or a device with USB debugging enabled

#### One-time native project initialization

1. Create `capacitor.config.json` in the repository root. Choose a permanent reverse-domain application ID before publishing:

   ```json
   {
     "appId": "com.example.sakurabox",
     "appName": "SakuraBox",
     "webDir": "release/app/dist/renderer"
   }
   ```

2. Generate the native Android project and application assets:

   ```bash
   pnpm exec cap add android
   pnpm run mobile:assets
   ```

   Capacitor 7 generates an Android project with `minSdkVersion 23`, `compileSdkVersion 35`, and `targetSdkVersion 35` by default.

#### Build and run

After changing frontend code, rebuild the mobile renderer and synchronize Capacitor plugins:

```bash
pnpm run mobile:sync:android
```

Open the synchronized project in Android Studio:

```bash
pnpm run mobile:android
```

Or build a debug APK directly from PowerShell:

```powershell
cd android
.\gradlew.bat assembleDebug
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

For a release bundle:

```powershell
cd android
.\gradlew.bat bundleRelease
```

The release bundle is written to `android/app/build/outputs/bundle/release/app-release.aab`. Configure signing in Android Studio or a private Gradle signing configuration. Never commit keystores or passwords.

### Project Structure

```
chatbox/
├── src/
│   ├── main/               # Electron main process
│   ├── renderer/           # React renderer (UI)
│   ├── preload/            # Electron preload scripts
│   └── shared/             # Shared utilities
├── doc/                    # Documentation and assets
├── assets/                 # Brand and application icons
├── resources/              # App resources and icons
└── package.json            # Project configuration
```

### Development Tips

- Use `pnpm run lint` before committing to ensure code quality
- Follow the existing code style and patterns
- Test your changes on both light and dark themes
- Ensure cross-platform compatibility when making UI changes

### Troubleshooting

**Issue**: `pnpm install` fails
- **Solution**: Ensure you're using pnpm (not npm or yarn) and Node.js version is within the required range. Run `corepack enable` if pnpm is not found.

**Issue**: Build fails on Windows
- **Solution**: Run `pnpm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"` if using Git Bash

**Issue**: Changes not reflecting in development
- **Solution**: Stop the dev server, delete `node_modules/.vite`, and restart

**Issue**: Capacitor reports `android platform has not been added yet`
- **Solution**: Create `capacitor.config.json` and run `pnpm exec cap add android` once, then rerun `pnpm run mobile:sync:android`.

## License

[LICENSE](./LICENSE)
