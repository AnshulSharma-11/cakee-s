# CakeShop Backend

Spring Boot 3.3 (Java 17, Maven) REST API for the CakeShop cake e-commerce platform.

## Prerequisites
- Java 17+
- Maven 3.9+
- MySQL 8+ running locally

## Setup

1. Create a database (or let Hibernate do it — see below):
   ```sql
   CREATE DATABASE cakeshop_db;
   ```

2. Edit `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_password_here
   ```

3. Set a real JWT secret (32+ characters) for anything beyond local testing:
   ```properties
   app.jwt.secret=replace_this_with_a_long_random_secret_key_min_32_chars
   ```

## Run

```bash
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. `spring.jpa.hibernate.ddl-auto=update` means
Hibernate will create/update all tables automatically from the JPA entities on first run —
`src/main/resources/db/schema.sql` is there for reference/manual setup if you'd rather not
rely on auto-DDL.

CORS is pre-configured to allow requests from `http://localhost:5173` (the Vite dev server).

## API overview

| Base path            | Role required | Covers |
|-----------------------|--------------|--------|
| `/api/auth/**`         | none (public) | register (vendor/customer), login, logout |
| `/api/profile/**`      | any authenticated user | view/update own profile |
| `/api/vendor/**`       | VENDOR        | products, categories, subcategories |
| `/api/customer/**`     | CUSTOMER      | browse products, cart, addresses, orders, vendor public profiles |
| `/api/admin/**`        | ADMIN         | product approval queue, vendor/customer directory, all orders (read-only) |

All protected endpoints expect `Authorization: Bearer <token>`, issued by `/api/auth/login`
or the register endpoints.

## Creating your first admin user

There's no public "register admin" endpoint by design. Insert one directly after your first
run creates the `users` table, using a bcrypt hash for the password:

```sql
INSERT INTO users (name, email, password, role, is_active, created_at, updated_at)
VALUES ('Admin', 'admin@cakeshop.test', '<bcrypt-hash>', 'ADMIN', true, NOW(), NOW());
```

You can generate a bcrypt hash quickly with an online bcrypt generator (cost factor 10) or a
small script using Spring's `BCryptPasswordEncoder`.
