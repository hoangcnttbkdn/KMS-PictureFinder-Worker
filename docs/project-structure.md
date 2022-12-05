```
.
│   .env.example
│   commitlint.config.js
│   docker-compose.yaml
│   nodemon.json
│   package-lock.json
│   package.json
│   README.md
│   tsconfig.json
│
├───docker
│       Dockerfile.dev
│       Dockerfile.prod
│
├───docs
│       code-convention.md
│       git-branch-convention.md
│       project-structure.md
│
└───src
    │   index.ts
    │
    ├───app
    │   ├───entities
    │   │       image.entity.ts
    │   │       index.ts
    │   │       session.entity.ts
    │   │
    │   ├───repositories
    │   │       image.repository.ts
    │   │       index.ts
    │   │       session.repository.ts
    │   │
    │   ├───typings
    │   │       index.ts
    │   │       response.typing.ts
    │   │       worker.typing.ts
    │   │
    │   ├───utils
    │   │       function.ts
    │   │       index.ts
    │   │
    │   └───workers
    │           cron.worker.ts
    │           handle.worker.ts
    │           index.ts
    │           mail.worker.ts
    │
    ├───database
    │   ├───migrations
    │   └───naming-strategies
    │           custom-naming-strategy.ts
    │
    └───shared
        ├───configs
        │       data-source.config.ts
        │       environment.config.ts
        │       mail.config.ts
        │       worker.config.ts
        │
        ├───constants
        │       enum.constant.ts
        │       environment.constant.ts
        │       index.ts
        │
        └───providers
                database.provider.ts
                env-load.provider.ts
                index.ts
                logger.provider.ts
```
