import jwt from "jsonwebtoken"
const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        token = token.split(" ")[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = payload; 
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};


const restrictToPortfolioOwner = (req, res, next) => {    
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({ message: "Only Admin has this access" });
};

export {
    verifyToken,
    restrictToPortfolioOwner
};