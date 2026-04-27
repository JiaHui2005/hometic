@echo off
setlocal

set ROOT_DIR=%~dp0..
set BACKEND_DIR=%ROOT_DIR%\backend
set FRONTEND_DIR=%ROOT_DIR%\frontend

echo ==> Hometic: chuan bi backend
cd /d "%BACKEND_DIR%"
if not exist ".env" copy ".env.example" ".env"
if not exist ".venv" py -3 -m venv .venv
call ".venv\Scripts\activate.bat"
pip install -r requirements.txt

echo ==> Hometic: chuan bi frontend
cd /d "%FRONTEND_DIR%"
if not exist ".env" copy ".env.example" ".env"
npm install

echo ==> Hometic: khoi chay API va Web
start "Hometic API" cmd /k "cd /d %BACKEND_DIR% && call .venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
start "Hometic Web" cmd /k "cd /d %FRONTEND_DIR% && npm run dev"

echo API: http://localhost:8000
echo Swagger: http://localhost:8000/docs
echo Web: http://localhost:5173
endlocal
