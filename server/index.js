const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const BuildingData = require("./models/BuildingData");

app.use(express.json());
app.use(cors());

mongoose
	.connect(
		"mongodb+srv://azfar:658k6QBGojpNkcWn@labnet.lulqqiu.mongodb.net/fyp?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
		}
	)
	.catch((err) => console.error("MongoDB connection error: ", err));

// send data to database
app.post("/insert", async (req, res) => {
	const buildingName = req.body.buildingName;

	const building = new BuildingData({ buildingName: buildingName });

	try {
		await building.save();
		res.status(200).send("Building saved to database");
	} catch (err) {
		console.log(err);
		res.status(500).send("Failed to save building to database");
	}
});

// get data from database
app.get("/read", async (req, res) => {
	try {
		const result = await BuildingData.find({}).exec();
		res.send(result);
	} catch (error) {
		res.status(500).send(error);
	}
});

// edit data from database
app.put("/update/:id", async (req, res) => {
	const newBuildingName = req.body.newBuildingName;
	const id = req.params.id;

	try {
		await BuildingData.findByIdAndUpdate(id, {
			buildingName: newBuildingName,
		});
	} catch (err) {
		console.log(err);
	}
});

// delete data from database
app.delete("/delete/:id", async (req, res) => {
	const id = req.params.id;

	await BuildingData.findByIdAndRemove(id).exec();
	res.send("Deleted");
});

app.listen(3001, () => {
	console.log("Server is running on port 3001");
});
