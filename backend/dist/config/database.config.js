"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const user_entity_1 = require("../entities/user.entity");
const post_entity_1 = require("../entities/post.entity");
const post_image_entity_1 = require("../entities/post-image.entity");
const getDatabaseConfig = (configService) => ({
    type: 'mariadb',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [user_entity_1.User, post_entity_1.Post, post_image_entity_1.PostImage],
    synchronize: true,
    logging: false,
    charset: 'utf8mb4',
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map