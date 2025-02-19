from doctr.io import DocumentFile
from doctr.models import ocr_predictor
from fastapi import HTTPException
from langchain_core.runnables import RunnablePassthrough
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
import json
from huggingface_hub import login
from dotenv import load_dotenv
import PyPDF2
import os
import time

load_dotenv()    # Loading the API keys from the .env file and setting them as environment variables
login(os.getenv('hf_key'))
os.environ['GROQ_API_KEY'] = os.getenv('ResParseGroqKey')

class ResumeParser:
    def __init__(self):
      # System prompt being passed to the information extraction LLM
      self.prompt_template = """
            You are an AI assistant designed to parse resumes and extract key details in a structured format. First, determine if the provided text is a resume. A resume typically includes details about an individual's professional background, education, skills, and work experience. If the text is not a resume, respond with the error message: "Error: The provided document does not appear to be a resume."

            The provided text is:
            ---------------------
            {text}
            ---------------------

            If the document is a resume, extract the following fields:
            Only extract what is explicitly written in the resume, don't add anything by yourself.

            1. **Name**: Full name of the person.
            2. **Contact Information**: Email address, phone number, and any linked social media or portfolio links (e.g., LinkedIn, GitHub).
            3. **Skills**: Explicitly list ALL skills individually without categorizing them. Each skill should be atomic.
            4. **Education**: Degrees, institutions, years attended, and major subjects or fields of study.
            5. **Work Experience**: List of jobs with job titles, companies, start and end dates, and key responsibilities or achievements.
            6. **Projects**: List of projects with names, brief descriptions, and technologies used.
            7. Fix any spelling errors 
            
            <|OUTPUT|>
            Return output in this strict JSON schema, don't use any extra characters like \n, \\, \, /: 
            {{
            "Name": "",
            "Contact Information": {{
                "Email": "",
                "Phone": ""
            }},
            "Skills": [],
            "Education": [
                {{
                "schoolName": "",
                "degree": "",
                "startYear": "",
                "endYear": "",
                "major": ""
                }}
            ],
            "Work Experience": [
                {{
                "jobTitle": "",
                "company": "",
                "startYear": "",
                "endYear": "",
                "responsibilities": ""
                }}
            ],
            "Projects": [
                {{
                "name": "",
                "description": "",
                "technologiesUsed": []
                }}
            ]
            }}
      """
      self.ocr_model=ocr_predictor(det_arch='db_resnet50', reco_arch='crnn_mobilenet_v3_large', pretrained=True, assume_straight_pages=True)  # OCR model from docTR that uses pretrained detection and recognition architectures
      self.resume_parsing_prompt = PromptTemplate(       # Prompt Template for the LLM
          template=self.prompt_template,
          input_variables=['text']
      )
      self.resume_parser = ChatGroq(    # Instantiating the LLM
          model='gemma2-9b-it',
          temperature=0.1
      )
      
    def count_pages(self, pdf_path: str):     # Counting number of pages in the uploaded pdf
      with open(pdf_path, 'rb') as pdf:
        pdfReader = PyPDF2.PdfReader(pdf)
        return len(pdfReader.pages)
      
    def resume_ocr(self, pdf_path: str):
      num_pages = self.count_pages(pdf_path)   
      if num_pages > 2:
        print("File Error: Resume has more than 2 pages")
        return "pdf_file too big"
      
      doc = DocumentFile.from_pdf(pdf_path)   
      user_info = self.ocr_model(doc)    # Performing OCR on the pdf file
      user_info = user_info.export()
      
      concat_data = ''         # Converting the extracted data into a string
      lines = len(user_info['pages'][0]['blocks'][0]['lines'])
      for i in range(0, lines):
          words = len(user_info['pages'][0]['blocks'][0]['lines'][i]['words'])
          curr_line = ''
          for word in range (0, words):
              curr_line = curr_line + " " + user_info['pages'][0]['blocks'][0]['lines'][i]['words'][word]['value']
          concat_data = concat_data + " | " + curr_line
      
      return concat_data

    def delete_file(self, file_path: str):
        if os.path.exists(file_path):
            try:
                print(f"Attempting to delete file: {file_path}")
                os.remove(file_path)
                print("File successfully deleted")
            except PermissionError:
                print("PermissionError: The file might still be in use. Retrying...")
                time.sleep(1)
                try:
                    os.remove(file_path)
                    print("File successfully deleted after retry")
                except Exception as e:
                    print(f"Failed to delete file: {e}")
        else:
            print("The file does not exist")

    def information_parsing(self, pdf_path: str):
      try:
          if os.path.exists(pdf_path):
              user_info = self.resume_ocr(pdf_path) 
              self.delete_file(pdf_path)
          else:
              raise HTTPException(status_code=500, detail="File Error: path doesn't exist")
          
          if user_info == "pdf_file too big":
              raise HTTPException(status_code=500, detail="File Error: Resume has more than 2 pages")
          
          info_chain = LLMChain(llm=self.resume_parser, prompt=self.resume_parsing_prompt, verbose=True) # Giving the ocr text and prompt to the LLM for information extraction
          response = info_chain.run(text=str(user_info))
          
          try:
              ans = json.loads(response.split('json\n')[-1].split('\n```')[0])
              print(ans)
              return ans
          except json.JSONDecodeError:
                try:
                    ans2 = json.loads(response.split('```json \n')[-1].split('\n```')[0])
                    return ans2
                except json.JSONDecodeError:
                    raise HTTPException(status_code=400, detail="Parsing Error: Failed to parse JSON response")
      except HTTPException as e:
         print("Handled Exception:", e.detail)
         raise e 
      except Exception as e:
         print("Unexpected error in information_parsing:", str(e))
         raise HTTPException(status_code=500, detail="Unexpected Error: " + str(e))
    
# parser = ResumeParser()
# print(parser.information_parsing('app/GuptaTheUrishita.pdf'))