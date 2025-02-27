module.exports = {
    check: (req, res, next) => {
        const authHeader = req.headers['authoraization'];

        if(!authHeader) {
            return res.status(401).json({
                status: false,
                error: {
                    message: "Unauthorized access"
                }
            })
        }
    }
}