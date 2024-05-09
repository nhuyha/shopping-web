FROM python:3.12
WORKDIR ./

COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

EXPOSE 8000

CMD ["python3", "-m", "uvicorn", "FastAPI:app"]