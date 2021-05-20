CREATE DATABASE db_rescue_pets;

USE db_rescue_pets;


-- Users table
CREATE TABLE user(
    iduser int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(50) NOT NULL, 
    date_created DATE NOT NULL,
    type VARCHAR(20) NOT NULL -- Administration, user
);

-- Table mascota ---con latitud y longitud
CREATE TABLE pet(
    idpet INT(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    iduser INT(11)  NOT NULL,
    foreign key (iduser) references user(iduser),
    name VARCHAR(20) NOT NULL,
    specie VARCHAR(20) NOT NULL,
    color VARCHAR(20) NOT NULL,
    size VARCHAR(20) NOT NULL,
    sex VARCHAR(20) NOT NULL,
    observation VARCHAR(255) NOT NULL,
    status  VARCHAR(20) NOT NULL,
    direction VARCHAR(255),
    datePet DATE NOT NULL,
    longitud VARCHAR(200),
    latitud VARCHAR(200)
);

-- Table imagen
CREATE TABLE image_pet(
    idpet INT(11) NOT NULL,
    foreign key (idpet) references pet(idpet),
    dir_image VARCHAR(255)
); 


--eliminar map para agregar latitud y longitud
Alter table pet drop column map;
alter table pet add longitud VARCHAR(200);
alter table pet add latitud VARCHAR(200);


DESCRIBE user;

DESCRIBE pet;

DESCRIBE image_pet;

(0,"Gary","Nova", "12345678", "gary@correo.com","123456", '2000-01-02',"Administration"),
(1,"Neil","Graneros", "12345678", "neil@correo.com","123456", '2000-01-01',"Administration"),
INSERT INTO user VALUES
(3,"Pilar","Sahonero", "12345678", "pilar@correo.com","123456", '2000-01-03',"user"),
(4,"Laura","cuba", "12345678", "laura@correo.com","123456", '2000-01-04',"user"),
(5,"Kamil","chavez", "12345678", "kamil@correo.com","123456", '2000-01-05',"user");
(1,1, "Lyto", "cat", "black", "big", "male", "blablablabla numero XD", "Perdido", "Direccion 1","2021-01-01", "mapa1");
INSERT INTO pet VALUES
(2,1, "juan de la riba", "cat", "black", "big", "male", "blablablabla numero XD", "Encontrado", "Direccion 2","2021-01-02", "mapa2"),
(3,3, "pequeño", "cat", "white", "small", "female", "blablablabla numero XD", "Perdido", "Direccion 3","2021-01-03", "mapa3"),
(4,3, "guapo", "dog", "black", "big", "male", "blablablabla numero XD", "reported", "Direccion 4","2021-01-04", "mapa4"),
(5,4, "astre", "cat", "black", "medium", "female", "blablablabla numero XD", "Perdido", "Direccion 5","2021-01-05", "mapa5"),
(6,5, "guapa", "dog", "brown", "big", "female", "blablablabla numero XD", "Perdido", "Direccion 6","2021-01-06", "mapa6"),
(7,3, "tiky", "cat", "black", "big", "male", "blablablabla numero XD", "reported", "Direccion 7","2021-01-07", "mapa7"),
(8,3, "little ugly", "dog", "black and white", "small", "male", "blablablabla numero XD", "Perdido", "Direccion 8","2021-01-08", "mapa8"),
(9,4, "manko", "cat", "tiger", "big", "female", "blablablabla numero XD", "Encontrado", "Direccion 9","2021-01-09", "mapa9"),
(10,1, ":)", "dog", "black", "small", "male", "blablablabla numero XD", "Perdido", "Direccion 10","2021-01-10", "mapa10");


