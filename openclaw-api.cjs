/**
 * OpenClaw API Extensions for LobsterBoard
 * 
 * Provides real-time agent status, task tracking, and goal progress
 */

const fs = require('fs');
const path = require('path');

// OpenClaw workspace path
const OPENCLAW_WORKSPACE = '/root/.openclaw/workspace';
const TASK_DB_PATH = path.join(OPENCLAW_WORKSPACE, 'skills/task-system/data/tasks.db');
const GOALS_PATH = path.join(OPENCLAW_WORKSPACE, 'goals/longterm.md');

/**
 * GET /api/openclaw/agents
 * Returns status of all OpenClaw agents
 */
function getAgents() {
  try {
    // TODO: Integrate with OpenClaw sessions API
    // For now, return mock data
    const agents = [
      {
        id: 'main',
        name: '哔哔',
        emoji: '📡',
        status: 'idle', // idle/busy/inactive/error
        lastActive: Date.now(),
        currentTask: null,
        color: '#00ff00' // 绿色
      },
      {
        id: 'coder',
        name: '零天',
        emoji: '⚙️',
        status: 'busy',
        lastActive: Date.now() - 60000,
        currentTask: 'OpenClaw API 扩展',
        color: '#808080' // 灰色
      },
      {
        id: 'programer',
        name: '夏言',
        emoji: '🍃',
        status: 'idle',
        lastActive: Date.now() - 300000,
        currentTask: null,
        color: '#00ffff' // 青色
      },
      {
        id: 'financier',
        name: '博燃',
        emoji: '💰',
        status: 'inactive',
        lastActive: Date.now() - 3600000,
        currentTask: null,
        color: '#ffd700' // 金色
      },
      {
        id: 'artist',
        name: '画仙',
        emoji: '🎨',
        status: 'busy',
        lastActive: Date.now() - 120000,
        currentTask: '像素小人美术设计',
        color: '#9370db' // 紫色
      },
      {
        id: 'verifier',
        name: '验安',
        emoji: '🛡️',
        status: 'idle',
        lastActive: Date.now() - 180000,
        currentTask: null,
        color: '#4169e1' // 蓝色
      },
      {
        id: 'writer',
        name: '书仙',
        emoji: '📖',
        status: 'idle',
        lastActive: Date.now() - 240000,
        currentTask: null,
        color: '#8b4513' // 棕色
      }
    ];

    return { status: 'ok', agents, timestamp: Date.now() };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

/**
 * GET /api/openclaw/tasks
 * Returns active tasks from task-system
 */
function getTasks() {
  try {
    // TODO: Read from SQLite database
    // For now, return mock data
    const tasks = [
      {
        id: 19,
        title: 'LobsterBoard + Phaser.js 像素小人仪表盘',
        status: 'active',
        assignee: 'main',
        createdAt: Date.now() - 7200000,
        updatedAt: Date.now() - 300000
      }
    ];

    return { status: 'ok', tasks, count: tasks.length };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

/**
 * GET /api/openclaw/goals
 * Returns goal progress from goal-tracker
 */
function getGoals() {
  try {
    if (!fs.existsSync(GOALS_PATH)) {
      return { status: 'ok', goals: [], message: 'No goals file found' };
    }

    const content = fs.readFileSync(GOALS_PATH, 'utf8');
    const goals = [];

    // Parse Markdown to extract goals
    // Simple parser: look for ## Goal Name and progress indicators
    const lines = content.split('\n');
    let currentGoal = null;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentGoal) {
          goals.push(currentGoal);
        }
        currentGoal = {
          name: line.replace('## ', '').trim(),
          progress: 0,
          milestones: []
        };
      } else if (currentGoal && line.includes('- [x]')) {
        currentGoal.milestones.push({ name: line.replace('- [x]', '').trim(), completed: true });
      } else if (currentGoal && line.includes('- [ ]')) {
        currentGoal.milestones.push({ name: line.replace('- [ ]', '').trim(), completed: false });
      }
    }

    if (currentGoal) {
      goals.push(currentGoal);
    }

    // Calculate progress
    goals.forEach(goal => {
      if (goal.milestones.length > 0) {
        const completed = goal.milestones.filter(m => m.completed).length;
        goal.progress = Math.round((completed / goal.milestones.length) * 100);
      }
    });

    return { status: 'ok', goals, count: goals.length };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

module.exports = {
  getAgents,
  getTasks,
  getGoals
};
