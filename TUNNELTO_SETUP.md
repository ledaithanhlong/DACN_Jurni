# 🚇 Tunnelto Setup Guide - Jurni Project

Hướng dẫn sử dụng **tunnelto** để expose local development servers ra internet.

## 📦 Cài đặt Tunnelto

### Option 1: Download Binary (Recommended cho Windows)

1. **Download tunnelto cho Windows:**
   - Truy cập: https://github.com/agrinman/tunnelto/releases/latest
   - Download file: `tunnelto-windows.exe` (hoặc `tunnelto-x86_64-pc-windows-msvc.zip`)
   
2. **Setup:**
   ```powershell
   # Tạo thư mục cho tunnelto
   mkdir C:\tunnelto
   
   # Di chuyển file downloaded vào thư mục
   # Rename thành tunnelto.exe
   
   # Thêm vào PATH (chạy PowerShell as Administrator)
   $env:Path += ";C:\tunnelto"
   [Environment]::SetEnvironmentVariable("Path", $env:Path, [System.EnvironmentVariableScope]::Machine)
   ```

3. **Verify installation:**
   ```powershell
   tunnelto --version
   # Should show: tunnelto 0.1.18
   ```

### Option 2: Install via Cargo (Nếu có Rust)

```bash
cargo install tunnelto
```

## 🚀 Cách Sử Dụng

### 1. Start Backend Tunnel

**Terminal 1 - Start Backend Server:**
```bash
cd e:\HUTECH\4th\Jurni\DACN_Jurni\backend
npm run dev
```

**Terminal 2 - Start Backend Tunnel:**
```bash
cd e:\HUTECH\4th\Jurni\DACN_Jurni\backend
npm run tunnel:backend
```

Bạn sẽ nhận được URL như: `https://random-subdomain.tunnelto.dev`

**Với Custom Subdomain:**
```bash
npm run tunnel:backend:custom jurni-api
# URL: https://jurni-api.tunnelto.dev
```

### 2. Start Frontend Tunnel

**Terminal 1 - Start Frontend Server:**
```bash
cd e:\HUTECH\4th\Jurni\DACN_Jurni\frontend
npm run dev
```

**Terminal 2 - Start Frontend Tunnel:**
```bash
cd e:\HUTECH\4th\Jurni\DACN_Jurni\frontend
npm run tunnel:frontend
```

**Với Custom Subdomain:**
```bash
npm run tunnel:frontend:custom jurni-app
# URL: https://jurni-app.tunnelto.dev
```

### 3. Update Environment Variables

**Backend `.env`:**
```env
# Thêm tunnel URLs khi cần
TUNNEL_URL=https://your-backend-subdomain.tunnelto.dev
FRONTEND_TUNNEL_URL=https://your-frontend-subdomain.tunnelto.dev
```

**Frontend `.env`:**
```env
# Update API URL khi dùng tunnel
VITE_API_URL=https://your-backend-subdomain.tunnelto.dev/api
```

## 💡 Use Cases

### 1. Testing Payment Webhooks

```bash
# Start backend tunnel
cd backend
npm run tunnel:backend:custom jurni-payment

# Copy URL: https://jurni-payment.tunnelto.dev
# Configure trong VNPay/Momo dashboard:
# IPN URL: https://jurni-payment.tunnelto.dev/api/payments/webhook
```

### 2. Mobile App Testing

```bash
# Start backend tunnel
npm run tunnel:backend

# Update mobile app config với tunnel URL
# Test API calls từ điện thoại thật
```

### 3. Demo cho Client

```bash
# Start cả backend và frontend với custom subdomains
cd backend
npm run tunnel:backend:custom jurni-demo-api

cd ../frontend  
npm run tunnel:frontend:custom jurni-demo

# Share URL với client: https://jurni-demo.tunnelto.dev
```

### 4. Full Stack Development với Tunnel

```bash
# Terminal 1: Backend server
cd backend && npm run dev

# Terminal 2: Backend tunnel
cd backend && npm run tunnel:backend:custom jurni-api

# Terminal 3: Frontend server
cd frontend && npm run dev

# Terminal 4: Frontend tunnel  
cd frontend && npm run tunnel:frontend:custom jurni-app

# Update frontend .env:
# VITE_API_URL=https://jurni-api.tunnelto.dev/api
```

## 🔧 Advanced Options

### Introspection Dashboard

Tunnelto cung cấp local dashboard để monitor requests:

```bash
tunnelto --port 5000 --dashboard-address localhost:8080
# Access dashboard: http://localhost:8080
```

### Specify Scheme

```bash
# Nếu local server dùng HTTPS
tunnelto --port 5000 --scheme https
```

### Custom Host

```bash
# Forward to specific host
tunnelto --port 5000 --host 192.168.1.100
```

## ⚠️ Important Notes

### CORS Configuration

Backend đã được configure để accept tunnel URLs. CORS sẽ automatically allow:
- `http://localhost:5173` (local frontend)
- `*.tunnelto.dev` (tunnel URLs)
- Custom tunnel URLs từ environment variables

### Security

> [!WARNING]
> **Chỉ dùng cho Development!**
> - Tunnel URLs là public, ai cũng có thể access
> - Không expose sensitive data
> - Không dùng cho production
> - URLs sẽ thay đổi mỗi lần restart (trừ khi dùng custom subdomain với API key)

### Limitations

- **Free tier** có giới hạn bandwidth
- **Custom subdomains** có thể bị conflict nếu đã có người dùng
- **Connection** có thể drop, cần restart tunnel
- **URLs** không persistent (sẽ thay đổi mỗi lần restart)

## 🐛 Troubleshooting

### "tunnelto: command not found"

```bash
# Kiểm tra PATH
echo $env:Path

# Hoặc chạy trực tiếp với full path
C:\tunnelto\tunnelto.exe --port 5000
```

### CORS Errors

```bash
# Đảm bảo backend đã update CORS config
# Restart backend server sau khi update .env
cd backend
npm run dev
```

### Tunnel Connection Failed

```bash
# Thử với verbose mode để debug
tunnelto --port 5000 -vvv

# Hoặc thử port khác
tunnelto --port 5001
```

### Custom Subdomain Already Taken

```bash
# Thử subdomain khác
tunnelto --port 5000 --subdomain jurni-api-2

# Hoặc không dùng custom subdomain (random URL)
tunnelto --port 5000
```

## 📚 Additional Resources

- **Official Docs**: https://github.com/agrinman/tunnelto
- **Releases**: https://github.com/agrinman/tunnelto/releases
- **Issues**: https://github.com/agrinman/tunnelto/issues

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `tunnelto --port 5000` | Start tunnel cho port 5000 |
| `tunnelto --port 5000 -s myapp` | Custom subdomain |
| `tunnelto --version` | Check version |
| `tunnelto --help` | Show help |
| `npm run tunnel:backend` | Start backend tunnel (port 5000) |
| `npm run tunnel:frontend` | Start frontend tunnel (port 5173) |

---

**Happy Tunneling! 🚀**
