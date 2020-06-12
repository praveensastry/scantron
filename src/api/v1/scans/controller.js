const { prisma } = require("../../../config/database");
const { Worker } = require('worker_threads');

const getScansForHost = async (
    req,
    res,
    next
) => {
    try {
        const { hostIdentifier } = req.query;
        console.log(req.query);
        const scans = await prisma.scan.findMany({
            where: {
                Host: {
                    identifier: {
                        equals: hostIdentifier,
                    },
                },
            },
        });
        res.status(200).json(scans);
    } catch (error) {
        next(error);
    }
};

const createHostIfNotExist = (hostIdentifier) => {
    return prisma.host.upsert({
        where: { identifier: hostIdentifier },
        update: { identifier: hostIdentifier },
        create: { identifier: hostIdentifier },
    })
}

const createScanAndConnectToHost = (hostIdentifier) => {
    return prisma.scan.create({
        data: {
            Host: {
                connect: { identifier: hostIdentifier }
            }
        },
    })
}

const formatMapElements = (map) => {
    let res = {};
    map.forEach((val, key) => {
        res[key] = val;
    });
    return res;
}

const createScansForHosts = async (req, res, next) => {
    try {
        const hostScans = new Map();
        const { range } = req.body;
        await Promise.all(range.map(async (hostIdentifier) => {
            await createHostIfNotExist(hostIdentifier);
            const scan = await createScanAndConnectToHost(hostIdentifier);
            if (!scan.id) {
                throw new Error("Unable to create a scanid");
            }
            //return scan id's for each host in the request
            hostScans.set(hostIdentifier, scan.id)
        }));
    const workerData = {
        opts: {
            json: true,
            range: range
        },
        hostScans: hostScans,
    };

    new Worker('./src/workers/worker.js', { workerData });
    res.status(200).json({ scans: formatMapElements(hostScans) });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getScansForHost,
    createScansForHosts
}
