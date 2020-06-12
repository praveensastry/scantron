const { workerData: { opts, hostScans } } = require('worker_threads');
console.log(hostScans);
const nmap = require('../scanners/nmap');
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

const fetchScanResults = async () => {
    try {
        const data = await nmap.scan(opts);
        const hosts = Object.keys(data);
        hosts.forEach(async (hostIdentifier) => {
            console.log("map", hostScans);
            console.log("host identifier:", hostIdentifier);
            console.log("scanId", hostScans.get(hostIdentifier));
            await prisma.host.update({
                where: {
                    identifier: hostIdentifier,
                },
                data: {
                    scans: {
                        update: [
                            {
                                data: {
                                    completed: true,
                                    scanner: data[hostIdentifier].item.scanner,
                                    version: data[hostIdentifier].item.version,
                                    command: data[hostIdentifier].item.args,
                                    portSummary: JSON.stringify(data[hostIdentifier].host[0].ports[0].port),
                                    scanSummary: data[hostIdentifier].runstats[0].finished[0].item.summary
                                },
                                where: {
                                    // get scan id fof this host 
                                    id: hostScans.get(hostIdentifier) 
                                },
                            }
                        ],
                    },
                },
            })
        });
        console.log(`worker: Scan completed`);
    } catch (error) {
        console.log(error);
    }
};

(async () => {
    console.log(`worker: Scan in progress`);
    await fetchScanResults();
})();

