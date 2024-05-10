FROM python:3.12
WORKDIR /app

COPY requirements.txt ./
RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python3", "-m", "uvicorn", "FastAPI:app","--host","0.0.0.0"]