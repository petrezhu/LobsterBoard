#!/bin/bash

# 角色定义
declare -A AGENTS=(
    ["bibi"]="green robot manager with antenna and screen face"
    ["lingtian"]="gray robot architect with gear icon"
    ["xiayan"]="cyan robot programmer with leaf icon"
    ["boran"]="golden robot product manager with gold ingot icon"
    ["huaxian"]="purple robot artist with paintbrush icon"
    ["yanan"]="blue robot tester with shield icon"
    ["shuxian"]="brown robot writer with book icon"
)

# 方向和姿势
DIRECTIONS=("down" "up" "left" "right")
POSES=("idle" "walk")

# 输出目录
OUTPUT_DIR="/root/git/LobsterBoard/pages/agents-pixel/assets"
mkdir -p "$OUTPUT_DIR"

# 生成脚本路径
GEN_SCRIPT="/root/.openclaw/workspace/scripts/modelscope_gen.py"

# 遍历所有角色
for agent in "${!AGENTS[@]}"; do
    desc="${AGENTS[$agent]}"
    echo "🎨 生成角色: $agent ($desc)"
    
    # 遍历所有方向和姿势
    for pose in "${POSES[@]}"; do
        for dir in "${DIRECTIONS[@]}"; do
            filename="${agent}-${pose}-${dir}.png"
            
            # 构建 prompt
            view_map=([down]="front view" [up]="back view" [left]="left side view" [right]="right side view")
            view="${view_map[$dir]}"
            
            pose_desc=""
            if [ "$pose" = "idle" ]; then
                pose_desc="standing idle pose"
            else
                pose_desc="walking animation pose"
            fi
            
            prompt="Low poly 3D cute chibi character, $desc, $view $pose_desc, white background, game asset style, clean simple design"
            
            echo "  📸 生成: $filename"
            echo "     Prompt: $prompt"
            
            # 调用生成脚本
            url=$(python3 "$GEN_SCRIPT" --prompt "$prompt" 2>&1 | tail -1)
            
            if [[ $url == https://* ]]; then
                echo "     ✅ 生成成功: $url"
                # 下载图片
                wget -q -O "$OUTPUT_DIR/$filename" "$url"
                echo "     💾 已保存: $filename"
            else
                echo "     ❌ 生成失败: $url"
            fi
            
            # 避免 API 限流
            sleep 2
        done
    done
    
    echo ""
done

echo "🎉 所有角色生成完成！"
ls -lh "$OUTPUT_DIR"
