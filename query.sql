CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    image_profile VARCHAR(255) DEFAULT ''
);

CREATE TABLE recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_recipe VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    video VARCHAR(255),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR NOT NULL,
    category_id VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
);

