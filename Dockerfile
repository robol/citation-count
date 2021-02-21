FROM ubuntu:20.04

RUN apt-get update && \
	apt-get -y install python3-flask python3-flask-cors python3-requests python3-pandas gunicorn && \
	rm -rf /var/lib/apt/lists 

COPY citationserver.py citations.py /app/
COPY scopus /app/scopus
COPY wos /app/wos

WORKDIR /app

CMD [ "gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "citationserver:app" ]
