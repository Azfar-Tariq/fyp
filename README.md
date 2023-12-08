# fyp

npm start to run the code <br>

Database Structure <br>
-- Create table BuildingData
CREATE TABLE BuildingData (
    id INT PRIMARY KEY IDENTITY,
    buildingName NVARCHAR(255)
);
<br>
-- Create table Lab<br>
CREATE TABLE Lab (
    id INT PRIMARY KEY IDENTITY,
    buildingId INT FOREIGN KEY REFERENCES BuildingData(id),
    labName NVARCHAR(255)
); <br>

-- Create table CameraData<br>
CREATE TABLE CameraData (
    id INT PRIMARY KEY IDENTITY,
    buildingId INT FOREIGN KEY REFERENCES BuildingData(id),
    labId INT FOREIGN KEY REFERENCES Lab(id),
    x1 INT,
    y1 INT,
    x2 INT,
    y2 INT,
    pcStatus BIT
);<br>

CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY,
    email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    name NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL
);<br>

--Run the following queries to add users <br>
INSERT INTO users (email, password, name, role)
VALUES ('admin@gmail.com', '12345678', 'Ahmad Imran', 'Admin');

INSERT INTO users (email, password, name, role)
VALUES ('user1@gmail.com', '123', 'Testing User 1', 'User');

SELECT * FROM users
