# PEM | On Demand Articles Delivery
### Project Goals
This project aims to create a comprehensive item/article/product/service delivery system with a focus on maintaining two codebases.

#### Frontend :
- **React Native:** A cross-platform JavaScript framework developed by Meta Inc., gaining popularity for its versatility.
- **Django:** Utilizing Django templates for server-side rendering, allowing Python-like syntax within HTML.
- **JS:** Employing JavaScript for webpage behavior, both on the web version of the app and within the React Native scope. 

#### Backend :
##### Django: 
Django, a prominent Python web framework, serves a dual purpose:
- **Web Application** : Providing a web application for users and coordinators, featuring a centralized dashboard (initially basic, with plans for a specialized admin dashboard).
- **API**: Using Django Rest Framework to handle API requests from the React Native app, ensuring the development of reliable, fast, and secure APIs.

# How to contribute?
1. Fork the project and download it.
2. Make your changes and submit a pull request. I am eager to collaborate, collaboration is most welcome!
# How to run the Project?

### Prerequisites
1. <a href="https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US">Expo Go (Android)</a> OR
2. <a href="https://apps.apple.com/us/app/expo-go/id982107779">Expo Go (iOS)</a>
3. <a href="https://www.python.org/downloads/">Python 3.9 or later</a>
4. <a href="https://nodejs.org/en/download">Node (for the Node Package Manager or npm)</a>
5. <a href="https://www.postgresql.org/download/">postgreSQL</a>
6. React Native CLI (**"npm install -g react-native-cli"**)

### Backend (Django) Setup
1. Open a command prompt and navigate to the backend folder (root of the Django project).
2. Create a virtual environment:
    - Run the command: **"python -m venv .<your-virtual-environment-name>"** OR **"py -m venv .<your-virtual-environment-name>"** OR **"python3 -m venv .<your-virtual-environment-name>"** depending on your installation and OS.
3. Activate the virtual environment: **".venv\Scripts\activate"** (Windows) or **"source .venv/bin/activate"** (Mac).
4. Install Python dependencies: **"pip install -r requirements.txt"**.
5. Run the development server: **"python manage.py runserver 0.0.0.0:8000"**.

### Frontend (React Native) Setup:
1. Navigate to the frontend folder and within the folder, navigate to the root of the the React Native Project.
2. Install dependencies **"npm install"**.
3. Find your IP Address:
    - For Windows: **"ipconfig"**.
    - For Mac: **"ifconfig"**.
4. Update IP addresses in the following files:
    - **/frontend/juicycup-rn/juicycup-mobile/screens/cart-screen.js**
    - **/frontend/juicycup-rn/juicycup-mobile/components/events/event-list.js**
5. Run the command: **"npx expo start"**.

If you encounter any issues or have questions or suggestions, feel free to reach out at @nlemarnold@gmail.com

# Contributing Guidelines

Please refer to CONTRIBUTING.md for details on how to contribute to this project.

# Acknowledgments

I would like to acknowledge the following frameworks and libraries for their contributions to this project:
- <a href="https://www.python.org/" target="_blank">Python</a>
- <a href="https://nodejs.org/en/download" target="_blank">Node</a>
- <a href="https://reactnative.dev/" target="_blank">React Native</a>
- <a href="https://reactnavigation.org/" target="_blank">React Navigation</a>
- <a href="https://react-redux.js.org/" target="_blank">React Redux</a>
- <a href="https://www.postgresql.org/" target="_blank">postgreSQL</a>

### Note:
I will provide an option to use Docker for those who prefer containerized development environments as soon as possible.
