FROM artifactory.relay.yashir.co.il:8080/docker-local/idi-ms-base-image:1.0.0-SNAPSHOT
COPY ./unrtmng/target/unrt-mng.jar  ./app.jar

