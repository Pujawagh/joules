CREATE TABLE user (id serial, PRIMARY KEY(id), name varchar(100), address varchar(200), town varchar(100), city varchar(200), shipping_info integer REFERENCES address_info(id), payment_method INTEGER REFERENCES payment_method(id))

CREATE TABLE personality

CREATE TABLE subscription

CREATE TABLE address_info(id serial, PRIMARY KEY(id), address varchar(200), city varchar(200), state varchar(50), country varchar(50), user integer REFERENCES user(id))

CREATE TABLE payment_method (id serial, card_number INTEGER, cvc2 INTEGER, billing_address INTEGER REFERENCES address_info(id), user INTEGER REFERENCES user(id))