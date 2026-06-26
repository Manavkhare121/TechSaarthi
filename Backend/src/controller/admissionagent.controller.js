
import { getAgentResponse } from "../services/admissionagent.service.js";

export const predictAdmission = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const aiReply = await getAgentResponse(message);
        res.status(200).json({ response: aiReply });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};