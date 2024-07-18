# Medical Care

This project is a full-stack web application built to manage doctors and patients, enabling doctor registration, patient signup, login functionalities, PDF uploads, and patient-doctor associations.

## Features

* **Doctor Registration** : Allows doctors to register with their name, email, password, and specialty.
* **Patient Registration** : Enables patients to sign up with their name, email, and password.
* **Authentication and Authorization** : Uses JWT tokens for secure authentication and authorization.
* **PDF Upload** : Doctors can upload PDF documents, which are stored and managed using Cloudinary.
* **Patient-Doctor Association** : Doctors can link/unlink patients to/from their profiles.
* **Database Operations** : Utilizes PostgreSQL (NeonDB) for persistent storage of doctor, patient, and PDF data.
* **Responsive UI** : The frontend is built using React, ensuring a user-friendly experience across devices.

## Technologies Used

### Frontend

* **React** : JavaScript library for building user interfaces.
* **React Router** : For routing within the single-page application.
* **Axios** : HTTP client for making API requests from React.
* **CSS (or styled-components)** : Styling the components.
* **Cloudinary** : For managing file uploads (PDFs).

### Backend

* **Node.js** : JavaScript runtime for server-side logic.
* **Express.js** : Web application framework for Node.js.
* **PostgreSQL (NeonDB)** : Relational database management system for storing application data.
* **bcrypt** : For hashing passwords securely.
* **JWT (JSON Web Tokens)** : For authentication and authorization.
* **Multer** : Middleware for handling file uploads to Cloudinary.

## Project Structure

The project follows a structured approach for frontend and backend separation:

* **`/app`** : Contains the React frontend.
* **`/server`** : Contains the Node.js backend.

## Installation

1. **Clone the repository: `git clone https://github.com/spm999/Medical-Portal.git`**
2. **Install dependencies:**

   * For client (React):
     ```
     cd app
     npm install
     ```
   * For server (Node.js):

   ```
       cd server
       npm install
   ```
3. **Set up environment variables:**

   * Create `.env` files in both `client` and `server` directories.
   * Example `.env` file for the server:

     ```

     PGHOST=
     PGDATABASE=
     PGUSER=
     PGPASSWORD=
     ENDPOINT_ID=

     JWT_SECRET=

     CLOUDINARY_CLOUD_NAME=
     CLOUDINARY_API_KEY=
     CLOUDINARY_API_SECRET=
     ```
4. **Start the development servers:**

   * For client (React) : `npm run dev`
   * For server (Node.js): `npm start`

## Usage

* Access the application in your browser at `http://localhost:5173`.
* Register as a doctor or patient, then log in to manage your profile and associated data.
* Doctors can upload PDFs, link/unlink patients, and manage their profile details.
* Patients can view the doctors they are associated with and manage their own profile information.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your proposed changes.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
