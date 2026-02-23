#!/bin/bash
# 批量压缩古风图片到 64x64

cd /root/git/LobsterBoard/pages/agents-pixel/assets

echo "🎨 开始压缩古风图片到 64x64..."

count=0
for img in ancient-style/*.png; do
    filename=$(basename "$img")
    output="ancient-style-64/${filename}"
    
    mkdir -p ancient-style-64
    
    echo "[$((count+1))/56] 压缩: $filename"
    
    # 压缩到 64x64
    convert "$img" -resize 64x64 -quality 85 "$output"
    
    echo "   ✅ 完成: $output"
    
    count=$((count + 1))
done

echo ""
echo "🎉 所有图片压缩完成！"
echo ""
echo "📊 统计："
ls -lh ancient-style-64/*.png | wc -l | xargs echo "   压缩后的图片数量:"
du -sh ancient-style-64 | awk '{print "   总大小: " $1}'