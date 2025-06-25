// Add to routes
import rateLimit from "express-rate-limit";

const signatureLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: "Too many signature attempts"
});

router.post("/submit-signature", signatureLimiter, verifySignature, submitSignature);