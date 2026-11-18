from importlib.metadata import version
from contextlib import asynccontextmanager
import asyncio
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

from app.database import connect_database,close_database,check_mongodb,check_redis


#Application
@asynccontextmanager
async def lifespan(app:FastAPI):
    await connect_database()
    yield
    await close_database()

app=FastAPI(
    title="SENTINEL AI",
    description=("Autonomous AI SRE and"
    "Self-HEaling Infrasturcture Platform"),
    version="0.1.0",
    lifespan=lifespan
)

#Cors

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#root endpoint
@app.get("/")
async def root():
    return {
        "Project":"Sentinel AI",
        "message":(
            "Autonomus AI SRE Platform is running"
        ),
        "version":"0.1.0"
    }

#live check
@app.get("health/live")
async def liveness():
    return {
        "status":"alive",
        "service":"sentinel-backend"
    }
#infrasturcture helath
async def get_infrastructure_helath():
    mongo_status,redis_status=await asyncio.gather(
        check_mongodb(),
        check_redis()
    )
    return {
        "mongodb":mongo_status,
        "redis":redis_status
    }

#redy check
@app.get("health/ready")
async def readiness():
    dependincies=await get_infrastructure_helath()
    ready =all(
        status=="helathy"
        for status in dependincies.values()
    )
    if not ready:
        raise HTTPException(
            status_code=503,
            detail={
                "status":"not ready",
                "dependincies":dependincies
            }
        )
    return{
        "status":"ready",
        "dependincies":dependincies
    }

#infrasturcture v1 overvew
@app.get("/api/v1/overview")
async def infrasturcture_overview():
    dependincies=await get_infrastructure_helath()
    overall_helathy=all(
        st=="healthy"
        for st in dependincies.values()
    )
    return {
        "project":"Sentinel AI SRE",
        "overall_status":(
            "helathy" if overall_helathy else "degraded"
        ),
        "Services":[
            {
                "name":"FastAPi",
                "status":"helathy",
                "description":"Backend API"
            },
            {
                "name":"MongoDv",
                "status":dependincies["mongodb"],
                "description":"Master Database"
            },
            {
                "name":"Redis",
                "status":dependincies["redis"],
                "description":"cache and message db"
            }
        ],
        "llm":{
            "provider":"Groq",
            "configured":bool(settings.GROQ_API_KEY)
        },
        "agents":{
            "status":"not yet config",
            "count":0
        }
    }
