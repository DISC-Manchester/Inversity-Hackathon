// nodejs defaults
const http = require("http");
const process = require("process");

// npm packages
const {AzureOpenAI} = require("openai");

// environment variables, obviously don't share these
const env_endpoint = process.env["AZOAI_ENDPOINT"];
const env_apikey   = process.env["AZOAI_KEY"];
// const env_apikey = process.env["OAI_KEY"];

// this is for checking if required environment parameters for (AOAI) Azure OpenAI exist
if(!env_endpoint || !env_apikey) {
	console.log("you need to define the api key or endpoint using AZOAI_ENDPOINT or AZOAI_KEY");
	process.exit(1);
}

// initialize our AOAI (Azure OpenAI) client, probably should not hardcode apiver or deployment (model).
const oaiclient = new AzureOpenAI({
	"endpoint": env_endpoint,
	"apiKey": env_apikey,
	"apiVersion": "2024-08-01-preview",
	"deployment": "gpt-4o"
});

// if you don't use AOAI, use the following for stock OAI,
// or follow the implementation for your favorite OAI-compatible service.
/*
const oaiclient = new OpenAI({
	"apiKey": env_apikey,
	...openAiOptions
});
*/

// spin a web server, make it async because I want awaits
http.createServer(async function(req, res) {
	// validate the url, ignoring the prefix or query parameter suffix
	const thisUrl = new URL("http://localhost" + req.url);
	// check if this is the endpoint (I do not care about functional URL routing.)
	if(thisUrl.pathname === "/api/v1/questions") {
		// 200 = OK, default because if nothing is wrong why change it?
		var statusNumber = 200;
		// prototype of this object is null to prevent possible jank
		var response = {"__proto__": null, "status": null, "result": null};
		if(!thisUrl.searchParams.has("q")) {
			// no query parameter, fail instantly
			statusNumber = 500;
			response.status = "failed";
			response.result = "No query.";
		} else {
			// nothing wrong, assume success?
			response.status = "success";
			const queries = thisUrl.searchParams.getAll("q");
			// completions is an array of completion objects generated by the AOAI client
			const completions = [];
			for(let query of queries) {
				// just send requests for each query, because there's no normal batch request method
				completions.push(await oaiclient.chat.completions.create({"messages":
					[{"role": "user", "content": query}]
				}));
			}
			// result is an array of strings
			response.result = [];
			for (let completion of completions) {
				// ... or whatever the type of content is
				response.result.push(completion.choices[0].message.content);
			}

			if(!completions[0].choices[0]?.message?.content) {
				// if there was an error with AOAI, use Service Unavaliable
				response.status = "failed";
				statusNumber = 503;
				response.result = "No response from partner.";
			}
		}
		// response setup, also I do not care about the ACAO, if you do, use a reverse proxy ;D
		res.writeHead(statusNumber, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
		res.write(JSON.stringify(response));
	} else {
		// If we have nothing to send, especially favicon.ico, just 404 it
		res.writeHead(404);
	}
	res.end();
// listen on *all* interfaces on TCP port 8080
}).listen(8080);