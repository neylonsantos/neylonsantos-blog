import { Application } from "@hotwired/stimulus";
import ThemeController from "./controllers/theme_controller.js";
import ViewsController from "./controllers/views_controller.js";

const application = Application.start();
application.register("theme", ThemeController);
application.register("views", ViewsController);
