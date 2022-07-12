CREATE TABLE roles(
	id serial primary key,
	rolename varchar(20) NOT NULL
);
	

CREATE TABLE users (
	id serial PRIMARY KEY,
    firstname varchar (50) NOT NULL,
	lastNname varchar (50) NOT NULL,
    username varchar (100) NOT NULL UNIQUE,
    password varchar (20) NOT NULL,
	roleid int NOT NULL,
	phone varchar(15) NOT NULL,
	addres varchar(50) NOT NULL,
	FOREIGN KEY (roleid) REFERENCES roles(id)
);

CREATE TABLE types (
    id serial PRIMARY KEY,
    typename varchar(20) NOT NULL
);

CREATE TABLE statuses (
    id serial PRIMARY KEY,
    statusname varchar(20) NOT NULL
);

CREATE TABLE applications (
    id serial PRIMARY KEY,
    typeid int NOT NULL,
    statusid int NOT NULL,
    userid int NOT NULL,
    FOREIGN KEY (typeid) REFERENCES types(id),
    FOREIGN KEY (statusid) REFERENCES statuses(id),
    FOREIGN KEY (userid) REFERENCES users(id)
);

INSERT INTO roles(rolename) VALUES('cadet');
INSERT INTO roles(rolename) VALUES('commander');

INSERT INTO types(typename) VALUES('obican');
INSERT INTO types(typename) VALUES('DDK');
INSERT INTO types(typename) VALUES('OPP');
INSERT INTO types(typename) VALUES('nagradno');
INSERT INTO types(typename) VALUES('sluzbeno');

INSERT INTO statuses(statusname) VALUES('neodlucen');
INSERT INTO statuses(statusname) VALUES('odobren');
INSERT INTO statuses(statusname) VALUES('odbijen');