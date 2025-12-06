@echo off
title Koruma Bot Controller
color 0A

:menu
cls
echo.
echo  ========================================
echo  =           KORUMA BOTU              =
echo  ========================================
echo.
echo  1. Botu Baslat
echo  2. Botu Durdur
echo  3. Botu Yeniden Baslat
echo  4. Cikis
echo.
set /p choice="Seciminiz (1-4): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto exit
goto menu

:start
cls
echo.
echo  Bot baslatiliyor...
node bot-controller.js start
echo.
echo  Bot arka planda calisiyor!
echo  Menuye donmek icin bir tusa basin...
pause > nul
goto menu

:stop
cls
echo.
echo  Bot durduruluyor...
node bot-controller.js stop
echo.
echo  Menuye donmek icin bir tusa basin...
pause > nul
goto menu

:restart
cls
echo.
echo  Bot yeniden baslatiliyor...
node bot-controller.js restart
echo.
echo  Bot yeniden baslatildi!
echo  Menuye donmek icin bir tusa basin...
pause > nul
goto menu

:exit
cls
echo.
echo  Gule gule!
timeout /t 2 > nul
exit