/*
 * index.ts
 *
 * This program will implement a simple REST API listener.
 *
 * The REST API will support eventual requests to the database to provide information back to 
 * the caller, for use in future solutions like visualizations and data analytics.
 */



// TODO: add in imports 
import pg from 'pg';
import express, { Request, Response, response } from 'express';
import fs from 'fs';
import { error } from 'console';


// TODO: add in function to perform the response work 



/*
 * main()
 *
 * This function will provide a microservice to support MQTT subscriptions and processing
 * to insert data into a PostGreSQL database
 *
 * The table will be the "telemetry" table as per TypeScript course demonstrations.
 */

async function main() {
	try {
		let s: string = await fs.readFileSync('./config.json', 'utf-8');
		let config = JSON.parse(s);
		const dbClient = new pg.Client(config.sql_config);
		await dbClient.connect();
		
		console.log("RESTAPI starting");

		const app: express.Application = express();


		// TODO: inform express to use JSON
		app.use(express.json());

		app.get(config.express.route, async (req: Request, res: Response) => {
			let { device, metric } = req.params;
			let { tstart, tend } = req.query;
			// console.log(req.params);
			if (tstart == undefined) {
				tstart = new Date(Date.now() - 1000).toISOString();
			};
			if (tend == undefined) { tend = new Date(Date.now()).toISOString() };
			if (typeof metric === 'string' && typeof tstart === 'string' && typeof tend === 'string') {
				queryData(dbClient, res, device, metric, tstart, tend);
			}
			else {
				res.status(400).json({
					error: 'Invalid query parameters'
				});
			}

		});

		app.listen(config.express.port, () => {
			console.log("hello");
		})

		const shutdown = async () => {
			// TODO: shut down mqtt client
			await dbClient.end();

			process.exit(0);
		}

		process.on('SIGINT', shutdown);
		process.on('SIGTERM', shutdown);

	}

	catch (err) {
		console.log("Error: " + err);
	}


	// TODO: add in HTTP listener request

	console.log("set up port listener");


	console.log("RESTAPI ending");
}

async function queryData(d: pg.Client, r: Response, dev: string, m: string, s: string, e: string) {
	try {
		let sql_command: string = `SELECT * FROM telemetry WHERE deviceid='${dev}' AND metric = '${m}' AND timestamp BETWEEN '${s}' AND '${e}'; `;
		console.log(sql_command);
		let res = d.query(sql_command);
		r.json((await res).rows);
		


	} catch (error) {
		console.error("error building timestable data: ", error);
		response.status(500).json({
			error: 'internal server error'
		});
	}
}




main();