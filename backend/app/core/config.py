import json
from functools import lru_cache
from typing import Annotated, List, Union
from pydantic import field_validator, AnyHttpUrl
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Hometic API"
    app_env: str = "development"
    secret_key: str = "change-this-in-production"
    access_token_expire_minutes: int = 60
    log_level: str = "INFO"

    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_database: str = "hometic_db"

    mysql_ssl: bool = False  # bắt buộc với MySQL trên cloud (TiDB Cloud, Aiven…)
    mysql_ssl_ca: str = ""  # file CA riêng của nhà cung cấp; bỏ trống thì dùng bộ CA công khai (certifi)

    # NoDecode: nhận cả "https://a.com,https://b.com" lẫn dạng JSON ["https://a.com"]
    backend_cors_origins: Annotated[List[str], NoDecode] = ["http://localhost:5173"]

    storage_backend: str = "local"
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""
    cloudinary_folder: str = "hometic"

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    # Để trống thì bỏ qua gửi email (vd. host chặn cổng SMTP), các chức năng khác vẫn chạy
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def split_cors(cls, value: Union[str, List[str]]) -> List[str]:
        if isinstance(value, str):
            if value.strip().startswith("["):
                return json.loads(value)
            return [origin.strip().rstrip("/") for origin in value.split(",") if origin.strip()]
        return value

    @property
    def secret_key_is_weak(self) -> bool:
        return len(self.secret_key) < 32 or self.secret_key.startswith("change-this")

    @property
    def database_url(self) -> str:
        import urllib.parse
        encoded_password = urllib.parse.quote_plus(self.mysql_password) if self.mysql_password else ""
        
        auth = self.mysql_user
        if encoded_password:
            auth = f"{auth}:{encoded_password}"
            
        url = (
            f"mysql+pymysql://{auth}@{self.mysql_host}:{self.mysql_port}/"
            f"{self.mysql_database}?charset=utf8mb4"
        )
        if self.mysql_ssl:
            import certifi
            ca = self.mysql_ssl_ca or certifi.where()
            url += f"&ssl_ca={urllib.parse.quote(ca)}&ssl_check_hostname=true"
        return url

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        # .env có thể chứa biến cho công cụ khác (vd. TIDB_* để nạp dữ liệu); bỏ qua thay vì báo lỗi khởi động
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()