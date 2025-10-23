# 新增功能说明

## 最新更新日期：2025-10-22

本次更新包含：
1. **登录接口优化** - 登录和注册接口现在返回用户 role 字段
2. **火炬接口** - 新增火炬传递功能

---

## 0. 认证接口优化 ⭐更新

### 更新概述
登录和注册接口的响应中，现在包含用户的 `role` 字段，用于区分普通用户和管理员。

### 主要变更
- **POST /api/v1/auth/login** - 登录响应中添加 `user.role` 字段
- **POST /api/v1/auth/register** - 注册响应中添加 `user.role` 字段

### 响应示例
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "jwt_token_string",
    "refreshToken": "refresh_token_string",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "avatar": null,
      "role": "user"  // ⭐ 新增字段
    }
  }
}
```

### role 字段说明
- `"user"` - 普通用户（默认）
- `"admin"` - 管理员

### 前端集成建议
```javascript
// 登录后判断用户权限
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const data = await loginResponse.json();
const userRole = data.data.user.role;

if (userRole === 'admin') {
  // 显示管理员功能
  showAdminPanel();
} else {
  // 显示普通用户界面
  showUserDashboard();
}
```

---

## 1. 火炬传递功能 ⭐新增

### 功能概述
用于统计火炬传递次数，展示"火炬已被传递xxx次"。全局计数器，所有用户共享。

### 技术实现
- **Model**: [Torch.js](src/models/Torch.js)
- **Controller**: [torchController.js](src/controllers/torchController.js)
- **Route**: [torch.js](src/routes/torch.js)
- **API路径**: `/api/v1/torch`

### 主要接口
1. **POST /api/v1/torch/add** - 增加火炬数量（公开）
   - 可选参数 count，默认为1
   - 返回增加后的总数量

2. **GET /api/v1/torch/get** - 获取当前火炬数量（公开）
   - 返回当前火炬总数量

### 前端集成建议
```javascript
// 示例1: 页面加载时获取火炬数量
const getTorchCount = async () => {
  const response = await fetch('/api/v1/torch/get');
  const data = await response.json();
  console.log(`当前火炬数量: ${data.data.count}`);
  // 显示: "火炬已被传递 {data.data.count} 次"
  return data.data.count;
};

// 示例2: 用户点击按钮传递火炬
const passTorch = async () => {
  const response = await fetch('/api/v1/torch/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count: 1 }) // count 可选，默认为1
  });
  const data = await response.json();
  console.log(`火炬传递成功！当前总数: ${data.data.count}`);
  updateTorchDisplay(data.data.count); // 更新页面显示
  return data.data.count;
};

// 示例3: 特殊活动时一次增加多个
const batchPassTorch = async (count) => {
  const response = await fetch('/api/v1/torch/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count: count })
  });
  const data = await response.json();
  return data.data.count;
};
```

### 数据库结构
```
torches 表
- id (主键, 固定为1)
- count (火炬数量, 整数, 默认0)
- createdAt
- updatedAt
```

### 特点说明
- **无需登录**: 任何访客都可以传递火炬
- **全局计数**: 只有一条记录（id=1），所有用户共享
- **并发安全**: 使用数据库的原子性操作确保计数准确
- **非负保证**: count 字段有最小值验证（min: 0）

---

## 2. 访客统计功能

### 功能概述
用于统计网站访问量，在首页展示"你是第xxx个传承者"。

### 技术实现
- **Model**: [Visitor.js](src/models/Visitor.js)
- **Controller**: [visitorController.js](src/controllers/visitorController.js)
- **Route**: [visitors.js](src/routes/visitors.js)
- **API路径**: `/api/v1/visitors`

### 主要接口
1. **POST /api/v1/visitors/add** - 增加访客量（公开）
   - 通过sessionId去重，避免重复计数
   - 返回访客编号用于展示

2. **GET /api/v1/visitors/count** - 获取访客总数（公开）

3. **GET /api/v1/visitors/stats** - 获取详细统计（管理员）
   - 包含今日、本周、本月访客数

### 前端集成建议
```javascript
// 示例：首页访客统计
let sessionId = localStorage.getItem('visitorSessionId');
const response = await fetch('/api/v1/visitors/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId })
});
const data = await response.json();
if (data.data.isNewVisitor) {
  localStorage.setItem('visitorSessionId', data.data.sessionId);
}
// 显示: "你是第 {data.data.visitorNumber} 个传承者"
```

---

## 2. 寄语未来功能

### 功能概述
「寄语未来互动板块」，让访客留下姓名、届别/单位和对河海的誓言。

### 技术实现
- **Model**: [FutureMessage.js](src/models/FutureMessage.js)
- **Controller**: [futureMessageController.js](src/controllers/futureMessageController.js)
- **Route**: [futureMessages.js](src/routes/futureMessages.js)
- **API路径**: `/api/v1/future-messages`

### 主要接口

#### 公开接口（无需登录）
1. **POST /api/v1/future-messages** - 创建寄语
   - 支持未登录用户
   - 如果已登录会记录userId
   - 字段：name（姓名）、grade（届别/单位）、message（誓言，最多500字）

2. **GET /api/v1/future-messages** - 获取寄语列表
   - 支持分页
   - 支持排序（latest=最新，random=随机）

3. **GET /api/v1/future-messages/random** - 获取随机寄语
   - 用于星空效果展示

4. **GET /api/v1/future-messages/:id** - 获取单条寄语详情

#### 管理员接口
5. **GET /api/v1/future-messages/admin/all** - 获取所有寄语（含待审核）
6. **PUT /api/v1/future-messages/admin/:id/review** - 审核寄语
7. **DELETE /api/v1/future-messages/admin/:id** - 删除寄语

### 页面布局建议
```
寄语未来互动板块

「现在,轮到你了,后来的火种。」

你的每一次探索,都在为这条奔涌的长河,注入新的流向。

请在此处,留下你的名字与誓言。它将被铭刻于学校的数字星空,与万千前辈,一同闪耀。

┌─────────────────────────────────────┐
│ 姓名                                │
│ [请输入您的姓名]                     │
├─────────────────────────────────────┤
│ 届别/单位                            │
│ [如: 2018级水利工程 或 河海校友]      │
├─────────────────────────────────────┤
│ 您的誓言                             │
│ [请写下您对河海、对未来的承诺与期许...] │
│                                     │
│                                     │
│                              0/500   │
├─────────────────────────────────────┤
│           [点亮星火]                 │
└─────────────────────────────────────┘

[下方展示已提交的寄语列表或星空效果]
```

---

## 数据库迁移

新增表格，运行应用时Sequelize会自动创建：

### torches 表 ⭐新增
- id (主键, 固定为1)
- count (整数, 默认0, 最小值0)
- createdAt
- updatedAt

### visitors 表
- id (主键)
- sessionId (唯一索引)
- ipAddress
- userAgent
- visitTime
- createdAt
- updatedAt

### future_messages 表
- id (主键)
- name
- grade
- message
- status (pending/approved/rejected)
- ipAddress
- userAgent
- userId (外键，可为空)
- createdAt
- updatedAt

---

## 配置说明

### 审核模式
默认情况下，寄语会自动审核通过（status: 'approved'）。

如需启用人工审核，修改 [futureMessageController.js:42](src/controllers/futureMessageController.js#L42)：
```javascript
status: 'pending' // 改为待审核
```

### 随机排序兼容性
不同数据库的随机排序语法：
- MySQL: `ORDER BY RAND()`
- PostgreSQL: `ORDER BY RANDOM()`
- SQLite: `ORDER BY RANDOM()`

代码已使用 `sequelize.random()` 自动适配。

---

## API测试

所有接口示例已添加到 [api-test.http](api-test.http)，可使用 REST Client 插件直接测试。

详细API文档请查看 [API_NEW.md](API_NEW.md)。

---

## 文件清单

### 新增文件
- `src/models/Visitor.js` - 访客模型
- `src/models/FutureMessage.js` - 寄语模型
- `src/models/Torch.js` - 火炬模型 ⭐新增
- `src/controllers/visitorController.js` - 访客控制器
- `src/controllers/futureMessageController.js` - 寄语控制器
- `src/controllers/torchController.js` - 火炬控制器 ⭐新增
- `src/routes/visitors.js` - 访客路由
- `src/routes/futureMessages.js` - 寄语路由
- `src/routes/torch.js` - 火炬路由 ⭐新增

### 修改文件
- `src/controllers/authController.js` - 登录和注册响应中添加 role 字段 ⭐更新
- `src/models/index.js` - 添加新模型导出和关联 ⭐更新
- `src/routes/index.js` - 注册新路由 ⭐更新
- `api-test.http` - 添加新接口测试用例
- `API_NEW.md` - 更新API文档 ⭐更新
- `README.md` - 更新API文档和数据库表结构 ⭐更新
- `NEW_FEATURES.md` - 本文档 ⭐更新

---

## 注意事项

1. **认证接口**: 登录和注册接口响应中现在包含 role 字段，前端可根据此字段判断用户权限
2. **火炬传递**: 无需登录即可传递，使用全局计数器，所有用户共享
3. **访客统计去重**: 使用sessionId避免重复计数，建议前端保存到localStorage
4. **寄语内容限制**: 最多500字，前端需做字数统计和验证
5. **IP获取**: 如果使用反向代理（如Nginx），确保正确配置 `X-Forwarded-For`
6. **管理员权限**: 管理员接口需要用户role为'admin'
7. **无需登录**: 火炬、访客、寄语功能都支持未登录访客使用，提升用户体验

---

## 后续优化建议

1. **火炬传递**
   - 可添加防刷机制（如限制同一IP的点击频率）
   - 可添加实时推送功能（使用WebSocket）
   - 可添加火炬传递动画效果
   - 可添加里程碑提醒（如达到1000次、10000次等）

2. **访客统计**
   - 可添加访客地理位置统计
   - 可添加访客来源（referrer）分析
   - 可添加访客设备类型统计

2. **寄语未来**
   - 可添加敏感词过滤
   - 可添加点赞功能
   - 可添加寄语分享功能
   - 可优化为星空可视化效果

---

## 技术支持

如有问题，请查看：
- API文档：[API_NEW.md](API_NEW.md)
- 测试文件：[api-test.http](api-test.http)
- 路由配置：[src/routes/index.js](src/routes/index.js)
