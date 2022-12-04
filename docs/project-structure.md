```
.
|   README.md
│   commitlint.config.js
│   docker-compose.yaml
│   env.example
│   nodemon.json
│   package-lock.json
│   package.json
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
├───public
│       favicon.ico
│
└───src
    │   main.ts
    │
    ├───app
    │   ├───controllers
    │   │       home.controller.ts
    │   │       index.ts
    │   │
    │   ├───dtos
    │   │       index.ts
    │   │       user.dto.ts
    │   │
    │   ├───entities
    │   │       comment.entity.ts
    │   │       index.ts
    │   │       user.entity.ts
    │   │
    │   ├───helpers
    │   ├───middlewares
    │   │       error.middleware.ts
    │   │       index.ts
    │   │       validation.middleware.ts
    │   │
    │   ├───repositories
    │   │       index.ts
    │   │       user.repository.ts
    │   │
    │   ├───routers
    │   │       home.route.ts
    │   │       index.ts
    │   │
    │   └───typings
    ├───database
    │   ├───column-transformers
    │   ├───migrations
    │   └───naming-strategies
    │           custom-naming-strategy.ts
    │
    └───shared
        ├───configs
        │       data-source.config.ts
        │       environment.config.ts
        │
        ├───constants
        │       environment.constant.ts
        │       index.ts
        │
        └───providers
                app.provider.ts
                database.provider.ts
                env-load.provider.ts
                index.ts
                logger.provider.ts
```
