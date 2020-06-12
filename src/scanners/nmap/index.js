const os = require('os');
const tools = require('./tools.js')

const nmap = function (options) {
    /**
     * @object defaults
     * Default set of options
     *
     * @param {String} nmap - Path to NMAP binary
     * @param {Boolean} verbose - Turn on verbosity during scan(s)
     * @param {String} ports - Range of ports to scan
     * @param {Array} range - An array of hostnames/ipv4/ipv6, CIDR or ranges
     * @param {Number} timeout - Number of seconds to wait for host/port response
     * @param {Number} blocksize - Number of hosts per network scanning block
     * @param {Number} threshold - Max number of  spawned process
     * @param {Array} flags - Array of flags for .spawn()
     * @param {Boolean} udp - Perform a scan using the UDP protocol
     * @param {Boolean} json - JSON object as output, false produces XML
     */
    const defaults = {
        nmap: 'nmap',
        verbose: false,
        ports: '1-1024',
        range: [],
        timeout: 60,
        blocksize: 16,
        threshold: os.cpus().length * 4,
        flags: [
            '-T4',    // Scan optimization is default
        ],
        udp: false,
        json: true
    };

    /**
     * @function scan
     * Performs scan of specified host/port combination
     *
     * @param {Object} obj User supplied options
     */
    nmap.prototype.scan = (obj) => {
        return new Promise((resolve, reject) => {
            let opts = {};

            tools.init(defaults, obj, (err, settings) => {
                if (err) {
                    reject(err);
                }

                opts = settings.opts;
                opts.funcs = settings.funcs;

                tools.worker(opts, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        });
    }

};

module.exports = new nmap();
