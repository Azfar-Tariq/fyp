# fyp

npm start to run the code

install following dependencies:
<br>
-node modules for client, server and the parent folder <br>
-express and cors

<br>

# database structure

create database fyp
use database fyp

create table BuildingData (
id int primary key identity,
buildingName nvarchar(255),
)

create table Lab (
id int primary key identity,
buildingId int,
foreign key(buildingId) references BuildingData(id) on delete cascade,
labName nvarchar(255),
)

create table cameraData (
id int primary key identity,
buildingId int foreign key references BuildingData(id),
foreign key(buildingId) references BuildingData(id) on delete no action,
labId int foreign key references Lab(id),
foreign key(labId) references Lab(id) on delete cascade,
x1 int,
y1 int,
x2 int,
y2 int,
pcStatus bit,
)

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

SELECT \* FROM users

<br>
in case of any issue<br>
add column<br>
ALTER TABLE tablename
ADD columnName int; 
<br>

remname a column<br>
EXEC sp_rename 'tableName.CurrentColumnName', 'NewColumnName', 'COLUMN';
