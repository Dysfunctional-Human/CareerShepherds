from langchain_groq import ChatGroq
from langchain.chains.summarize import load_summarize_chain
from langchain.chains import RetrievalQA
from langchain_text_splitters.character import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from huggingface_hub import login
from dotenv import load_dotenv
import re
import os

load_dotenv()
login(os.getenv('hf_key'))
os.environ['GROQ_API_KEY'] = os.getenv('ResParseGroqKey')


class FlashCardGenerator:
    def __init__(self):
        self.prompt_template = """
            You are a helpful, respectful and honest teaching assistant who is responsible for aiding teachers with their daily work and helping students secure more marks.
            Your task is to generate questions from a given piece of text and the make sure that the questions are relevant to the topic covered in the text
            The following text was given by the user:

            --------------
            {text}
            --------------

            Your task is to generate atleast 5 questions from the above given USER_TEXT, make sure the questions are from the USER_TEXT itself and no outside resource.
            Make sure the questions are meaningful and relevant to the general topic of the context.
            Also, don't explicitly mention the context in your output like - "The context states-", etc.

            QUESTIONS:
        """
        self.refine_template = """
            You are an expert at creating practice questions based on reference material given to you.
            Your goal is to help a student prepare for a test based on the material given to them.
            We have received some practice questions to a certain extent: {existing_answer}.
            We have the option to refine the existing questions or add new ones (Minimum 5 questions are compulsory).
            Make sure the questions are meaningful and relevant to the general topic of the context.
            Also, don't explicitly mention the context in your output like - "The context states-", etc.
            Make sure that the questions aren't repetitive.
            (only if necessary) with some more context below.
            ------------
            {text}
            ------------

            Given the new context, refine the original questions in English.
            If the context is not helpful, please provide the original questions.

            Please provide output in this STRICT JSON format:
            [
                {{
                    "question": "Specific question text",
                }},
                ...
            ]
        """
        self.answer_template ="""
            Context: {context}
            Question: {question}

            Generate a detailed answer that:
            1. Only give the answer as the output and nothing else.
            2. Directly addresses the question and answer from the context itself.
            3. Uses specific information from the context.
            4. Is structured in clear paragraphs.
            5. Includes relevant examples if present in the context.
            6. Don't explicitly mention the context in your output like - "The context states-", etc.

            Answer:
        """
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        self.embedding_model = HuggingFaceEmbeddings(model_name='sentence-transformers/all-mpnet-base-v2')
        self.llm_question_gen = ChatGroq(
            model='gemma2-9b-it',
            temperature=0.3
        )
        self.llm_answer_gen = ChatGroq(
            model='gemma2-9b-it',
            temperature=0.1
        )
        self.FINAL_QUESTIONS = None
        self.document_ans_gen = None
        self.question_gen_prompt = PromptTemplate( 
            template=self.prompt_template,
            input_variables=["text"]
        )
        self.refined_question_gen_prompt = PromptTemplate(
            template=self.refine_template,
            input_variables=["existing_answer","text"]
        )
        self.answer_prompt= PromptTemplate(
            template=self.answer_template,
            input_variables=["context", "question"]
        )
    
    def text_splitting(self, USER_TEXT: str):
        '''Returns list of 'Document' objects for separate Question and Answer generation'''
        
        chunks_ques_gen = self.text_splitter.split_text(USER_TEXT)
        document_ques_gen = [Document(page_content=t) for t in chunks_ques_gen]
        
        document_ans_gen = self.text_splitter.split_documents(document_ques_gen)
        
        return document_ques_gen, document_ans_gen

    def generate_questions(self, user_input: dict):
        USER_TEXT = user_input['text']
        document_ques_gen, self.document_ans_gen = self.text_splitting(USER_TEXT)
        
        question_gen_chain = load_summarize_chain(
            llm=self.llm_question_gen,
            verbose=True,
            chain_type='refine',
            question_prompt=self.question_gen_prompt,
            refine_prompt=self.refined_question_gen_prompt
        )
        
        questions = question_gen_chain.run(document_ques_gen)
        pattern = r'"question":\s*"(.*?)"'
        matches = re.findall(pattern, questions)
        i = 1
        filtered_questions_list = []
        for question in matches:
            filtered_questions_list.append(f"{i}. "+question)
            i += 1
            
        self.FINAL_QUESTIONS = filtered_questions_list
        return filtered_questions_list

    def generate_answers(self):
        faiss_vector_store = FAISS.from_documents(self.document_ans_gen, self.embedding_model)
        
        ans_gen_chain = RetrievalQA.from_chain_type(
            llm=self.llm_answer_gen,
            retriever=faiss_vector_store.as_retriever(),
            chain_type_kwargs={"prompt": self.answer_prompt}
        )
        
        qa_pairs = {}
        for i, question in enumerate(self.FINAL_QUESTIONS):
            answer=ans_gen_chain(question)
            qa_pairs[i]=answer['result']
            
        return qa_pairs
        
# FlashCards = FlashCardGenerator()
# USER_TEXT = "The numbers of hidden layers and neurons are not the only hyperparameters you can tweak in an MLP. Here are some of the most important ones, as well as tips on how to set them: Learning rate The learning rate is arguably the most important hyperparameter. In general, the optimal learning rate is about half of the maximum learning rate (i.e., the learning rate above which the training algorithm diverges, as we saw in Chapter 4). One way to find a good learning rate is to train the model for a few hundred iterations, starting with a very low learning rate (e.g., 10 ) and gradually increasing it up to a very large value (e.g., 10). This is done by multiplying the learning rate by a constant factor at each iteration (e.g., by exp(log(10 )/500) to go from 10 to 10 in 500 iterations). If you plot the loss as a function of the learning rate (using a log scale for the learning rate), you should see it dropping at first. But after a while, the learning rate will be too large, so the loss will shoot back up: the optimal learning rate will be a bit lower than the point at which the loss starts to climb (typically about 10 times lower than the turning point). You can then reinitialize your model and train it normally using this good learning rate. We will look at more learning rate techniques in Chapter 11. Optimizer Choosing a better optimizer than plain old Mini-batch Gradient Descent (and tuning its hyperparameters) is also quite important. We will see several advanced optimizers in Chapter 11. Batch size -5 6 -5 The batch size can have a significant impact on your model’s performance and training time. The main benefit of using large batch sizes is that hardware accelerators like GPUs can process them efficiently (see Chapter 19), so the training algorithm will see more instances per second. Therefore, many researchers and practitioners recommend using the largest batch size that can fit in GPU RAM. There’s a catch, though: in practice, large batch sizes often lead to training instabilities, especially at the beginning of training, and the resulting model may not generalize as well as a model trained with a small batch size. In April 2018, Yann LeCun even tweeted “Friends don’t let friends use mini-batches larger than 32,” citing a 2018 paper by Dominic Masters and Carlo Luschi which concluded that using small batches (from 2 to 32) was preferable because small batches led to better models in less training time. Other papers point in the opposite direction, however; in 2017, papers by Elad Hoffer et al. and Priya Goyal et al. showed that it was possible to use very large batch sizes (up to 8,192) using various techniques such as warming up the learning rate (i.e., starting training with a small learning rate, then ramping it up, as we will see in Chapter 11). This led to a very short training time, without any generalization gap. So, one strategy is to try to use a large batch size, using learning rate warmup, and if training is unstable or the final performance is disappointing, then try using a small batch size instead. Activation function We discussed how to choose the activation function earlier in this chapter: in general, the ReLU activation function will be a good default for all hidden layers. For the output layer, it really depends on your task. Number of iterations In most cases, the number of training iterations does not actually need to be tweaked: just use early stopping instead."
# user_input = {"text": USER_TEXT}
# print(FlashCards.generate_questions(user_input))
# print("\n\n")
# print(FlashCards.generate_answers())
