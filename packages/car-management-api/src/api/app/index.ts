import { Hono, type Context } from "hono";
import { HTTPException } from "hono/http-exception";
import authRoutes from "./features/auth";
import carCategoriesRoutes from "./features/car-categories";
import carTrimsRoutes from "./features/car-trims";
import contactUsConfigRoutes from "./features/contact-us-config";
import faqsRoutes from "./features/faqs";
import favoritesRoutes from "./features/favorites";
import homepageConfigRoutes from "./features/homepage-config";
import resolveTenant from "./features/resolve-tenant";
import userMessagesRoutes from "./features/user-messages";
import usersRoutes from "./features/users";
import vehicleScenariosRoutes from "./features/vehicle-scenarios";
import { appAuthMiddleware, type AppAuthEnv } from "./middleware/auth";
import { tenantMiddleware, type AppTenantEnv } from "./middleware/tenant";

const app = new Hono<AppTenantEnv>();

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(`App API Error: ${err}`);
  return c.json(
    {
      message: "An error occurred in the App API.",
      error: err.message,
    },
    500,
  );
});

// All routes for a specific tenant are grouped here
const tenantApp = new Hono<AppTenantEnv>();

// Apply tenant middleware to all tenant routes
tenantApp.use("*", tenantMiddleware);

// Auth routes are public within a tenant, but tenant-aware
tenantApp.route("/auth", authRoutes);

// Publicly accessible routes within a tenant
tenantApp.route("/vehicle-scenarios", vehicleScenariosRoutes);
tenantApp.route("/car-categories", carCategoriesRoutes);
tenantApp.route("/car-trims", carTrimsRoutes);
tenantApp.route("/homepage-config", homepageConfigRoutes);
tenantApp.route("/contact-us-config", contactUsConfigRoutes);
tenantApp.route("/faqs", faqsRoutes);

// Routes that require authentication
const authedApp = new Hono<AppAuthEnv>();
authedApp.use("*", appAuthMiddleware);
authedApp.route("/users", usersRoutes);
authedApp.route("/favorites", favoritesRoutes);
authedApp.route("/user-messages", userMessagesRoutes);

// Register authed routes under the tenant app
tenantApp.route("/", authedApp);

// Register tenant app with the main app
app.route("/tenants/:tenantId", tenantApp);

app.route("/resolve-tenant", resolveTenant);

// Middleware
app.use("*", tenantMiddleware);
app.use("/users/me", appAuthMiddleware);

// 后续将在此处聚合所有 app 功能路由
app.get("/", (c: Context) => c.json({ message: "Welcome to App API" }));

export default app;
