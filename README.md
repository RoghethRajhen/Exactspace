# Documenation
The below steps focus on how you can bring this scraping application up. We are using docker images to run the application

#### Steps to run the application
1. Clone the repo to your local.
```yaml
    git clone https://github.com/RoghethRajhen/Exactspace.git
```
Open a terminal and see to that the terminal is inside the folder Exactspace.

2. To create a docker image
```yaml
    docker build --build-arg SCRAPE_URL="www.example.com" -t <image-name> .
```
[ Note: Docker should be installed in the system and running ]
The custom URL that you want to scrape can be added to the SCRAPE_URL variable.

3. Now run a container with the following command
```yaml
    docker run --rm -d -p 5000:5000 -e SCRAPE_URL="www.example.com" <image-name>
```
4. Go to your browser and go to localhost:5000, here you can the see the scraped data.

5. Once you are done, dont forget to stop the container.
```yaml
docker stop <container-name>
```
