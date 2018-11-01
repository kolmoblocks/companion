// parse deserializes network trace files in NetVis format

NetVis.prototype.parse = function(srcJSON) {
	// jsonAdapter loads JSON in NetVis format   

	if (typeof(srcJSON) !== 'object') {
		return 'srcJSON needs to be a JSON object';
	}

	for (var i=0; i< srcJSON.length; i++) {
		if (typeof(srcJSON[i]) !== 'object') {
			console.log("failing to parse event:",srcJSON[i]);
			continue;
		}

		switch (srcJSON[i].event) {
			case "messageSent":
				this._parseMessageSent(srcJSON[i]);
				break;
			default:
				console.log("Event type ",srcJSON[i].event, " not supported");
		}

	}

	this.updateAll();
};
