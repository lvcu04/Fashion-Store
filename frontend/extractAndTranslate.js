
const fg = require("fast-glob");
const fs = require("fs");
const { default: translate } = require("google-translate-open-api");

// Cấu hình
const SEARCH_PATHS = ["app/**/*.tsx", "components/**/*.tsx"];
const VI_JSON_PATH = "i18n/locales/vi.json";
const EN_JSON_PATH = "i18n/locales/en.json";

// Regex để tìm chuỗi trong <Text>...</Text>
const TEXT_TAG_REGEX = /<Text[^>]*>(.*?)<\/Text>/g;

async function main() {
  const files = await fg(SEARCH_PATHS);
  const viMap = {};
  const enMap = {};

  console.log(`🔍 Quét ${files.length} file...`);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const matches = [...content.matchAll(TEXT_TAG_REGEX)];

    for (const match of matches) {
      const rawText = match[1].trim();
      if (rawText && !viMap[rawText]) {
        viMap[rawText] = rawText;
      }
    }
  }

  console.log(`✏️ Tổng số đoạn text: ${Object.keys(viMap).length}`);

  // Lưu file vi.json
  fs.mkdirSync("i18n/locales", { recursive: true });
  fs.writeFileSync(VI_JSON_PATH, JSON.stringify(viMap, null, 2), "utf8");

  // Dịch sang tiếng Anh
  for (const key of Object.keys(viMap)) {
    try {
      const result = await translate(viMap[key], { to: "en" });
      enMap[key] = result.data[0];
      console.log(`🌐 ${viMap[key]} => ${enMap[key]}`);
    } catch (err) {
      console.error(`❌ Lỗi dịch "${key}"`, err);
      enMap[key] = "";
    }
  }

  // Lưu file en.json
  fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enMap, null, 2), "utf8");
  console.log("\n✅ Hoàn tất! Đã tạo i18n/locales/vi.json và en.json");
}

main();
