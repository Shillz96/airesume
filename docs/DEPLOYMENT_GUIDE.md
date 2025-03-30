## Deployment Guide: FastAPI + React + PostgreSQL

This guide covers database setup, application preparation, choosing hosting platforms, and deployment steps.

**1. Database Setup (PostgreSQL)**

You need different database setups for local development and production deployment.

**a. Development Environment:**

*   **Option 1: Local PostgreSQL Installation:** Install PostgreSQL directly on your machine. This gives you full control but requires manual setup.
*   **Option 2: Docker:** Use Docker and Docker Compose to run PostgreSQL in a container. This is highly recommended as it isolates the database, ensures consistency, and simplifies setup/teardown.
    *   Create a `docker-compose.yml` file in your project root.
    *   Define a service for PostgreSQL, specifying an image (e.g., `postgres:15`), environment variables for the user/password/database name, and potentially a volume to persist data.
*   **Connection String:** Regardless of the method, store your *local* database connection string (e.g., `postgresql://user:password@localhost:5432/mydatabase`) in a `.env` file in your `server/` directory.
*   **.gitignore:** **Crucially, add `.env` to your main `.gitignore` file.** Never commit `.env` files containing credentials to Git.
*   **Loading Settings:** Use a library like `python-dotenv` and Pydantic's `BaseSettings` in your FastAPI app to load the connection string and other settings from the `.env` file for local development.

**b. Production Environment:**

*   **Managed Database Service:** For deployment, **do not** run the database on the same server instance as your application if you can avoid it. Use a managed cloud database service. This handles backups, scaling, security patches, and availability for you.
*   **Free/Cheap Options:**
    *   **Supabase:** Provides a generous free tier that includes a full PostgreSQL database, authentication, storage, and more. It's a very popular choice for projects starting out.
    *   **Neon:** A serverless PostgreSQL provider with a good free tier. Excellent if you expect variable load or want to minimize costs during idle periods.
    *   **Render:** Offers a free tier PostgreSQL database. It might be slower and have stricter limits than Supabase/Neon's free tiers, but it's convenient if you host your app on Render too.
    *   **Railway:** Offers PostgreSQL as a service. Pricing is usage-based, and they often have starter credits that might cover initial usage for free.
*   **Setup:**
    1.  Sign up for one of the services above (Supabase or Neon are often recommended starting points).
    2.  Create a new project and a PostgreSQL database instance.
    3.  Securely note down the connection details: **Host, Port, Database Name, User, Password**. The service will usually provide a ready-to-use Connection URI/URL.
    4.  **Security:** Use a strong password. Configure network access rules (firewall settings) in the database provider's dashboard to only allow connections from your deployed backend's IP address or region, if possible.
*   **Connection String (Production):** You will store this production connection string **securely** as an environment variable on your chosen *deployment platform* (see Step 5), **not** in your code or `.env` file.

**c. Database Migrations:**

*   If you're using an ORM like SQLAlchemy, you likely need a migration tool (like Alembic) to manage changes to your database schema over time.
*   Ensure you have Alembic configured correctly (`alembic.ini`, `env.py`).
*   **Deployment Workflow:** Your deployment process must include a step to run database migrations *before* the new application code starts running. How you run this depends on the platform (e.g., a pre-deploy script, a separate command in the deployment pipeline). Example command: `alembic upgrade head`.

**2. Backend Preparation (FastAPI)**

*   **Dependencies:** Ensure your `server/requirements.txt` (or `pyproject.toml` if using Poetry/PDM) is complete and lists all necessary packages, including `fastapi`, `uvicorn`, `psycopg2-binary` (or `asyncpg` for async), `python-dotenv`, `pydantic-settings`, and importantly, `gunicorn`.
*   **Environment Variables:** Modify your FastAPI settings logic (e.g., using Pydantic `BaseSettings`) to read configuration **exclusively** from environment variables in production. This includes:
    *   `DATABASE_URL` (the production connection string)
    *   `SECRET_KEY` (for JWT tokens or other security features)
    *   `ALLOWED_ORIGINS` (for CORS, see below)
    *   Any other API keys or sensitive settings.
*   **CORS (Cross-Origin Resource Sharing):** Configure FastAPI's `CORSMiddleware` to allow requests from your deployed frontend URL.
    ```python
    # server/main.py (or wherever your FastAPI app is created)
    from fastapi.middleware.cors import CORSMiddleware
    import os

    # Load origins from environment variable, split by comma
    origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
    # Default to allow nothing if not set, or add specific defaults
    origins = [origin for origin in origins if origin] # Remove empty strings

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins, # Frontend URL(s) go here
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    ```
    Set the `ALLOWED_ORIGINS` environment variable on your deployment platform (e.g., `ALLOWED_ORIGINS=https://your-frontend-domain.com`).
*   **Production Server (Gunicorn + Uvicorn):** Do *not* run `uvicorn server.main:app --reload` in production. Use `gunicorn` to manage `uvicorn` workers for better performance and reliability.
    *   **Start Command:** Your deployment platform will need a start command. Use something like:
        ```bash
        gunicorn -w 4 -k uvicorn.workers.UvicornWorker server.main:app --bind 0.0.0.0:$PORT
        ```
        *   `-w 4`: Specifies 4 worker processes (adjust based on your server resources, 2-4 is common for small instances).
        *   `-k uvicorn.workers.UvicornWorker`: Tells Gunicorn to use Uvicorn workers for ASGI compatibility.
        *   `server.main:app`: Points to your FastAPI app instance (adjust `server.main` if your file/app variable is named differently).
        *   `--bind 0.0.0.0:$PORT`: Binds to all available network interfaces on the port specified by the `PORT` environment variable (most platforms set this automatically).
*   **Dockerfile (Recommended):** Containerizing your backend with Docker simplifies deployment significantly.
    ```dockerfile
    # server/Dockerfile
    FROM python:3.11-slim # Choose a specific, recent Python version

    WORKDIR /app

    # Install dependencies
    COPY ./requirements.txt .
    # Consider using --no-cache-dir in production builds
    RUN pip install --no-cache-dir -r requirements.txt

    # Copy application code
    COPY . .

    # Expose the port the app runs on (set by $PORT env var later)
    # EXPOSE 8000 # Example, Gunicorn will use $PORT

    # Command to run the application using Gunicorn
    # PORT environment variable will be injected by the platform
    # Ensure server.main:app points to your FastAPI app instance
    CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "server.main:app", "--bind", "0.0.0.0:${PORT:-8000}"]
    ```

**3. Frontend Preparation (React)**

*   **API URL:** Your React app needs to know the URL of your deployed backend API.
    *   Use Vite's environment variable system. Create a `.env` file in your `client/` directory (e.g., `client/.env`).
    *   Define the variable: `VITE_API_BASE_URL=http://localhost:8000` (for local dev pointing to local backend).
    *   Access it in your code: `const apiUrl = import.meta.env.VITE_API_BASE_URL;`
    *   Update your API fetching logic (`fetch`, `axios`, etc.) to use this base URL.
    *   **Important:** You will override `VITE_API_BASE_URL` with the *production* backend URL in the deployment platform's environment variable settings for the frontend.
    *   Add `client/.env` to your `.gitignore`.
*   **Build Step:** Create the optimized static production build.
    *   Run `npm run build` (or `yarn build`) in your `client/` directory (or configure your deployment platform to do this).
    *   This generates static HTML, CSS, and JS files in the output directory specified in `vite.config.ts` (`build.outDir`). By default, relative to the `root` ('client'), this is often `client/dist`. Verify this path.

**4. Choosing Deployment Platforms (Free/Cheap Focus)**

Consider these platforms that offer free tiers suitable for full-stack apps:

*   **Render:**
    *   **Pros:** Simple UI, good documentation, free tiers for web service (Python/Node.js/etc.), static site (React), and PostgreSQL DB. Great all-in-one starting point. Auto-deploys from Git.
    *   **Cons:** Free web services sleep after inactivity, can be slow to wake up. Free DB has limited resources/connections. Build times can be slow on free tier.
*   **Fly.io:**
    *   **Pros:** Generous free allowances (compute hours, RAM, small persistent volume for SQLite if needed, can deploy Postgres containers). Deploys Docker containers globally. Fast.
    *   **Cons:** Steeper learning curve than Render (requires `flyctl` CLI). Configuration via `fly.toml`.
*   **Railway:**
    *   **Pros:** Very easy UI, automatically detects services from repo. Usage-based pricing can be very cheap or free initially with starter credits. Supports Postgres.
    *   **Cons:** Can become more expensive than fixed free tiers if usage exceeds credits/limits.
*   **Vercel (Frontend) + Backend Host (Render/Fly/Railway):**
    *   **Pros:** Vercel offers an excellent *free* tier for hosting static frontends (your React build) with global CDN, HTTPS, custom domains. It's extremely fast and easy for frontends. You then host your FastAPI backend and DB on a separate platform's free tier (like Render or Fly). This separation is a common and scalable pattern.
    *   **Cons:** Requires managing two platforms. Need to correctly configure CORS on the backend to allow requests from the Vercel frontend domain.
*   **Netlify (Frontend) + Backend Host (Render/Fly/Railway):**
    *   **Pros/Cons:** Similar to the Vercel option. Netlify is another top-tier static hosting provider with a great free tier.

**Recommendation:**
*   For absolute simplicity to start: **Render** (all-in-one).
*   For better frontend performance and a common pattern: **Vercel (Frontend) + Render (Backend + DB)**.

**5. Deployment Steps (Example: Render)**

1.  **Push to Git:** Ensure your code (including `Dockerfile` if using, `requirements.txt`, etc., but *not* `.env` files) is pushed to a GitHub, GitLab, or Bitbucket repository.
2.  **Create Render Account:** Sign up for Render.
3.  **Create PostgreSQL Service:**
    *   New -> PostgreSQL.
    *   Choose a name, region, free plan.
    *   Once created, copy the **Internal Connection URL**.
4.  **Create Backend Web Service (FastAPI):**
    *   New -> Web Service.
    *   Connect your Git repository.
    *   Select Docker runtime (if using `Dockerfile`) or Python.
    *   **Settings:**
        *   Name: e.g., `my-app-backend`
        *   Region: Choose the same as your database.
        *   Branch: `main` (or your deployment branch).
        *   Runtime: Docker (select `server/Dockerfile` if nested) or Python (Render will detect `requirements.txt`).
        *   Build Command (if Python runtime): `pip install -r server/requirements.txt` (adjust path if needed). Or leave blank if using Dockerfile.
        *   Start Command: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker server.main:app --bind 0.0.0.0:$PORT` (adjust `server.main:app`).
        *   Plan: Free.
    *   **Environment Variables:**
        *   Click "Add Environment Variable".
        *   `DATABASE_URL`: Paste the **Internal Connection URL** from your Render PostgreSQL service.
        *   `ALLOWED_ORIGINS`: Add the URL where your frontend will live (e.g., `https://my-app-frontend.onrender.com` - you'll know this after deploying the frontend). Also add `http://localhost:5173` if you want to test locally against the deployed backend.
        *   Add any other secrets (`SECRET_KEY`, etc.).
        *   Render automatically sets a `PORT` variable.
    *   Click "Create Web Service". Render will build and deploy. Note the URL (e.g., `https://my-app-backend.onrender.com`).
5.  **Run Database Migrations (Manual First Time):**
    *   Go to your deployed backend service dashboard on Render.
    *   Click the "Shell" tab.
    *   Run your migration command: `alembic upgrade head` (or equivalent).
    *   *Note:* For automated migrations on subsequent deploys, you might add this command to a build script or use Render's "Build & Deploy" hooks if available on your plan/setup.
6.  **Create Frontend Static Site:**
    *   New -> Static Site.
    *   Connect your Git repository.
    *   **Settings:**
        *   Name: e.g., `my-app-frontend`
        *   Branch: `main`.
        *   Root Directory: `client` (if your `package.json` and `vite.config.ts` are inside the `client` folder relative to the repo root). Leave blank if they are at the root.
        *   Build Command: `npm install && npm run build` (or `yarn && yarn build`).
        *   Publish Directory: `dist` (verify this matches `build.outDir` in `vite.config.ts`, relative to the `Root Directory`).
    *   **Environment Variables (under Advanced):**
        *   Click "Add Environment Variable".
        *   `VITE_API_BASE_URL`: Paste the URL of your deployed Render *backend* service (e.g., `https://my-app-backend.onrender.com`).
    *   Click "Create Static Site". Render will build and deploy.
7.  **Update Backend CORS:** Go back to your backend service's Environment Variables on Render and ensure `ALLOWED_ORIGINS` includes the URL of your deployed frontend (e.g., `https://my-app-frontend.onrender.com`). The service will likely need to redeploy for the change to take effect.

**6. Post-Deployment**

*   **Testing:** Thoroughly test all features of your application. Check browser developer console for errors.
*   **Custom Domain:** Configure custom domains through your hosting provider's dashboard (usually involves DNS changes).
*   **HTTPS:** Most platforms provide free managed SSL certificates (Let's Encrypt). Ensure it's enabled.
*   **Logging:** Familiarize yourself with accessing logs on your chosen platform for debugging.

This guide provides a solid foundation. Deployment often involves platform-specific details, so always refer to the documentation of your chosen database and hosting providers. Good luck! 