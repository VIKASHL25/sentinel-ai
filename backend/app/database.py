from pymongo import AsyncMongoClient
from redis.asyncio import Redis
from app.config import settings

mongo_client:AsyncMongoClient | None=None
redis_client:Redis |None=None


async def connect_database():
    global mongo_client,redis_client
    mongo_client=AsyncMongoClient(
        settings.MONGO_URI,
        serverSelectionTimeoutMS=3000
    )

    redis_client=Redis.from_url(
        settings.REDIS_URL,
        socket_connect_timeout=3
    )

async def close_database():
    global mongo_client,redis_client

    if mongo_client is not None:
        await mongo_client.close()
        mongo_client=None
    
    if redis_client is not None:
        await redis_client.close()
        redis_client=None

def get_database():
    if mongo_client is None:
        raise RuntimeError("MongoDb  not conneted")
    
    return mongo_client(settings.MONGO_DB_NAME)

def get_redis():
    if redis_client is None:
        raise RuntimeError("Redis not connected")
    
    return redis_client


async def check_mongodb():
    if mongo_client is None:
        return "failed"
    try:
        await mongo_client.admin.command("ping")
        return "Healthy"
    except Exception:
        return "failed"

async def check_redis():
    if redis_client is None:
        return "failed"
    try:
        await redis_client.ping()
        return "healthy"
    except Exception:
        return "fail"
        



