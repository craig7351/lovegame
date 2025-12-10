# zImage Random 工作流 (zImage_Random_工作流)

這是一個基於 **ComfyUI** 的自動化人像生成工作流，特別針對 **z-image-turbo (Sana)** 模型進行優化。它利用 `Dynamic Prompts` 插件來實現隨機化的場景、動作與表情，同時保留了「固定角色特徵」的錨點，確保生成的人物具有極高的一致性。

## 📥 需求與安裝 (Dependencies)

在使用此工作流之前，請確保您已安裝以下組件：

1.  **ComfyUI**: 基礎運行環境。
2.  **ComfyUI-DynamicPrompts**: 核心插件，用於處理 `__wildcard__` 語法與隨機提示詞生成。
    *   [GitHub 連結](https://github.com/adieyal/comfyui-dynamicprompts)
    *   安裝方式：透過 ComfyUI Manager 搜尋 "Dynamic Prompts" 安裝。

### 📦 模型下載 (Models)
請將以下模型下載並放置於 ComfyUI 對應的 `models` 資料夾中：

*   **Checkpoints / Diffusion Models**: `z_image_turbo_bf16.safetensors`
    *   路徑: `ComfyUI/models/diffusion_models/` (或 checkpoints)
    *   [下載連結](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/diffusion_models/z_image_turbo_bf16.safetensors)
*   **Text Encoders**: `qwen_3_4b.safetensors`
    *   路徑: `ComfyUI/models/text_encoders/`
    *   [下載連結](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/text_encoders/qwen_3_4b.safetensors)
*   **VAE**: `ae.safetensors`
    *   路徑: `ComfyUI/models/vae/`
    *   [下載連結](https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/ae.safetensors)

> 注意：此工作流使用 `z-image-turbo`，生成速度極快，且對 prompt 的理解能力（特別是中文/英文混用）相當不錯。

---

## 🚀 如何使用 (Usage)

1.  **載入工作流**: 將 `zImage_Random_工作流.json` 拖入 ComfyUI 介面。
2.  **檢查 Wildcards**: 確保 `wildcards` 資料夾位於 ComfyUI-DynamicPrompts 插件能夠讀取的位置（通常在 `ComfyUI/custom_nodes/comfyui-dynamicprompts/wildcards/`，或是您自定義的路徑）。
    *   本專案提供的 `wildcards` 資料夾包含：`expression.txt`, `pose.txt`, `scene.txt`, `outfit.txt`, `framing.txt`。
3.  **生成**: 點擊 "Queue Prompt" 開始生成。
    *   `Random Prompts` 節點會自動從 wildcards 中隨機抽取組合，生成多樣化的圖片。

---

## 📂 Wildcards 內容介紹

此工作流依賴 `wildcards` 資料夾中的文字檔來豐富畫面細節。以下是各檔案的用途：

*   **`expression.txt`** (表情):
    *   包含各種細微的面部表情描述，如「微微一笑」、「若有所思」、「帶點害羞」等。
*   **`scene.txt`** (場景):
    *   定義背景環境，例如「圖書館」、「海邊」、「教室」、「雨中街道」等。
*   **`pose.txt`** (動作):
    *   描述人物的姿態與動作，如「回頭看」、「雙手抱書」、「遮雨」等。
*   **`outfit.txt`** (服裝):
    *   定義角色的穿著，如「白色水手服」、「便服」等。
*   **`framing.txt`** (鏡頭):
    *   控制鏡頭語言，如「半身景」、「特寫」、「全身照」等。

在 Prompt 中使用 `__expression__` 即可隨機調用該檔案中的一行內容。

---

## ✨ 工作流特點 (Features)

1.  **極速生成**: 使用 Turbo 模型，生成速度非常快。
2.  **角色一致性 (Character Consistency)**:
    *   透過精心設計的「錨點 Prompt」，鎖定人物的面部特徵、骨架與比例。
    *   即使更換場景、動作或表情，人物看起來依然是「同一個人」。
3.  **高度隨機化**:
    *   利用 Dynamic Prompts，每次生成都會組合成新的情境（例如：在下午的教室（場景）+ 看著窗外（動作）+ 帶著微憂鬱（表情））。
4.  **中文支援**: 配合強大的 Text Encoder，可以直接使用包含繁體中文的描述詞。

---

## ⚓ 固定人物錨點範例 (Character Anchor)

為了保持角色在不同圖片中的一致性，請在 Prompt 的開頭始終保留以下描述。這段描述鎖定了人物的生理特徵與風格：

```text
24歲日本女生，及肩棕色頭髮，自然淡妝，
溫柔暖色的眼神，苗條身形，乾淨真實的肌膚質感，柔和微笑，

角色臉固定、同一個人、同一張臉、
請保持完全相同的面部特徵、不要更改臉部設定、
臉部比例不變、五官位置不變、臉型不變、

相同的下顎線形狀、相同的臉部輪廓、
相同的鼻樑結構、相同的眼距、相同的臉部骨架、
臉部地標穩定、五官比例一致、面部拓撲不變、

請保持人物身份一致、不要隨機改變臉、
請保持極高的一致性、面部特徵完全一致、
每一張都是同一位女生，臉不要產生變化，

高一致性角色描述、可重複生成的穩定面孔、
極高面部穩定度、保持完全一致的角色身份，

高品質人像攝影風格，
```

您可以將這段文字貼在 `DPRandomGenerator` 節點的最上方，然後在其後接上 `__outfit__`, `__scene__`, `__pose__` 等變數。

---

### Prompt 結構範例

```text
[固定人物錨點描述...]

白色水手服 藍色裙子 
__framing__，__pose__
__scene__
__expression__
暖色燈光
```

---

## 🎮 Galgame 應用範例 (Application: Galgame)

既然現在我們能夠利用 **zImage + 固定錨點** 生成出「同一位角色」在「不同情境」下的照片，這正是製作視覺小說 (Visual Novel / Galgame) 的完美素材！

本專案附帶了一個簡易的 Galgame 引擎範例 (`index.html`)，您可以直接將生成的圖片應用於其中：

1.  **生成圖片**: 使用此工作流生成一系列連貫的圖片（例如：相遇、圖書館、雨天...）。
2.  **放入素材**: 將生成的圖片重新命名 (e.g., `01.png`, `02.png`) 並放入 `assets/` 資料夾。
3.  **編寫劇情**: 編輯 `data/gameScript.js`，將對話與圖片對應起來。
4.  **開始遊戲**: 打開 `index.html`，您專屬的戀愛遊戲就完成了！

這個範例展示了 AI 生成內容 (AIGC) 如何快速轉化為實際的互動娛樂產品。

