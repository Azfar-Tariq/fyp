const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

// -------- Configure for Image Upload --------
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./images");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + "-" + file.originalname);
	},
});

const upload = multer({ storage: storage });

// -------- Building Data Endpioints --------
// send data to database
app.post(
	"/insertBuilding",
	upload.single("buildingImage"),
	async (req, res) => {
		const buildingName = req.body.buildingName;
		const buildingImage = req.file ? req.file.path.replace("public", "") : "";
		const building = new BuildingData({
			buildingName: buildingName,
			buildingImage: buildingImage,
		});

		try {
			await building.save();
			res.status(200).send("Building saved to database");
		} catch (err) {
			console.log(err);
			res.status(500).send("Failed to save building to database");
		}
	}
);

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
app.put(
	"/updateBuilding/:id",
	upload.single("buildingImage"),
	async (req, res) => {
		const newBuildingName = req.body.newBuildingName;
		const newBuildingImage = req.file
			? req.file.path.replace("public", "")
			: "";
		const id = req.params.id;

		try {
			const building = await BuildingData.findById(id);
			if (!building) {
				res.status(404).send("Building not found");
				return;
			}
			if (newBuildingName) {
				building.buildingName = newBuildingName;
			}
			if (newBuildingImage) {
				if (building.buildingImage) {
					fs.unlinkSync(building.buildingImage);
				}
				building.buildingImage = newBuildingImage;
			}
			await building.save();
			res.status(200).send("Building updated successfully");
		} catch (err) {
			console.log(err);
			res.status(500).send("Failed to update building in the database");
		}
	}
);

// delete data from database
app.delete("/deleteBuilding/:id", async (req, res) => {
	const id = req.params.id;

	try {
		const deleteBuilding = await BuildingData.findByIdAndRemove(id).exec();
		if (deleteBuilding) {
			if (deleteBuilding.buildingImage) {
				const imagePath = path.join(__dirname, deleteBuilding.buildingImage);
				fs.unlinkSync(imagePath);
			}
			res.status(200).send("Building Deleted Successfully");
		} else {
			res.status(404).send("Building Not Found");
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Failed to delete building from database");
	}
});

// -------- Lab Data Endpioints --------
// send data to database
app.post(
	"/readBuilding/:buildingId/addLab",
	upload.single("labImage"),
	async (req, res) => {
		const buildingId = req.params.buildingId;
		const newLab = req.body;
		const newLabImage = req.file ? req.file.path.replace("public", "") : "";

		try {
			const building = await BuildingData.findById(buildingId);
			if (!building) {
				res.status(404).send("Building not found");
				return;
			}

			newLab.labImage = newLabImage;

			building.labs.push(newLab);
			await building.save();

			res.status(200).send("Lab saved to database");
		} catch (err) {
			console.log(err);
			res.status(500).send("Failed to save lab to the database");
		}
	}
);

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
app.put(
	"/readBuilding/:buildingId/updateLab/:labId",
	upload.single("labImage"),
	async (req, res) => {
		const buildingId = req.params.buildingId;
		const labId = req.params.labId;
		const updateLab = req.body;
		const newLabImage = req.file ? req.file.path.replace("public", "") : "";

		try {
			const building = await BuildingData.findById(buildingId);
			if (!building) {
				res.status(404).send("Building not found");
				return;
			} else {
				const labToUpdate = building.labs.id(labId);
				if (!labToUpdate) {
					res.status(404).send("Lab not found in the building");
				} else {
					if (newLabImage) {
						if (labToUpdate.labImage) {
							fs.unlinkSync(labToUpdate.labImage);
						}
						labToUpdate.labImage = newLabImage;
					}
					labToUpdate.set(updateLab);
					await building.save();
					res.status(200).send("Lab updated successfully");
				}
			}
		} catch (err) {
			console.log(err);
			res.status(500).send("Failed to update lab in the database");
		}
	}
);

// delete data from database
app.delete("/readBuilding/:buildingId/deleteLab/:labId", async (req, res) => {
	const buildingId = req.params.buildingId;
	const labId = req.params.labId;
	try {
		const building = await BuildingData.findById(buildingId);
		if (!building) {
			res.status(404).send("Building not found");
			return;
		} else {
			const labToDelete = building.labs.id(labId);
			if (!labToDelete) {
				res.status(404).send("Lab not found in the building");
			} else {
				if (labToDelete.labImage) {
					fs.unlinkSync(labToDelete.labImage);
				}
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

// -------- PC's Data Endpioints --------
// send data to database
app.post("/readBuilding/:buildingId/readLab/:labId/addPC", async (req, res) => {
	const buildingId = req.params.buildingId;
	const labId = req.params.labId;
	const { pcName, pcStatus } = req.body;

	try {
		const building = await BuildingData.findById(buildingId);
		if (!building) {
			res.status(404).send("Building not found");
		} else {
			const lab = building.labs.id(labId);
			if (!lab) {
				res.status(404).send("Lab not found in the building");
			} else {
				lab.pcs.push({ pcName, pcStatus });
				await building.save();
				res.status(200).send("PC saved to database");
			}
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Failed to save PC to the database");
	}
});

// get data from database
app.get("/readBuilding/:buildingId/readLab/:labId/readPC", async (req, res) => {
	const buildingId = req.params.buildingId;
	const labId = req.params.labId;
	try {
		const building = await BuildingData.findById(buildingId);
		if (!building) {
			res.status(404).send("Building not found");
		} else {
			const lab = building.labs.id(labId);
			if (!lab) {
				res.status(404).send("Lab not found in the building");
			} else {
				const pcs = lab.pcs;
				res.status(200).json(pcs);
			}
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Failed to get PCs from the database");
	}
});

// edit data from database
app.put(
	"/readBuilding/:buildingId/readLab/:labId/updatePC/:pcId",
	async (req, res) => {
		const buildingId = req.params.buildingId;
		const labId = req.params.labId;
		const pcId = req.params.pcId;
		const { pcName, pcStatus } = req.body;
		try {
			const building = await BuildingData.findById(buildingId);
			if (!building) {
				res.status(404).send("Building not found");
			} else {
				const lab = building.labs.id(labId);
				if (!lab) {
					res.status(404).send("Lab not found in the building");
				} else {
					const pcToUpdate = lab.pcs.id(pcId);
					if (!pcToUpdate) {
						res.status(404).send("PC not found in the lab");
					} else {
						pcToUpdate.pcName = pcName;
						pcToUpdate.pcStatus = pcStatus;
						await building.save();
						res.status(200).send("PC updated successfully");
					}
				}
			}
		} catch (err) {
			console.log(err);
			res.status(500).send("Failed to update PC in the database");
		}
	}
);

// delete data from database
app.delete(
	"/readBuilding/:buildingId/readLab/:labId/deletePC/:pcId",
	async (req, res) => {
		const buildingId = req.params.buildingId;
		const labId = req.params.labId;
		const pcId = req.params.pcId;
		try {
			const building = await BuildingData.findById(buildingId);
			if (!building) {
				res.status(404).send("Building not found");
			} else {
				const lab = building.labs.id(labId);
				if (!lab) {
					res.status(404).send("Lab not found in the building");
				} else {
					const pcToDelete = lab.pcs.id(pcId);
					if (!pcToDelete) {
						res.status(404).send("PC not found in the lab");
					} else {
						pcToDelete.deleteOne();
						await building.save();
						res.status(200).send("PC deleted successfully");
					}
				}
			}
		} catch (err) {
			console.log(err);
			res.status(500).send("Failed to delete PC from the database");
		}
	}
);

app.use("/images", express.static(path.join(__dirname, "images")));

// listen to port 3001
app.listen(3001, () => {
	console.log("Server is running on port 3001");
});
