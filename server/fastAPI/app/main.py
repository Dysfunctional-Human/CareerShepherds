import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/../'))
from app.FlashCard import FlashCardGen
from app.RecommendationSystem import RecSys
from app.ResumeChecker import ResCheck
from app.ResumeParser import ResParse
from app.ChatbotShepherd import Chatbot
import os
from fastapi import FastAPI, Request, File, Form, Response
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
import aiofiles
import json
from fastapi.staticfiles import StaticFiles
import uvicorn
from typing import Dict
from pydantic import BaseModel
import pandas as pd
import uuid
from fastapi.responses import JSONResponse

app = FastAPI()
base_folder = r'app/static/docs'
if not os.path.exists(base_folder):
    os.makedirs(base_folder)
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.mount("/static", StaticFiles(directory=r'app/static'), name="static")

rec_data = pd.read_csv('app/fin_df.csv')
print('Data loaded')
course_recommender = RecSys.RecommenderSystem(rec_data)
flash_card_generator = FlashCardGen.FlashCardGenerator()
resume_parser = ResParse.ResumeParser()
chat_sessions: Dict[str, Chatbot.Chatbot_with_memory] = {}
print('Classes loaded')

class ChatRequest(BaseModel):
    user_message: str
    sessionId: str
    #user_data: Chatbot.User

@app.get("/")
def index():
    return {"message": "Hello welcome to CareerShepherds"}

@app.post("/api/generate-questions")
def generate_questions(user_input: dict):
    return flash_card_generator.generate_questions(user_input=user_input)

@app.get("/api/generate-answers")
def generate_answers():
    return flash_card_generator.generate_answers()

@app.post("/api/recommend-courses")
def recommend_courses(user_text: dict):
    user_text = user_text["text"]
    return course_recommender.recommend_courses_on_skill(user_input=user_text, num_courses=5, more=False)

@app.post("/api/upload")
async def upload(request: Request, pdf_file: bytes = File(), filename: str = Form(...)):
    try:
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(base_folder, unique_filename)
        print("unique filename: ",file_path)

        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(pdf_file)
            
        page_count = resume_parser.count_pages(file_path)
        if page_count > 2:
            os.remove(file_path)
            return JSONResponse(content={"msg": "error pdf file too big"}, status_code=400)

        return JSONResponse(content={"msg": "success", "file_path": file_path})
    except Exception as e:
        print("error occured during upload: ", e)

@app.post("/api/resume-parse")
def resume_parse(filename: dict):
    file_path = filename["filename"]
    return resume_parser.information_parsing(pdf_path=file_path)

@app.post("/api/resume-check")
def resume_check(req: dict):
    jd = req["jd"]
    file_path = req["filename"]
    resume_checker = ResCheck.ResumeChecker(pdf_path=file_path, jobD=jd)
    return resume_checker.resume_checker()

@app.post("/api/start-chat")
async def start_chat(user_data: Chatbot.User):
    session_id = user_data.sessionid
    if session_id not in chat_sessions:
        chat_sessions[session_id] = Chatbot.Chatbot_with_memory(user_data=user_data)

    chat_sessions[session_id].start_new_chat(user_data=user_data)
    print("Chat startup complete")
    return Response(jsonable_encoder(json.dumps({"msg": "Chat Startup Complete"})))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    user_message = request.user_message
    session_id = request.sessionId
    if session_id not in chat_sessions:
        return {"error": "Session not found. Please start a chat session first."}
    
    chat_instance = chat_sessions[session_id]
    config = {"configurable": {"thread_id": session_id}} 
    
    result = chat_instance.app.invoke({"messages": user_message}, config=config)
    
    return {"messages": result["messages"][-1]}

print('Endpoints operational')

if __name__ == "__main__":
    uvicorn.run("main:app", host='0.0.0.0', port=8000, reload=True)
