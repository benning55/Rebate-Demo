FROM python:3.8-alpine
MAINTAINER Benning

ENV PYTHONUNBUFFERED 1

COPY requirements.txt /requirements.txt
RUN apk add --update --no-cache postgresql-client jpeg-dev libffi-dev \
    cairo-dev pango-dev gdk-pixbuf-dev fontconfig font-noto-thai
RUN apk add --update --no-cache --virtual .tmp-build-deps \
    gcc libc-dev linux-headers postgresql-dev musl-dev zlib \
     zlib-dev python3-dev fontconfig font-noto-thai ttf-dejavu
RUN apk --update add fontconfig ttf-dejavu
RUN pip install -r /requirements.txt
RUN apk del .tmp-build-deps

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN adduser -D user
RUN chmod -R 755 /app/static
RUN chmod -R 755 /app/media

USER user