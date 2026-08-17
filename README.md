# Render Callback

一个可直接部署到 Render 的最小 Node.js 回调服务。

## 本地运行

```bash
npm start
```

打开 `http://localhost:3000/` 检查服务状态。

测试回调：

```bash
curl -X POST http://localhost:3000/callback \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```

## Render 配置

- Service Type：Web Service
- Language：Node
- Build Command：留空或填写 `npm install`
- Start Command：`npm start`
- Health Check Path：`/`

部署完成后的回调地址：

```text
https://你的服务名.onrender.com/callback
```

正式接收支付或账号相关回调前，请根据第三方平台文档增加签名验证。
