const async = require('async');
const merge = require('deepmerge');
const proc = require('child_process').spawn;
const emitter = require('events').EventEmitter;
const network = require('./networking.js');
const reporting = require('./reporting.js');
const validation = require('./validation.js');


class tools extends emitter {

  // Perform preliminary option/default object merge
  merge(defaults, obj) {
    return merge(defaults, obj);
  }


  // Defines new property for array's
  chunk(obj, offset) {
    let idx = 0;
    const alength = obj.length;
    const tarray = [];

    for (idx = 0; idx < alength; idx += offset) {
      tarray.push(obj.slice(idx, idx + offset).join(' '));
    }

    return tarray;
  }

  // Flattens nested arrays into one flat array
  flatten(arr, obj) {
    let value;
    const result = [];

    for (let i = 0, length = arr.length; i < length; i++) {

      value = arr[i];

      if (Array.isArray(value)) {
        return this.flatten(value, obj);
      }
      else {
        result.push(value);
      }
    }
    return result;
  }

  // create functions for use as callbacks
  funcs(opts) {
    const scope = this;
    const funcs = {};
    let cmd = false;
    const errors = [];
    const reports = [];

    if (opts.range.length <= 0)
      return "Range of hosts could not be created";

    Object.keys(opts.range).forEach(function blocks(block) {

      // Acquire an array of ranges
      const range = opts.range[block];

      // Create a new function for each range block
      funcs[range] = function block(callback) {
        const report = [];


        // Capture the flags, & ranges as a command string
        cmd = scope.command(opts, range);

        // Split up cmd for .spawn()
        const obj = cmd.split(" ");
        cmd = obj[0];
        const args = obj.slice(1);

        if (opts.verbose)
          console.log(`Running: ${cmd} ${args}`);

        // Push it on to the heap
        const execute = proc(cmd, args);

        // Discard stderr for now, maybe log?
        execute.stderr.on('data', (chunk) => {
          /* Silently discard stderr messages to not interupt scans */
        });

        // Push to array of reports
        execute.stdout.on('data', (chunk) => {
          report.push(chunk);
        });

        // Push report array to reporting function on stream end
        execute.stdout.on('end', () => {
          if (report.length > 0)
            return reporting.reports(opts, report, callback);
        });
      };
    });

    return funcs;
  }

  command(opts, block) {
    const flags = opts.flags.join(' ');
    const proto = (opts.udp) ? ' -sU' : ' ';
    const to = `--host-timeout=${opts.timeout}s `;
    const ipv6 = (validation.test(validation.patterns.IPv6, block)) ?
      ' -6 ' : ' ';

    return (opts.ports) ?
      `${opts.nmap+proto} ${to}${flags}${ipv6}-p${opts.ports} ${block}` :
      `${opts.nmap+proto} ${to}${flags}${ipv6}${block}`;
  }

  worker(obj, fn) {
    async.parallelLimit(obj.funcs, obj.threshold, fn);
  }

  init(defaults, opts, cb) {
    let funcs = [];

    /* Override 'defaults.flags' array with 'opts.flags' (prevents merge) */
    if (/array/.test(typeof opts.flags))
      defaults.flags = opts.flags;

    opts = this.merge(defaults, opts);

    /* Ensure we can always parse the report */
    if (opts.flags.indexOf('-oX -') === -1)
      opts.flags.push('-oX -');

    validation.init(opts, (err, result) => {
      if (err)
        return cb(err);

      opts.range = network.calculate(opts);
      funcs = this.funcs(opts);

      return cb(null, {
        opts,
        funcs
      });
    });
  }
}

module.exports = new tools;
