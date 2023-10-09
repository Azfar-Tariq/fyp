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

// -------- Building Data Endpioints --------
// send data to database
app.post("/insertBuilding", async (req, res) => {
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
app.get("/readBuilding", async (req, res) => {
	try {
		const result = await BuildingData.find({}).exec();
		res.send(result);
	} catch (error) {
		res.status(500).send(error);
	}
});

// edit data from database
app.put("/updateBuilding/:id", async (req, res) => {
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
app.delete("/deleteBuilding/:id", async (req, res) => {
	const id = req.params.id;

	await BuildingData.findByIdAndRemove(id).exec();
	res.send("Deleted");
});

// -------- Lab Data Endpioints --------
// send data to database
app.post("/readBuilding/:buildingId/addLab", async (req, res) => {
	const buildingId = req.params.buildingId;
	const newLab = req.body;

	try {
		const building = await BuildingData.findById(buildingId);
		if (!building) {
			res.status(404).send("Building not found");
		}
		building.labs.push(newLab);
		await building.save();

		res.status(200).send("Lab saved to database");
	} catch (err) {
		console.log(err);
		res.status(500).send("Failed to save lab to the database");
	}
});

// get data from database
app.get("/readBuilding/:buildingId/readLab", async (req, res) => {
	const buildingId = req.params.buildingId;
	try {
		const building = await BuildingData.findById(buildingId);
		if (!building) {
			res.status(404).send("Building not found");
		} else {
			const labs = building.labs;
			res.status(200).json(labs);
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Failed to get labs from the database");
	}
});

// edit data from database
app.put("/readBuilding/:buildingId/updateLab/:labId", async (req, res) => {
	const buildingId = req.params.buildingId;
	const labId = req.params.labId;
	const updateLab = req.body;
	try {
		const building = await buildingData.findById(buildingId);
		if (!building) {
			res.status(404).send("Building not found");
		} else {
			const labToUpdate = building.labs.id(labId);
			if (!labToUpdate) {
				res.status(404).send("Lab not found in the building");
			} else {
				labToUpdate.set(updateLab);
				await building.save();
				res.status(200).send("Lab updated successfully");
			}
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Failed to update lab in the database");
	}
});

// delete data from database
app.delete("/readBuilding/:buildingId/deleteLab/:labId", async (req, res) => {
	const buildingId = req.params.buildingId;
	const labId = req.params.labId;
	try {
		const building = await BuildingData.findById(buildingId);
		if (!building) {
			res.status(404).send("Building not found");
		} else {
			const labToDelete = building.labs.id(labId);
			if (!labToDelete) {
				res.status(404).send("Lab not found in the building");
			} else {
				labToDelete.deleteOne();
				await building.save();
				res.status(200).send("Lab deleted successfully");
			}
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Failed to delete lab from the database");
	}
});

app.listen(3001, () => {
	console.log("Server is running on port 3001");
});
