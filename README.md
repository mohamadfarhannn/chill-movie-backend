🎬 Chill Movie - Backend API Service
A RESTful API service built for Chill Movie, a movie streaming platform application. This backend service focuses on the User Wishlist ("Daftar Saya") feature, enabling users to manage their favorite movies and watch statuses.Built with Node.js, Express, and MySQL (running via Docker).

🚀 Features (MVP)
This API handles the CRUD operations for the user's "My List" feature:

- Create: Add a movie/series to the user's personal list.
- Read: Retrieve all items in a specific user's list.Update: Change the status of an item (e.g., from wishlist to watched).-Delete: Remove an item from the list.

🛠️ Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MySQL (Docker Container)
- ORM/-Driver: mysql2
- Tools: DBeaver, Postman, Docker

📂 Project Structure
├── src
│ ├── config # Database configuration & connection pool
│ ├── routes # API Endpoints & Routing logic
│ └── services # Business logic & SQL Queries
├── .env # Environment variables (Not uploaded)
├── index.js # Entry point & Server setup
└── package.json # Dependencies

🔧 Installation & Setup
Follow these steps to run the project locally:

1. Clone the repositoryBashgit clone https://github.com/USERNAME_GITHUB_KAMU/chill-movie-backend.git
   cd chill-movie-backend
2. Install DependenciesBashnpm install
3. Setup DatabaseEnsure you have Docker installed and running.Run a MySQL container mapping port 3306.Create a database named chill_movie.Import the required tables (user, items, daftar_saya).
4. Environment VariablesCreate a .env file in the root directory based on .env.example:
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=chill_movie
5. Run the ServerThe server is configured to run on Port 5001 to avoid conflicts.
   node index.js
   Server will start at: http://localhost:5001

📡 API Endpoints ReferenceBase URL: http://localhost:5001MethodEndpointDescriptionRequest Body / ParamPOST/api/my-listAdd item to list{ "userId": 1, "contentId": 2 }GET/api/my-list/:userIdGet user's listParam: userIdPATCH/api/my-list/:listIdUpdate status{ "status": "watched" }DELETE/api/my-list/:listIdRemove from listParam: listId

👤 Author
Mohammad Farhan
GitHub: @mohamadfarhannn
LinkedIn: [Mohammad Farhan](https://www.linkedin.com/in/mohamadfarhannn)
