#!/bin/bash

# LobsterBoard 图片加载测试

BASE_URL="http://113.45.170.85/pages/agents-pixel/assets/ancient-style-64"
AGENTS=("bibi" "lingtian" "xiayan" "boran" "huaxian" "yanan" "shuxian")
ACTIONS=("idle" "walk")
DIRECTIONS=("down" "up" "left" "right")

TOTAL=0
SUCCESS=0
FAILED=0

echo "🧪 LobsterBoard 图片加载测试"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for agent in "${AGENTS[@]}"; do
  for action in "${ACTIONS[@]}"; do
    for dir in "${DIRECTIONS[@]}"; do
      filename="${agent}-${action}-${dir}.png"
      url="${BASE_URL}/${filename}"
      
      http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
      ((TOTAL++))
      
      if [[ "$http_code" == "200" ]]; then
        echo "✅ $filename"
        ((SUCCESS++))
      else
        echo "❌ $filename (HTTP $http_code)"
        ((FAILED++))
      fi
    done
  done
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 结果: ✅ $SUCCESS/$TOTAL 成功 | ❌ $FAILED 失败"

if [[ $FAILED -eq 0 ]]; then
  echo "🎉 所有图片加载正常！"
  exit 0
else
  echo "⚠️  有 $FAILED 个图片加载失败"
  exit 1
fi
