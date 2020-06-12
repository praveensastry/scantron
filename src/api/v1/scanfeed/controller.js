const { prisma } = require("../../../config/database");

const getFeed = async (
    _req,
    res,
    next
) => {
    try {
        const scans = await prisma.scan.findMany({
            include: {
                Host: true
            }
        });
        res.status(200).json(scans);
    } catch (error) {
        next(error);
    }
};

module.exports = { getFeed };