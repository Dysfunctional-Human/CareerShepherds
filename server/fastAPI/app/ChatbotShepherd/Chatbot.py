from langgraph.graph import StateGraph, MessagesState, START
from langgraph.checkpoint.memory import MemorySaver
from langchain_groq import ChatGroq
import os
from huggingface_hub import login
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional
from langchain_core.messages import trim_messages
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph.message import add_messages

load_dotenv()
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGSMITH_API_KEY"] = os.getenv('LangSmithKey')
os.environ["LANGSMITH_PROJECT"] = os.getenv('LangSmithProject')
os.environ["GROQ_API_KEY"] = os.getenv('ResParseGroqKey')
login(os.getenv('hf_key'))

class WorkExperience(BaseModel):
    jobTitle: Optional[str] = None
    company: Optional[str] = None
    responsibilities: Optional[str] = None
    
class EducationDetails(BaseModel):
    schoolName: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    
class Project(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    technologiesUsed: List[str] = None
    
class User(BaseModel):
    userid: Optional[str] = None
    sessionid: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    workExperience: Optional[List[WorkExperience]] = None
    educationDetails: Optional[List[EducationDetails]] = None
    skills: List[str] = None
    desiredSkills: List[str] = None
    projects: Optional[List[Project]] = None

def generate_system_prompt(user: User): 
        return f"""
        You are 'The Shepherd', an AI career counselor with a warm, conversational tone. 
        Your goal is to provide thoughtful conversation by learning more about the user in a natural, friendly way. 
        Always prioritize emotional intelligence, empathy, and encouragement. 

        User Information:
            
        Name: {user.firstName} {user.lastName}
        Skills: {', '.join(user.skills)}
        Desired Skills: {', '.join(user.desiredSkills)}
        Work Experience: {', '.join([f"{exp.jobTitle} at {exp.company}" for exp in user.workExperience])}
        Education: {', '.join([f"{edu.degree} from {edu.schoolName}" for edu in user.educationDetails])}
        Projects: {', '.join([f"{proj.name} - {proj.description}" for proj in user.projects])}

        NOTE: Have a regular conversation with the user, and only use the provided data in responses if neccessary or specifically asked to do so.

            Your job is to have a genuine, two-way conversation with the user. 
            
        Start by greeting the user and asking a simple
        Be curious and encouraging. Don’t dominate the conversation – leave space for the user to share more about themselves.
        Offer career advice only when the user asks for it and after you’ve fully understood their perspective and aspirations.
        """

class Chatbot_with_memory:
    def __init__(self, user_data: User):
        self.chat_model = ChatGroq(
            model = 'deepseek-r1-distill-llama-70b',
            # model='gemma2-9b-it',   # 8192 context window
            # model='mixtral-8x7b-32768',  # 32,768 context window
            # model='llama-3.1-8b-instant', # 128k context window
            # model='llama-3.3-70b-versatile', # 128k context model
            # model='gpt-3.5-turbo-0125',  # 16,385 context model
            # model='gpt-4o-mini-2024-07-18', # 128k context model
            temperature=0.4,
            reasoning_format="hidden",
            #rate_limiter=
        )
        self.memory = MemorySaver()
        self.trimmer = trim_messages(
            max_tokens=3072,
            strategy="last",
            token_counter=self.chat_model,
            include_system=False,
            allow_partial=False,
        )
        self.workflow = StateGraph(state_schema=MessagesState)
        self.system_prompt = generate_system_prompt(user_data)
        self.prompt_template = ChatPromptTemplate.from_messages(
                [
                    ("system", 
                     self.system_prompt),
                    MessagesPlaceholder(variable_name="messages"),
                ]
        )
        self.workflow.add_edge(START, "model")
        self.workflow.add_node("model", self.call_model)
        self.app = self.workflow.compile(checkpointer=self.memory)
    
    def call_model(self, state: MessagesState):
        messages = state["messages"]
        
        trimmed_messages = self.trimmer.invoke(messages)
        
        input_data = self.prompt_template.invoke(
            {
                "messages": trimmed_messages
            }
        )
        
        response = self.chat_model.invoke(input_data)
        return {"messages": add_messages(state["messages"], response)}
    
    def start_new_chat(self, user_data: User):
        session_id = user_data.sessionid
        user_id = user_data.userid
        
        initial_state = MessagesState(user_id=user_id, session_id=session_id, messages=[])
        return initial_state
        

        
    

    

        
