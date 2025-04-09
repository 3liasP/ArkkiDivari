# Antiquarian

Antiquarian web application. This project aims to create a shared database system (referred to as "Keskusdivari" in Finnish) that centralizes and facilitates the operations of multiple second-hand bookshops ("divarit" in Finnish). These bookshops typically sell used books or surplus editions from publishers and are increasingly moving towards online sales. By implementing this shared platform, individual bookshops can manage their inventory, allow customers to search for books across multiple shops, and process orders efficiently.

Developed as a coursework for TUNI DATA.DB.210 Database programming -course.

## Tech Used

A detailed list of the `npm` packages used can be found in the `package.json` files of the respective components. Below is a brief overview of the key technologies utilized in this project.

### Backend

-   [PostgreSQL](https://www.postgresql.org/)
-   [Express](https://expressjs.com/)
-   [Node](https://nodejs.org/en/)
-   [Bcrypt](https://www.npmjs.com/package/bcrypt)
-   [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)

### Frontend

-   [React](https://reactjs.org/)
-   [Redux](https://redux.js.org/)
-   [Material UI](https://mui.com/)
-   [Vite](https://www.npmjs.com/package/vite)

### Developement

-   [ESLint](https://www.npmjs.com/package/eslint)
-   [Prettier](https://www.npmjs.com/package/prettier)
-   [Husky](https://www.npmjs.com/package/husky)
-   [Lint-staged](https://www.npmjs.com/package/lint-staged)

## Getting Started

The application is deployed in Tampere University's linux server with nginx. Outside of University's network you can access it with using a VPN, such as [EduVPN](https://www.eduvpn.org).

Application is found in the following address: http://tie-tkannat.it.tuni.fi:8011/ . It is fully working in prod mode and can be accessed straight from this URL. You can create a new user or use some of the existing ones. Application has 3 different user roles (admin, seller and customer). Following list includes premade user accounts and their passwords and roles. Creating a new account through registration page will have a customer-role.

### Premade accounts

| Role   | Username              | Password                |
| ------ | --------------------- | ----------------------- |
| Admin  | admin@arkkidivari.com | admin123                |
| Seller | lasse@lassenlehti.fi  | lasse456                |
| Seller | galle@galleingalle.fi | galle789                |
| Seller | kimmo@kirjakammio.fi  | kimmoEiKestäKakaroitaan |

## Running application locally

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2. Install Node.js (v. 22) and PostgreSQL

3. Checkout branch dev
    ```bash
    git checkout dev
    ```
4. Create a file `.env` into `server/`-directory and copy data from `.env.sample` to `.env`
5. For no login set value of `NODE_ENV` to "dev"
6. Install required dependencies:
    ```bash
    npm install
    ```
7. Start the backend server:
    ```bash
    cd server/
    npm run dev
    ```
8. Start the frontend server:
    ```bash
    cd client/
    npm install
    npm run dev
    ```
9. Install required dependencies to `tools/`-directory:
    ```bash
    cd tools/
    npm install
    ```
10. Initialize the database:
    ```bash
    cd tools/scripts/
    sh db-init.sh
    ```
11. Populate the database (NOTE: Faker creates sample books ONLY when `NODE_ENV=dev`)
    ```bash
    cd tools/populate/
    node setup.js <numberOfUsers> <numberOfBooks>
    ```
12. You can run populate again, if you need more books or users in the database.
13. Open URL http://localhost:8011 on your preferred browser. (Google Chrome and Firefox work both well)
14. Enjoy exploring and testing the application!
