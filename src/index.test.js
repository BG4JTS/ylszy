const request = require('supertest');
const app = require('./index');

// 测试前重置数据
beforeEach(async () => {
  await request(app).post('/reset');
});

// 测试根路由
test('根路由应该返回正确的响应', async () => {
  const response = await request(app).get('/');
  expect(response.statusCode).toBe(200);
  expect(response.text).toContain('音频节目数据库');
});

// 测试提交节目
test('提交节目应该成功', async () => {
  const program = {
    title: '测试节目',
    description: '这是一个测试节目',
    author: '测试作者'
  };
  
  const response = await request(app)
    .post('/submit')
    .send(program);
  
  expect(response.statusCode).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.program.title).toBe(program.title);
  expect(response.body.prSubmitted).toBe(true);
});

// 测试获取所有节目
test('获取所有节目应该返回正确的数据', async () => {
  // 先添加一个节目
  const program = {
    title: '测试节目',
    description: '这是一个测试节目'
  };
  
  await request(app)
    .post('/submit')
    .send(program);
  
  // 然后获取所有节目
  const response = await request(app).get('/programs');
  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].title).toBe(program.title);
});

// 测试缺少必要字段的情况
test('缺少必要字段应该返回错误', async () => {
  const program = {
    title: '测试节目'
    // 缺少 description
  };
  
  const response = await request(app)
    .post('/submit')
    .send(program);
  
  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe('缺少必要字段');
});