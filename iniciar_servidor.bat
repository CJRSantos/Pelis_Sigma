@echo off
echo =======================================================
echo           PELIS SIGMA - SERVIDOR LOCAL
echo =======================================================
echo.
echo Para evitar el Error 153 de YouTube (Error de configuracion),
echo esta pagina debe abrirse desde un servidor local (http://localhost)
echo en lugar de abrir el archivo index.html directamente.
echo.

:: Verificar Node.js
where node >nul 2>nul
if errorlevel 1 goto check_python

echo [OK] Se detecto Node.js. Iniciando servidor...
echo Abriendo http://localhost:8080 en el navegador...
start http://localhost:8080
npx -y http-server -p 8080
goto end

:check_python
:: Verificar Python
where python >nul 2>nul
if errorlevel 1 goto no_tools

echo [OK] Se detecto Python. Iniciando servidor...
echo Abriendo http://localhost:8000 en el navegador...
start http://localhost:8000
python -m http.server 8000
goto end

:no_tools
echo [ERROR] No se detecto Node.js ni Python en tu sistema.
echo Por favor, instale Node.js o Python para ejecutar el servidor local.
pause

:end
