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

Current Fixes: Making Application Production Ready
 1. Testing Dao Crud Operations
2. Proposal Crud Ops:-GetAllProposalsInDao, GetProposalDetailsById,FundProposal 
3. Vote: GetAllOngoingProposals, VoteInSpecificProposal,GetVotedProposals
4. Authentication & Implementation of protected Routes 
5. Normal User Management
6. Admin User Management

<h1>TESTING - Testing Module for the project </h1>
<h3>Types of Tests Used & Purpose</h3>
<ul> 
<li>Unit Testing: Isolating each unit of code & evaluating its functioning, focusing on isolated modules & functions</li>
<li>Integration Testing:  involves testing software modules and the interaction between them. It tests groups of logically integrated modules.</li>
</ul>
Structural whitebox testing techniques are implemented which involves dev designing test cases based on the internal structure of the code. 
