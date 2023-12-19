# fyp

npm start to run the code <br>

install following dependencies:
<br>
-node modules for client, server and the parent folder <br>
-express and cors

<br>

Database Structure <br> <br>
-- Create table BuildingData <br>
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
    role NVARCHAR(50) NOT NULL,
	logged_in binary,
	mannualControlRequested int
);<br>

CREATE TABLE ManualControlRequests (
    id INT PRIMARY KEY IDENTITY,
    teacherId INT FOREIGN KEY REFERENCES users(id),
    labId INT FOREIGN KEY REFERENCES Lab(id),
    buildingId INT FOREIGN KEY REFERENCES BuildingData(id),
    status NVARCHAR(50) DEFAULT 'Pending',
    timestamp DATETIME DEFAULT GETDATE()
);<br>

--Run the following queries to add users <br>
INSERT INTO users (email, password, name, role)
VALUES ('admin@gmail.com', '123', 'Admin', 'Admin'); <br>

INSERT INTO users (email, password, name, role)
VALUES ('user1@gmail.com', '123', 'Testing User 1', 'User');

SELECT * FROM users


<br>
in case of any issue<br>
add column<br>
ALTER TABLE tablename
ADD columnName int; 
<br>

remname a column<br>
EXEC sp_rename 'tableName.CurrentColumnName', 'NewColumnName', 'COLUMN';