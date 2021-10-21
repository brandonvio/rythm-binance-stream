FROM 919217319840.dkr.ecr.us-west-2.amazonaws.com/python-38-slim-buster:latest

WORKDIR /app
COPY . .
RUN pip3 install -r requirements.txt
CMD ["python3", "-u", "app.py"]
