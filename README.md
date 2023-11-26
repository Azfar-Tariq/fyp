# fyp

npm start to run the code

# database structure

create database fyp
use database fyp

create table BuildingData (
id int primary key identity,
buildingName nvarchar(255),
)

create table Lab (
id int primary key identity,
buildingId int foreign key references BuildingData(id),
labName nvarchar(255),
)

create cameraData (
id int primary key identity,
buildingId int foreign key references BuildingData(id),
labId int foreign key references Lab(id),
x1 int,
y1 int,
x2 int,
y2 int,
pcStatus bit,
)
