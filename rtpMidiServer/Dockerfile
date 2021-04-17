FROM python:3.9-slim

RUN pip install pymidi

WORKDIR /rtpMidiServer

COPY rptMidiServer_example.py .

CMD ["python3", "rptMidiServer_example.py"]
