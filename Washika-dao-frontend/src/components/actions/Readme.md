Contains All logic for V1
In V2 will contain only client -> blockchain functions since the backend will handle most of the onchain calls
Will Contain actions that require a private key since the wallet is on the frontend, but if a custom solution is implemented, most actions will go directly.
Will not contain functions that handle sensitive user data but preferably on readonly functions whose onchain data is necessary since the blockchain will in all regards be the single source of truth
