const cidrjs = require('cidr-js');
const validation = require('./validation.js');

const cidr = new cidrjs();


class network {
  range(opts, host) {

    const tools = require('./tools.js');

    const blocks = cidr.list(host);
    let splitat = Math.round(blocks.length / opts.blocksize);

    const results = [];
    let tarray = [];

    // Make sure we account for valid subnet ranges
    splitat = (splitat > 256) ? Math.round(splitat / 255) : splitat;

    if (splitat > 1) {

      // Split blocks up by offset
      tarray = tools.chunk(blocks, splitat);
      tarray.forEach(block => {
        results.push(block);
      });
    } else {
      results.push(blocks.join(' '));
    }

    return results;
  }

  calculate(opts) {
    const tools = require('./tools.js');
    const blocks = [];

    let results = [];

    const tresults = [];
    const tests = validation.patterns;

    opts.range.forEach(host => {

      switch (true) {

        /* singular IPv4, IPv6 or RFC-1123 hostname */
        case (validation.test(tests.hostname, host) ||
              validation.test(tests.IPv4, host) ||
              validation.test(tests.IPv6, host)):

          results.push(host);

          break;

        /* IPv4 CIDR notation; break up into chunks for parallel processing */
        case (validation.test(tests.IPv4CIDR, host)):

          tresults.push(this.range(opts, host));

          break;

        /* IPv4 range notation */
        case (validation.test(tests.IPv4Range, host)):

          results.push(host);

          break;

        case (validation.test(tests.IPv6CIDR, host)):
            
          /* Add IPv6 calculations to assist with parallel processing */
          results.push(host);

          break;

        default:

          /* Silently discard specified element as invalid */
          break;
      }
    });

    if (tresults.length > 0) {
      results = tools.merge(results, tresults[0])
    }

    return results;
  }
}


module.exports = new network;
