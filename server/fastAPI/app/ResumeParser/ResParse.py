# from doctr.io import DocumentFile
# from doctr.models import ocr_predictor, crnn_mobilenet_v3_large, db_mobilenet_v3_large
# import torch
# from langchain_groq import ChatGroq
# from langchain.prompts import PromptTemplate
# from langchain.chains import LLMChain
# import os
# from huggingface_hub import login
# from dotenv import load_dotenv
# import PyPDF2

# load_dotenv()    # Loading the API keys from the .env file and setting them as environment variables
# login(os.getenv('hf_key'))
# os.environ['GROQ_API_KEY'] = os.getenv('ResParseGroqKey')

# class ResumeParser:
#     def __init__(self):
#       # System prompt being passed to the information extraction LLM
#       self.prompt_template = """
#           You are an AI assistant designed to parse resumes and extract key details in a structured format. First, determine if the provided text is a resume. A resume typically includes details about an individual’s professional background, education, skills, and work experience. If the text is not a resume, respond with the error message: "Error: The provided document does not appear to be a resume."

#           The provided text is:
#           ---------------------
#           {text}
#           ---------------------

#           If the document is a resume, extract the following fields:
#           Only extract what is explicitly written in the resume, don't add anything by yourself.

#           1. **Name**: Full name of the person.
#           2. **Contact Information**: Email address, phone number, and any linked social media or portfolio links (e.g., LinkedIn, GitHub).
#           3. **Skills**: List of technical and soft skills mentioned.
#           4. **Education**: Degrees, institutions, years attended, and major subjects or fields of study.
#           5. **Work Experience**: List of jobs with job titles, companies, start and end dates, and key responsibilities or achievements.
#           6. **Projects**: List of projects with names, brief descriptions, and technologies used.

#           Return the output in the following strict JSON format and nothing else:
#           ```json
#           {{
#             "Name": "",
#             "Contact Information": {{
#               "Email": "",
#               "Phone": "",
#               "Links": []
#             }},
#             "Skills": [],
#             "Education": [
#               {{
#                 "Degree": "",
#                 "Institution": "",
#                 "Years Attended": "",
#                 "Major": ""
#               }}
#             ],
#             "Work Experience": [
#               {{
#                 "Job Title": "",
#                 "Company": "",  
#                 "Start Date": "",
#                 "End Date": "",
#                 "Responsibilities": ""
#               }}
#             ],
#             "Projects": [
#               {{
#                 "Name": "",
#                 "Description": "",
#                 "Technologies Used": []
#               }}
#             ]
#           }}
#           """
#       self.ocr_model=ocr_predictor(det_arch='db_resnet50', reco_arch='crnn_mobilenet_v3_large', pretrained=True, assume_straight_pages=True)  # OCR model from docTR that uses pretrained detection and recognition architectures
#       self.resume_parsing_prompt = PromptTemplate(       # Prompt Template for the LLM
#           template=self.prompt_template,
#           input_variables=['text']
#       )
#       self.resume_parser = ChatGroq(    # Instantiating the LLM
#           model='gemma2-9b-it',
#           temperature=0.1
#       )
      
#     def count_pages(self, pdf_path: str):     # Counting number of pages in the uploaded pdf
#       with open(pdf_path, 'rb') as pdf:
#         pdfReader = PyPDF2.PdfReader(pdf)
#         return len(pdfReader.pages)
      
#     def resume_ocr(self, pdf_path: str):
#       num_pages = self.count_pages(pdf_path)   
#       if num_pages > 2:
#         print("File Error: Resume has more than 2 pages")
#         return None
      
#       doc = DocumentFile.from_pdf(pdf_path)   
#       user_info = self.ocr_model(doc)    # Performing OCR on the pdf file
#       user_info = user_info.export()
      
#       concat_data = ''         # Converting the extracted data into a string
#       lines = len(user_info['pages'][0]['blocks'][0]['lines'])
#       for i in range(0, lines):
#           words = len(user_info['pages'][0]['blocks'][0]['lines'][i]['words'])
#           curr_line = ''
#           for word in range (0, words):
#               curr_line = curr_line + " " + user_info['pages'][0]['blocks'][0]['lines'][i]['words'][word]['value']
#           concat_data = concat_data + " | " + curr_line
      
#       return concat_data

#     def information_parsing(self, pdf_path: str):
#       user_info = self.resume_ocr(pdf_path)   
#       info_chain = LLMChain(llm=self.resume_parser, prompt=self.resume_parsing_prompt, verbose=True) # Giving the ocr text and prompt to the LLM for information extraction
#       final_info = info_chain.run(user_info)
      
#       return final_info
    
# # parser = ResumeParser()
# # print(parser.information_parsing('GuptaTheUrishita.pdf'))