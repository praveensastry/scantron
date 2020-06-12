const { prisma } = require("../../../config/database");

const getFeed = async (
    _req,
    res,
    next
) => {
    try {
        const hosts = await prisma.host.findMany({
            include: {
                scans: true
            }
        })
        res.status(200).json(hosts);
    } catch (error) {
        next(error);
    }
};

module.exports = { getFeed }