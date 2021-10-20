CREATE DATABASE db_employees CHAR SET utf8 COLLATE utf8_general_ci;

USE db_employees;

CREATE TABLE employees (
  id int(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(25) NOT NULL,
  last_name VARCHAR(25),
  phone_number VARCHAR(25),
  email VARCHAR(80) NOT NULL,
  address VARCHAR(120),
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(25) NOT NULL,
  last_name VARCHAR(25),
  email VARCHAR(80) NOT NULL,
  password VARCHAR(120) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO users (name, last_name, email, password)
VALUES('Michael', 'Serrato', 'mserrato@example.com', 'pass5678');
