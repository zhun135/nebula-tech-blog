@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo   ╔══════════════════════════════════╗
echo   ║  Nebula Tech · 新建文章生成器   ║
echo   ╚══════════════════════════════════╝
echo.

set /p TITLE="  文章标题: "
set /p SLUG="  文件名 (如 my-article): "
set /p AUTHOR_INIT="  作者缩写 (Z/L/W): "
set /p CATEGORY="  分类标签: "
set /p TAGS="  文章标签 (空格分隔): "
set /p READ_TIME="  阅读时长 (如 8 min): "

REM 生成日期
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set DATE_CN=%datetime:~0,4% 年 %datetime:~4,2% 月 %datetime:~6,2% 日
set DATE_SHORT=%datetime:~0,4%.%datetime:~4,2%.%datetime:~6,2%

REM 作者全名映射
if /i "%AUTHOR_INIT%"=="Z" set AUTHOR_FULL=Zhang San
if /i "%AUTHOR_INIT%"=="L" set AUTHOR_FULL=Li Si
if /i "%AUTHOR_INIT%"=="W" set AUTHOR_FULL=Wang Wu
if "%AUTHOR_FULL%"=="" set AUTHOR_FULL=%AUTHOR_INIT%

REM 生成标签 HTML
set TAG_HTML=
for %%t in (%TAGS%) do (
    if "!TAG_HTML!"=="" (
        set TAG_HTML=<span class="tag">%%t</span>
    ) else (
        set TAG_HTML=!TAG_HTML!<span class="tag">%%t</span>
    )
)
set TAGS_HEADER=%TAG_HTML%

REM 生成标签页脚（带搜索链接）
set TAGS_FOOTER=
for %%t in (%TAGS%) do (
    if "!TAGS_FOOTER!"=="" (
        set TAGS_FOOTER=<a href="archive.html?search=%%t" class="tag">%%t</a>
    ) else (
        set TAGS_FOOTER=!TAGS_FOOTER!<a href="archive.html?search=%%t" class="tag">%%t</a>
    )
)

REM 作者角色映射
set AUTHOR_ROLE=作者
if /i "%AUTHOR_INIT%"=="Z" set AUTHOR_ROLE=AI 研究员
if /i "%AUTHOR_INIT%"=="L" set AUTHOR_ROLE=量子计算研究员
if /i "%AUTHOR_INIT%"=="W" set AUTHOR_ROLE=航天科技记者

set OUT_DIR=%~dp0xunku
set OUT_FILE=%OUT_DIR%\article-%SLUG%.html

REM 检查是否已存在
if exist "%OUT_FILE%" (
    echo.
    echo   [警告] 文件 article-%SLUG%.html 已存在！
    set /p OVERWRITE="  是否覆盖? (y/n): "
    if /i not "!OVERWRITE!"=="y" (
        echo   已取消。
        goto :end
    )
)

(
echo ^<!DOCTYPE html^>
echo ^<html lang="zh-CN"^>
echo ^<head^>
echo   ^<meta charset="UTF-8"^>
echo   ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo   ^<meta name="description" content="%TITLE% —— Nebula Tech 星云科技博客。"^>
echo   ^<meta name="theme-color" content="#0a0a0f"^>
echo   ^<meta property="og:title" content="%TITLE%"^>
echo   ^<meta property="og:description" content="%TITLE%"^>
echo   ^<meta property="og:type" content="article"^>
echo   ^<title^>%TITLE% — Nebula Tech^</title^>
echo   ^<link rel="stylesheet" href="style.css"^>
echo   ^<link rel="stylesheet" href="article.css"^>
echo ^</head^>
echo ^<body^>
echo   ^<canvas id="particle-canvas"^>^</canvas^>
echo.
echo   ^<div id="nav-placeholder"^>^</div^>
echo   ^<div id="search-placeholder"^>^</div^>
echo.
echo   ^<main^>
echo     ^<article class="article-container"^>
echo       ^<header class="article-header"^>
echo         ^<div class="article-breadcrumb"^>
echo           ^<a href="index.html"^>首页^</a^>^<span^>/^</span^>^<a href="archive.html"^>文章^</a^>^<span^>/^</span^>^<span class="current"^>%TITLE%^</span^>
echo         ^</div^>
echo         ^<div class="article-category-tag"^>
echo           %TAGS_HEADER%
echo         ^</div^>
echo         ^<h1 class="article-title"^>%TITLE%^</h1^>
echo         ^<p class="article-subtitle"^>在此填写文章副标题或导语...^</p^>
echo         ^<div class="article-meta"^>
echo           ^<div class="meta-author"^>
echo             ^<div class="author-avatar-lg"^>%AUTHOR_INIT%^</div^>
echo             ^<div class="author-info"^>
echo               ^<span class="author-name"^>%AUTHOR_FULL%^</span^>
echo               ^<span class="author-role"^>%AUTHOR_ROLE%^</span^>
echo             ^</div^>
echo           ^</div^>
echo           ^<div class="meta-details"^>
echo             ^<span class="meta-item"^>^<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"^>^<rect x="3" y="4" width="18" height="18" rx="2"/^>^<path d="M16 2v4M8 2v4M3 10h18"/^>^</svg^>%DATE_CN%^</span^>
echo             ^<span class="meta-item"^>^<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"^>^<circle cx="12" cy="12" r="10"/^>^<path d="M12 6v6l4 2"/^>^</svg^>%READ_TIME% 阅读^</span^>
echo             ^<span class="meta-item"^>^<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"^>^<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/^>^<circle cx="12" cy="12" r="3"/^>^</svg^>0 次浏览^</span^>
echo           ^</div^>
echo         ^</div^>
echo       ^</header^>
echo.
echo       ^<div class="article-cover"^>
echo         ^<div class="cover-placeholder"^>
echo           ^<div class="cover-pattern"^>^</div^>
echo           ^<div class="cover-grid"^>^</div^>
echo           ^<div class="cover-glow-top"^>^</div^>
echo           ^<div class="cover-glow-bottom"^>^</div^>
echo         ^</div^>
echo       ^</div^>
echo.
echo       ^<div class="article-layout"^>
echo         ^<aside class="article-toc"^>
echo           ^<div class="toc-sticky"^>
echo             ^<h4 class="toc-title"^>目录^</h4^>
echo             ^<ol class="toc-list"^>
echo               ^<li class="active"^>^<a href="#s1"^>第一节标题^</a^>^</li^>
echo               ^<li^>^<a href="#s2"^>第二节标题^</a^>^</li^>
echo             ^</ol^>
echo           ^</div^>
echo         ^</aside^>
echo.
echo         ^<div class="article-body"^>
echo           ^<section id="s1"^>
echo             ^<h2^>1. 第一节标题^</h2^>
echo             ^<p^>在此开始写作...^</p^>
echo           ^</section^>
echo           ^<section id="s2"^>
echo             ^<h2^>2. 第二节标题^</h2^>
echo             ^<p^>继续写作...^</p^>
echo           ^</section^>
echo.
echo           ^<div class="article-tags-footer"^>
echo             %TAGS_FOOTER%
echo           ^</div^>
echo.
echo           ^<div class="article-share"^>
echo             ^<span^>分享到：^</span^>^<a href="#" class="share-btn copy-link-btn"^>📋 复制链接^</a^>
echo           ^</div^>
echo.
echo           ^<div class="author-card"^>
echo             ^<div class="author-card-avatar"^>%AUTHOR_INIT%^</div^>
echo             ^<div class="author-card-body"^>
echo               ^<h3^>%AUTHOR_FULL%^</h3^>
echo               ^<p^>作者简介...^</p^>
echo               ^<div class="author-card-social"^>^<a href="#"^>GitHub^</a^>^<a href="#"^>Twitter^</a^>^</div^>
echo             ^</div^>
echo           ^</div^>
echo.
echo           ^<div class="comments-section"^>
echo             ^<h3^>评论 ^(^<span^>0^</span^>^)^</h3^>
echo             ^<div class="comment-form-wrapper"^>
echo               ^<div class="comment-avatar"^>Y^</div^>
echo               ^<form class="comment-form" id="comment-form"^>
echo                 ^<textarea placeholder="写下你的想法..." rows="3"^>^</textarea^>
echo                 ^<div class="comment-form-footer"^>
echo                   ^<span class="comment-hint"^>支持 Markdown 语法^</span^>
echo                   ^<button type="submit" class="btn-primary"^>发表评论^</button^>
echo                 ^</div^>
echo               ^</form^>
echo             ^</div^>
echo             ^<div class="comment-list"^>^</div^>
echo           ^</div^>
echo         ^</div^>
echo       ^</div^>
echo.
echo       ^<aside class="related-posts"^>
echo         ^<h3 class="related-title"^>相关推荐^</h3^>
echo         ^<div class="related-grid"^>
echo           ^<!-- 在此添加相关文章卡片 -->^
echo         ^</div^>
echo       ^</aside^>
echo     ^</article^>
echo   ^</main^>
echo.
echo   ^<div id="footer-placeholder"^>^</div^>
echo.
echo   ^<script src="components.js"^>^</script^>
echo   ^<script src="script.js"^>^</script^>
echo   ^<script src="article.js"^>^</script^>
echo ^</body^>
echo ^</html^>
) > "%OUT_FILE%"

echo.
echo   [成功] 文章已生成: xunku\article-%SLUG%.html
echo.
echo   下一步:
echo     1. 编辑 article-%SLUG%.html 填写正文内容
echo     2. 在 index.html 精选区添加文章卡片
echo     3. 在 archive.html 归档列表中添加条目

:end
endlocal
