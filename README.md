# KMS-PictureFinder-BE

## Video demo
Use this link: [https://youtu.be/_8mVyfxF-9o](https://youtu.be/_8mVyfxF-9o)

![Watch the video](https://youtu.be/_8mVyfxF-9o/maxresdefault.jpg)](https://youtu.be/_8mVyfxF-9o)

## Architecture

* **Current version**
![](./assets/images/architect_1.png)

* **The next version**
![](./assets/images/architect_2.png)

## Prepare

- Create a `.env` file from the `.env.example` file

  ```
  cp .env.example .env
  ```

- Install package

  ```
  npm install
  ```

- Build source

  ```
  npm run build
  ```

## Local (For DEV)

- Environment

  ```
  node v16+
  ```

- Docker commands

  - Build & run all container

    ```
    docker-compose up --build
    ```

  - Run all container
    ```
    docker-compose up
    ```
  - Run a container
    ```
    docker-compose up <service_name>
    ```
  - Exec

    ```
    docker exec -it <service_name> sh
    ```

# Convention

- [Git Branch Convention](./docs/git-branch-convention.md)
- [Code Convention](./docs/code-convention.md)

# Architect

- [Project Structure](./docs/project-structure.md)
