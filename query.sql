CREATE DATABASE izipizy;

CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    image_profile VARCHAR(255) DEFAULT ''
);

CREATE TABLE recipe (
    id VARCHAR PRIMARY KEY,
    name_recipe VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    video VARCHAR(255),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- CREATE TABLE category (
--     id VARCHAR PRIMARY KEY,
--     name VARCHAR(255) NOT NULL UNIQUE
-- );

CREATE TABLE save_recipe (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    recipe_id VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id)
);

CREATE TABLE like_recipe (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    recipe_id VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id)
);

CREATE TABLE comment (
    id VARCHAR PRIMARY KEY,
    comment_text TEXT NOT NULL,
    user_id VARCHAR NOT NULL,
    recipe_id VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipe(id)
);