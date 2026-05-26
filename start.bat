@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo   ╔══════════════════════════════════════════╗
echo   ║  Nebula Tech · 全栈开发服务器            ║
echo   ║  后端 API : http://localhost:3001         ║
echo   ║  前端页面 : http://localhost:3001         ║
echo   ║  数据库   : data/nebula.db                ║
echo   ╚══════════════════════════════════════════╝
echo.

echo [启动] 后端 API 服务器...
start "Nebula-API" cmd /c "cd /d %~dp0server && node index.js"
timeout /t 2 /nobreak >nul

echo [启动] 打开浏览器...
start http://localhost:3001

echo.
echo   API 端点:
echo     GET  http://localhost:3001/api/articles       文章列表
echo     GET  http://localhost:3001/api/articles/:slug  文章详情
echo     GET  http://localhost:3001/api/articles/tags   标签统计
echo     GET  http://localhost:3001/api/comments/:slug  评论列表
echo     POST http://localhost:3001/api/comments/:slug  提交评论
echo     POST http://localhost:3001/api/subscribers     订阅邮箱
echo     GET  http://localhost:3001/api/health          健康检查
echo.
echo   按任意键关闭服务器...
pause >nul
taskkill /FI "WINDOWTITLE eq Nebula-API" /F >nul 2>&1
