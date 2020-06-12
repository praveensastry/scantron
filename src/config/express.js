const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const bodyParser = require("body-parser");
const { APP_PORT } = require("./settings");
const { CORS_REGEX } = require("./secrets");
const logger = require("../util/logger");

const setupExpress = (app) => {
    app.set("port", APP_PORT);

    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin) return callback();
            const match = origin.match(new RegExp(CORS_REGEX)) ? true : false;
            callback(null, match);
        }
    };
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(compression());
    app.use(
        morgan(
            "[:method] :url :status :res[content-length] - :response-time ms",
            {
                stream: {
                    write: (text) => {
                        logger.info(text.substring(0, text.lastIndexOf("\n")));
                    }
                }
            }
        )
    );
};

module.exports = {
    setupExpress
}