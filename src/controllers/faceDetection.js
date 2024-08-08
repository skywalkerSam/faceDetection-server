// Image Route Handlers
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";
import dotenv from "dotenv";
dotenv.config();

const PAT = process.env.PAT;
const USER_ID = process.env.USER_ID;
const APP_ID = process.env.APP_ID;
const MODEL_ID = process.env.MODEL_ID;
const MODEL_VERSION_ID = process.env.MODEL_VERSION_ID;

export const detectFace = (req, res) => {
    // Clarifai API: gRPC 
    const IMAGE_URL = req.body.input;
    console.log("\n...Incoming Request: " + IMAGE_URL + "\n")
    const stub = ClarifaiStub.grpc();

    // This will be used by every Clarifai endpoint call
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                // console.log(IMAGE_URL)
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here
            const output = response.outputs[0].data.regions[0].region_info.bounding_box

            // console.log("Predicted concepts:");
            // for (const concept of output.data.concepts) {
            //     console.log(concept.name + " " + concept.value);
            // }
            // console.log(output)
            return res.json(output)
        }

    );
}
