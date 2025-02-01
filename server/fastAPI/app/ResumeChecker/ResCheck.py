import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ResumeParser import ResParseGemini
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv
from huggingface_hub import login
import json

load_dotenv()    # Loading the API keys from the .env file and setting them as environment variables
login(os.getenv('hf_key'))
os.environ['GROQ_API_KEY'] = os.getenv('ResParseGroqKey')

class ResumeChecker:
    def __init__(self, pdf_path, jobD):
        self.prompt_template = """
          You are an AI assistant designed to analyze resumes and compare them with job descriptions to assess the candidate's suitability for a given role. First, ensure that both the provided resume and job description are valid. A resume should contain professional background details such as education, skills, and work experience, while a job description should outline role responsibilities, required skills, and qualifications.  
          
          If either input is invalid, respond with the appropriate error message and nothing else:  
          - "Error: The provided resume does not appear to be valid."  
          - "Error: The provided job description does not appear to be valid."  

          The provided resume is:  
          ---------------------  
          {resume_text}  
          ---------------------  

          The provided job description is:  
          ---------------------  
          {job_description}  
          ---------------------  

          If both inputs are valid, analyze and extract the following key insights:  

          1. **Fitment Score**: Rate the candidate's suitability for the role on a scale of 0 to 10 based on skills, experience, and job requirements and give honest score.  
          2. **Missing Skills or keywords**: List critical skills required for the job but not present in the resume.  
          3. **Resume Improvement Suggestions**: Provide suggestions to enhance the resume for better alignment with the job.  
          4. **Personalized Advice**: Offer tailored career advice based on strengths and improvement areas.  

          Return the output in the following strict JSON format and nothing else:  
          ```json
          {{
            "Fitment Score": "",
            "Missing Skills/keywords": [],
            "Resume Improvement Suggestions": [],
            "Personalized Advice": ""
          }}
          ```
        """
        self.parser=ResParseGemini.ResumeParser()
        self.user_info = self.parser.information_parsing(pdf_path)
        self.jobDesc = jobD
        self.checker_prompt = PromptTemplate(
            template=self.prompt_template,
            input_variables=['resume_text', 'job_description']
        )
        self.checker_model = ChatGroq(
            model='mixtral-8x7b-32768',
            temperature=0
        )
        
    def resume_checker(self):
        resume_text = self.user_info
        job_description = self.jobDesc
        checkerChain = LLMChain(llm=self.checker_model, prompt=self.checker_prompt, verbose=True)
        result = checkerChain.run({'resume_text': resume_text,
                                   'job_description': job_description})
        
        print(result)
        try:
          return json.loads(result.split('```json\n')[-1].split('\n```')[0])
        except:
          return result
    
# jobD = """Proficiency in Python programming and familiarity with Computer vision libraries.Understanding of ML models and exposure to common ML libraries from basic NumPy and Scikit Learn to Keras and Tensor Flow.

# We are looking for talented engineers interested in working in the exotic field of photogrammetry – which is basically getting measurements from photos. Since this is a slightly exotic field and is still not completely mature – there exist both commercial as well as research opportunities for those who want to explore this.

# You will be working with computer vision – focusing on what is called Structure from Motion (SFM) pipeline. This pipeline takes in multiple photos of an infrastructure object from all possible angles, processes them to create a 3D visual model. This model can then be used by the user to view the object in all 3 dimensions.

# The second component would be to recognize the individual components from their physical dimensions and record their position and orientations. These are matched with entries in a standard component database to generate and inventory of components along with the total weight of the inventory and space utilization of the infrastructure.

# The third and final component would be to use a combination of computer vison and machine learning to detect faults in the 3D objects. Examples of faults would be rust, corrosion, cracks in the structure, paint flaking off, mechanical wear and tear etc."""
# checker = ResumeChecker('ShajuTheAlen.pdf', jobD)
# print(checker.resume_checker())

        