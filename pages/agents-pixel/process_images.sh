#!/bin/bash

# 图片后处理脚本 - 裁剪、去背景、缩放
# 处理所有 56 张角色图（7 个角色 × 8 个姿态）

INPUT_DIR="/root/git/LobsterBoard/pages/agents-pixel/assets"
OUTPUT_SIZE="64x64"  # Phaser 游戏中使用 64x64 像素

cd "$INPUT_DIR"

echo "🎨 开始批量处理 56 张角色图..."
echo ""

# 处理所有 PNG 图片（排除临时文件和已处理文件）
count=0
for img in *.png; do
    # 跳过临时文件和已处理文件
    if [[ $img == *"-temp.png" ]] || [[ $img == *"-processed.png" ]]; then
        continue
    fi
    
    count=$((count + 1))
    echo "[$count/56] 🔧 处理: $img"
    
    # 1. 去除白色背景，转为透明
    # 2. 自动裁剪空白边缘
    # 3. 缩放到 64x64（保持比例，居中）
    convert "$img" \
        -fuzz 15% -transparent white \
        -trim +repage \
        -resize "${OUTPUT_SIZE}^" \
        -gravity center \
        -extent "$OUTPUT_SIZE" \
        "${img%.png}-processed.png"
    
    echo "         ✅ 完成: ${img%.png}-processed.png"
done

echo ""
echo "🎉 所有 $count 张图片处理完成！"
echo ""
echo "📊 统计结果："
ls -1 *-processed.png | wc -l | xargs echo "   处理后的图片数量:"
du -sh *-processed.png | tail -1 | awk '{print "   总大小: " $1}'
