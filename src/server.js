const app = require("./app");
const logger = require("./util/logger");

app.listen(app.get("port"), () => {
    logger.info(
        `API is running at http://localhost:${app.get("port")} in ${app.get(
            "env"
        )} mode`
    );
});