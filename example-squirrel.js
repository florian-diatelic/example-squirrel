
new Promise(callUncertifiedAssociation)
		.then(() => console.log("Association OK"))
		.then(createCSR)
		.then(() => console.log("==> Calling PKI"))
		.then(callPKI)
		.then(() => console.log("PKI OK"));

function callPKI() {
	return new Promise((resolve, reject) => {
		const csr = fs.readFileSync('openssl/local2.csr', 'utf8');
		const data = {
			"user": certificateInfo.login,
			"password": certificateInfo.password,
			"pkcs10req": csr,
			"resulttype": 1
		};
		// form data
		const postData = querystring.stringify(data);
// request option
		const options = {
			host: "webservicepki.pharmagest.com",
			port: 443,
			method: 'POST',
			path: "/ejbca/certreq",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length
			}
		};

// request object
		var req = https.request(options, function (res) {
			var result = '';
			res.on('data', function (chunk) {
				if (displayResponse) {
					console.log(chunk.toString());
				}
				fs.writeFileSync("openssl/cert.crt", chunk.toString());
				resolve(chunk.toString());
			});
			res.on('end', function () {
				if (result) {
					console.log("end : " + result);
				}
			});
			res.on('error', function (err) {
				reject(err);
			});
		});

// req error
		req.on('error', function (err) {
			reject(err);
		});
//send request with the postData form
		req.write(postData);
		req.end();
	});
}
