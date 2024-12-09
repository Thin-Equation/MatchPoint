import json
from typing import List
from openai import OpenAI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
import boto3
import PyPDF2
from botocore.exceptions import ClientError
import re
import uuid
import pyodbc

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Azure SQL Database connection details
AZURE_SQL_SERVER = "match-point.database.windows.net"
AZURE_SQL_DB = "MatchPoint"
AZURE_SQL_USER = "matchpoint"
AZURE_SQL_PASSWORD = "Abc@12345"
AZURE_SQL_PORT = 1433  # Default for SQL Server

# AWS S3 configuration
S3_BUCKET_NAME = 'match-point'
AWS_ACCESS_KEY_ID = 'AKIA2CCC2FMGRQ6AEEUK'
AWS_SECRET_ACCESS_KEY = '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'
AWS_REGION = 'us-east-1'

# Initialize S3 client
s3_client = boto3.client('s3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

class Identity(BaseModel):
    connection: str
    provider: str
    user_id: str
    isSocial: bool

class UserDetails(BaseModel):
    created_at: str
    email: str
    email_verified: bool
    identities: List[Identity]
    name: str
    nickname: str
    picture: str
    updated_at: str
    user_id: str
    last_ip: str
    last_login: str
    logins_count: int

@app.post("/api/user-details")
async def receive_user_details(user_details: UserDetails):
    try:
        response = {
            "status": "success",
            "message": "User details received successfully",
            "data": user_details.model_dump()
        }
        response_data = response.get("data")
        
        created_at = response_data.get('created_at')
        email = response_data.get('email')
        user_id = response_data.get('user_id')

        connection_string = (
        f"Driver={{ODBC Driver 18 for SQL Server}};"
        f"Server={AZURE_SQL_SERVER},{AZURE_SQL_PORT};"
        f"Database={AZURE_SQL_DB};"
        f"Uid={AZURE_SQL_USER};"
        f"Pwd={AZURE_SQL_PASSWORD};"
        f"Encrypt=yes;"
        f"TrustServerCertificate=no;"
        f"Connection Timeout=30;"
    )

        try:
            # Connect to Azure SQL Database
            connection = pyodbc.connect(connection_string)
            cursor = connection.cursor()

            # Insert data into the table
            insert_query = """
                INSERT INTO Users (created_at, email, user_id)
                VALUES (?, ?, ?);
            """
            cursor.execute(insert_query, (created_at, email, user_id))

            # Commit the transaction
            connection.commit()
            print("Data inserted successfully!")

        except pyodbc.Error as e:
            print("Database error occurred:", e)

        finally:
            if connection:
                cursor.close()
                connection.close()
                print("Database connection closed.")

        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_files(
    user_id: str = Form(...),
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # Upload resume to S3
        resume_key = f"{user_id}/resume/{resume.filename}"
        s3_client.upload_fileobj(resume.file, S3_BUCKET_NAME, resume_key)

        jd_name = str(uuid.uuid4())
        # Upload job description to S3
        job_desc_key = f"{user_id}/job_description/{jd_name}.txt"
        s3_client.put_object(Bucket=S3_BUCKET_NAME, Key=job_desc_key, Body=job_description)

        return JSONResponse(content={
            "message": "Files uploaded successfully to S3",
            "resume_path": f"s3://{S3_BUCKET_NAME}/{resume_key}",
            "job_description_path": f"s3://{S3_BUCKET_NAME}/{job_desc_key}"
        }, status_code=200)

    except ClientError as e:
        return JSONResponse(content={
            "message": f"An error occurred while uploading to S3: {str(e)}"
        }, status_code=500)
    except Exception as e:
        return JSONResponse(content={
            "message": f"An unexpected error occurred: {str(e)}"
        }, status_code=500)

@app.post("/api/generate_feedback")
async def generate_feedback(user_id: str, resume_path: str, job_description_path: str):
    s3_client = boto3.client('s3')
    
    try:
        # Extract bucket name and key from S3 paths
        resume_bucket, resume_key = resume_path.replace("s3://", "").split("/", 1)
        jd_bucket, jd_key = job_description_path.replace("s3://", "").split("/", 1)
        
        # Retrieve resume content from S3
        local_file = '/tmp/' + "1.pdf"
        s3_client.download_file(resume_bucket, resume_key, local_file)

        with open(local_file, 'rb') as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            resume_content = ""
            for page in reader.pages:
                resume_bucket += page.extract_text()
        
        # Retrieve job description content from S3
        jd_obj = s3_client.get_object(Bucket=jd_bucket, Key=jd_key)
        job_description_content = jd_obj['Body'].read().decode('utf-8')
        
        # Generate the prompt
        prompt = f"""Analyze the compatibility between the following resume and job description. Provide a compatibility score from 0 to 100 and detailed feedback.

        Resume:
        {resume_content}

        Job Description:
        {job_description_content}

        Please format your response as a JSON object with two keys:
        1. 'score': An integer from 0 to 100 representing the compatibility.
        2. 'feedback': A string containing detailed feedback and suggestions."""
        
        # Generate feedback using OpenAI
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key="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"
        )
        completion = client.chat.completions.create(
            model="nvidia/llama-3.1-nemotron-70b-instruct",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            top_p=1,
            max_tokens=1024
        )
        
        feedback_content = completion.choices[0].message.content

        # Extract text between triple backticks
        match = re.search(r'```(.*?)```', feedback_content, re.DOTALL)
        if match:
            extracted_text = match.group(1)
        else:
            extracted_text = "No text found between triple backticks."
        
        try:
            cleaned_text = extracted_text.replace("\n", "").replace("\r", "")
            feedback_json = json.loads(cleaned_text.strip())
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to decode feedback as JSON")
        
        # Store feedback in S3
        feedback_key = f"{user_id}/feedback/feedback.json"
        s3_client.put_object(
            Bucket=resume_bucket,  # Assuming we use the same bucket as the resume
            Key=feedback_key,
            Body=feedback_json,
            ContentType='application/json'
        )
        
        return JSONResponse(content={
            "message": "Feedback generated and stored successfully",
            "feedback_path": f"s3://{resume_bucket}/{feedback_key}"
        }, status_code=200)
    
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"An error occurred with S3: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


@app.get("/api/get_feedback_details/{user_id}")
def get_feedback_details(user_id: str):
    s3_client = boto3.client('s3')
    bucket_name = 'match-point'  # Replace with your actual bucket name

    try:
        # Fetch feedback.json from S3
        feedback_key = f"{user_id}/feedback/feedback.json"
        response = s3_client.get_object(Bucket=bucket_name, Key=feedback_key)
        feedback_content = response['Body'].read().decode('utf-8')
        feedback_data = json.loads(feedback_content)

        return feedback_data

    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            raise HTTPException(status_code=404, detail="Feedback not found")
        else:
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")