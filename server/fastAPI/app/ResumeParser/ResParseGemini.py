import pymupdf
import os
from dotenv import load_dotenv
import PyPDF2
import google.generativeai as genai 
import base64
import json

load_dotenv()    # Loading the API keys from the .env file and setting them as environment variables
genai.configure(api_key=os.getenv('GeminiKey'))

class ResumeParser:
    def __init__(self):
        # System prompt being passed to the information extraction LLM
        self.prompt_template = """
            <|image_1|>\n
            You are an AI assistant designed to process images of resumes and extract key details in a structured format. First, analyze the provided image and determine if it is a resume. A resume typically includes details about an individual’s professional background, education, skills, and work experience.

            If the image does not contain a resume, respond with the error message: "Error: The provided image does not appear to be a resume." If it is a resume, extract the specified fields in JSON format.

            <|INSTRUCTIONS|>
            If the document is a resume, extract the following fields:
            1. **Name**: Full name of the person.
            2. **Contact Information**: Email address, phone number, and any linked social media or portfolio links (e.g., LinkedIn, GitHub).
            3. **Skills**: List of technical and soft skills mentioned.
            4. **Education**: Degrees, institutions, years attended, and major subjects or fields of study.
            5. **Work Experience**: List of jobs with job titles, companies, start and end dates, and key responsibilities or achievements.
            6. **Projects**: List of projects with names, brief descriptions, and technologies used.

            <|OUTPUT|>
            Use this JSON schema, don't use any extra characters like \n, \\, \, /: 
            {
            "Name": "",
            "Contact Information": {
                "Email": "",
                "Phone": "",
            },
            "Skills": [],
            "Education": [
                {
                "schoolName": "",
                "degree": "",
                "startYear": "",
                "endYear": "",
                "major": ""
                }
            ],
            "Work Experience": [
                {
                "jobTitle": "",
                "company": "",
                "startYear": "",
                "endYear": "",
                "responsibilities": ""
                }
            ],
            "Projects": [
                {
                "name": "",
                "description": "",
                "technologiesUsed": []
                }
            ]
            }
            """
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        
      
    def count_pages(self, pdf_path: str):     # Counting number of pages in the uploaded pdf
        with open(pdf_path, 'rb') as pdf:
            pdfReader = PyPDF2.PdfReader(pdf)
            return len(pdfReader.pages)        
      
    def get_img(self, pdf_path: str):
        num_pages = self.count_pages(pdf_path)   
        if num_pages > 2:
            print("File Error: Resume has more than 2 pages")
            return None

        doc = pymupdf.open(pdf_path)
        imgs = []
        for page in doc:
            img = page.get_pixmap()
            img.save("img.jpg")
            with open("img.jpg", "rb") as image_file:
                imgs.append(base64.b64encode(image_file.read()).decode('utf-8'))
                
        return imgs

    def information_parsing(self, pdf_path: str):
        imgs = self.get_img(pdf_path)
        if len(imgs) > 1:
            response = self.model.generate_content([{'mime_type':'image/jpeg', 'data': imgs[0]},
                                                    {'mime_type':'image/jpeg', 'data': imgs[1]},
                                                    self.prompt_template])
        else:
            response = self.model.generate_content([{'mime_type':'image/jpeg', 'data': imgs[0]}, self.prompt_template])
        
        try:
            return json.loads(response.text.split('json\n')[-1].split('\n```\n')[0])
        except:
            return response.text

    
# parser = ResumeParser()
# print(parser.information_parsing('GuptaTheUrishita.pdf'))



        