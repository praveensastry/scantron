const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    log: ['error'],
});

app.get('/hostfeed', async (_, res) => {
    const hosts = await prisma.host.findMany({
        include: {
            scans: true
        }
    })
    res.json(hosts)
})

app.get('/scanfeed', async (_, res) => {
    const scans = await prisma.scan.findMany({
        include: {
            Host: true
        }
    })
    res.json(scans)
})

app.post('/scan', async (req, res) => {
    const { range } = req.body
    if (!isvalidHostRange(range)) {
        res.status(422).json({ error: "Invalid Host range. Range must be valid host / IP Address/ IP Range" });
    } else {
        try {
            const hostScans = new Map();
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
            res.json({ scans: formatMapElements(hostScans) });
        } catch (error) {
            console.trace(error);
            res.status(500).json({
                error: "Error initializing scans for given hosts"
            })
        }
    }
});

