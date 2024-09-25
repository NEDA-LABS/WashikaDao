# Awesome Project Build with TypeORM

Steps to run this project:
1. By now you've already gitcloned the project & switched to this directory
2. Run `npm i` command 
This installs and autoconfigures the dependencies & versions as outlined in the package.json file
3. Setup database settings inside `data-source.ts` file
4. Run `npm start` command -- This starts the development server in the port configured in your .env, follow the .env.example file for sample provided.However, The default port is  8080 but you can change it in the index.ts file  & do not require a .env file 

This backend provides both a scaling solution that aims at maintaining user privacy without significant compromises in user experience & performance.  
```index.ts``` offers the entry point of the application, whose data source & database configuration are contained in the ```data-source.ts`` 
In our entry point, ```index.ts``` we initialize the database, populating it with the relevant configuration from the datasource, which can Raise a Failed to Initialize exception. 
We also declare the endpoints present for use. 
The ```entities``` directory contains the relationship models used to represent the database relationships via Typeorm specific syntax similar to Hibernate in Java & FastApi in Python.
The ```routes``` directory contains the relevant routes & their corresponding controller methods which will be executed when the server receives a request. as well as the corresponding ```http``` verbs 
The ```controller``` directory contains the relevant controller modules, which contain the logic for processing the request. 
The current implementation features using REST APIs fully, however, future iterations will include a hybrid blockchain implementation to serve the aforementioned purposes. 

Current Fixes: Controller Testing - prod
UX:
 1. Account Abstraction: Selection of a provider within the ecosystem.
 2. Implementation using REST APIs into our currently existing API's 
 3. Addition of Smart Contract Calls for specified transactions/interactions to work with our APIs. 