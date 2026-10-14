# AuraHealth (Java Servlets + JDBC + MySQL)

REST backend for the AuraHealth web app: patients, doctors and an admin, with appointment booking, medical history, reviews, settings, analytics and an AI helper.

## Stack
Java 17 · Jakarta Servlet 6 (Tomcat 10.1+) · JDBC (MySQL 8) · Gson · Firebase Admin (Google sign-in token check) · Maven

## Run
1. Create the database: `mysql -u root -p < db/schema.sql`
2. Set environment variables (defaults in brackets): `DB_URL` [jdbc:mysql://localhost:3306/aurahealth], `DB_USER` [root], `DB_PASS` [empty]
   For Google login also set `GOOGLE_APPLICATION_CREDENTIALS` to your Firebase service-account JSON.
3. Build: `mvn clean package`
4. Copy `target/aurahealth.war` into Tomcat's `webapps/` and start Tomcat.
5. Open http://localhost:8080/aurahealth/ . The default admin Sunny / Sunny123 is created on first start.

## API (all JSON, cookie session)
| Method + path | Who | What |
|---|---|---|
| POST /api/auth/login, /register, /admin, /google, /logout; GET /api/auth/me | all | authentication |
| GET/POST/PUT/DELETE /api/users[/id] | admin | user management |
| GET /api/doctors; POST /api/doctors; PUT /api/doctors/me | public / admin / doctor | doctors and schedule |
| GET /api/slots?doctorId=&date= | logged in | free slots |
| GET/POST/PUT /api/appointments[/id] | all roles | book, confirm, cancel, reschedule (admin) |
| GET/POST /api/history | patient / doctor | medical records |
| GET/POST /api/reviews | patient / doctor | ratings and feedback |
| GET/PUT /api/profile | patient / doctor | own profile |
| GET/PUT /api/settings | public / admin | system settings |
| GET /api/analytics | admin | report numbers |
| POST /api/ai | patient | AI helper |

## Layout
`model` (User → Doctor inheritance, POJOs) · `dao` (Dao<T> interface, BaseDao JDBC helper) · `service` (SlotService) · `servlet` (one servlet per resource) · `util` (Db, PasswordUtil, exceptions).

## Note
`src/main/webapp/index.html` is the demo front-end. It still saves data in localStorage; replace its data functions with `fetch('/aurahealth/api/...')` calls to use this backend.
