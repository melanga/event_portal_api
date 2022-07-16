CREATE DATABASE eventportal;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    telephone_number VARCHAR(12) NOT NULL,
    location VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT check_min_length_telephone_number CHECK(length(telephone_number) >= 10)
);

CREATE TABLE customer (
    user_id uuid PRIMARY KEY,
    CONSTRAINT customer_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE service_provider(
    user_id uuid PRIMARY KEY,
    service_title VARCHAR(50) NOT NULL DEFAULT 'no title',
    description VARCHAR(255),
    CONSTRAINT service_provider_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE category (
    name VARCHAR(50) PRIMARY KEY ,
    icon_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE event (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    location VARCHAR(50),
    date TIMESTAMP NOT NULL,
    category VARCHAR(50) NOT NULL,
    customer_id uuid NOT NULL,
    CONSTRAINT event_category_fk FOREIGN KEY (category) REFERENCES category(name) ON DELETE SET NULL,
    CONSTRAINT event_customer_id_fk FOREIGN KEY (customer_id) REFERENCES customer(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE service_provider_event (
    service_provider_id uuid NOT NULL,
    event_id uuid NOT NULL,
    PRIMARY KEY (service_provider_id, event_id),
    CONSTRAINT service_provider_event_service_provider_id_fk FOREIGN KEY (service_provider_id) REFERENCES service_provider(id) ON DELETE SET NULL,
    CONSTRAINT service_provider_event_event_id_fk FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
);

CREATE TABLE requirement (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id uuid NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT requirement_event_id_fk FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
    CONSTRAINT requirement_category_fk FOREIGN KEY (category) REFERENCES category(name) ON DELETE SET NULL
);