import certifi
import pytest
from sqlalchemy.dialects.mysql.pymysql import MySQLDialect_pymysql
from sqlalchemy.engine import make_url

from app.core.config import Settings


@pytest.mark.parametrize("raw", [
    "https://hometic.vercel.app,http://localhost:5173",
    "https://hometic.vercel.app/, http://localhost:5173",
    '["https://hometic.vercel.app","http://localhost:5173"]',
])
def test_cors_origins_accept_comma_and_json(raw, monkeypatch):
    monkeypatch.setenv("BACKEND_CORS_ORIGINS", raw)
    assert Settings().backend_cors_origins == ["https://hometic.vercel.app", "http://localhost:5173"]


def test_database_url_plain_by_default(monkeypatch):
    monkeypatch.setenv("MYSQL_SSL", "false")
    assert "ssl" not in Settings().database_url


def test_database_url_with_tls_reaches_pymysql(monkeypatch):
    monkeypatch.setenv("MYSQL_SSL", "true")
    monkeypatch.setenv("MYSQL_HOST", "gateway01.ap-southeast-1.prod.aws.tidbcloud.com")
    monkeypatch.setenv("MYSQL_PORT", "4000")
    monkeypatch.setenv("MYSQL_USER", "abc.root")
    monkeypatch.setenv("MYSQL_PASSWORD", "p@ss:w/rd")
    _, kwargs = MySQLDialect_pymysql().create_connect_args(make_url(Settings().database_url))
    assert kwargs["ssl"] == {"ca": certifi.where(), "check_hostname": True}
    assert kwargs["port"] == 4000 and kwargs["user"] == "abc.root" and kwargs["password"] == "p@ss:w/rd"
