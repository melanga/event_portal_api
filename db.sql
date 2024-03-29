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

CREATE TABLE admin
(
    user_id uuid PRIMARY KEY,
    CONSTRAINT admin_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE category (
    name VARCHAR(50) PRIMARY KEY ,
    icon_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE service_provider(
    user_id uuid PRIMARY KEY,
    service_title VARCHAR(50) NOT NULL DEFAULT 'no title',
    description VARCHAR(255) NOT NULL DEFAULT 'no description',
    category VARCHAR(50),
    CONSTRAINT service_provider_category FOREIGN KEY (category) REFERENCES category(name) ON DELETE SET NULL,
    CONSTRAINT service_provider_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE service_provider_rating(
    id SERIAL PRIMARY KEY,
    service_provider_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    rating INTEGER NOT NULL,
    comment VARCHAR(255),
    CONSTRAINT service_provider_rating_service_provider_id_fk FOREIGN KEY (service_provider_id) REFERENCES service_provider(user_id) ON DELETE CASCADE,
    CONSTRAINT service_provider_rating_customer_id_fk FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE eventBidData (
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
    sp_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    sp_confirmed_at TIMESTAMP,
    c_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    c_confirmed_at TIMESTAMP,
    PRIMARY KEY (service_provider_id, event_id),
    CONSTRAINT service_provider_event_service_provider_id_fk FOREIGN KEY (service_provider_id) REFERENCES service_provider(user_id) ON DELETE SET NULL,
    CONSTRAINT service_provider_event_event_id_fk FOREIGN KEY (event_id) REFERENCES eventBidData(id) ON DELETE CASCADE
);

CREATE TABLE requirement (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id uuid NOT NULL,
    title VARCHAR(50) NOT NULL DEFAULT 'no title',
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT requirement_event_id_fk FOREIGN KEY (event_id) REFERENCES eventBidData(id) ON DELETE CASCADE,
    CONSTRAINT requirement_category_fk FOREIGN KEY (category) REFERENCES category(name) ON DELETE SET NULL
);

CREATE TABLE requirement_bidding(
    requirement_id uuid NOT NULL,
    service_provider_id uuid NOT NULL,
    price INTEGER NOT NULL,
    PRIMARY KEY (requirement_id, service_provider_id),
    CONSTRAINT requirement_bidding_requirement_id_fk FOREIGN KEY (requirement_id) REFERENCES requirement(id) ON DELETE CASCADE,
    CONSTRAINT requirement_bidding_service_provider_id_fk FOREIGN KEY (service_provider_id) REFERENCES service_provider(user_id) ON DELETE CASCADE
);