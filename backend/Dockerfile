FROM python:3.11-slim

WORKDIR /app

# Bỏ qua cài đặt gói hệ thống để tránh lỗi mạng và giảm dung lượng image
# Vì ta dùng pymysql nên không cần libmariadb-dev

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set environment variables
ENV MYSQL_HOST=mysql
ENV MYSQL_PORT=3306
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=""
ENV MYSQL_DATABASE=hometic_db

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
