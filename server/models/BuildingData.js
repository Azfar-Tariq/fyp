const mongoose = require("mongoose");

const BuildingDataSchema = new mongoose.Schema({
	buildingName: {
		type: String,
		required: true,
	},
});

const BuildingData = mongoose.model("BuildingData", BuildingDataSchema);
module.exports = BuildingData;
