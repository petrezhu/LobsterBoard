#!/bin/bash

# 快速测试版本 - 每个角色只生成 idle-down

declare -A AGENTS=(
    ["bibi"]="green robot manager with antenna and screen face"
    ["lingtian"]="gray robot architect with gear icon"
    ["xiayan"]="cyan robot programmer with leaf icon"
    ["boran"]="golden robot product manager with gold ingot icon"
    ["huaxian"]="purple robot artist with paintbrush icon"
    ["yanan"]="blue robot tester with shield icon"
    ["shuxian"]="brown robot writer with book icon"
)

OUTPUT_DIR="/root/git/LobsterBoard/pages/agents-pixel/assets"
mkdir -p "$OUTPUT_DIR"

GEN_SCRIPT="/root/.openclaw/workspace/scripts/modelscope_gen.py"

for agent in "${!AGENTS[@]}"; do
    desc="${AGENTS[$agent]}"
    filename="${agent}-idle-down.png"
    
    prompt="Low poly 3D cute chibi character, $desc, front view standing idle pose, white background, game asset style, clean simple design, similar to mobile game character"
    
    echo "🎨 生成: $filename"
    echo "   Prompt: $prompt"
    
    url=$(python3 "$GEN_SCRIPT" --prompt "$prompt" 2>&1 | tail -1)
    
    if [[ $url == https://* ]]; then
        echo "   ✅ 成功: $url"
        wget -q -O "$OUTPUT_DIR/$filename" "$url"
        echo "   💾 已保存"
    else
        echo "   ❌ 失败: $url"
    fi
    
    sleep 2
    echo ""
done

echo "🎉 测试版本完成！"
ls -lh "$OUTPUT_DIR"/*.png
