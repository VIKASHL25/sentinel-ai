from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):

    APP_NAME:str="SENTINEL AI"
    APP_ENV:str="development"
    MONGO_URI:str=(
            "mongodb://sentinel:sentinel_dev_password"
            "@mongodb:27017/?authSource=admin"
        )

    MONGO_DB_NAME:str="sentinel"
    REDIS_URL:str="redis://redis:6379/0"
    GROQ_API_KEY:str=""


    CORS_ORIGINS:list[str]=[
        "http://localhost:5173"
    ]
    model_config=SettingsConfigDict(case_sensitive=True,extra="ignore")

settings=Settings()

