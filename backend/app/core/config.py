from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Hometic API"
    app_env: str = "development"
    secret_key: str = "change-this-secret-key"
    access_token_expire_minutes: int = 1440
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_database: str = "hometic_db"
    backend_cors_origins: list[str] = ["http://localhost:5173"]

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def split_cors(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def database_url(self) -> str:
        auth = self.mysql_user
        if self.mysql_password:
            auth = f"{auth}:{self.mysql_password}"
        return (
            f"mysql+pymysql://{auth}@{self.mysql_host}:{self.mysql_port}/"
            f"{self.mysql_database}?charset=utf8mb4"
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
