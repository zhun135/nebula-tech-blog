@echo off
chcp 65001 >nul
echo.
echo   ╔════════════════════════════════╗
echo   ║  Nebula Tech · 本地开发服务器 ║
echo   ╚════════════════════════════════╝
echo.
cd /d "%~dp0xunku"

set PORT=3000

REM 优先使用 Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   [Node.js] 启动服务器: http://localhost:%PORT%
    echo   按 Ctrl+C 停止
    echo.
    node -e "var http=require('http'),fs=require('fs'),path=require('path'),url=require('url');var mime={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};http.createServer(function(req,res){var p=path.join(__dirname,url.parse(req.url).pathname||'/index.html');fs.stat(p,function(e,s){if(e||s.isDirectory()){p=path.join(__dirname,'index.html')}var ext=path.extname(p);res.writeHead(200,{'Content-Type':mime[ext]||'text/html;charset=utf-8'});fs.createReadStream(p).pipe(res)})}).listen(%PORT%)"
    goto :open
)

REM 回退到 Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   [Python] 启动服务器: http://localhost:%PORT%
    echo   按 Ctrl+C 停止
    echo.
    python -m http.server %PORT%
    goto :end
)

echo   [错误] 未找到 Node.js 或 Python，请安装其中之一。
pause
goto :end

:open
start http://localhost:%PORT%
goto :end

:end
