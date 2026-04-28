from functools import lru_cache
from typing import List, Union
from pydantic import field_validator, AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Hometic API"
    app_env: str = "development"
    secret_key: str = "change-this-in-production"
    access_token_expire_minutes: int = 1440

    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_database: str = "hometic_db"

    backend_cors_origins: List[str] = ["http://localhost:5173"]

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str
    smtp_password: str
    smtp_from: str

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def split_cors(cls, value: Union[str, List[str]]) -> List[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def database_url(self) -> str:
        import urllib.parse
        encoded_password = urllib.parse.quote_plus(self.mysql_password) if self.mysql_password else ""
        
        auth = self.mysql_user
        if encoded_password:
            auth = f"{auth}:{encoded_password}"
            
        return (
            f"mysql+pymysql://{auth}@{self.mysql_host}:{self.mysql_port}/"
            f"{self.mysql_database}?charset=utf8mb4"
        )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False 
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()