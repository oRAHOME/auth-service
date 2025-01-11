# Custom auth service

## setup instructions

1. Install python (we recommend 3.9)
2. clone the repository ```git clone <repository link>```
3. initiate and activate a virtual environment:
    - for windows based systems: 
        1. `python -m venv authenv`
        2. `authenv\Scripts\activate`
    - for unix like os: 
        1. `python3 -m venv authenv`
        2. `source authenv/bin/activate`
4. install dependancies: `pip install requirements.txt`
5. Run the service using flask's inbuild wsgi for testing:
    - `flask run`
    
