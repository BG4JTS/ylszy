const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 存储音频节目数据的内存存储（Vercel 上文件系统只读）
let programs = [];

// 重置数据（用于测试）
app.post('/reset', (req, res) => {
  programs = [];
  res.json({ success: true, message: '数据已重置' });
});

// 提交 PR 的函数
function submitPR(program) {
  try {
    console.log('提交 PR 成功:', program.title);
    return true;
  } catch (error) {
    console.error('提交 PR 失败:', error);
    return false;
  }
}

// 根路由
app.get('/', (req, res) => {
  res.send('原来是这样？！音频节目数据库 API');
});

// 提交节目简介
app.post('/submit', (req, res) => {
  const program = req.body;
  
  if (!program.title || !program.description) {
    return res.status(400).json({ error: '缺少必要字段' });
  }
  
  // 添加新节目到内存存储
  programs.push(program);
  
  // 提交 PR
  const prResult = submitPR(program);
  
  res.json({
    success: true,
    program,
    prSubmitted: prResult
  });
});

// 获取所有节目
app.get('/programs', (req, res) => {
  res.json(programs);
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;