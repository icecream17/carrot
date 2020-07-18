// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/enums/ConnectionType.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectionType = void 0;
/**
 * The type of a connection.
 */

var ConnectionType;

(function (ConnectionType) {
  /**
   * No connection used for exceptions.
   */
  ConnectionType[ConnectionType["NO_CONNECTION"] = 0] = "NO_CONNECTION";
  /**
   * Connect all input to all output nodes
   */

  ConnectionType[ConnectionType["ALL_TO_ALL"] = 1] = "ALL_TO_ALL";
  /**
   * Connect one input to one output node
   */

  ConnectionType[ConnectionType["ONE_TO_ONE"] = 2] = "ONE_TO_ONE";
  /**
   * Connect with pooling
   */

  ConnectionType[ConnectionType["POOLING"] = 3] = "POOLING";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
},{}],"../src/enums/NodeType.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoiseNodeType = exports.PoolNodeType = exports.NodeType = void 0;
/**
 * The type of node.
 */

var NodeType;

(function (NodeType) {
  /**
   * Node is an input node.
   */
  NodeType[NodeType["INPUT"] = 0] = "INPUT";
  /**
   * Node is a hidden node.
   */

  NodeType[NodeType["HIDDEN"] = 1] = "HIDDEN";
  /**
   * Node is a output node.
   */

  NodeType[NodeType["OUTPUT"] = 2] = "OUTPUT";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
/**
 * The type of pool node.
 */


var PoolNodeType;

(function (PoolNodeType) {
  /**
   * Maximum pooling node.
   */
  PoolNodeType[PoolNodeType["MAX_POOLING"] = 0] = "MAX_POOLING";
  /**
   * Average pooling node.
   */

  PoolNodeType[PoolNodeType["AVG_POOLING"] = 1] = "AVG_POOLING";
  /**
   * Minimum pooling node.
   */

  PoolNodeType[PoolNodeType["MIN_POOLING"] = 2] = "MIN_POOLING";
})(PoolNodeType = exports.PoolNodeType || (exports.PoolNodeType = {}));
/**
 * The type of noise node.
 */


var NoiseNodeType;

(function (NoiseNodeType) {
  /**
   * Gaussian noise node
   */
  NoiseNodeType[NoiseNodeType["GAUSSIAN_NOISE"] = 0] = "GAUSSIAN_NOISE";
})(NoiseNodeType = exports.NoiseNodeType || (exports.NoiseNodeType = {}));
},{}],"../src/utils/Utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pairing = exports.generateGaussian = exports.avg = exports.sum = exports.min = exports.minValueIndex = exports.maxValueIndex = exports.max = exports.shuffle = exports.removeFromArray = exports.randBoolean = exports.randDouble = exports.randInt = exports.pickRandom = void 0;
/**
 * Returns an random element from the given array.
 *
 * @param arr the array to pick from
 * @returns the random picked element
 */

function pickRandom(arr) {
  if (Array.isArray(arr)) {
    if (arr.length === 0) {
      throw new RangeError("Cannot pick from an empty array");
    }

    return arr[randInt(0, arr.length)];
  } else {
    return pickRandom(Array.from(arr));
  }
}

exports.pickRandom = pickRandom;
/**
 * Returns a random integer in the range [min,max)
 *
 * @param min bound
 * @param max bound
 * @returns random integer in [min,max)
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

exports.randInt = randInt;
/**
 * Returns a random double in the range [min,max)
 *
 * @param min bound
 * @param max bound
 * @returns random double in [min,max)
 */

function randDouble(min, max) {
  return Math.random() * (max - min) + min;
}

exports.randDouble = randDouble;
/**
 * Returns a random boolean
 *
 * @returns random boolean
 */

function randBoolean() {
  return Math.random() >= 0.5;
}

exports.randBoolean = randBoolean;
/**
 * Removes an element from an array.
 *
 * @param arr the array
 * @param elem the element which will be removed
 * @returns false -> element does not exists on array; true -> element removed from array
 */

function removeFromArray(arr, elem) {
  const index = arr.indexOf(elem);

  if (index === -1) {
    return false;
  } else {
    arr.splice(index, 1);
    return true;
  }
}

exports.removeFromArray = removeFromArray;
/**
 * Shuffles an array
 * @param array the array
 * @returns the shuffled array
 */

function shuffle(array) {
  // While there are elements in the array
  for (let counter = array.length - 1; counter > 0; counter--) {
    // Pick a random index
    const index = randInt(0, counter); // And swap the last element with it

    const temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
}

exports.shuffle = shuffle;
/**
 * Finds the maximum value of an number array
 *
 * @param array
 */

function max(array) {
  if (array.length === 0) {
    throw new RangeError();
  }

  let maxValue = array[0];

  for (let i = 1; i < array.length; i++) {
    if (array[i] > maxValue) {
      maxValue = array[i];
    }
  }

  return maxValue;
}

exports.max = max;
/**
 * Finds the maximum value index of an number array
 *
 * @param array
 */

function maxValueIndex(array) {
  if (array.length === 0) {
    throw new RangeError();
  }

  let maxValue = array[0];
  let maxValueIndex = 0;

  for (let i = 1; i < array.length; i++) {
    if (array[i] > maxValue) {
      maxValue = array[i];
      maxValueIndex = i;
    }
  }

  return maxValueIndex;
}

exports.maxValueIndex = maxValueIndex;
/**
 * Finds the minimum value index of an number array
 *
 * @param array
 */

function minValueIndex(array) {
  if (array.length === 0) {
    throw new RangeError();
  }

  let minValue = array[0];
  let minValueIndex = 0;

  for (let i = 1; i < array.length; i++) {
    if (array[i] < minValue) {
      minValue = array[i];
      minValueIndex = i;
    }
  }

  return minValueIndex;
}

exports.minValueIndex = minValueIndex;
/**
 * Finds the minimum value of an number array
 *
 * @param array
 */

function min(array) {
  if (array.length === 0) {
    throw new RangeError();
  }

  let minValue = array[0];

  for (let i = 1; i < array.length; i++) {
    if (array[i] < minValue) {
      minValue = array[i];
    }
  }

  return minValue;
}

exports.min = min;
/**
 * Calculates the average value of an array
 *
 * @param array
 */

function avg(array) {
  return sum(array) / array.length;
}

exports.avg = avg;
/**
 * Calculates the sum of all values of an array
 *
 * @param array
 */

function sum(array) {
  if (array.length === 0) {
    throw new RangeError();
  }

  let sum = 0;

  for (const value of array) {
    sum += value;
  }

  return sum;
}

exports.sum = sum;
/**
 * Generates a random number with the gaussian distribution.
 *
 * @see https://en.wikipedia.org/wiki/Normal_distribution
 *
 * @param mean the mean value
 * @param deviation the standard deviation
 */

function generateGaussian(mean = 0, deviation = 2) {
  let sum = 0;
  const numSamples = 10;

  for (let i = 0; i < numSamples; i++) {
    sum += Math.random();
  }

  return deviation * sum / numSamples + mean - 0.5 * deviation;
}

exports.generateGaussian = generateGaussian;
/**
 * Pairing two numbers
 *
 * @see {@link https://en.wikipedia.org/wiki/Pairing_function (Cantor pairing function)|Pairing function (Cantor pairing function)}
 *
 * @param a - A [natural number](https://en.wikipedia.org/wiki/Natural_number), which is an integer greater than or equal to zero
 * @param b - A [natural number](https://en.wikipedia.org/wiki/Natural_number), which is an integer greater than or equal to zero
 *
 * @return An Integer that uniquely represents a pair of Integers
 */

function pairing(a, b) {
  return 1 / 2 * (a + b) * (a + b + 1) + b;
}

exports.pairing = pairing;
},{}],"../src/methods/Mutation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwapNodesMutation = exports.SubBackConnectionMutation = exports.AddBackConnectionMutation = exports.SubSelfConnectionMutation = exports.AddSelfConnectionMutation = exports.SubGateMutation = exports.AddGateMutation = exports.ModActivationMutation = exports.ModBiasMutation = exports.ModWeightMutation = exports.SubConnectionMutation = exports.AddConnectionMutation = exports.SubNodeMutation = exports.AddNodeMutation = exports.Mutation = exports.ONLY_STRUCTURE = exports.NO_STRUCTURE_MUTATIONS = exports.FEEDFORWARD_MUTATIONS = exports.ALL_MUTATIONS = void 0;

const Node_1 = require("../architecture/Node");

const NodeType_1 = require("../enums/NodeType");

const Utils_1 = require("../utils/Utils");
/**
 *
 * Genetic algorithm mutation methods. Creates variations (mutations) in neural networks which are then selected for better performance.
 *
 * @see {@link https://en.wikipedia.org/wiki/mutation_(genetic_algorithm)|Mutation (genetic algorithms) on Wikipedia}
 * @see {@link https://en.wikipedia.org/wiki/Genetic_algorithm#Selection|Selection (genetic algorithms) on Wikipedia}
 */


class Mutation {}

exports.Mutation = Mutation;
/**
 * Add node mutation.
 *
 * Adds a hidden node to the network.
 */

class AddNodeMutation extends Mutation {
  /**
   * Constructs a AddNodeMutation object
   * @param randomActivation Should choose a random activation for a new node?
   */
  constructor(randomActivation = true) {
    super();
    this.randomActivation = randomActivation;
  }
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   * @param options
   */


  mutate(network, options = {}) {
    // check if max nodes is already reached
    if (options.maxNodes !== undefined && network.nodes.length >= options.maxNodes) {
      return;
    } // create a new hidden node


    const node = new Node_1.Node(NodeType_1.NodeType.HIDDEN);

    if (this.randomActivation) {
      node.mutateActivation(); // choose random activation
    } // take a random connection


    const connection = Utils_1.pickRandom(Array.from(network.connections));
    const from = connection.from;
    const to = connection.to;
    network.disconnect(from, to); // disconnect it
    // put the node in between the connection

    const minBound = Math.max(network.inputSize, 1 + network.nodes.indexOf(from));
    network.nodes.splice(minBound, 0, node);
    const newConnection1 = network.connect(from, node, 1);
    const newConnection2 = network.connect(node, to, connection.weight);

    if (connection.gateNode != null) {
      // if connection had a gate node
      // choose randomly which new connection should get this gate node
      if (Utils_1.randBoolean()) {
        network.addGate(connection.gateNode, newConnection1);
      } else {
        network.addGate(connection.gateNode, newConnection2);
      }
    }
  }

}

exports.AddNodeMutation = AddNodeMutation;
/**
 * Sub node mutation.
 *
 * Removes a random node from the network.
 */

class SubNodeMutation extends Mutation {
  constructor(keepGates = true) {
    super();
    this.keepGates = keepGates;
  }
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   */


  mutate(network) {
    const possible = network.nodes.filter(node => node !== undefined && node.isHiddenNode()); // hidden nodes

    if (possible.length > 0) {
      network.removeNode(Utils_1.pickRandom(possible), this.keepGates); // remove a random node from the filtered array
    }
  }

}

exports.SubNodeMutation = SubNodeMutation;
/**
 * Add connections mutation.
 *
 * Adds a connection to the network.
 */

class AddConnectionMutation extends Mutation {
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   * @param options
   */
  mutate(network, options = {}) {
    // check if max connections is already reached
    if (options.maxConnections !== undefined && network.connections.size >= options.maxConnections) {
      return;
    }

    const possible = [];

    for (let i = 0; i < network.nodes.length - network.outputSize; i++) {
      const from = network.nodes[i];

      for (let j = Math.max(i + 1, network.inputSize); j < network.nodes.length; j++) {
        const to = network.nodes[j];

        if (!from.isProjectingTo(to)) {
          possible.push([from, to]);
        }
      }
    }

    if (possible.length > 0) {
      const pair = Utils_1.pickRandom(possible);
      network.connect(pair[0], pair[1]);
    }
  }

}

exports.AddConnectionMutation = AddConnectionMutation;
/**
 * Sub connection mutation.
 *
 * Removes a random connection from the network.
 */

class SubConnectionMutation extends Mutation {
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   */
  mutate(network) {
    const possible = Array.from(network.connections).filter(conn => conn.from.outgoing.size > 1) // do not deactivate a neuron
    .filter(conn => conn.to.incoming.size > 1) // do not deactivate a neuron
    .filter(conn => network.nodes.indexOf(conn.to) > network.nodes.indexOf(conn.from)); // look for forward pointing connections

    if (possible.length > 0) {
      const randomConnection = Utils_1.pickRandom(possible); // pick a random connection from the filtered array

      network.disconnect(randomConnection.from, randomConnection.to); // remove the connection from the network
    }
  }

}

exports.SubConnectionMutation = SubConnectionMutation;
/**
 * Mod weight mutation.
 *
 * Modifies the weight of a random connection.
 */

class ModWeightMutation extends Mutation {
  /**
   * Constructs a ModWeightMutation object
   * @param min The minimum weight.
   * @param max The maximum weight.
   */
  constructor(min = -1, max = 1) {
    super();
    this.min = min;
    this.max = max;
  }
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   */


  mutate(network) {
    // pick random connection and mutate it's weight
    Utils_1.pickRandom(Array.from(network.connections)).weight += Utils_1.randDouble(this.min, this.max);
  }

}

exports.ModWeightMutation = ModWeightMutation;
/**
 * Mod bias mutation.
 *
 * Modifies the bias value of a random hidden or output node
 */

class ModBiasMutation extends Mutation {
  /**
   * Constructs a ModBiasMutation object
   * @param min The minimum bias.
   * @param max The maximum bias.
   */
  constructor(min = -1, max = 1) {
    super();
    this.min = min;
    this.max = max;
  }
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   */


  mutate(network) {
    Utils_1.pickRandom(network.nodes.filter(node => !node.isInputNode())) // pick random hidden or output node
    .mutateBias(this); // mutate it's bias
  }

}

exports.ModBiasMutation = ModBiasMutation;
/**
 * Mod activation mutation.
 *
 * Modifies the activation function of a random node
 */

class ModActivationMutation extends Mutation {
  /**
   * Constructs a ModActivationMutation object
   * @param mutateOutput Can the output be mutated?
   */
  constructor(mutateOutput = false) {
    super();
    this.mutateOutput = mutateOutput;
  }
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   * @param options
   */


  mutate(network, options = {}) {
    const possible = this.mutateOutput ? network.nodes.filter(node => !node.isInputNode()) // hidden and output nodes
    : network.nodes.filter(node => node.isHiddenNode()); // hidden nodes

    if (possible.length > 0) {
      Utils_1.pickRandom(possible).mutateActivation(options.allowedActivations); // mutate the activation of the node
    }
  }

}

exports.ModActivationMutation = ModActivationMutation;
/**
 * Add self connection.
 *
 * Adds a connection from a node to itself.
 */

class AddSelfConnectionMutation extends Mutation {
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   */
  mutate(network) {
    const possible = network.nodes.filter(node => !node.isInputNode()) // no input nodes
    .filter(node => node.selfConnection.weight === 0); // only nodes that doesn't have an self connection already

    if (possible.length > 0) {
      const node = Utils_1.pickRandom(possible); // pick a random node from the filtered array

      network.connect(node, node); // connection the node to itself
    }
  }

}

exports.AddSelfConnectionMutation = AddSelfConnectionMutation;
/**
 * Sub self connection.
 *
 * Removes a connection from a node to itself.
 */

class SubSelfConnectionMutation extends Mutation {
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   */
  mutate(network) {
    const possible = Array.from(network.connections).filter(conn => conn.from === conn.to);

    if (possible.length > 0) {
      const randomConnection = Utils_1.pickRandom(possible);
      network.disconnect(randomConnection.from, randomConnection.to);
    }
  }

}

exports.SubSelfConnectionMutation = SubSelfConnectionMutation;
/**
 * Add gate mutation.
 *
 * Adds a gate to the network.
 */

class AddGateMutation extends Mutation {
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   * @param options
   */
  mutate(network, options = {}) {
    // check if max gates isn't reached already
    if (options.maxGates !== undefined && network.gates.size >= options.maxGates) {
      return;
    } // use only connections that aren't already gated


    const possible = Array.from(network.connections).filter(conn => conn.gateNode === null);

    if (possible.length > 0) {
      const node = Utils_1.pickRandom(network.nodes.filter(node => !node.isInputNode())); // hidden or output node

      const connection = Utils_1.pickRandom(possible); // random connection from filtered array

      network.addGate(node, connection); // use the node to gate the connection
    }
  }

}

exports.AddGateMutation = AddGateMutation;
/**
 * Sub gate mutation.
 *
 * Removes a gate from the network.
 */

class SubGateMutation extends Mutation {
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   */
  mutate(network) {
    if (network.gates.size > 0) {
      network.removeGate(Utils_1.pickRandom(Array.from(network.gates)));
    }
  }

}

exports.SubGateMutation = SubGateMutation;
/**
 * Add back connection mutation.
 *
 * Adds a backward pointing connection to the network.
 */

class AddBackConnectionMutation extends Mutation {
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   */
  mutate(network) {
    const possible = [];

    for (let i = network.inputSize; i < network.nodes.length; i++) {
      const from = network.nodes[i];

      for (let j = network.inputSize; j < i; j++) {
        const to = network.nodes[j];

        if (!from.isProjectingTo(to)) {
          possible.push([from, to]);
        }
      }
    }

    if (possible.length > 0) {
      const pair = Utils_1.pickRandom(possible);
      network.connect(pair[0], pair[1]);
    }
  }

}

exports.AddBackConnectionMutation = AddBackConnectionMutation;
/**
 * Sub back connection mutation.
 *
 * Removes a backward pointing connection to the network.
 */

class SubBackConnectionMutation extends Mutation {
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   */
  mutate(network) {
    const possible = Array.from(network.connections).filter(conn => conn.from.outgoing.size > 1).filter(conn => conn.to.incoming.size > 1).filter(conn => network.nodes.indexOf(conn.from) > network.nodes.indexOf(conn.to));

    if (possible.length > 0) {
      const randomConnection = Utils_1.pickRandom(possible);
      network.disconnect(randomConnection.from, randomConnection.to);
    }
  }

}

exports.SubBackConnectionMutation = SubBackConnectionMutation;
/**
 * Swap nodes mutation.
 *
 * Swaps the values of two randomly picked nodes.
 */

class SwapNodesMutation extends Mutation {
  /**
   * Constructs a SwapNodeMutation object
   * @param mutateOutput Can the output be mutated?
   */
  constructor(mutateOutput = false) {
    super();
    this.mutateOutput = mutateOutput;
  }
  /**
   * Mutates the network.
   *
   * @param network The network which gets mutated
   */


  mutate(network) {
    const possible = this.mutateOutput ? network.nodes.filter(node => node !== undefined && !node.isInputNode()) // hidden or output nodes
    : network.nodes.filter(node => node !== undefined && node.isHiddenNode()); // only hidden nodes

    if (possible.length >= 2) {
      // select two different nodes from the filtered array
      const node1 = Utils_1.pickRandom(possible);
      const node2 = Utils_1.pickRandom(possible.filter(node => node !== node1)); // change there parameters

      const biasTemp = node1.bias;
      const squashTemp = node1.squash;
      node1.bias = node2.bias;
      node1.squash = node2.squash;
      node2.bias = biasTemp;
      node2.squash = squashTemp;
    }
  }

}

exports.SwapNodesMutation = SwapNodesMutation;
/**
 * Array of all mutation methods
 */

const ALL_MUTATIONS = [new AddNodeMutation(), new SubNodeMutation(), new AddConnectionMutation(), new SubConnectionMutation(), new ModWeightMutation(), new ModBiasMutation(), new ModActivationMutation(), new AddGateMutation(), new SubGateMutation(), new AddSelfConnectionMutation(), new SubSelfConnectionMutation(), new AddBackConnectionMutation(), new SubBackConnectionMutation(), new SwapNodesMutation()];
exports.ALL_MUTATIONS = ALL_MUTATIONS;
/**
 * Array of all feed forward mutation methods
 */

const FEEDFORWARD_MUTATIONS = [new AddNodeMutation(), new SubNodeMutation(), new AddConnectionMutation(), new SubConnectionMutation(), new ModWeightMutation(), new ModBiasMutation(), new ModActivationMutation(), new SwapNodesMutation()];
exports.FEEDFORWARD_MUTATIONS = FEEDFORWARD_MUTATIONS;
const NO_STRUCTURE_MUTATIONS = [new ModWeightMutation(), new ModBiasMutation(), new ModActivationMutation()];
exports.NO_STRUCTURE_MUTATIONS = NO_STRUCTURE_MUTATIONS;
const ONLY_STRUCTURE = [new AddNodeMutation(), new SubNodeMutation(), new AddConnectionMutation(), new SubConnectionMutation(), new AddGateMutation(), new SubGateMutation(), new AddSelfConnectionMutation(), new SubSelfConnectionMutation(), new AddBackConnectionMutation(), new SubBackConnectionMutation(), new SwapNodesMutation()];
exports.ONLY_STRUCTURE = ONLY_STRUCTURE;
},{"../architecture/Node":"../src/architecture/Node.js","../enums/NodeType":"../src/enums/NodeType.js","../utils/Utils":"../src/utils/Utils.js"}],"../src/architecture/Connection.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Connection = void 0;

const Utils_1 = require("../utils/Utils");
/**
 * A connection instance describes the connection between two nodes.
 */


class Connection {
  constructor(from, to, weight, gateNode) {
    this.from = from;
    this.to = to;
    this.weight = weight !== null && weight !== void 0 ? weight : 0;
    this.gain = 1;
    this.eligibility = 0;
    this.deltaWeightsPrevious = 0;
    this.deltaWeightsTotal = 0;
    this.xTrace = new Map();

    if (gateNode) {
      this.gateNode = gateNode;
      gateNode.addGate(this);
    } else {
      this.gateNode = null;
    }
  }
  /**
   * Returns the connection as a JSON
   *
   * @return Connection as a JSON
   */


  toJSON() {
    return {
      fromIndex: this.from.index,
      toIndex: this.to.index,
      gateNodeIndex: this.gateNode === null ? null : this.gateNode.index,
      weight: this.weight
    };
  }
  /**
   * Get the innovation ID for this connection
   */


  getInnovationID() {
    return Utils_1.pairing(this.from.index, this.to.index);
  }

}

exports.Connection = Connection;
},{"../utils/Utils":"../src/utils/Utils.js"}],"../src/architecture/Node.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Node = void 0;

const src_1 = require("activations/build/src");

const NodeType_1 = require("../enums/NodeType");

const Mutation_1 = require("../methods/Mutation");

const Utils_1 = require("../utils/Utils");

const Connection_1 = require("./Connection");
/**
 * Creates a new neuron/node
 *
 * Neurons are the basic unit of the neural network. They can be connected together, or used to gate connections between other neurons. A Neuron can perform basically 4 operations: form connections, gate connections, activate and [propagate](https://www.youtube.com/watch?v=Ilg3gGewQ5U).
 *
 * For more information check:
 * - [BecomingHuman](https://becominghuman.ai/what-is-an-artificial-neuron-8b2e421ce42e)
 * - [Wikipedia](https://en.wikipedia.org/wiki/Artificial_neuron)
 * - [Neataptic](https://wagenaartje.github.io/neataptic/docs/architecture/node/)
 * - [Synaptic](https://github.com/cazala/synaptic/wiki/Neural-Networks-101)
 * - [Keras](https://keras.io/backend/#bias_add)
 */


class Node {
  constructor(type = NodeType_1.NodeType.HIDDEN) {
    this.type = type;
    this.bias = Utils_1.randDouble(-1, 1);
    this.squash = src_1.Logistic;
    this.activation = 0;
    this.derivativeState = 1;
    this.state = 0;
    this.old = 0;
    this.mask = 1;
    this.deltaBiasPrevious = 0;
    this.deltaBiasTotal = 0;
    this.incoming = new Set();
    this.outgoing = new Set();
    this.gated = new Set();
    this.selfConnection = new Connection_1.Connection(this, this, 0);
    this.errorResponsibility = 0;
    this.errorProjected = 0;
    this.errorGated = 0;
    this.index = NaN;
  }
  /**
   * Convert a json object to a node
   *
   * @param json A node represented as a JSON object
   *
   * @returns itself
   */


  fromJSON(json) {
    var _a, _b, _c, _d;

    this.bias = (_a = json.bias) !== null && _a !== void 0 ? _a : Utils_1.randDouble(-1, 1);
    this.type = json.type;
    this.squash = (_b = json.squash) !== null && _b !== void 0 ? _b : src_1.Logistic;
    this.mask = (_c = json.mask) !== null && _c !== void 0 ? _c : 1;
    this.index = (_d = json.index) !== null && _d !== void 0 ? _d : NaN;
    return this;
  }
  /**
   * Clears this node's state information - _i.e. resets node and its connections to "factory settings"_
   *
   * `node.clear()` is useful for predicting time series.
   */


  clear() {
    this.incoming.forEach(connection => {
      connection.eligibility = 0;
      connection.xTrace.clear();
    });
    this.gated.forEach(conn => conn.gain = 0);
    this.errorResponsibility = this.errorProjected = this.errorGated = 0;
    this.old = this.state = this.activation = 0;
  }
  /**
   * Mutates the node's bias
   *
   * @param method The method is needed for the min and max value of the node's bias otherwise a range of [-1,1] is chosen
   */


  mutateBias(method = new Mutation_1.ModBiasMutation()) {
    this.bias += Utils_1.randDouble(method.min, method.max); // add a random value in range [min,max)
  }
  /**
   * Mutates the node's activation function
   */


  mutateActivation(allowedActivations = Object.values(src_1.ALL_ACTIVATIONS)) {
    // pick a random activation from allowed activations except the current activation
    const possible = allowedActivations.filter(activation => activation !== this.squash);

    if (possible.length > 0) {
      this.squash = Utils_1.pickRandom(possible);
    }
  }
  /**
   * Checks if the given node(s) are have outgoing connections to this node
   *
   * @param node Checks if `node(s)` have outgoing connections into this node
   *
   * @return Returns true, if every node(s) has an outgoing connection into this node
   */


  isProjectedBy(node) {
    if (node === this) {
      // self connection
      return this.selfConnection.weight !== 0; // is projected, if weight of self connection is unequal 0
    } else {
      return Array.from(this.incoming).map(conn => conn.from).includes(node); // check every incoming connection for node
    }
  }
  /**
   * Checks if this node has an outgoing connection(s) into the given node(s)
   *
   * @param node Checks if this node has outgoing connection(s) into `node(s)`
   *
   * @returns Returns true, if this node has an outgoing connection into every node(s)
   */


  isProjectingTo(node) {
    if (node === this) {
      // self connection
      return this.selfConnection.weight !== 0; // is projected, if weight of self connection is unequal 0
    } else {
      return Array.from(this.outgoing).map(conn => conn.to).includes(node); // check every outgoing connection for node
    }
  }
  /**
   * This node gates (influences) the given connection
   *
   * @param connection Connection to be gated (influenced) by a neuron
   */


  addGate(connection) {
    this.gated.add(connection);
    connection.gateNode = this;
  }
  /**
   * Stops this node from gating (manipulating) the given connection(s)
   *
   * @param connection Connections to remove gate - _i.e. remove this node from_
   */


  removeGate(connection) {
    this.gated.delete(connection);
    connection.gateNode = null;
    connection.gain = 1;
  }
  /**
   * Connects this node to the given node(s)
   *
   * @param target Node(s) to project connection(s) to
   * @param weight Initial connection(s) [weight](https://en.wikipedia.org/wiki/Synaptic_weight)
   * @param twoSided If `true` connect nodes to each other
   */


  connect(target, weight = 1, twoSided = false) {
    if (target === this) {
      // self connection
      this.selfConnection.weight = weight;
      return this.selfConnection;
    } else if (this.isProjectingTo(target)) {
      throw new ReferenceError("Their is already a connection!"); // already connected
    } else {
      const connection = new Connection_1.Connection(this, target, weight); // create new connection
      // add it to the arrays

      this.outgoing.add(connection);
      target.incoming.add(connection);

      if (twoSided) {
        target.connect(this); // connect in the other direction
      }

      return connection;
    }
  }
  /**
   * Disconnects this node from the given node(s)
   *
   * @param node Node(s) to remove connection(s) to
   * @param twoSided=false If `true` disconnects nodes from each other (i.e. both sides)
   */


  disconnect(node, twoSided = false) {
    if (node === this) {
      // self connection
      this.selfConnection.weight = 0; // set weight to 0

      return this.selfConnection;
    }

    const connections = Array.from(this.outgoing).filter(conn => conn.to === node);

    if (connections.length === 0) {
      throw new Error("No Connection found");
    }

    const connection = connections[0]; // remove it from the arrays

    this.outgoing.delete(connection);
    connection.to.incoming.delete(connection);

    if (connection.gateNode !== undefined && connection.gateNode != null) {
      connection.gateNode.removeGate(connection); // if connection is gated -> remove gate
    }

    if (twoSided) {
      node.disconnect(this); // disconnect the other direction
    }

    return connection;
  }
  /**
   * Backpropagate the error (a.k.a. learn).
   *
   * After an activation, you can teach the node what should have been the correct output (a.k.a. train). This is done by backpropagating. [Momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html) adds a fraction of the previous weight update to the current one. When the gradient keeps pointing in the same direction, this will increase the size of the steps taken towards the minimum.
   *
   * If you combine a high learning rate with a lot of momentum, you will rush past the minimum (of the error function) with huge steps. It is therefore often necessary to reduce the global learning rate µ when using a lot of momentum (m close to 1).
   *
   * @param target The target value (i.e. "the value the network SHOULD have given")
   * @param options More options for propagation
   *
   * @see [Regularization Neataptic](https://wagenaartje.github.io/neataptic/docs/methods/regularization/)
   * @see [What is backpropagation | YouTube](https://www.youtube.com/watch?v=Ilg3gGewQ5U)
   */


  propagate(target, options = {}) {
    var _a, _b, _c;

    options.momentum = (_a = options.momentum) !== null && _a !== void 0 ? _a : 0;
    options.rate = (_b = options.rate) !== null && _b !== void 0 ? _b : 0.3;
    options.update = (_c = options.update) !== null && _c !== void 0 ? _c : true;

    if (target !== undefined && Number.isFinite(target)) {
      this.errorResponsibility = this.errorProjected = target - this.activation;
    } else {
      this.errorProjected = 0;
      this.outgoing.forEach(connection => {
        this.errorProjected += connection.to.errorResponsibility * connection.weight * connection.gain;
      });
      this.errorProjected *= this.derivativeState;
      this.errorGated = 0;
      this.gated.forEach(connection => {
        let influence;

        if (connection.to.selfConnection.gateNode === this) {
          // self connection is gated with this node
          influence = connection.to.old + connection.weight * connection.from.activation;
        } else {
          influence = connection.weight * connection.from.activation;
        }

        this.errorGated += connection.to.errorResponsibility * influence;
      });
      this.errorGated *= this.derivativeState;
      this.errorResponsibility = this.errorProjected + this.errorGated;
    }

    this.incoming.forEach(connection => {
      var _a, _b; // calculate gradient


      let gradient = this.errorProjected * connection.eligibility;
      connection.xTrace.forEach((value, key) => gradient += key.errorResponsibility * value);
      connection.deltaWeightsTotal += ((_a = options.rate) !== null && _a !== void 0 ? _a : 0.3) * gradient * this.mask;

      if (options.update) {
        connection.deltaWeightsTotal += ((_b = options.momentum) !== null && _b !== void 0 ? _b : 0) * connection.deltaWeightsPrevious;
        connection.weight += connection.deltaWeightsTotal;
        connection.deltaWeightsPrevious = connection.deltaWeightsTotal;
        connection.deltaWeightsTotal = 0;
      }
    });
    this.deltaBiasTotal += options.rate * this.errorResponsibility;

    if (options.update) {
      this.deltaBiasTotal += options.momentum * this.deltaBiasPrevious;
      this.bias += this.deltaBiasTotal;
      this.deltaBiasPrevious = this.deltaBiasTotal;
      this.deltaBiasTotal = 0;
    }
  }
  /**
   * Actives the node.
   *
   * When a neuron activates, it computes its state from all its input connections and 'squashes' it using its activation function, and returns the output (activation).
   *
   * You can also provide the activation (a float between 0 and 1) as a parameter, which is useful for neurons in the input layer.
   *
   * @param [input] Environment signal (i.e. optional numerical value passed to the network as input)  - _should only be passed in input neurons_
   * @param [trace] Controls whether traces are created when activation happens (a trace is meta information left behind for different uses, e.g. backpropagation).
   *
   * @returns A neuron's ['Squashed'](https://medium.com/the-theory-of-everything/understanding-activation-functions-in-neural-networks-9491262884e0) output value
   */


  activate(input, trace = true) {
    if (input !== undefined) {
      return this.activation = input;
    } else if (this.isInputNode()) {
      throw new ReferenceError("There is no input given to an input node!");
    }

    if (trace) {
      this.old = this.state;
      this.state = this.selfConnection.gain * this.selfConnection.weight * this.state + this.bias;
      this.incoming.forEach(conn => {
        this.state += conn.from.activation * conn.weight * conn.gain;
      });
      this.activation = this.squash(this.state, false) * this.mask;
      this.derivativeState = this.squash(this.state, true); // store traces

      const nodes = [];
      const influences = []; // Adjust 'gain' (to gated connections) & Build traces

      this.gated.forEach(connection => {
        connection.gain = this.activation; // Build traces

        const index = nodes.indexOf(connection.to);

        if (index > -1) {
          // Node & influence exist
          influences[index] += connection.weight * connection.from.activation;
        } else {
          // Add node & corresponding influence
          nodes.push(connection.to);

          if (connection.to.selfConnection.gateNode === this) {
            influences.push(connection.weight * connection.from.activation + connection.to.old);
          } else {
            influences.push(connection.weight * connection.from.activation);
          }
        }
      }); // Forwarding 'xTrace' (to incoming connections)

      this.incoming.forEach(connection => {
        var _a;

        connection.eligibility = this.selfConnection.gain * this.selfConnection.weight * connection.eligibility + connection.from.activation * connection.gain;

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const influence = influences[i];

          if (connection.xTrace.has(node)) {
            connection.xTrace.set(node, node.selfConnection.gain * node.selfConnection.weight * ((_a = connection.xTrace.get(node)) !== null && _a !== void 0 ? _a : 0) + this.derivativeState * connection.eligibility * influence);
          } else {
            connection.xTrace.set(node, this.derivativeState * connection.eligibility * influence);
          }
        }
      });
      return this.activation;
    } else {
      if (this.isInputNode()) return this.activation = 0;
      this.state = this.selfConnection.gain * this.selfConnection.weight * this.state + this.bias;
      this.incoming.forEach(connection => this.state += connection.from.activation * connection.weight * connection.gain);
      this.activation = this.squash(this.state, false); // Adjust gain

      this.gated.forEach(connection => connection.gain = this.activation);
      return this.activation;
    }
  }
  /**
   * Converts the node to a json object that can later be converted back
   *
   * @returns A node representing json object
   */


  toJSON() {
    return {
      bias: this.bias,
      type: this.type,
      squash: this.squash,
      mask: this.mask,
      index: this.index
    };
  }
  /**
   * Is this a input Node?
   */


  isInputNode() {
    return this.type === NodeType_1.NodeType.INPUT;
  }
  /**
   * Is this a hidden Node?
   */


  isHiddenNode() {
    return this.type === NodeType_1.NodeType.HIDDEN;
  }
  /**
   * Is this a output Node?
   */


  isOutputNode() {
    return this.type === NodeType_1.NodeType.OUTPUT;
  }
  /**
   * Set bias.
   *
   * @param bias the new bias value
   */


  setBias(bias) {
    this.bias = bias;
    return this;
  }
  /**
   * Set activation type
   *
   * @param activation the new activation type
   */


  setActivationType(activation) {
    this.squash = activation;
    return this;
  }

}

exports.Node = Node;
},{"../enums/NodeType":"../src/enums/NodeType.js","../methods/Mutation":"../src/methods/Mutation.js","../utils/Utils":"../src/utils/Utils.js","./Connection":"../src/architecture/Connection.js"}],"../src/enums/GatingType.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GatingType = void 0;
/**
 * The type of gating.
 */

var GatingType;

(function (GatingType) {
  /**
   * Gate incoming connections.
   */
  GatingType[GatingType["INPUT"] = 0] = "INPUT";
  /**
   * Gate self connections.
   */

  GatingType[GatingType["SELF"] = 1] = "SELF";
  /**
   * Gate outgoing connections.
   */

  GatingType[GatingType["OUTPUT"] = 2] = "OUTPUT";
})(GatingType = exports.GatingType || (exports.GatingType = {}));
},{}],"../src/architecture/Layers/Layer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layer = void 0;

const ConnectionType_1 = require("../../enums/ConnectionType");

const GatingType_1 = require("../../enums/GatingType");
/**
 * Parent class for layers.
 */


class Layer {
  constructor(outputSize) {
    this.outputSize = outputSize;
    this.nodes = [];
    this.inputNodes = new Set();
    this.outputNodes = new Set();
    this.connections = [];
    this.gates = [];
  }
  /**
   * Connect two Layers or sets of Nodes.
   *
   * @param from origin Nodes / Layer
   * @param to destination Nodes / Layer
   * @param connectionType The type of connection
   * @param weight the initial weights for all new connections
   *
   * @returns all created connections
   */


  static connect(from, to, connectionType = ConnectionType_1.ConnectionType.ALL_TO_ALL, weight = 1) {
    if (connectionType === ConnectionType_1.ConnectionType.NO_CONNECTION) {
      throw new ReferenceError("Cannot connect with 'NO_CONNECTION' connection type");
    }

    const fromNodes = Array.from(from instanceof Layer ? from.outputNodes : from);
    const toNodes = Array.from(to instanceof Layer ? to.inputNodes : to);

    if (toNodes.length === 0) {
      throw new ReferenceError("Target from has no input nodes!");
    }

    if (fromNodes.length === 0) {
      throw new ReferenceError("This from has no output nodes!");
    }

    const connections = [];

    if (connectionType === ConnectionType_1.ConnectionType.ALL_TO_ALL) {
      fromNodes.forEach(fromNode => {
        toNodes.forEach(toNode => {
          connections.push(fromNode.connect(toNode, weight)); // connect every "from node" to every "to node"
        });
      });
    } else if (connectionType === ConnectionType_1.ConnectionType.ONE_TO_ONE) {
      if (fromNodes.length !== toNodes.length) {
        throw new RangeError("Can't connect one to one! Number of output nodes from are unequal number of incoming nodes from next layer!");
      }

      for (let i = 0; i < fromNodes.length; i++) {
        connections.push(fromNodes[i].connect(toNodes[i], weight)); // connect every nodes with same indices
      }
    } else if (connectionType === ConnectionType_1.ConnectionType.POOLING) {
      // connect the same amount of input nodes to every output node
      // every input node has only one connection available
      const ratio = toNodes.length / fromNodes.length;
      connections.push(...fromNodes.map((node, index) => node.connect(toNodes[Math.floor(index * ratio)], weight)));
    }

    return connections;
  }
  /**
   * Gate nodes and connections.
   *
   * @param nodes the nodes which function as gateNodes
   * @param connections the connections which will be gated
   * @param gateType The type of gating
   *
   * @returns all gated connections
   */


  static gate(nodes, connections, gateType) {
    const gatedConnections = [];

    switch (gateType) {
      case GatingType_1.GatingType.INPUT:
        {
          // gate incoming connections
          const toNodes = Array.from(new Set(connections.map(conn => conn.to)));

          for (let i = 0; i < toNodes.length; i++) {
            const node = toNodes[i];
            const gateNode = nodes[i % nodes.length];
            node.incoming.forEach(conn => {
              if (connections.includes(conn)) {
                gateNode.addGate(conn);
                gatedConnections.push(conn);
              }
            });
          }

          break;
        }

      case GatingType_1.GatingType.SELF:
        {
          // gate self connections
          const fromNodes = Array.from(new Set(connections.map(conn => conn.from)));

          for (let i = 0; i < fromNodes.length; i++) {
            if (connections.includes(fromNodes[i].selfConnection)) {
              nodes[i % nodes.length].addGate(fromNodes[i].selfConnection);
              gatedConnections.push(fromNodes[i].selfConnection);
            }
          }

          break;
        }

      case GatingType_1.GatingType.OUTPUT:
        {
          // gate outgoing connections
          const fromNodes = Array.from(new Set(connections.map(conn => conn.from)));

          for (let i = 0; i < fromNodes.length; i++) {
            const node = fromNodes[i];
            const gateNode = nodes[i % nodes.length];
            node.outgoing.forEach(conn => {
              if (connections.includes(conn)) {
                gateNode.addGate(conn);
                gatedConnections.push(conn);
              }
            });
          }

          break;
        }
    }

    return gatedConnections;
  }

}

exports.Layer = Layer;
},{"../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../enums/GatingType":"../src/enums/GatingType.js"}],"../src/architecture/Nodes/ConstantNode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConstantNode = void 0;

const src_1 = require("activations/build/src");

const NodeType_1 = require("../../enums/NodeType");

const Node_1 = require("../Node");
/**
 * Constant node
 */


class ConstantNode extends Node_1.Node {
  constructor() {
    super(NodeType_1.NodeType.HIDDEN);
    this.bias = 1;
  }
  /**
   * Create a constant node from json object.
   *
   * @param json the json object representing the node
   *
   * @returns the created node
   */


  fromJSON(json) {
    var _a, _b;

    this.index = (_a = json.index) !== null && _a !== void 0 ? _a : -1;
    this.squash = (_b = json.squash) !== null && _b !== void 0 ? _b : src_1.Identitiy;
    return this;
  }
  /**
   * Convert this node into a json object.
   *
   * @returns the json object representing this node
   */


  toJSON() {
    return {
      index: this.index,
      squash: this.squash
    };
  }
  /**
   * Bias mutations aren't allowed for a constant node.
   */


  mutateBias() {
    throw new ReferenceError("Cannot mutate a pool node!");
  }
  /**
   * Activation mutations aren't allowed for a constant node.
   */


  mutateActivation() {
    throw new ReferenceError("Cannot mutate a pool node!");
  }
  /**
   * Constant nodes can't gate a connection.
   */


  addGate() {
    throw new ReferenceError("A pool node can't gate a connection!");
  }
  /**
   * Constant nodes can't gate a connection.
   */


  removeGate() {
    throw new ReferenceError("A pool node can't gate a connection!");
  }
  /**
   * Can't set the bias of a constant node.
   */


  setBias() {
    throw new ReferenceError("Cannot set the bias of a pool node!");
  }

}

exports.ConstantNode = ConstantNode;
},{"../../enums/NodeType":"../src/enums/NodeType.js","../Node":"../src/architecture/Node.js"}],"../src/architecture/Nodes/NoiseNode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoiseNode = void 0;

const NodeType_1 = require("../../enums/NodeType");

const Utils_1 = require("../../utils/Utils");

const ConstantNode_1 = require("./ConstantNode");
/**
 * Noise node
 */


class NoiseNode extends ConstantNode_1.ConstantNode {
  constructor(options = {}) {
    var _a;

    super();
    this.noiseType = (_a = options.noiseType) !== null && _a !== void 0 ? _a : NodeType_1.NoiseNodeType.GAUSSIAN_NOISE;
    this.options = options;
  }
  /**
   * Actives the node.
   *
   * When a neuron activates, it computes its state from all its input connections and 'squashes' it using its activation function, and returns the output (activation).
   *
   * You can also provide the activation (a float between 0 and 1) as a parameter, which is useful for neurons in the input layer.
   *
   * @returns A neuron's output value
   */


  activate() {
    var _a, _b, _c, _d;

    this.old = this.state;
    const incomingStates = Array.from(this.incoming).map(conn => conn.from.activation * conn.weight * conn.gain);

    switch (this.noiseType) {
      case NodeType_1.NoiseNodeType.GAUSSIAN_NOISE:
        this.state = Utils_1.avg(incomingStates) + Utils_1.generateGaussian((_b = (_a = this.options.gaussian) === null || _a === void 0 ? void 0 : _a.mean) !== null && _b !== void 0 ? _b : 0, (_d = (_c = this.options.gaussian) === null || _c === void 0 ? void 0 : _c.deviation) !== null && _d !== void 0 ? _d : 2);
        break;

      default:
        throw new ReferenceError("Cannot activate this noise type!");
    }

    this.activation = this.squash(this.state, false) * this.mask;
    this.derivativeState = this.squash(this.state, true);
    return this.activation;
  }
  /**
   * Backpropagate the error (a.k.a. learn).
   *
   * After an activation, you can teach the node what should have been the correct output (a.k.a. train). This is done by backpropagating. [Momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html) adds a fraction of the previous weight update to the current one. When the gradient keeps pointing in the same direction, this will increase the size of the steps taken towards the minimum.
   *
   * If you combine a high learning rate with a lot of momentum, you will rush past the minimum (of the error function) with huge steps. It is therefore often necessary to reduce the global learning rate µ when using a lot of momentum (m close to 1).
   *
   * @param target The target value (i.e. "the value the network SHOULD have given")
   * @param options More options for propagation
   */


  propagate(target, options = {}) {
    var _a, _b, _c;

    options.momentum = (_a = options.momentum) !== null && _a !== void 0 ? _a : 0;
    options.rate = (_b = options.rate) !== null && _b !== void 0 ? _b : 0.3;
    options.update = (_c = options.update) !== null && _c !== void 0 ? _c : true;
    const connectionsStates = Array.from(this.outgoing).map(conn => conn.to.errorResponsibility * conn.weight * conn.gain);
    this.errorResponsibility = this.errorProjected = Utils_1.sum(connectionsStates) * this.derivativeState;
    this.incoming.forEach(connection => {
      var _a, _b; // calculate gradient


      let gradient = this.errorProjected * connection.eligibility;
      connection.xTrace.forEach((value, key) => {
        gradient += key.errorResponsibility * value;
      });
      connection.deltaWeightsTotal += ((_a = options.rate) !== null && _a !== void 0 ? _a : 0.3) * gradient * this.mask;

      if (options.update) {
        connection.deltaWeightsTotal += ((_b = options.momentum) !== null && _b !== void 0 ? _b : 0) * connection.deltaWeightsPrevious;
        connection.weight += connection.deltaWeightsTotal;
        connection.deltaWeightsPrevious = connection.deltaWeightsTotal;
        connection.deltaWeightsTotal = 0;
      }
    });
  }

}

exports.NoiseNode = NoiseNode;
},{"../../enums/NodeType":"../src/enums/NodeType.js","../../utils/Utils":"../src/utils/Utils.js","./ConstantNode":"../src/architecture/Nodes/ConstantNode.js"}],"../src/architecture/Layers/NoiseLayers/NoiseLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoiseLayer = void 0;

const src_1 = require("activations/build/src");

const ConnectionType_1 = require("../../../enums/ConnectionType");

const NodeType_1 = require("../../../enums/NodeType");

const NoiseNode_1 = require("../../Nodes/NoiseNode");

const Layer_1 = require("../Layer");
/**
 * Noise layer
 */


class NoiseLayer extends Layer_1.Layer {
  constructor(outputSize, options = {}) {
    var _a;

    super(outputSize);
    const activation = (_a = options.activation) !== null && _a !== void 0 ? _a : src_1.Identitiy;

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new NoiseNode_1.NoiseNode({
        noiseType: NodeType_1.NoiseNodeType.GAUSSIAN_NOISE,
        gaussian: options
      }).setActivationType(activation));
    }

    this.outputNodes = this.inputNodes;
    this.nodes.push(...Array.from(this.inputNodes));
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.ONE_TO_ONE;
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return type === ConnectionType_1.ConnectionType.ONE_TO_ONE;
  }

}

exports.NoiseLayer = NoiseLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../Nodes/NoiseNode":"../src/architecture/Nodes/NoiseNode.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/architecture/Layers/CoreLayers/InputLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputLayer = void 0;

const ConnectionType_1 = require("../../../enums/ConnectionType");

const NodeType_1 = require("../../../enums/NodeType");

const Node_1 = require("../../Node");

const Layer_1 = require("../Layer");

const NoiseLayer_1 = require("../NoiseLayers/NoiseLayer");
/**
 * Input layer
 */


class InputLayer extends Layer_1.Layer {
  constructor(outputSize, options = {}) {
    super(outputSize);

    for (let i = 0; i < outputSize; i++) {
      const node = new Node_1.Node(NodeType_1.NodeType.INPUT);
      this.nodes.push(node);
    }

    if (options.noise) {
      const noiseLayer = new NoiseLayer_1.NoiseLayer(options.noise);
      noiseLayer.outputNodes.forEach(node => this.outputNodes.add(node));
      this.connections.push(...Layer_1.Layer.connect(this.nodes, noiseLayer, noiseLayer.getDefaultIncomingConnectionType()));
    } else {
      this.nodes.forEach(node => this.outputNodes.add(node));
    }
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.NO_CONNECTION;
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return type === ConnectionType_1.ConnectionType.NO_CONNECTION;
  }

}

exports.InputLayer = InputLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../Node":"../src/architecture/Node.js","../Layer":"../src/architecture/Layers/Layer.js","../NoiseLayers/NoiseLayer":"../src/architecture/Layers/NoiseLayers/NoiseLayer.js"}],"../src/architecture/Layers/CoreLayers/OutputLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OutputLayer = void 0;

const src_1 = require("activations/build/src");

const ConnectionType_1 = require("../../../enums/ConnectionType");

const NodeType_1 = require("../../../enums/NodeType");

const Node_1 = require("../../Node");

const Layer_1 = require("../Layer");
/**
 * Output layer
 */


class OutputLayer extends Layer_1.Layer {
  constructor(outputSize, options = {}) {
    var _a;

    super(outputSize);
    const activation = (_a = options.activation) !== null && _a !== void 0 ? _a : src_1.Identitiy;

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.OUTPUT).setActivationType(activation));
    }

    this.nodes.push(...Array.from(this.inputNodes));
  }
  /**
   * A outgoing connection is not allowed for an output layer!
   */


  connect() {
    throw new ReferenceError("Could not connect an OutputLayer!");
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return true;
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.ALL_TO_ALL;
  }

}

exports.OutputLayer = OutputLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../Node":"../src/architecture/Node.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/methods/Loss.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALL_LOSSES = exports.HINGELoss = exports.MSLELoss = exports.WAPELoss = exports.MAPELoss = exports.MAELoss = exports.BinaryLoss = exports.MBELoss = exports.MSELoss = void 0;

const Utils_1 = require("../utils/Utils");

exports.MSELoss = function (targets, outputs) {
  let error = 0;
  outputs.forEach((value, index) => {
    error += Math.pow(targets[index] - value, 2);
  });
  return error / outputs.length;
};

exports.MBELoss = function (targets, outputs) {
  let error = 0;
  outputs.forEach((value, index) => {
    error += targets[index] - value;
  });
  return error / outputs.length;
};

exports.BinaryLoss = function (targets, outputs) {
  let error = 0;
  outputs.forEach((value, index) => {
    error += Math.round(targets[index] * 2) !== Math.round(value * 2) ? 1 : 0;
  });
  return error / outputs.length;
};

exports.MAELoss = function (targets, outputs) {
  let error = 0;
  outputs.forEach((value, index) => {
    error += Math.abs(targets[index] - value);
  });
  return error / outputs.length;
};

exports.MAPELoss = function (targets, outputs) {
  let error = 0;
  outputs.forEach((value, index) => {
    error += Math.abs((value - targets[index]) / Math.max(targets[index], 1e-15));
  });
  return error / outputs.length;
};

exports.WAPELoss = function (targets, outputs) {
  let error = 0;
  outputs.forEach((value, index) => {
    error += Math.abs(targets[index] - value);
  });
  return error / Utils_1.sum(targets);
};

exports.MSLELoss = function (targets, outputs) {
  let error = 0;
  outputs.forEach((value, index) => {
    error += Math.log(Math.max(targets[index], 1e-15)) - Math.log(Math.max(value, 1e-15));
  });
  return error / outputs.length;
};

exports.HINGELoss = function (targets, outputs) {
  let error = 0;
  outputs.forEach((value, index) => {
    error += Math.max(0, 1 - value * targets[index]);
  });
  return error / outputs.length;
};

exports.ALL_LOSSES = {
  MSELoss: exports.MSELoss,
  MBELoss: exports.MBELoss,
  BinaryLoss: exports.BinaryLoss,
  MAELoss: exports.MAELoss,
  MAPELoss: exports.MAPELoss,
  WAPELoss: exports.WAPELoss,
  MSLELoss: exports.MSLELoss,
  HINGELoss: exports.HINGELoss
};
},{"../utils/Utils":"../src/utils/Utils.js"}],"../src/methods/Selection.js":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TournamentSelection = exports.PowerSelection = exports.FitnessProportionateSelection = exports.Selection = void 0;

const TimSort = __importStar(require("timsort"));

const Utils_1 = require("../utils/Utils");
/**
 * Genetic Algorithm Selection Methods (Genetic Operator)
 *
 * @see [Genetic Algorithm - Selection]{@link https://en.wikipedia.org/wiki/Selection_(genetic_algorithm)}
 */


class Selection {}

exports.Selection = Selection;
/**
 * Fitness proportionate selection
 *
 * [Fitness Proportionate / Roulette Wheel Selection on Wikipedia](https://en.wikipedia.org/wiki/Fitness_proportionate_selection)
 */

class FitnessProportionateSelection extends Selection {
  /**
   * Selects a genome from the population according to the Selection method.
   *
   * @param population the pool of networks
   * @returns the selected genome
   */
  select(population) {
    var _a, _b, _c;

    let totalFitness = 0;
    let minimalFitness = 0;

    for (const genome of population) {
      minimalFitness = Math.min((_a = genome.score) !== null && _a !== void 0 ? _a : minimalFitness, minimalFitness);
      totalFitness += (_b = genome.score) !== null && _b !== void 0 ? _b : 0;
    }

    minimalFitness = Math.abs(minimalFitness);
    totalFitness += minimalFitness * population.length;
    const random = Utils_1.randDouble(0, totalFitness);
    let value = 0;

    for (const genome of population) {
      value += ((_c = genome.score) !== null && _c !== void 0 ? _c : 0) + minimalFitness;

      if (random < value) {
        return genome;
      }
    }

    return Utils_1.pickRandom(population);
  }

}

exports.FitnessProportionateSelection = FitnessProportionateSelection;
/**
 * Power selection
 *
 * A random decimal value between 0 and 1 will be generated (e.g. 0.5) then this value will get an exponential value (power, default is 4). So 0.5**4 = 0.0625. This is converted into an index for the array of the current population, sorted from fittest to worst.
 */

class PowerSelection extends Selection {
  /**
   * Constructs a power selection.
   * @param power Probability of picking better networks.
   */
  constructor(power = 4) {
    super();
    this.power = power;
  }
  /**
   * Selects a genome from the population according to the Selection method.
   *
   * @param population the pool of networks
   * @returns the selected genome
   */


  select(population) {
    return population[Math.floor(Math.pow(Math.random(), this.power) * population.length)];
  }

}

exports.PowerSelection = PowerSelection;
/**
 * Tournament selection
 *
 * [Tournament Selection on Wikipedia](https://en.wikipedia.org/wiki/Tournament_selection)
 */

class TournamentSelection extends Selection {
  /**
   * Constructs a tournament selection.
   * @param size the size of a tournament
   * @param probability Selects the best individual (when probability = 1).
   */
  constructor(size = 5, probability = 0.5) {
    super();
    this.size = size;
    this.probability = probability;
  }
  /**
   * Selects a genome from the population according to the Selection method.
   *
   * @param population the pool of networks
   * @returns the selected genome
   */


  select(population) {
    if (this.size > population.length) {
      throw new Error(`Your tournament size should be lower than the population size, please change methods.selection.TOURNAMENT.size`);
    } // Create a tournament


    const individuals = [];

    for (let i = 0; i < this.size; i++) {
      individuals.push(Utils_1.pickRandom(population));
    } // Sort the tournament individuals by score


    TimSort.sort(individuals, (a, b) => {
      return b.score === undefined || a.score === undefined ? 0 : b.score - a.score;
    }); // Select an individual

    for (let i = 0; i < this.size; i++) {
      if (Math.random() < this.probability || i === this.size - 1) {
        return individuals[i];
      }
    }

    return Utils_1.pickRandom(population);
  }

}

exports.TournamentSelection = TournamentSelection;
},{"../utils/Utils":"../src/utils/Utils.js"}],"../src/interfaces/EvolveOptions.js":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EvolveOptions = void 0;

const src_1 = require("activations/build/src");

const os_1 = __importDefault(require("os"));

const Network_1 = require("../architecture/Network");

const Loss_1 = require("../methods/Loss");

const Mutation_1 = require("../methods/Mutation");

const Selection_1 = require("../methods/Selection");
/**
 * Options used to evolve network
 */


class EvolveOptions {
  constructor() {
    /**
     * How big could the distance be between a network and the represent of a species?
     */
    this._speciesDistanceThreshold = 4;
    this._c1 = 1;
    this._c2 = 1;
    this._c3 = 1;
    this._survivors = 0.8;
    this._input = 1;
    this._output = 1;
    this._generation = 0;
    this._elitism = 1;
    this._equal = true;
    this._clear = false;
    this._populationSize = 50;
    this._mutationRate = 0.6;
    this._mutationAmount = 5;
    this._selection = new Selection_1.FitnessProportionateSelection();
    this._loss = Loss_1.MSELoss;
    this._mutations = Mutation_1.FEEDFORWARD_MUTATIONS;
    this._activations = Object.values(src_1.ALL_ACTIVATIONS);
    this._template = new Network_1.Network(this._input, this._output);
    this._maxNodes = Infinity;
    this._maxConnections = Infinity;
    this._maxGates = Infinity;
    this._threads = os_1.default.cpus().length;
    this._log = -1;
    this._iterations = 1000;
    this._error = 0.05;
    this._maxStagnation = 3;
  }
  /**
   * Getter
   */


  get maxStagnation() {
    return this._maxStagnation;
  }
  /**
   * Setter
   * @param value
   */


  set maxStagnation(value) {
    this._maxStagnation = value;
  }
  /**
   * Getter
   */


  get speciesDistanceThreshold() {
    return this._speciesDistanceThreshold;
  }
  /**
   * Setter
   */


  set speciesDistanceThreshold(value) {
    this._speciesDistanceThreshold = value;
  }
  /**
   * Getter
   */


  get c1() {
    return this._c1;
  }
  /**
   * Setter
   */


  set c1(value) {
    this._c1 = value;
  }
  /**
   * Getter
   */


  get c2() {
    return this._c2;
  }
  /**
   * Setter
   */


  set c2(value) {
    this._c2 = value;
  }
  /**
   * Getter
   */


  get c3() {
    return this._c3;
  }
  /**
   * Setter
   */


  set c3(value) {
    this._c3 = value;
  }
  /**
   * Getter
   */


  get survivors() {
    return this._survivors;
  }
  /**
   * Setter
   */


  set survivors(value) {
    this._survivors = value;
  }
  /**
   * Getter
   */


  get threads() {
    return this._threads;
  }
  /**
   * Setter
   */


  set threads(value) {
    this._threads = value;
  }
  /**
   * Getter
   */


  get input() {
    return this._input;
  }
  /**
   * Setter
   */


  set input(value) {
    this._input = value;
  }
  /**
   * Getter
   */


  get output() {
    return this._output;
  }
  /**
   * Setter
   */


  set output(value) {
    this._output = value;
  }
  /**
   * Getter
   */


  get dataset() {
    return this._dataset;
  }
  /**
   * Setter
   */


  set dataset(value) {
    this._dataset = value;
  }
  /**
   * Getter
   */


  get generation() {
    return this._generation;
  }
  /**
   * Setter
   */


  set generation(value) {
    this._generation = value;
  }
  /**
   * Getter
   */


  get training() {
    return this._training;
  }
  /**
   * Setter
   */


  set training(value) {
    this._training = value;
  }
  /**
   * Getter
   */


  get template() {
    return this._template;
  }
  /**
   * Setter
   */


  set template(value) {
    this._template = value;
  }
  /**
   * Getter
   */


  get mutations() {
    return this._mutations;
  }
  /**
   * Setter
   */


  set mutations(value) {
    this._mutations = value;
  }
  /**
   * Getter
   */


  get activations() {
    return this._activations;
  }
  /**
   * Setter
   */


  set activations(value) {
    this._activations = value;
  }
  /**
   * Getter
   */


  get selection() {
    return this._selection;
  }
  /**
   * Setter
   */


  set selection(value) {
    this._selection = value;
  }
  /**
   * Getter
   */


  get mutationRate() {
    return this._mutationRate;
  }
  /**
   * Setter
   */


  set mutationRate(value) {
    this._mutationRate = value;
  }
  /**
   * Getter
   */


  get mutationAmount() {
    return this._mutationAmount;
  }
  /**
   * Setter
   */


  set mutationAmount(value) {
    this._mutationAmount = value;
  }
  /**
   * Getter
   */


  get elitism() {
    return this._elitism;
  }
  /**
   * Setter
   */


  set elitism(value) {
    this._elitism = value;
  }
  /**
   * Getter
   */


  get populationSize() {
    return this._populationSize;
  }
  /**
   * Setter
   */


  set populationSize(value) {
    this._populationSize = value;
  }
  /**
   * Getter
   */


  get fitnessFunction() {
    return this._fitnessFunction;
  }
  /**
   * Setter
   */


  set fitnessFunction(value) {
    this._fitnessFunction = value;
  }
  /**
   * Getter
   */


  get loss() {
    return this._loss;
  }
  /**
   * Setter
   */


  set loss(value) {
    this._loss = value;
  }
  /**
   * Getter
   */


  get maxNodes() {
    return this._maxNodes;
  }
  /**
   * Setter
   */


  set maxNodes(value) {
    this._maxNodes = value;
  }
  /**
   * Getter
   */


  get maxConnections() {
    return this._maxConnections;
  }
  /**
   * Setter
   */


  set maxConnections(value) {
    this._maxConnections = value;
  }
  /**
   * Getter
   */


  get maxGates() {
    return this._maxGates;
  }
  /**
   * Setter
   */


  set maxGates(value) {
    this._maxGates = value;
  }
  /**
   * Getter
   */


  get equal() {
    return this._equal;
  }
  /**
   * Setter
   */


  set equal(value) {
    this._equal = value;
  }
  /**
   * Getter
   */


  get log() {
    return this._log;
  }
  /**
   * Setter
   */


  set log(value) {
    this._log = value;
  }
  /**
   * Getter
   */


  get schedule() {
    return this._schedule;
  }
  /**
   * Setter
   */


  set schedule(value) {
    this._schedule = value;
  }
  /**
   * Getter
   */


  get clear() {
    return this._clear;
  }
  /**
   * Setter
   */


  set clear(value) {
    this._clear = value;
  }
  /**
   * Getter
   */


  get iterations() {
    return this._iterations;
  }
  /**
   * Setter
   */


  set iterations(value) {
    this._iterations = value;
  }
  /**
   * Getter
   */


  get error() {
    return this._error;
  }
  /**
   * Setter
   */


  set error(value) {
    this._error = value;
  }

}

exports.EvolveOptions = EvolveOptions;
},{"../architecture/Network":"../src/architecture/Network.js","../methods/Loss":"../src/methods/Loss.js","../methods/Mutation":"../src/methods/Mutation.js","../methods/Selection":"../src/methods/Selection.js"}],"../src/architecture/Species.js":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Species = void 0;

const TimSort = __importStar(require("timsort"));

const Utils_1 = require("../utils/Utils");

const Network_1 = require("./Network");
/**
 * A class holding a species
 */


class Species {
  constructor(representative) {
    this.representative = representative;
    this.representative.species = this;
    this.members = new Set();
    this.members.add(representative);
    this._score = 0;
    this.lastScore = 0;
    this._stagnation = 0;
  }
  /**
   * Getter
   */


  get score() {
    return this._score;
  }
  /**
   * Getter
   */


  get stagnation() {
    return this._stagnation;
  }
  /**
   * Puts a network to the species, after checking the distance
   * @param network
   * @param c1
   * @param c2
   * @param c3
   * @param distanceThreshold
   */


  put(network, c1, c2, c3, distanceThreshold) {
    if (network.distance(this.representative, c1, c2, c3) < distanceThreshold) {
      this.forcePut(network);
      return true;
    } else {
      return false;
    }
  }
  /**
   * Puts a network to the species without checking the distance
   * @param network
   */


  forcePut(network) {
    if (network === undefined) {
      return;
    }

    this.members.add(network);
    network.species = this;
  }
  /**
   * Calculate the score of this species
   */


  evaluateScore() {
    let sum = 0;
    this.members.forEach(network => {
      var _a;

      return sum += (_a = network.score) !== null && _a !== void 0 ? _a : 0;
    });
    const score = sum / this.members.size;

    if (this.lastScore < score) {
      this._stagnation++;
    } else {
      this._stagnation = 0;
    }

    this._score = score;
  }
  /**
   * Reset this object
   */


  reset() {
    this.representative = Utils_1.pickRandom(this.members);
    this.members.forEach(genome => genome.species = null);
    this.members.clear();
    this.members.add(this.representative);
    this.representative.species = this;
    this.lastScore = this.score;
    this._score = 0;
  }
  /**
   * Kill a specific percentage of networks
   * @param percentage
   */


  kill(percentage) {
    const arr = Array.from(this.members);
    TimSort.sort(arr, (a, b) => {
      return a.score === undefined || b.score === undefined ? 0 : a.score - b.score;
    });
    const amount = Math.floor(percentage * this.members.size);

    for (let i = 0; i < amount; i++) {
      this.members.delete(arr[i]);
      arr[i].species = null;
    }
  }
  /**
   * Create offspring
   */


  breed() {
    return Network_1.Network.crossOver(Utils_1.pickRandom(this.members), Utils_1.pickRandom(this.members));
  }
  /**
   * The size of this species
   */


  size() {
    return this.members.size;
  }
  /**
   * Returns the best genome from this species
   */


  getBest() {
    const networks = Array.from(this.members);
    return networks[Utils_1.maxValueIndex(networks.map(genome => {
      var _a;

      return (_a = genome.score) !== null && _a !== void 0 ? _a : -Infinity;
    }))];
  }
  /**
   * to string
   */


  print() {
    console.log("Species={Members: " + this.members.size + "; Score: " + this._score + "; Stagnation: " + this.stagnation + "}");
  }

}

exports.Species = Species;
},{"../utils/Utils":"../src/utils/Utils.js","./Network":"../src/architecture/Network.js"}],"../src/NEAT.js":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NEAT = void 0;

const TimSort = __importStar(require("timsort"));

const Species_1 = require("./architecture/Species");

const Mutation_1 = require("./methods/Mutation");

const Utils_1 = require("./utils/Utils");
/**
 * Runs the NEAT algorithm on group of neural networks.
 *
 * @constructs Neat
 */


class NEAT {
  /**
   * Constructs a NEAT object.
   *
   * @param options
   */
  constructor(options) {
    if (!options.fitnessFunction) {
      throw new ReferenceError("No fitness function given!");
    }

    this._options = options;
    this.population = [];
    this.species = new Set();

    for (let i = 0; i < this.options.populationSize; i++) {
      this.population.push(this.options.template.copy());
    }
  }
  /**
   * Getter
   */


  get options() {
    return this._options;
  }
  /**
   * Setter
   */


  set options(value) {
    this._options = value;
  }
  /**
   * Mutate a network with a random mutation from the allowed array.
   *
   * @param network The network which will be mutated.
   */


  mutateRandom(network) {
    const allowed = this.options.mutations.filter(method => {
      return method.constructor.name !== Mutation_1.AddNodeMutation.constructor.name || network.nodes.length < this.options.maxNodes || method.constructor.name !== Mutation_1.AddConnectionMutation.constructor.name || network.connections.size < this.options.maxConnections || method.constructor.name !== Mutation_1.AddGateMutation.constructor.name || network.gates.size < this.options.maxGates;
    });
    network.mutate(Utils_1.pickRandom(allowed), {
      allowedActivations: this.options.activations
    });
  }
  /**
   * Evaluates, selects, breeds and mutates population
   *
   * @returns {Network} Fittest network
   */


  evolve() {
    return __awaiter(this, void 0, void 0, function* () {
      this.genSpecies();
      yield this.evaluate();
      this.sort();
      this.species.forEach(species => species.evaluateScore());
      this.kill(1 - this.options.survivors);
      this.removeExtinctSpecies();
      this.reproduce();
      const elitists = this.population.splice(0, this.options.elitism);
      this.mutate();
      this.population.splice(0, 0, ...elitists);

      if (this.options.training) {
        for (const genome of this.population) {
          genome.train(this.options.training);
        }
      } // evaluate the population


      yield this.evaluate(); // Sort in order of fitness (fittest first)

      this.sort();
      const fittest = this.population[0].copy();
      fittest.score = this.population[0].score;

      if (this.options.log > 0 && this.options.generation % this.options.log === 0) {
        console.log("\n---------------------------");
        console.log("Generation: " + this.options.generation + "; Species: " + this.species.size + "; Score: " + this.population[0].score);

        for (const species of this.species) {
          species.print();
        }
      } // Reset the scores


      this.population.forEach(genome => genome.score = undefined);
      this.options.generation++;
      return fittest;
    });
  }
  /**
   * Mutates the given (or current) population
   *
   * @param {Mutation} [method] A mutation method to mutate the population with. When not specified will pick a random mutation from the set allowed mutations.
   */


  mutate(method) {
    // Elitist genomes should not be included
    this.population.filter(() => Math.random() <= this.options.mutationRate).forEach(genome => {
      for (let i = 0; i < this.options.mutationAmount; i++) {
        if (method) {
          genome.mutate(method);
        } else {
          this.mutateRandom(genome);
        }
      }
    });
  }
  /**
   * Evaluates the current population, basically sets their `.score` property
   *
   * @return {Network} Fittest Network
   */


  evaluate() {
    var _a, _b;

    return __awaiter(this, void 0, void 0, function* () {
      if (this.options.clear) {
        this.population.forEach(genome => genome.clear());
      }

      yield (_b = (_a = this.options).fitnessFunction) === null || _b === void 0 ? void 0 : _b.call(_a, this.population, this.options.dataset); // Sort the population in order of fitness

      this.sort();
      return this.population[0];
    });
  }
  /**
   * Sorts the population by score (descending)
   * @todo implement a quicksort algorithm in utils
   */


  sort() {
    TimSort.sort(this.population, (a, b) => {
      return a.score === undefined || b.score === undefined ? 0 : b.score - a.score;
    });
  }
  /**
   * Returns the fittest genome of the current population
   *
   * @returns {Network} Current population's fittest genome
   */


  getFittest() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.population[this.population.length - 1].score === undefined) {
        yield this.evaluate();
      }

      this.sort();
      return this.population[0];
    });
  }
  /**
   * Returns the average fitness of the current population
   *
   * @returns {number} Average fitness of the current population
   */


  getAverage() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.population[this.population.length - 1].score === undefined) {
        yield this.evaluate();
      }

      let score = 0;
      this.population.map(genome => genome.score).forEach(val => score += val !== null && val !== void 0 ? val : 0);
      return score / this.population.length;
    });
  }
  /**
   * Replace the whole population with the new genomes
   * @param genomes the genomes which replace the population
   */


  replacePopulation(genomes) {
    this.population = genomes;
    this.options.populationSize = genomes.length;
  }
  /**
   * Reproduce the population, by replacing the killed networks
   * @private
   */


  reproduce() {
    const speciesArr = Array.from(this.species);

    if (speciesArr.length === 0) {
      return;
    }

    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].species === null) {
        const selectedSpecies = this.options.selection.select(speciesArr);
        this.population[i] = selectedSpecies.breed();
        selectedSpecies.forcePut(this.population[i]);
      }
    }
  }
  /**
   * Remove empty species
   * @private
   */


  removeExtinctSpecies() {
    for (const species of Array.from(this.species)) {
      if (species.size() <= 1 || species.stagnation > this.options.maxStagnation) {
        species.members.forEach(member => member.species = null);
        this.species.delete(species);
      }
    }
  }
  /**
   * Kill bad networks
   * @param killRate
   * @private
   */


  kill(killRate) {
    this.species.forEach(species => species.kill(killRate));
  }
  /**
   * Generate species
   * @private
   */


  genSpecies() {
    this.species.forEach(species => species.reset());
    this.population.filter(genome => genome.species === null).forEach(genome => {
      let found = false;

      for (const species of Array.from(this.species)) {
        if (species.put(genome, this.options.c1, this.options.c2, this.options.c3, this.options.speciesDistanceThreshold)) {
          found = true;
          break;
        }
      }

      if (!found) {
        this.species.add(new Species_1.Species(genome));
      }
    });
  }

}

exports.NEAT = NEAT;
},{"./architecture/Species":"../src/architecture/Species.js","./methods/Mutation":"../src/methods/Mutation.js","./utils/Utils":"../src/utils/Utils.js"}],"../src/architecture/Network.js":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Network = void 0;

const threads_1 = require("threads");

const dist_1 = require("threads/dist");

require("threads/register");

const TimSort = __importStar(require("timsort"));

const NodeType_1 = require("../enums/NodeType");

const EvolveOptions_1 = require("../interfaces/EvolveOptions");

const Loss_1 = require("../methods/Loss");

const Mutation_1 = require("../methods/Mutation");

const NEAT_1 = require("../NEAT");

const Utils_1 = require("../utils/Utils");

const Node_1 = require("./Node");
/**
 * Create a neural network
 *
 * Networks are easy to create, all you need to specify is an `input` and an `output` size.
 *
 * @constructs Network
 */


class Network {
  constructor(inputSize, outputSize) {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.nodes = [];
    this.connections = new Set();
    this.gates = new Set();
    this.score = undefined;
    this.species = null; // Create input and output nodes

    for (let i = 0; i < inputSize; i++) {
      this.nodes.push(new Node_1.Node(NodeType_1.NodeType.INPUT));
    }

    for (let i = 0; i < outputSize; i++) {
      this.nodes.push(new Node_1.Node(NodeType_1.NodeType.OUTPUT));
    } // Connect input and output nodes


    for (let i = 0; i < this.inputSize; i++) {
      for (let j = this.inputSize; j < this.outputSize + this.inputSize; j++) {
        // https://stats.stackexchange.com/a/248040/147931
        const weight = (Math.random() - 0.5) * this.inputSize * Math.sqrt(2 / this.inputSize);
        this.connect(this.nodes[i], this.nodes[j], weight);
      }
    }
  }
  /**
   * Convert a json object to a network
   *
   * @param {{input:{number},output:{number},dropout:{number},nodes:Array<object>,connections:Array<object>}} json A network represented as a json object
   *
   * @returns {Network} Network A reconstructed network
   */


  static fromJSON(json) {
    const network = new Network(json.inputSize, json.outputSize);
    network.nodes = [];
    network.connections.clear();
    json.nodes.map(nodeJSON => new Node_1.Node().fromJSON(nodeJSON)).forEach(node => network.nodes[node.index] = node);
    json.connections.forEach(jsonConnection => {
      const connection = network.connect(network.nodes[jsonConnection.fromIndex], network.nodes[jsonConnection.toIndex], jsonConnection.weight);

      if (jsonConnection.gateNodeIndex != null) {
        network.addGate(network.nodes[jsonConnection.gateNodeIndex], connection);
      }
    });
    return network;
  }
  /**
   * Create an offspring from two parent networks.
   *
   * Networks are not required to have the same size, however input and output size should be the same!
   *
   * @todo Add custom [crossover](crossover) method customization
   *
   * @param {Network} network1 First parent network
   * @param {Network} network2 Second parent network
   *
   * @returns {Network} New network created from mixing parent networks
   */


  static crossOver(network1, network2) {
    var _a, _b;

    if (network1.inputSize !== network2.inputSize || network1.outputSize !== network2.outputSize) {
      throw new Error("Networks don`t have the same input/output size!");
    } // Initialise offspring


    const offspring = new Network(network1.inputSize, network1.outputSize);
    offspring.connections.clear(); // clear

    offspring.nodes = []; // clear
    // Save scores and create a copy

    const score1 = (_a = network1.score) !== null && _a !== void 0 ? _a : 0;
    const score2 = (_b = network2.score) !== null && _b !== void 0 ? _b : 0; // Determine offspring node size

    let offspringSize;

    if (score1 === score2) {
      const max = Math.max(network1.nodes.length, network2.nodes.length);
      const min = Math.min(network1.nodes.length, network2.nodes.length);
      offspringSize = Utils_1.randInt(min, max + 1); // [min,max]
    } else if (score1 > score2) {
      offspringSize = network1.nodes.length;
    } else {
      offspringSize = network2.nodes.length;
    }

    const inputSize = network1.inputSize;
    const outputSize = network1.outputSize; // set node indices

    for (let i = 0; i < network1.nodes.length; i++) {
      network1.nodes[i].index = i;
    } // set node indices


    for (let i = 0; i < network2.nodes.length; i++) {
      network2.nodes[i].index = i;
    } // Assign nodes from parents to offspring


    for (let i = 0; i < offspringSize; i++) {
      let chosenNode;
      let chosenNodeType = null; // decide what type of node is needed first check for input and output nodes and fill up with hidden nodes

      if (i < inputSize) {
        // pick input node
        chosenNodeType = NodeType_1.NodeType.INPUT;
        const sourceNetwork = Utils_1.randBoolean() ? network1 : network2;
        let inputNumber = -1;
        let j = -1;

        while (inputNumber < i) {
          if (j++ >= sourceNetwork.nodes.length) {
            throw RangeError('something is wrong with the size of the input');
          }

          if (sourceNetwork.nodes[j].isInputNode()) {
            inputNumber++;
          }
        }

        chosenNode = sourceNetwork.nodes[j];
      } else if (i < inputSize + outputSize) {
        // pick output node
        chosenNodeType = NodeType_1.NodeType.OUTPUT;
        const sourceNetwork = Utils_1.randBoolean() ? network1 : network2;
        let outputNumber = -1;
        let j = -1;

        while (outputNumber < i - inputSize) {
          j++;

          if (j >= sourceNetwork.nodes.length) {
            throw RangeError('something is wrong with the size of the output');
          }

          if (sourceNetwork.nodes[j].isOutputNode()) {
            outputNumber++;
          }
        }

        chosenNode = sourceNetwork.nodes[j];
      } else {
        // pick hidden node
        chosenNodeType = NodeType_1.NodeType.HIDDEN;
        let sourceNetwork;

        if (i >= network1.nodes.length) {
          sourceNetwork = network2;
        } else if (i >= network2.nodes.length) {
          sourceNetwork = network1;
        } else {
          sourceNetwork = Utils_1.randBoolean() ? network1 : network2;
        }

        chosenNode = Utils_1.pickRandom(sourceNetwork.nodes);
      }

      const newNode = new Node_1.Node(chosenNodeType);
      newNode.bias = chosenNode.bias;
      newNode.squash = chosenNode.squash;
      offspring.nodes.push(newNode);
    } // Create arrays of connection genes


    const n1connections = [];
    const n2connections = []; // Add the connections of network 1

    network1.connections.forEach(connection => {
      n1connections[Utils_1.pairing(connection.from.index, connection.to.index)] = connection.toJSON();
    }); // Add the connections of network 2

    network2.connections.forEach(connection => {
      n2connections[Utils_1.pairing(connection.from.index, connection.to.index)] = connection.toJSON();
    }); // Split common conn genes from disjoint or excess conn genes

    const connections = [];
    const keys1 = Object.keys(n1connections);
    const keys2 = Object.keys(n2connections);

    for (let i = keys1.length - 1; i >= 0; i--) {
      if (n2connections[parseInt(keys1[i])] !== undefined) {
        connections.push(Utils_1.randBoolean() ? n1connections[parseInt(keys1[i])] : n2connections[parseInt(keys1[i])]);
        n2connections[parseInt(keys1[i])] = undefined;
      } else if (score1 >= score2) {
        connections.push(n1connections[parseInt(keys1[i])]);
      }
    } // Excess/disjoint gene


    if (score2 >= score1) {
      keys2.map(key => parseInt(key)) // convert to numbers
      .map(key => n2connections[key]) // get the connection
      .filter(conn => conn !== undefined) // filter out undefined connections
      .forEach(conn => connections.push(conn)); // add the filtered connections
    } // Add common conn genes uniformly


    connections.forEach(connectionJSON => {
      if (connectionJSON !== undefined && connectionJSON.toIndex < offspringSize && connectionJSON.fromIndex < offspringSize) {
        const from = offspring.nodes[connectionJSON.fromIndex];
        const to = offspring.nodes[connectionJSON.toIndex];
        const connection = offspring.connect(from, to, connectionJSON.weight);

        if (connectionJSON.gateNodeIndex !== null && connectionJSON.gateNodeIndex < offspringSize) {
          offspring.addGate(offspring.nodes[connectionJSON.gateNodeIndex], connection);
        }
      }
    });
    return offspring;
  }
  /**
   * Returns a copy of Network.
   * @returns {Network} Returns an identical network
   */


  copy() {
    return Network.fromJSON(this.toJSON());
  }
  /**
   * Connects a Node to another Node or Group in the network
   *
   * @param {Node} from The source Node
   * @param {Node} to The destination Node or Group
   * @param {number} [weight=0] An initial weight for the connections to be formed
   *
   * @returns {Connection[]} An array of the formed connections
   */


  connect(from, to, weight = 0) {
    const connection = from.connect(to, weight); // run node-level connect

    this.connections.add(connection); // add it to the array

    return connection;
  }
  /**
   * Activates the network
   *
   * It will activate all the nodes in activation order and produce an output.
   *
   * @param {number[]} [input] Input values to activate nodes with
   * @param options
   * @returns {number[]} Squashed output values
   */


  activate(input, options = {}) {
    var _a, _b;

    if (input.length !== this.inputSize) {
      throw new RangeError("Input size of dataset is different to network input size!");
    } // get default value if no value is given


    options.dropoutRate = (_a = options.dropoutRate) !== null && _a !== void 0 ? _a : 0;
    options.trace = (_b = options.trace) !== null && _b !== void 0 ? _b : true;
    this.nodes.filter(node => node.isInputNode()) // only input nodes
    .forEach((node, index) => node.activate(input[index], options.trace)); // activate them with the input

    this.nodes.filter(node => node.isHiddenNode()) // only hidden nodes
    .forEach(node => {
      if (options.dropoutRate) {
        node.mask = Math.random() >= options.dropoutRate ? 1 : 0;
      }

      node.activate(undefined, options.trace); // activate them
    });
    return this.nodes.filter(node => node.isOutputNode()) // only output nodes
    .map(node => node.activate(undefined, options.trace)); // map them to there activation value will give the network's output
  }
  /**
   * Backpropagate the network
   *
   * This function allows you to teach the network. If you want to do more complex training, use the `network.train()` function.
   *
   * @param {number[]} target Ideal values of the previous activate. Will use the difference to improve the weights
   * @param options More option for propagation
   */


  propagate(target, options = {}) {
    var _a, _b, _c; // get default value if value isn't given


    options.rate = (_a = options.rate) !== null && _a !== void 0 ? _a : 0.3;
    options.momentum = (_b = options.momentum) !== null && _b !== void 0 ? _b : 0;
    options.update = (_c = options.update) !== null && _c !== void 0 ? _c : false;

    if (target.length !== this.outputSize) {
      throw new Error(`Output target length should match network output length`);
    } // Backpropagation: output -> hidden -> input
    // propagate through the output nodes


    this.nodes.filter(node => node.isOutputNode()) // only output nodes
    .forEach((node, index) => node.propagate(target[index], options)); // propagate
    // propagate backwards through the hidden nodes

    for (let i = this.nodes.length - 1; i >= 0; i--) {
      if (this.nodes[i].isHiddenNode()) {
        // only hidden nodes
        this.nodes[i].propagate(undefined, options);
      }
    } // propagate through the input nodes


    this.nodes.filter(node => node.isInputNode()) // only input nodes
    .forEach(node => node.propagate(undefined, options)); // propagate
  }
  /**
   * Clear the context of the network
   */


  clear() {
    this.nodes.forEach(node => node.clear());
  }
  /**
   * Removes the connection of the `from` node to the `to` node
   *
   * @param {Node} from Source node
   * @param {Node} to Destination node
   */


  disconnect(from, to) {
    // remove the connection network-level
    this.connections.forEach(conn => {
      if (conn.from === from && conn.to === to) {
        if (conn.gateNode !== null) {
          this.removeGate(conn); // remove possible gate
        }

        this.connections.delete(conn); // remove connection from array
      }
    }); // disconnect node-level

    return from.disconnect(to);
  }
  /**
   * Makes a network node gate a connection
   *
   * @param {Node} node Gating node
   * @param {Connection} connection Connection to gate with node
   */


  addGate(node, connection) {
    if (this.nodes.indexOf(node) === -1) {
      throw new ReferenceError(`This node is not part of the network!`);
    } else if (connection.gateNode != null) {
      return;
    }

    node.addGate(connection);
    this.gates.add(connection);
  }
  /**
   * Remove the gate of a connection.
   *
   * @param {Connection} connection Connection to remove gate from
   */


  removeGate(connection) {
    if (!this.gates.has(connection)) {
      throw new Error(`This connection is not gated!`);
    }

    this.gates.delete(connection);

    if (connection.gateNode != null) {
      connection.gateNode.removeGate(connection);
    }
  }
  /**
   * Removes a node from a network, all its connections will be redirected. If it gates a connection, the gate will be removed.
   *
   * @param {Node} node Node to remove from the network
   * @param keepGates
   */


  removeNode(node, keepGates = new Mutation_1.SubNodeMutation().keepGates) {
    if (!this.nodes.includes(node)) {
      throw new ReferenceError(`This node does not exist in the network!`);
    }

    this.disconnect(node, node); // remove self connection

    const inputs = []; // keep track

    const gates = []; // keep track

    const outputs = []; // keep track

    const connections = []; // keep track
    // read all inputs from node and keep track of the nodes that gate the incoming connection

    node.incoming.forEach(connection => {
      if (keepGates && connection.gateNode !== null && connection.gateNode !== node) {
        gates.push(connection.gateNode);
      }

      inputs.push(connection.from);
      this.disconnect(connection.from, node);
    }); // read all outputs from node and keep track of the nodes that gate the outgoing connection

    node.outgoing.forEach(connection => {
      if (keepGates && connection.gateNode !== null && connection.gateNode !== node) {
        gates.push(connection.gateNode);
      }

      outputs.push(connection.to);
      this.disconnect(node, connection.to);
    }); // add all connections the node has

    inputs.forEach(input => {
      outputs.forEach(output => {
        if (!input.isProjectingTo(output)) {
          connections.push(this.connect(input, output));
        }
      });
    }); // as long as there are gates and connections

    while (gates.length > 0 && connections.length > 0) {
      const gate = gates.shift(); // take a gate node and remove it from the array

      if (gate === undefined) {
        continue;
      }

      const connection = Utils_1.pickRandom(connections); // take a random connection

      this.addGate(gate, connection); // gate the connection with the gate node

      Utils_1.removeFromArray(connections, connection); // remove the connection from the array
    } // remove every gate the node has


    node.gated.forEach(this.removeGate);
    Utils_1.removeFromArray(this.nodes, node); // remove the node from the nodes array
  }
  /**
   * Mutates the network with the given method.
   *
   * @param {Mutation} method [Mutation method](mutation)
   * @param {object} options
   * @param {number} [options.maxNodes]
   * @param {number} [options.maxConnections]
   * @param {number} [options.maxGates] Maximum amount of Gates a network can grow to
   */


  mutate(method, options) {
    method.mutate(this, options);
  }
  /**
   * Selects a random mutation method and returns a mutated copy of the network. Warning! Mutates network directly.
   *
   * @param {Mutation[]} [allowedMethods=methods.mutation.ALL] An array of [Mutation methods](mutation) to automatically pick from
   * @param {object} options
   * @param {number} [options.maxNodes] Maximum amount of [Nodes](node) a network can grow to
   * @param {number} [options.maxConnections] Maximum amount of [Connections](connection) a network can grow to
   * @param {number} [options.maxGates] Maximum amount of Gates a network can grow to
   */


  mutateRandom(allowedMethods = Mutation_1.ALL_MUTATIONS, options = {}) {
    if (allowedMethods.length === 0) {
      return;
    } // mutate the network with a random allowed mutation


    this.mutate(Utils_1.pickRandom(allowedMethods), options);
  }
  /**
   * Train the given data to this network
   *
   * @param {TrainOptions} options Options used to train network
   *
   * @returns {{error:{number},iterations:{number},time:{number}}} A summary object of the network's performance
   */


  train(options) {
    if (options.dataset[0].input.length !== this.inputSize || options.dataset[0].output.length !== this.outputSize) {
      throw new Error(`Dataset input/output size should be same as network input/output size!`);
    }

    const start = Date.now();

    if (options.iterations <= 0 && options.error <= 0) {
      throw new Error(`At least one of the following options must be specified: error, iterations`);
    } // Split into trainingSet and testSet if cross validation is enabled


    let trainingSetSize;
    let trainingSet;
    let testSet;

    if (options.crossValidateTestSize > 0) {
      trainingSetSize = Math.ceil((1 - options.crossValidateTestSize) * options.dataset.length);
      trainingSet = options.dataset.slice(0, trainingSetSize);
      testSet = options.dataset.slice(trainingSetSize);
    } else {
      trainingSet = options.dataset;
      testSet = [];
    }

    let currentTrainingRate;
    let iterationCount = 0;
    let error = 1; // train until the target error is reached or the target iterations are reached

    while (error > options.error && (options.iterations <= 0 || iterationCount < options.iterations)) {
      iterationCount++; // update the rate according to the rate policy

      currentTrainingRate = options.rate.calc(iterationCount); // train a single epoch

      error = this.trainEpoch({
        dataset: trainingSet,
        batchSize: options.batchSize,
        trainingRate: currentTrainingRate,
        momentum: options.momentum,
        loss: options.loss,
        dropoutRate: options.dropout
      });

      if (options.clear) {
        this.clear();
      } // Run test with the testSet, if cross validation is enabled


      if (options.crossValidateTestSize > 0) {
        error = this.test(testSet, options.loss);

        if (options.clear) {
          this.clear();
        }
      }

      if (options.shuffle) {
        Utils_1.shuffle(options.dataset);
      }

      if (options.log > 0 && iterationCount % options.log === 0) {
        console.log(`iteration number`, iterationCount, `error`, error, `training rate`, currentTrainingRate);
      }

      if (options.schedule && iterationCount % options.schedule.iterations === 0) {
        options.schedule.function(error, iterationCount);
      }
    }

    if (options.clear) {
      this.clear();
    }

    return {
      error,
      iterations: iterationCount,
      time: Date.now() - start
    };
  }
  /**
   * Tests a set and returns the error and elapsed time
   *
   * @param {Array<{input:number[],output:number[]}>} dataset A set of input values and ideal output values to test the network against
   * @param {lossType} [loss=MSELoss] The [loss function](https://en.wikipedia.org/wiki/Loss_function) used to determine network error
   *
   * @returns {number} A summary object of the network's performance
   */


  test(dataset, loss = Loss_1.MSELoss) {
    let error = 0;

    for (const entry of dataset) {
      const input = entry.input;
      const target = entry.output;
      const output = this.activate(input, {
        trace: false
      });
      error += loss(target, output);
    }

    return error / dataset.length;
  }
  /**
   * Convert the network to a json object
   *
   * @returns {NetworkJSON} The network represented as a json object
   */


  toJSON() {
    const json = {
      nodes: [],
      connections: [],
      inputSize: this.inputSize,
      outputSize: this.outputSize
    }; // set node indices

    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].index = i;
    } // convert all nodes to json and add the to the json object


    this.nodes.forEach(node => {
      json.nodes.push(node.toJSON());

      if (node.selfConnection.weight !== 0) {
        // if there is a self connection
        // add it to the json object
        json.connections.push(node.selfConnection.toJSON());
      }
    });
    this.connections.forEach(conn => {
      json.connections.push(conn.toJSON());
    });
    return json;
  }
  /**
   * Evolves the network to reach a lower error on a dataset using the [NEAT algorithm](http://nn.cs.utexas.edu/downloads/papers/stanley.ec02.pdf)
   *
   * If both `iterations` and `error` options are unset, evolve will default to `iterations` as an end condition.
   *
   * @param {object} [options] Configuration options
   *
   * @returns {{error:{number},iterations:{number},time:{number}}} A summary object of the network's performance. <br /> Properties include: `error` - error of the best genome, `iterations` - generations used to evolve networks, `time` - clock time elapsed while evolving
   */


  evolve(options = new EvolveOptions_1.EvolveOptions()) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!options.fitnessFunction && options.dataset && (options.dataset[0].input.length !== this.inputSize || options.dataset[0].output.length !== this.outputSize)) {
        throw new Error(`Dataset input/output size should be same as network input/output size!`);
      } // set options to default if necessary


      options.input = this.inputSize;
      options.output = this.outputSize;
      const start = Date.now(); // @ts-ignore

      let workerPool;

      if (!options.fitnessFunction) {
        // if no fitness function is given
        // create default one
        // Serialize the dataset using JSON
        const serializedDataSet = JSON.stringify(options.dataset);
        const lossIndex = Object.values(Loss_1.ALL_LOSSES).indexOf(options.loss); // init a pool of workers

        workerPool = dist_1.Pool(() => threads_1.spawn(new threads_1.Worker("../multithreading/TestWorker")), options.threads);

        options.fitnessFunction = function (population) {
          return __awaiter(this, void 0, void 0, function* () {
            for (const genome of population) {
              // add a task to the workerPool's queue
              workerPool.queue(test => __awaiter(this, void 0, void 0, function* () {
                if (genome === undefined) {
                  throw new ReferenceError();
                } // test the genome


                genome.score = -(yield test(serializedDataSet, JSON.stringify(genome.toJSON()), lossIndex));
              }));
            }

            yield workerPool.completed(); // wait until every task is done
          });
        };
      }

      options.template = this; // set this network as template for first generation

      const neat = new NEAT_1.NEAT(options);
      let error;
      let bestFitness = 0;
      let bestGenome = this; // run until error goal is reached or iteration goal is reached

      do {
        const fittest = yield neat.evolve(); // run one generation

        if (!fittest.score) {
          throw new ReferenceError();
        }

        error = fittest.score;

        if (neat.options.generation === 1 || fittest.score > bestFitness) {
          bestFitness = fittest.score;
          bestGenome = fittest;
        }

        if (options.schedule && neat.options.generation % options.schedule.iterations === 0) {
          options.schedule.function(fittest.score, -error, neat.options.generation);
        }
      } while (error < -options.error && (options.iterations === 0 || neat.options.generation < options.iterations));

      if (bestGenome !== undefined) {
        // set this network to the fittest from NEAT
        this.nodes = bestGenome.nodes;
        this.connections = bestGenome.connections;
        this.gates = bestGenome.gates;

        if (options.clear) {
          this.clear();
        }
      }

      if (workerPool) {
        yield workerPool.terminate(); // stop all processes
      }

      return {
        error: -error,
        iterations: neat.options.generation,
        time: Date.now() - start
      };
    });
  }
  /**
   * Distance function
   * @param g2 other network
   * @param c1
   * @param c2
   * @param c3
   */


  distance(g2, c1, c2, c3) {
    let g1 = this; // set node indices

    for (let i = 0; i < g1.nodes.length; i++) {
      g1.nodes[i].index = i;
    } // set node indices


    for (let i = 0; i < g2.nodes.length; i++) {
      g2.nodes[i].index = i;
    }

    let indexG1 = 0;
    let indexG2 = 0;
    const connections1 = Array.from(g1.connections).filter(conn => conn !== undefined);
    const connections2 = Array.from(g2.connections).filter(conn => conn !== undefined);
    TimSort.sort(connections1, (a, b) => {
      return a.getInnovationID() - b.getInnovationID();
    });
    TimSort.sort(connections2, (a, b) => {
      return a.getInnovationID() - b.getInnovationID();
    });
    const highestInnovationID1 = connections1[connections1.length - 1].getInnovationID();
    const highestInnovationID2 = connections2[connections2.length - 1].getInnovationID();

    if (highestInnovationID1 < highestInnovationID2) {
      const temp = g1;
      g1 = g2;
      g2 = temp;
    }

    let disjointGenes = 0;
    let totalWeightDiff = 0;
    let similarGenes = 0;

    while (indexG1 < connections1.length && indexG2 < connections2.length) {
      const gene1 = connections1[indexG1];
      const gene2 = connections2[indexG2];

      if (gene1 === undefined || gene2 === undefined) {
        throw Error("HERE");
      }

      const in1 = gene1.getInnovationID();
      const in2 = gene2.getInnovationID();

      if (in1 === in2) {
        // similarGenes
        indexG1++;
        indexG2++;
        totalWeightDiff += Math.abs(gene1.weight - gene2.weight);
        similarGenes++;
      } else if (indexG1 > indexG2) {
        // disjoint of b
        indexG2++;
        disjointGenes++;
      } else {
        // disjoint of a
        indexG1++;
        disjointGenes++;
      }
    }

    totalWeightDiff /= similarGenes;
    const excessGenes = g1.connections.size - indexG1;
    let N = Math.max(g1.connections.size, g2.connections.size);

    if (N < 20) {
      N = 1;
    }

    return c1 * excessGenes / N + c2 * disjointGenes / N + c3 * totalWeightDiff;
  }
  /**
   * Performs one training epoch and returns the error - this is a private function used in `self.train`
   *
   * @private
   *
   * @returns {number}
   */


  trainEpoch(options) {
    let errorSum = 0;

    for (let i = 0; i < options.dataset.length; i++) {
      const input = options.dataset[i].input;
      const correctOutput = options.dataset[i].output;
      const update = (i + 1) % options.batchSize === 0 || i + 1 === options.dataset.length;
      const output = this.activate(input, {
        dropoutRate: options.dropoutRate
      });
      this.propagate(correctOutput, {
        rate: options.trainingRate,
        momentum: options.momentum,
        update
      });
      errorSum += options.loss(correctOutput, output);
    }

    return errorSum / options.dataset.length;
  }

}

exports.Network = Network;
},{"../enums/NodeType":"../src/enums/NodeType.js","../interfaces/EvolveOptions":"../src/interfaces/EvolveOptions.js","../methods/Loss":"../src/methods/Loss.js","../methods/Mutation":"../src/methods/Mutation.js","../NEAT":"../src/NEAT.js","../utils/Utils":"../src/utils/Utils.js","./Node":"../src/architecture/Node.js"}],"../src/architecture/Architect.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Architect = void 0;

const InputLayer_1 = require("./Layers/CoreLayers/InputLayer");

const OutputLayer_1 = require("./Layers/CoreLayers/OutputLayer");

const Layer_1 = require("./Layers/Layer");

const Network_1 = require("./Network");
/**
 * Architect constructs multilayer networks with various types of layers.
 */


class Architect {
  constructor() {
    this.layers = [];
  }
  /**
   * Adds a layer to the architect.
   *
   * @param layer The layer
   * @param incomingConnectionType The incoming connection to this layer
   * @returns this object to function as builder class
   */


  addLayer(layer, incomingConnectionType) {
    const connectionType = incomingConnectionType !== null && incomingConnectionType !== void 0 ? incomingConnectionType : layer.getDefaultIncomingConnectionType();

    if (!layer.connectionTypeisAllowed(connectionType)) {
      throw new ReferenceError("Connection type " + connectionType + " is not allowed at layer " + layer.constructor.name);
    }

    this.layers.push({
      layer,
      incomingConnectionType: connectionType
    });
    return this; // function as builder class
  }
  /**
   * Build the network from the layers added to the architect.
   *
   * @returns the constructed network
   */


  buildModel() {
    if (!(this.layers[0].layer instanceof InputLayer_1.InputLayer)) {
      throw new ReferenceError("First layer has to be a InputLayer! Currently is: " + this.layers[0].layer.constructor.name);
    }

    if (!(this.layers[this.layers.length - 1].layer instanceof OutputLayer_1.OutputLayer)) {
      throw new ReferenceError("Last layer has to be a OutputLayer! Currently is: " + this.layers[this.layers.length - 1].layer.constructor.name);
    }

    const inputSize = this.layers[0].layer.nodes.length;
    const outputSize = this.layers[this.layers.length - 1].layer.nodes.length;
    const network = new Network_1.Network(inputSize, outputSize);
    network.nodes = [];
    network.connections.clear();

    for (let i = 0; i < this.layers.length - 1; i++) {
      Layer_1.Layer.connect(this.layers[i].layer, this.layers[i + 1].layer, this.layers[i + 1].incomingConnectionType).forEach(conn => network.connections.add(conn));
      network.nodes.push(...this.layers[i].layer.nodes);
      this.layers[i].layer.connections.forEach(conn => network.connections.add(conn));
      this.layers[i].layer.gates.forEach(conn => network.gates.add(conn));
    }

    network.nodes.push(...this.layers[this.layers.length - 1].layer.nodes);
    return network;
  }

}

exports.Architect = Architect;
},{"./Layers/CoreLayers/InputLayer":"../src/architecture/Layers/CoreLayers/InputLayer.js","./Layers/CoreLayers/OutputLayer":"../src/architecture/Layers/CoreLayers/OutputLayer.js","./Layers/Layer":"../src/architecture/Layers/Layer.js","./Network":"../src/architecture/Network.js"}],"../src/architecture/Nodes/ActivationNode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActivationNode = void 0;

const Utils_1 = require("../../utils/Utils");

const ConstantNode_1 = require("./ConstantNode");
/**
 * Activation node
 */


class ActivationNode extends ConstantNode_1.ConstantNode {
  constructor() {
    super();
  }
  /**
   * Actives the node.
   *
   * When a neuron activates, it computes its state from all its input connections and 'squashes' it using its activation function, and returns the output (activation).
   *
   * You can also provide the activation (a float between 0 and 1) as a parameter, which is useful for neurons in the input layer.
   *
   * @returns A neuron's output value
   */


  activate() {
    this.old = this.state;
    const incomingStates = Array.from(this.incoming).map(conn => conn.from.activation * conn.weight * conn.gain);

    if (incomingStates.length !== 1) {
      throw new ReferenceError("Only 1 incoming connections is allowed!");
    }

    this.state = incomingStates[0];
    this.activation = this.squash(this.state, false) * this.mask;
    this.derivativeState = this.squash(this.state, true);
    return this.activation;
  }
  /**
   * Backpropagate the error (a.k.a. learn).
   *
   * After an activation, you can teach the node what should have been the correct output (a.k.a. train). This is done by backpropagating. [Momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html) adds a fraction of the previous weight update to the current one. When the gradient keeps pointing in the same direction, this will increase the size of the steps taken towards the minimum.
   *
   * If you combine a high learning rate with a lot of momentum, you will rush past the minimum (of the error function) with huge steps. It is therefore often necessary to reduce the global learning rate µ when using a lot of momentum (m close to 1).
   *
   * @param target The target value (i.e. "the value the network SHOULD have given")
   * @param options More options for propagation
   */


  propagate(target, options) {
    var _a, _b, _c;

    options.momentum = (_a = options.momentum) !== null && _a !== void 0 ? _a : 0;
    options.rate = (_b = options.rate) !== null && _b !== void 0 ? _b : 0.3;
    options.update = (_c = options.update) !== null && _c !== void 0 ? _c : true;
    const connectionsStates = Array.from(this.outgoing).map(conn => conn.to.errorResponsibility * conn.weight * conn.gain);
    this.errorResponsibility = this.errorProjected = Utils_1.sum(connectionsStates) * this.derivativeState;
    this.incoming.forEach(connection => {
      var _a, _b; // calculate gradient


      let gradient = this.errorProjected * connection.eligibility;
      connection.xTrace.forEach((value, key) => {
        gradient += key.errorResponsibility * value;
      });
      connection.deltaWeightsTotal += ((_a = options.rate) !== null && _a !== void 0 ? _a : 0.3) * gradient * this.mask;

      if (options.update) {
        connection.deltaWeightsTotal += ((_b = options.momentum) !== null && _b !== void 0 ? _b : 0) * connection.deltaWeightsPrevious;
        connection.weight += connection.deltaWeightsTotal;
        connection.deltaWeightsPrevious = connection.deltaWeightsTotal;
        connection.deltaWeightsTotal = 0;
      }
    });
  }

}

exports.ActivationNode = ActivationNode;
},{"../../utils/Utils":"../src/utils/Utils.js","./ConstantNode":"../src/architecture/Nodes/ConstantNode.js"}],"../src/architecture/Layers/CoreLayers/ActivationLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActivationLayer = void 0;

const src_1 = require("activations/build/src");

const ConnectionType_1 = require("../../../enums/ConnectionType");

const ActivationNode_1 = require("../../Nodes/ActivationNode");

const Layer_1 = require("../Layer");
/**
 * Activation layer
 */


class ActivationLayer extends Layer_1.Layer {
  constructor(outputSize, options = {}) {
    var _a;

    super(outputSize);
    const activation = (_a = options.activation) !== null && _a !== void 0 ? _a : src_1.Logistic;

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new ActivationNode_1.ActivationNode().setActivationType(activation));
    }

    this.outputNodes = this.inputNodes;
    this.nodes.push(...Array.from(this.inputNodes));
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return type === ConnectionType_1.ConnectionType.ONE_TO_ONE;
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.ONE_TO_ONE;
  }

}

exports.ActivationLayer = ActivationLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../Nodes/ActivationNode":"../src/architecture/Nodes/ActivationNode.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/architecture/Layers/CoreLayers/DenseLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DenseLayer = void 0;

const src_1 = require("activations/build/src");

const ConnectionType_1 = require("../../../enums/ConnectionType");

const NodeType_1 = require("../../../enums/NodeType");

const Node_1 = require("../../Node");

const Layer_1 = require("../Layer");
/**
 * Dense layer
 */


class DenseLayer extends Layer_1.Layer {
  constructor(outputSize, options = {}) {
    var _a;

    super(outputSize);
    const activation = (_a = options.activationType) !== null && _a !== void 0 ? _a : src_1.Logistic;

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setActivationType(activation));
    }

    this.outputNodes = this.inputNodes;
    this.nodes.push(...Array.from(this.inputNodes));
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return true;
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.ALL_TO_ALL;
  }

}

exports.DenseLayer = DenseLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../Node":"../src/architecture/Node.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/architecture/Nodes/DropoutNode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropoutNode = void 0;

const Utils_1 = require("../../utils/Utils");

const ConstantNode_1 = require("./ConstantNode");
/**
 * Dropout node
 */


class DropoutNode extends ConstantNode_1.ConstantNode {
  constructor(probability) {
    super();
    this.probability = probability;
    this.droppedOut = false;
  }
  /**
   * Actives the node.
   *
   * When a neuron activates, it computes its state from all its input connections and 'squashes' it using its activation function, and returns the output (activation).
   *
   * You can also provide the activation (a float between 0 and 1) as a parameter, which is useful for neurons in the input layer.
   *
   * @returns A neuron's output value
   */


  activate() {
    if (this.incoming.size !== 1) {
      throw new RangeError("Dropout node should have exactly one incoming connection!");
    }

    const incomingConnection = Array.from(this.incoming)[0]; // https://stats.stackexchange.com/a/219240

    if (Utils_1.randDouble(0, 1) < this.probability) {
      // DROPOUT
      this.droppedOut = true;
      this.state = 0;
    } else {
      this.droppedOut = false;
      this.state = incomingConnection.from.activation * incomingConnection.weight * incomingConnection.gain;
      this.state *= 1 / (1 - this.probability);
    }

    this.activation = this.squash(this.state, false) * this.mask; // Adjust gain

    this.gated.forEach(conn => conn.gain = this.activation);
    return this.activation;
  }
  /**
   * Backpropagate the error (a.k.a. learn).
   *
   * After an activation, you can teach the node what should have been the correct output (a.k.a. train). This is done by backpropagating. [Momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html) adds a fraction of the previous weight update to the current one. When the gradient keeps pointing in the same direction, this will increase the size of the steps taken towards the minimum.
   *
   * If you combine a high learning rate with a lot of momentum, you will rush past the minimum (of the error function) with huge steps. It is therefore often necessary to reduce the global learning rate µ when using a lot of momentum (m close to 1).
   *
   * @param target The target value (i.e. "the value the network SHOULD have given")
   * @param options More options for propagation
   */


  propagate(target, options = {}) {
    var _a, _b, _c;

    options.momentum = (_a = options.momentum) !== null && _a !== void 0 ? _a : 0;
    options.rate = (_b = options.rate) !== null && _b !== void 0 ? _b : 0.3;
    options.update = (_c = options.update) !== null && _c !== void 0 ? _c : true;
    const connectionsStates = Array.from(this.outgoing).map(conn => conn.to.errorResponsibility * conn.weight * conn.gain);
    this.errorResponsibility = this.errorProjected = Utils_1.sum(connectionsStates) / (1 - this.probability);

    if (this.incoming.size !== 1) {
      throw new RangeError("Dropout node should have exactly one incoming connection!");
    }

    const connection = Array.from(this.incoming)[0]; // calculate gradient

    if (!this.droppedOut) {
      let gradient = this.errorProjected * connection.eligibility;
      connection.xTrace.forEach((value, key) => {
        gradient += key.errorResponsibility * value;
      });

      if (options.update) {
        connection.deltaWeightsTotal += options.rate * gradient * this.mask + options.momentum * connection.deltaWeightsPrevious;
        connection.weight += connection.deltaWeightsTotal;
        connection.deltaWeightsPrevious = connection.deltaWeightsTotal;
        connection.deltaWeightsTotal = 0;
      }
    }
  }
  /**
   * Create a constant node from json object.
   *
   * @param json the json object representing the node
   *
   * @returns the created node
   */


  fromJSON(json) {
    super.fromJSON(json);
    this.probability = json.probability;
    return this;
  }
  /**
   * Convert this node into a json object.
   *
   * @returns the json object representing this node
   */


  toJSON() {
    return Object.assign(super.toJSON(), {
      probability: this.probability
    });
  }

}

exports.DropoutNode = DropoutNode;
},{"../../utils/Utils":"../src/utils/Utils.js","./ConstantNode":"../src/architecture/Nodes/ConstantNode.js"}],"../src/architecture/Layers/CoreLayers/DropoutLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropoutLayer = void 0;

const src_1 = require("activations/build/src");

const ConnectionType_1 = require("../../../enums/ConnectionType");

const DropoutNode_1 = require("../../Nodes/DropoutNode");

const Layer_1 = require("../Layer");
/**
 * Dropout layer
 */


class DropoutLayer extends Layer_1.Layer {
  constructor(outputSize, options = {}) {
    var _a, _b;

    super(outputSize);
    const activation = (_a = options.activation) !== null && _a !== void 0 ? _a : src_1.Identitiy;
    const probability = (_b = options.probability) !== null && _b !== void 0 ? _b : 0.1;

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new DropoutNode_1.DropoutNode(probability).setActivationType(activation));
    }

    this.outputNodes = this.inputNodes;
    this.nodes.push(...Array.from(this.inputNodes));
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.ONE_TO_ONE;
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return type === ConnectionType_1.ConnectionType.ONE_TO_ONE;
  }

}

exports.DropoutLayer = DropoutLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../Nodes/DropoutNode":"../src/architecture/Nodes/DropoutNode.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/architecture/Nodes/PoolNode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolNode = void 0;

const NodeType_1 = require("../../enums/NodeType");

const Utils_1 = require("../../utils/Utils");

const ConstantNode_1 = require("./ConstantNode");
/**
 * Pool node
 */


class PoolNode extends ConstantNode_1.ConstantNode {
  constructor(poolingType = NodeType_1.PoolNodeType.MAX_POOLING) {
    super();
    this.poolingType = poolingType;
    this.receivingNode = null;
  }
  /**
   * Create a constant node from json object.
   *
   * @param json the json object representing the node
   *
   * @returns the created node
   */


  fromJSON(json) {
    super.fromJSON(json);
    this.poolingType = json.poolType;
    return this;
  }
  /**
   * Actives the node.
   *
   * When a neuron activates, it computes its state from all its input connections and 'squashes' it using its activation function, and returns the output (activation).
   *
   * You can also provide the activation (a float between 0 and 1) as a parameter, which is useful for neurons in the input layer.
   *
   * @returns A neuron's output value
   */


  activate() {
    const connections = Array.from(this.incoming);
    const incomingStates = connections.map(conn => conn.from.activation * conn.weight * conn.gain);

    if (this.poolingType === NodeType_1.PoolNodeType.MAX_POOLING) {
      const index = Utils_1.maxValueIndex(incomingStates);
      this.receivingNode = connections[index].from;
      this.state = incomingStates[index];
    } else if (this.poolingType === NodeType_1.PoolNodeType.AVG_POOLING) {
      this.state = Utils_1.avg(incomingStates);
    } else if (this.poolingType === NodeType_1.PoolNodeType.MIN_POOLING) {
      const index = Utils_1.minValueIndex(incomingStates);
      this.receivingNode = connections[index].from;
      this.state = incomingStates[index];
    } else {
      throw new ReferenceError("No valid pooling type! Type: " + this.poolingType);
    }

    this.activation = this.squash(this.state, false) * this.mask;

    if (this.poolingType === NodeType_1.PoolNodeType.AVG_POOLING) {
      this.derivativeState = this.squash(this.state, true);
    } // Adjust gain


    this.gated.forEach(conn => conn.gain = this.activation);
    return this.activation;
  }
  /**
   * Backpropagate the error (a.k.a. learn).
   *
   * After an activation, you can teach the node what should have been the correct output (a.k.a. train). This is done by backpropagating. [Momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html) adds a fraction of the previous weight update to the current one. When the gradient keeps pointing in the same direction, this will increase the size of the steps taken towards the minimum.
   *
   * If you combine a high learning rate with a lot of momentum, you will rush past the minimum (of the error function) with huge steps. It is therefore often necessary to reduce the global learning rate µ when using a lot of momentum (m close to 1).
   *
   * @param target The target value (i.e. "the value the network SHOULD have given")
   * @param options More options for propagation
   */


  propagate(target, options = {}) {
    var _a, _b, _c;

    options.momentum = (_a = options.momentum) !== null && _a !== void 0 ? _a : 0;
    options.rate = (_b = options.rate) !== null && _b !== void 0 ? _b : 0.3;
    options.update = (_c = options.update) !== null && _c !== void 0 ? _c : true;
    const connectionsStates = Array.from(this.outgoing).map(conn => conn.to.errorResponsibility * conn.weight * conn.gain);
    this.errorResponsibility = this.errorProjected = Utils_1.sum(connectionsStates) * this.derivativeState;

    if (this.poolingType === NodeType_1.PoolNodeType.AVG_POOLING) {
      this.incoming.forEach(connection => {
        var _a, _b; // calculate gradient


        let gradient = this.errorProjected * connection.eligibility;
        connection.xTrace.forEach((value, key) => {
          gradient += key.errorResponsibility * value;
        });
        connection.deltaWeightsTotal += ((_a = options.rate) !== null && _a !== void 0 ? _a : 0.3) * gradient * this.mask;

        if (options.update) {
          connection.deltaWeightsTotal += ((_b = options.momentum) !== null && _b !== void 0 ? _b : 0) * connection.deltaWeightsPrevious;
          connection.weight += connection.deltaWeightsTotal;
          connection.deltaWeightsPrevious = connection.deltaWeightsTotal;
          connection.deltaWeightsTotal = 0;
        }
      });
    } else {
      // TODO: don't think that this is correct
      // Passing only the connections that were used for getting the min or max
      this.incoming.forEach(conn => {
        conn.weight = this.receivingNode === conn.from ? 1 : 0;
        conn.gain = this.receivingNode === conn.from ? 1 : 0;
      });
    }
  }
  /**
   * Convert this node into a json object.
   *
   * @returns the json object representing this node
   */


  toJSON() {
    return Object.assign(super.toJSON(), {
      poolType: this.poolingType
    });
  }

}

exports.PoolNode = PoolNode;
},{"../../enums/NodeType":"../src/enums/NodeType.js","../../utils/Utils":"../src/utils/Utils.js","./ConstantNode":"../src/architecture/Nodes/ConstantNode.js"}],"../src/architecture/Layers/PoolingLayers/PoolingLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolingLayer = void 0;

const ConnectionType_1 = require("../../../enums/ConnectionType");

const Layer_1 = require("../Layer");
/**
 * Parent class for all pooling layers
 */


class PoolingLayer extends Layer_1.Layer {
  constructor(outputSize) {
    super(outputSize);
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.POOLING;
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return true;
  }

}

exports.PoolingLayer = PoolingLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/architecture/Layers/PoolingLayers/AvgPooling1DLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AvgPooling1DLayer = void 0;

const src_1 = require("activations/build/src");

const NodeType_1 = require("../../../enums/NodeType");

const PoolNode_1 = require("../../Nodes/PoolNode");

const PoolingLayer_1 = require("./PoolingLayer");
/**
 * Average pooling layer 1D
 */


class AvgPooling1DLayer extends PoolingLayer_1.PoolingLayer {
  constructor(outputSize, options = {}) {
    var _a;

    super(outputSize);
    const activationType = (_a = options.activation) !== null && _a !== void 0 ? _a : src_1.Identitiy;

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new PoolNode_1.PoolNode(NodeType_1.PoolNodeType.AVG_POOLING).setActivationType(activationType));
    }

    this.outputNodes = this.inputNodes;
    this.nodes.push(...Array.from(this.inputNodes));
  }

}

exports.AvgPooling1DLayer = AvgPooling1DLayer;
},{"../../../enums/NodeType":"../src/enums/NodeType.js","../../Nodes/PoolNode":"../src/architecture/Nodes/PoolNode.js","./PoolingLayer":"../src/architecture/Layers/PoolingLayers/PoolingLayer.js"}],"../src/architecture/Layers/PoolingLayers/GlobalAvgPooling1DLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlobalAvgPooling1DLayer = void 0;

const AvgPooling1DLayer_1 = require("./AvgPooling1DLayer");
/**
 * Global average pooling layer 1D
 */


class GlobalAvgPooling1DLayer extends AvgPooling1DLayer_1.AvgPooling1DLayer {
  constructor(outputSize, options = {}) {
    super(1, options);
  }

}

exports.GlobalAvgPooling1DLayer = GlobalAvgPooling1DLayer;
},{"./AvgPooling1DLayer":"../src/architecture/Layers/PoolingLayers/AvgPooling1DLayer.js"}],"../src/architecture/Layers/PoolingLayers/MaxPooling1DLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MaxPooling1DLayer = void 0;

const src_1 = require("activations/build/src");

const NodeType_1 = require("../../../enums/NodeType");

const PoolNode_1 = require("../../Nodes/PoolNode");

const PoolingLayer_1 = require("./PoolingLayer");
/**
 * Maximum pooling layer 1D
 */


class MaxPooling1DLayer extends PoolingLayer_1.PoolingLayer {
  constructor(outputSize, options = {}) {
    var _a;

    super(outputSize);
    const activationType = (_a = options.activation) !== null && _a !== void 0 ? _a : src_1.Identitiy;

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new PoolNode_1.PoolNode(NodeType_1.PoolNodeType.MAX_POOLING).setActivationType(activationType));
    }

    this.outputNodes = this.inputNodes;
    this.nodes.push(...Array.from(this.inputNodes));
  }

}

exports.MaxPooling1DLayer = MaxPooling1DLayer;
},{"../../../enums/NodeType":"../src/enums/NodeType.js","../../Nodes/PoolNode":"../src/architecture/Nodes/PoolNode.js","./PoolingLayer":"../src/architecture/Layers/PoolingLayers/PoolingLayer.js"}],"../src/architecture/Layers/PoolingLayers/GlobalMaxPooling1DLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlobalMaxPooling1DLayer = void 0;

const MaxPooling1DLayer_1 = require("./MaxPooling1DLayer");
/**
 * Global maximum pooling layer 1D
 */


class GlobalMaxPooling1DLayer extends MaxPooling1DLayer_1.MaxPooling1DLayer {
  constructor(outputSize, options = {}) {
    super(1, options);
  }

}

exports.GlobalMaxPooling1DLayer = GlobalMaxPooling1DLayer;
},{"./MaxPooling1DLayer":"../src/architecture/Layers/PoolingLayers/MaxPooling1DLayer.js"}],"../src/architecture/Layers/PoolingLayers/MinPooling1DLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MinPooling1DLayer = void 0;

const src_1 = require("activations/build/src");

const NodeType_1 = require("../../../enums/NodeType");

const PoolNode_1 = require("../../Nodes/PoolNode");

const PoolingLayer_1 = require("./PoolingLayer");
/**
 * Minimum pooling layer 1D
 */


class MinPooling1DLayer extends PoolingLayer_1.PoolingLayer {
  constructor(outputSize, options = {}) {
    var _a;

    super(outputSize);
    const activationType = (_a = options.activation) !== null && _a !== void 0 ? _a : src_1.Identitiy;

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new PoolNode_1.PoolNode(NodeType_1.PoolNodeType.MIN_POOLING).setActivationType(activationType));
    }

    this.outputNodes = this.inputNodes;
    this.nodes.push(...Array.from(this.inputNodes));
  }

}

exports.MinPooling1DLayer = MinPooling1DLayer;
},{"../../../enums/NodeType":"../src/enums/NodeType.js","../../Nodes/PoolNode":"../src/architecture/Nodes/PoolNode.js","./PoolingLayer":"../src/architecture/Layers/PoolingLayers/PoolingLayer.js"}],"../src/architecture/Layers/PoolingLayers/GlobalMinPooling1DLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlobalMinPooling1DLayer = void 0;

const MinPooling1DLayer_1 = require("./MinPooling1DLayer");
/**
 * Global minimum pooling layer 1D
 */


class GlobalMinPooling1DLayer extends MinPooling1DLayer_1.MinPooling1DLayer {
  constructor(outputSize, options = {}) {
    super(1, options);
  }

}

exports.GlobalMinPooling1DLayer = GlobalMinPooling1DLayer;
},{"./MinPooling1DLayer":"../src/architecture/Layers/PoolingLayers/MinPooling1DLayer.js"}],"../src/architecture/Layers/RecurrentLayers/GRULayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GRULayer = void 0;

const src_1 = require("activations/build/src");

const ConnectionType_1 = require("../../../enums/ConnectionType");

const GatingType_1 = require("../../../enums/GatingType");

const NodeType_1 = require("../../../enums/NodeType");

const Node_1 = require("../../Node");

const Layer_1 = require("../Layer");
/**
 * GRU layer
 */


class GRULayer extends Layer_1.Layer {
  constructor(outputSize, options = {}) {
    super(outputSize);
    const updateGate = [];
    const inverseUpdateGate = [];
    const resetGate = [];
    const memoryCell = [];
    const previousOutput = [];

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
      updateGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(1));
      inverseUpdateGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(0).setActivationType(src_1.Logistic));
      resetGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(0));
      memoryCell.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setActivationType(src_1.TANH));
      previousOutput.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(0).setActivationType(src_1.Logistic));
      this.outputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
    }

    this.connections.push(...Layer_1.Layer.connect(this.inputNodes, updateGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    this.connections.push(...Layer_1.Layer.connect(this.inputNodes, resetGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    this.connections.push(...Layer_1.Layer.connect(this.inputNodes, memoryCell, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    this.connections.push(...Layer_1.Layer.connect(previousOutput, updateGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    this.connections.push(...Layer_1.Layer.connect(updateGate, inverseUpdateGate, ConnectionType_1.ConnectionType.ONE_TO_ONE, 1));
    this.connections.push(...Layer_1.Layer.connect(previousOutput, resetGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    const reset = Layer_1.Layer.connect(previousOutput, memoryCell, ConnectionType_1.ConnectionType.ALL_TO_ALL);
    this.connections.push(...reset);
    this.gates.push(...Layer_1.Layer.gate(resetGate, reset, GatingType_1.GatingType.OUTPUT));
    const update = Layer_1.Layer.connect(previousOutput, this.outputNodes, ConnectionType_1.ConnectionType.ALL_TO_ALL);
    const inverseUpdate = Layer_1.Layer.connect(memoryCell, this.outputNodes, ConnectionType_1.ConnectionType.ALL_TO_ALL);
    this.connections.push(...update);
    this.connections.push(...inverseUpdate);
    this.gates.push(...Layer_1.Layer.gate(updateGate, update, GatingType_1.GatingType.OUTPUT));
    this.gates.push(...Layer_1.Layer.gate(inverseUpdateGate, inverseUpdate, GatingType_1.GatingType.OUTPUT));
    this.connections.push(...Layer_1.Layer.connect(this.outputNodes, previousOutput, ConnectionType_1.ConnectionType.ONE_TO_ONE, 1));
    this.nodes.push(...Array.from(this.inputNodes));
    this.nodes.push(...updateGate);
    this.nodes.push(...inverseUpdateGate);
    this.nodes.push(...resetGate);
    this.nodes.push(...memoryCell);
    this.nodes.push(...Array.from(this.outputNodes));
    this.nodes.push(...previousOutput);
    this.outputNodes.forEach(node => {
      var _a;

      return node.squash = (_a = options.activation) !== null && _a !== void 0 ? _a : src_1.Logistic;
    });
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return true;
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.ALL_TO_ALL;
  }

}

exports.GRULayer = GRULayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/GatingType":"../src/enums/GatingType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../Node":"../src/architecture/Node.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/architecture/Layers/RecurrentLayers/HopfieldLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HopfieldLayer = void 0;

const src_1 = require("activations/build/src");

const ConnectionType_1 = require("../../../enums/ConnectionType");

const NodeType_1 = require("../../../enums/NodeType");

const Node_1 = require("../../Node");

const Layer_1 = require("../Layer");
/**
 * Hopfield layer
 */


class HopfieldLayer extends Layer_1.Layer {
  constructor(outputSize) {
    super(outputSize);

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
      this.outputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setActivationType(src_1.BinaryStep));
    }

    this.connections.push(...Layer_1.Layer.connect(this.inputNodes, this.outputNodes, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    this.connections.push(...Layer_1.Layer.connect(this.outputNodes, this.inputNodes, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    this.nodes.push(...Array.from(this.inputNodes));
    this.nodes.push(...Array.from(this.outputNodes));
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return true;
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.ALL_TO_ALL;
  }

}

exports.HopfieldLayer = HopfieldLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../Node":"../src/architecture/Node.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/architecture/Layers/RecurrentLayers/LSTMLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LSTMLayer = void 0;

const src_1 = require("activations/build/src");

const ConnectionType_1 = require("../../../enums/ConnectionType");

const GatingType_1 = require("../../../enums/GatingType");

const NodeType_1 = require("../../../enums/NodeType");

const Node_1 = require("../../Node");

const Layer_1 = require("../Layer");
/**
 * LSTM layer
 */


class LSTMLayer extends Layer_1.Layer {
  constructor(outputSize, options = {}) {
    super(outputSize);
    const inputGate = [];
    const forgetGate = [];
    const memoryCell = [];
    const outputGate = [];

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
      inputGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(1));
      forgetGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(1).setActivationType(src_1.Logistic));
      memoryCell.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
      outputGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(1));
      this.outputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
    }

    this.connections.push(...Layer_1.Layer.connect(memoryCell, inputGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    this.connections.push(...Layer_1.Layer.connect(memoryCell, forgetGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    this.connections.push(...Layer_1.Layer.connect(memoryCell, outputGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    const forgetGateConnections = Layer_1.Layer.connect(memoryCell, memoryCell, ConnectionType_1.ConnectionType.ONE_TO_ONE);
    const outputGateConnections = Layer_1.Layer.connect(memoryCell, this.outputNodes, ConnectionType_1.ConnectionType.ALL_TO_ALL);
    this.connections.push(...forgetGateConnections);
    this.connections.push(...outputGateConnections);
    this.connections.push(...Layer_1.Layer.connect(this.inputNodes, memoryCell, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    this.connections.push(...Layer_1.Layer.connect(this.inputNodes, outputGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    this.connections.push(...Layer_1.Layer.connect(this.inputNodes, forgetGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));
    const inputGateConnections = Layer_1.Layer.connect(this.inputNodes, inputGate, ConnectionType_1.ConnectionType.ALL_TO_ALL);
    this.connections.push(...inputGateConnections);
    this.gates.push(...Layer_1.Layer.gate(forgetGate, forgetGateConnections, GatingType_1.GatingType.SELF));
    this.gates.push(...Layer_1.Layer.gate(outputGate, outputGateConnections, GatingType_1.GatingType.OUTPUT));
    this.gates.push(...Layer_1.Layer.gate(inputGate, inputGateConnections, GatingType_1.GatingType.INPUT));
    this.nodes.push(...Array.from(this.inputNodes));
    this.nodes.push(...inputGate);
    this.nodes.push(...forgetGate);
    this.nodes.push(...memoryCell);
    this.nodes.push(...outputGate);
    this.nodes.push(...Array.from(this.outputNodes));
    this.outputNodes.forEach(node => {
      var _a;

      return node.squash = (_a = options.activation) !== null && _a !== void 0 ? _a : src_1.TANH;
    });
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return true;
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.ALL_TO_ALL;
  }

}

exports.LSTMLayer = LSTMLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/GatingType":"../src/enums/GatingType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../Node":"../src/architecture/Node.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/architecture/Layers/RecurrentLayers/MemoryLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MemoryLayer = void 0;

const src_1 = require("activations/build/src");

const ConnectionType_1 = require("../../../enums/ConnectionType");

const NodeType_1 = require("../../../enums/NodeType");

const Node_1 = require("../../Node");

const Layer_1 = require("../Layer");
/**
 * Memory layer
 */


class MemoryLayer extends Layer_1.Layer {
  constructor(outputSize, options = {}) {
    var _a;

    super(outputSize);

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
    }

    let prevNodes = Array.from(this.inputNodes);
    const nodes = [];

    for (let i = 0; i < ((_a = options.memorySize) !== null && _a !== void 0 ? _a : 1); i++) {
      const block = [];

      for (let j = 0; j < outputSize; j++) {
        const node = new Node_1.Node(NodeType_1.NodeType.HIDDEN);
        node.squash = src_1.Identitiy;
        node.bias = 0;
        block.push(node);
      }

      this.connections.push(...Layer_1.Layer.connect(prevNodes, block, ConnectionType_1.ConnectionType.ONE_TO_ONE));
      nodes.push(...block);
      prevNodes = block;
    }

    this.nodes.push(...Array.from(this.inputNodes));
    this.nodes.push(...nodes.reverse());
    prevNodes.forEach(node => this.outputNodes.add(node));
    this.outputNodes.forEach(node => {
      var _a;

      return node.squash = (_a = options.activation) !== null && _a !== void 0 ? _a : src_1.Logistic;
    });
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return true;
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.ALL_TO_ALL;
  }

}

exports.MemoryLayer = MemoryLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../Node":"../src/architecture/Node.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/architecture/Layers/RecurrentLayers/RNNLayer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RNNLayer = void 0;

const src_1 = require("activations/build/src");

const ConnectionType_1 = require("../../../enums/ConnectionType");

const NodeType_1 = require("../../../enums/NodeType");

const Node_1 = require("../../Node");

const Layer_1 = require("../Layer");
/**
 * RNN layer
 */


class RNNLayer extends Layer_1.Layer {
  constructor(outputSize, options = {}) {
    var _a;

    super(outputSize);

    for (let i = 0; i < outputSize; i++) {
      this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setActivationType((_a = options.activation) !== null && _a !== void 0 ? _a : src_1.Logistic));
    }

    this.outputNodes = this.inputNodes;
    this.nodes.push(...Array.from(this.inputNodes)); // Adding self connections

    this.connections.push(...Layer_1.Layer.connect(this.nodes, this.nodes, ConnectionType_1.ConnectionType.ONE_TO_ONE));
  }
  /**
   * Checks if a given connection type is allowed on this layer.
   *
   * @param type the type to check
   *
   * @return Is this connection type allowed?
   */


  connectionTypeisAllowed(type) {
    return true;
  }
  /**
   * Gets the default connection type for a incoming connection to this layer.
   *
   * @returns the default incoming connection
   */


  getDefaultIncomingConnectionType() {
    return ConnectionType_1.ConnectionType.ALL_TO_ALL;
  }

}

exports.RNNLayer = RNNLayer;
},{"../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../Node":"../src/architecture/Node.js","../Layer":"../src/architecture/Layers/Layer.js"}],"../src/methods/Rate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InverseRate = exports.ExponentialRate = exports.StepRate = exports.FixedRate = exports.Rate = void 0;
/**
 * Built-in learning rate policies, which allow for a dynamic learning rate during neural network training.
 *
 * @see [Learning rates and how-to improve performance](https://towardsdatascience.com/understanding-learning-rates-and-how-it-improves-performance-in-deep-learning-d0d4059c1c10)
 * @see [Learning rate policy](https://stackoverflow.com/questions/30033096/what-is-lr-policy-in-caffe/30045244)
 *
 */

class Rate {
  /**
   * Constructs a rate policy
   * @param baseRate the rate at first iteration
   */
  constructor(baseRate) {
    this.baseRate = baseRate;
  }

}

exports.Rate = Rate;
/**
 * Fixed Learning Rate
 *
 * Default rate policy. Using this will make learning rate static (no change). Useful as a way to update a previous rate policy.
 */

class FixedRate extends Rate {
  /**
   * Calculates the current training rate.
   *
   * @param iteration count
   * @returns the current training rate
   */
  calc(iteration) {
    return this.baseRate;
  }

}

exports.FixedRate = FixedRate;
/**
 * Step Learning Rate
 *
 * The learning rate will decrease (i.e. 'step down') every `stepSize` iterations.
 */

class StepRate extends Rate {
  /**
   * Constructs a step rate policy.
   *
   * @param baseRate the rate at first iteration
   * @param gamma=0.9 Learning rate retention per step; - _0 < `gamma` < 1_ - _large `gamma` CAN cause networks to never converge, low `gamma` CAN cause networks to converge too quickly_
   * @param stepSize=100 Learning rate is updated every `step_size` iterations
   */
  constructor(baseRate, gamma = 0.9, stepSize = 100) {
    super(baseRate);
    this.gamma = gamma;
    this.stepSize = stepSize;
  }
  /**
   * Calculates the current training rate.
   *
   * @param iteration count
   * @returns the current training rate
   */


  calc(iteration) {
    return this.baseRate * Math.pow(this.gamma, Math.floor(iteration / this.stepSize));
  }

}

exports.StepRate = StepRate;
/**
 * Exponential Learning Rate
 *
 * The learning rate will exponentially decrease.
 *
 * The rate at `iteration` is calculated as: `rate = base_rate * Math.pow(gamma, iteration)`
 */

class ExponentialRate extends Rate {
  /**
   * Constructs a step rate policy.
   *
   * @param baseRate the rate at first iteration
   * @param gamma=0.9 Learning rate retention per step; - _0 < `gamma` < 1_ - _large `gamma` CAN cause networks to never converge, low `gamma` CAN cause networks to converge too quickly_
   */
  constructor(baseRate, gamma = 0.999) {
    super(baseRate);
    this.gamma = gamma;
  }
  /**
   * Calculates the current training rate.
   *
   * @param iteration count
   * @returns the current training rate
   */


  calc(iteration) {
    return this.baseRate * Math.pow(this.gamma, iteration);
  }

}

exports.ExponentialRate = ExponentialRate;
/**
 * Inverse Exponential Learning Rate
 *
 * The learning rate will exponentially decrease.
 *
 * The rate at `iteration` is calculated as: `rate = baseRate * Math.pow(1 + gamma * iteration, -power)`
 */

class InverseRate extends Rate {
  /**
   * Constructs a step rate policy.
   *
   * @param baseRate the rate at first iteration
   * @param gamma=0.001 Learning rate decay per iteration; - _0 < `gamma` < 1_ - _large `gamma` CAN cause networks to converge too quickly and stop learning, low `gamma` CAN cause networks to converge to learn VERY slowly_
   * @param power=2 Decay rate per iteration - _0 < `power`_ - _large `power` CAN cause networks to stop learning quickly, low `power` CAN cause networks to learn VERY slowly_
   */
  constructor(baseRate, gamma = 0.001, power = 2) {
    super(baseRate);
    this.gamma = gamma;
    this.power = power;
  }
  /**
   * Calculates the current training rate.
   *
   * @param iteration count
   * @returns the current training rate
   */


  calc(iteration) {
    return this.baseRate * Math.pow(1 + this.gamma * iteration, -this.power);
  }

}

exports.InverseRate = InverseRate;
},{}],"../src/interfaces/TrainOptions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrainOptions = void 0;

const Loss_1 = require("../methods/Loss");

const Rate_1 = require("../methods/Rate");
/**
 * Options used to train network
 */


class TrainOptions {
  constructor(dataset) {
    this._dataset = dataset;
    this._iterations = -1;
    this._error = -1;
    this._loss = Loss_1.MSELoss;
    this._dropout = 0;
    this._momentum = 0;
    this._batchSize = this.dataset.length;
    this._rate = new Rate_1.FixedRate(0.3);
    this._log = -1;
    this._crossValidateTestSize = -1;
    this._shuffle = false;
    this._clear = false;
  }
  /**
   * Getter
   */


  get dataset() {
    return this._dataset;
  }
  /**
   * Setter
   */


  set dataset(value) {
    this._dataset = value;
  }
  /**
   * Getter
   */


  get shuffle() {
    return this._shuffle;
  }
  /**
   * Setter
   */


  set shuffle(value) {
    this._shuffle = value;
  }
  /**
   * Getter
   */


  get clear() {
    return this._clear;
  }
  /**
   * Setter
   */


  set clear(value) {
    this._clear = value;
  }
  /**
   * Getter
   */


  get schedule() {
    return this._schedule;
  }
  /**
   * Setter
   */


  set schedule(value) {
    this._schedule = value;
  }
  /**
   * Getter
   */


  get crossValidateTestSize() {
    return this._crossValidateTestSize;
  }
  /**
   * Setter
   */


  set crossValidateTestSize(value) {
    this._crossValidateTestSize = value;
  }
  /**
   * Getter
   */


  get rate() {
    return this._rate;
  }
  /**
   * Setter
   */


  set rate(value) {
    this._rate = value;
  }
  /**
   * Getter
   */


  get loss() {
    return this._loss;
  }
  /**
   * Setter
   */


  set loss(value) {
    this._loss = value;
  }
  /**
   * Getter
   */


  get iterations() {
    return this._iterations;
  }
  /**
   * Setter
   */


  set iterations(value) {
    this._iterations = value;
  }
  /**
   * Getter
   */


  get error() {
    return this._error;
  }
  /**
   * Setter
   */


  set error(value) {
    this._error = value;
  }
  /**
   * Getter
   */


  get momentum() {
    return this._momentum;
  }
  /**
   * Setter
   */


  set momentum(value) {
    this._momentum = value;
  }
  /**
   * Getter
   */


  get dropout() {
    return this._dropout;
  }
  /**
   * Setter
   */


  set dropout(value) {
    this._dropout = value;
  }
  /**
   * Getter
   */


  get log() {
    return this._log;
  }
  /**
   * Setter
   */


  set log(value) {
    this._log = value;
  }
  /**
   * Getter
   */


  get batchSize() {
    return this._batchSize;
  }
  /**
   * Setter
   */


  set batchSize(value) {
    this._batchSize = value;
  }

}

exports.TrainOptions = TrainOptions;
},{"../methods/Loss":"../src/methods/Loss.js","../methods/Rate":"../src/methods/Rate.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateGaussian = exports.avg = exports.sum = exports.min = exports.minValueIndex = exports.maxValueIndex = exports.max = exports.shuffle = exports.removeFromArray = exports.randBoolean = exports.randDouble = exports.randInt = exports.pickRandom = exports.TournamentSelection = exports.PowerSelection = exports.FitnessProportionateSelection = exports.Selection = exports.InverseRate = exports.ExponentialRate = exports.StepRate = exports.FixedRate = exports.Rate = exports.SwapNodesMutation = exports.SubBackConnectionMutation = exports.AddBackConnectionMutation = exports.SubSelfConnectionMutation = exports.AddSelfConnectionMutation = exports.SubGateMutation = exports.AddGateMutation = exports.ModActivationMutation = exports.ModBiasMutation = exports.ModWeightMutation = exports.SubConnectionMutation = exports.AddConnectionMutation = exports.SubNodeMutation = exports.AddNodeMutation = exports.Mutation = exports.ONLY_STRUCTURE = exports.NO_STRUCTURE_MUTATIONS = exports.FEEDFORWARD_MUTATIONS = exports.ALL_MUTATIONS = exports.HINGELoss = exports.MSLELoss = exports.WAPELoss = exports.MAPELoss = exports.MAELoss = exports.BinaryLoss = exports.MBELoss = exports.MSELoss = exports.ALL_LOSSES = exports.TrainOptions = exports.EvolveOptions = exports.NoiseNodeType = exports.PoolNodeType = exports.NodeType = exports.GatingType = exports.ConnectionType = exports.Node = exports.Species = exports.Network = exports.Connection = exports.Architect = exports.PoolNode = exports.NoiseNode = exports.DropoutNode = exports.ConstantNode = exports.Layer = exports.MemoryLayer = exports.LSTMLayer = exports.GRULayer = exports.RNNLayer = exports.HopfieldLayer = exports.ActivationLayer = exports.PoolingLayer = exports.GlobalMaxPooling1DLayer = exports.GlobalMinPooling1DLayer = exports.GlobalAvgPooling1DLayer = exports.MaxPooling1DLayer = exports.MinPooling1DLayer = exports.AvgPooling1DLayer = exports.NoiseLayer = exports.OutputLayer = exports.InputLayer = exports.DropoutLayer = exports.DenseLayer = void 0;

const Architect_1 = require("../src/architecture/Architect");

Object.defineProperty(exports, "Architect", {
  enumerable: true,
  get: function () {
    return Architect_1.Architect;
  }
});

const Connection_1 = require("../src/architecture/Connection");

Object.defineProperty(exports, "Connection", {
  enumerable: true,
  get: function () {
    return Connection_1.Connection;
  }
});

const ActivationLayer_1 = require("../src/architecture/Layers/CoreLayers/ActivationLayer");

Object.defineProperty(exports, "ActivationLayer", {
  enumerable: true,
  get: function () {
    return ActivationLayer_1.ActivationLayer;
  }
});

const DenseLayer_1 = require("../src/architecture/Layers/CoreLayers/DenseLayer");

Object.defineProperty(exports, "DenseLayer", {
  enumerable: true,
  get: function () {
    return DenseLayer_1.DenseLayer;
  }
});

const DropoutLayer_1 = require("../src/architecture/Layers/CoreLayers/DropoutLayer");

Object.defineProperty(exports, "DropoutLayer", {
  enumerable: true,
  get: function () {
    return DropoutLayer_1.DropoutLayer;
  }
});

const InputLayer_1 = require("../src/architecture/Layers/CoreLayers/InputLayer");

Object.defineProperty(exports, "InputLayer", {
  enumerable: true,
  get: function () {
    return InputLayer_1.InputLayer;
  }
});

const OutputLayer_1 = require("../src/architecture/Layers/CoreLayers/OutputLayer");

Object.defineProperty(exports, "OutputLayer", {
  enumerable: true,
  get: function () {
    return OutputLayer_1.OutputLayer;
  }
});

const Layer_1 = require("../src/architecture/Layers/Layer");

Object.defineProperty(exports, "Layer", {
  enumerable: true,
  get: function () {
    return Layer_1.Layer;
  }
});

const NoiseLayer_1 = require("../src/architecture/Layers/NoiseLayers/NoiseLayer");

Object.defineProperty(exports, "NoiseLayer", {
  enumerable: true,
  get: function () {
    return NoiseLayer_1.NoiseLayer;
  }
});

const AvgPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/AvgPooling1DLayer");

Object.defineProperty(exports, "AvgPooling1DLayer", {
  enumerable: true,
  get: function () {
    return AvgPooling1DLayer_1.AvgPooling1DLayer;
  }
});

const GlobalAvgPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/GlobalAvgPooling1DLayer");

Object.defineProperty(exports, "GlobalAvgPooling1DLayer", {
  enumerable: true,
  get: function () {
    return GlobalAvgPooling1DLayer_1.GlobalAvgPooling1DLayer;
  }
});

const GlobalMaxPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/GlobalMaxPooling1DLayer");

Object.defineProperty(exports, "GlobalMaxPooling1DLayer", {
  enumerable: true,
  get: function () {
    return GlobalMaxPooling1DLayer_1.GlobalMaxPooling1DLayer;
  }
});

const GlobalMinPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/GlobalMinPooling1DLayer");

Object.defineProperty(exports, "GlobalMinPooling1DLayer", {
  enumerable: true,
  get: function () {
    return GlobalMinPooling1DLayer_1.GlobalMinPooling1DLayer;
  }
});

const MaxPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/MaxPooling1DLayer");

Object.defineProperty(exports, "MaxPooling1DLayer", {
  enumerable: true,
  get: function () {
    return MaxPooling1DLayer_1.MaxPooling1DLayer;
  }
});

const MinPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/MinPooling1DLayer");

Object.defineProperty(exports, "MinPooling1DLayer", {
  enumerable: true,
  get: function () {
    return MinPooling1DLayer_1.MinPooling1DLayer;
  }
});

const PoolingLayer_1 = require("../src/architecture/Layers/PoolingLayers/PoolingLayer");

Object.defineProperty(exports, "PoolingLayer", {
  enumerable: true,
  get: function () {
    return PoolingLayer_1.PoolingLayer;
  }
});

const GRULayer_1 = require("../src/architecture/Layers/RecurrentLayers/GRULayer");

Object.defineProperty(exports, "GRULayer", {
  enumerable: true,
  get: function () {
    return GRULayer_1.GRULayer;
  }
});

const HopfieldLayer_1 = require("../src/architecture/Layers/RecurrentLayers/HopfieldLayer");

Object.defineProperty(exports, "HopfieldLayer", {
  enumerable: true,
  get: function () {
    return HopfieldLayer_1.HopfieldLayer;
  }
});

const LSTMLayer_1 = require("../src/architecture/Layers/RecurrentLayers/LSTMLayer");

Object.defineProperty(exports, "LSTMLayer", {
  enumerable: true,
  get: function () {
    return LSTMLayer_1.LSTMLayer;
  }
});

const MemoryLayer_1 = require("../src/architecture/Layers/RecurrentLayers/MemoryLayer");

Object.defineProperty(exports, "MemoryLayer", {
  enumerable: true,
  get: function () {
    return MemoryLayer_1.MemoryLayer;
  }
});

const RNNLayer_1 = require("../src/architecture/Layers/RecurrentLayers/RNNLayer");

Object.defineProperty(exports, "RNNLayer", {
  enumerable: true,
  get: function () {
    return RNNLayer_1.RNNLayer;
  }
});

const Network_1 = require("../src/architecture/Network");

Object.defineProperty(exports, "Network", {
  enumerable: true,
  get: function () {
    return Network_1.Network;
  }
});

const Node_1 = require("../src/architecture/Node");

Object.defineProperty(exports, "Node", {
  enumerable: true,
  get: function () {
    return Node_1.Node;
  }
});

const ConstantNode_1 = require("../src/architecture/Nodes/ConstantNode");

Object.defineProperty(exports, "ConstantNode", {
  enumerable: true,
  get: function () {
    return ConstantNode_1.ConstantNode;
  }
});

const DropoutNode_1 = require("../src/architecture/Nodes/DropoutNode");

Object.defineProperty(exports, "DropoutNode", {
  enumerable: true,
  get: function () {
    return DropoutNode_1.DropoutNode;
  }
});

const NoiseNode_1 = require("../src/architecture/Nodes/NoiseNode");

Object.defineProperty(exports, "NoiseNode", {
  enumerable: true,
  get: function () {
    return NoiseNode_1.NoiseNode;
  }
});

const PoolNode_1 = require("../src/architecture/Nodes/PoolNode");

Object.defineProperty(exports, "PoolNode", {
  enumerable: true,
  get: function () {
    return PoolNode_1.PoolNode;
  }
});

const Species_1 = require("../src/architecture/Species");

Object.defineProperty(exports, "Species", {
  enumerable: true,
  get: function () {
    return Species_1.Species;
  }
});

const ConnectionType_1 = require("../src/enums/ConnectionType");

Object.defineProperty(exports, "ConnectionType", {
  enumerable: true,
  get: function () {
    return ConnectionType_1.ConnectionType;
  }
});

const GatingType_1 = require("../src/enums/GatingType");

Object.defineProperty(exports, "GatingType", {
  enumerable: true,
  get: function () {
    return GatingType_1.GatingType;
  }
});

const NodeType_1 = require("../src/enums/NodeType");

Object.defineProperty(exports, "NodeType", {
  enumerable: true,
  get: function () {
    return NodeType_1.NodeType;
  }
});
Object.defineProperty(exports, "NoiseNodeType", {
  enumerable: true,
  get: function () {
    return NodeType_1.NoiseNodeType;
  }
});
Object.defineProperty(exports, "PoolNodeType", {
  enumerable: true,
  get: function () {
    return NodeType_1.PoolNodeType;
  }
});

const EvolveOptions_1 = require("../src/interfaces/EvolveOptions");

Object.defineProperty(exports, "EvolveOptions", {
  enumerable: true,
  get: function () {
    return EvolveOptions_1.EvolveOptions;
  }
});

const TrainOptions_1 = require("../src/interfaces/TrainOptions");

Object.defineProperty(exports, "TrainOptions", {
  enumerable: true,
  get: function () {
    return TrainOptions_1.TrainOptions;
  }
});

const Loss_1 = require("../src/methods/Loss");

Object.defineProperty(exports, "ALL_LOSSES", {
  enumerable: true,
  get: function () {
    return Loss_1.ALL_LOSSES;
  }
});
Object.defineProperty(exports, "BinaryLoss", {
  enumerable: true,
  get: function () {
    return Loss_1.BinaryLoss;
  }
});
Object.defineProperty(exports, "HINGELoss", {
  enumerable: true,
  get: function () {
    return Loss_1.HINGELoss;
  }
});
Object.defineProperty(exports, "MAELoss", {
  enumerable: true,
  get: function () {
    return Loss_1.MAELoss;
  }
});
Object.defineProperty(exports, "MAPELoss", {
  enumerable: true,
  get: function () {
    return Loss_1.MAPELoss;
  }
});
Object.defineProperty(exports, "MBELoss", {
  enumerable: true,
  get: function () {
    return Loss_1.MBELoss;
  }
});
Object.defineProperty(exports, "MSELoss", {
  enumerable: true,
  get: function () {
    return Loss_1.MSELoss;
  }
});
Object.defineProperty(exports, "MSLELoss", {
  enumerable: true,
  get: function () {
    return Loss_1.MSLELoss;
  }
});
Object.defineProperty(exports, "WAPELoss", {
  enumerable: true,
  get: function () {
    return Loss_1.WAPELoss;
  }
});

const Mutation_1 = require("../src/methods/Mutation");

Object.defineProperty(exports, "AddBackConnectionMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.AddBackConnectionMutation;
  }
});
Object.defineProperty(exports, "AddConnectionMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.AddConnectionMutation;
  }
});
Object.defineProperty(exports, "AddGateMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.AddGateMutation;
  }
});
Object.defineProperty(exports, "AddNodeMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.AddNodeMutation;
  }
});
Object.defineProperty(exports, "AddSelfConnectionMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.AddSelfConnectionMutation;
  }
});
Object.defineProperty(exports, "ALL_MUTATIONS", {
  enumerable: true,
  get: function () {
    return Mutation_1.ALL_MUTATIONS;
  }
});
Object.defineProperty(exports, "FEEDFORWARD_MUTATIONS", {
  enumerable: true,
  get: function () {
    return Mutation_1.FEEDFORWARD_MUTATIONS;
  }
});
Object.defineProperty(exports, "ModActivationMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.ModActivationMutation;
  }
});
Object.defineProperty(exports, "ModBiasMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.ModBiasMutation;
  }
});
Object.defineProperty(exports, "ModWeightMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.ModWeightMutation;
  }
});
Object.defineProperty(exports, "Mutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.Mutation;
  }
});
Object.defineProperty(exports, "NO_STRUCTURE_MUTATIONS", {
  enumerable: true,
  get: function () {
    return Mutation_1.NO_STRUCTURE_MUTATIONS;
  }
});
Object.defineProperty(exports, "ONLY_STRUCTURE", {
  enumerable: true,
  get: function () {
    return Mutation_1.ONLY_STRUCTURE;
  }
});
Object.defineProperty(exports, "SubBackConnectionMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.SubBackConnectionMutation;
  }
});
Object.defineProperty(exports, "SubConnectionMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.SubConnectionMutation;
  }
});
Object.defineProperty(exports, "SubGateMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.SubGateMutation;
  }
});
Object.defineProperty(exports, "SubNodeMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.SubNodeMutation;
  }
});
Object.defineProperty(exports, "SubSelfConnectionMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.SubSelfConnectionMutation;
  }
});
Object.defineProperty(exports, "SwapNodesMutation", {
  enumerable: true,
  get: function () {
    return Mutation_1.SwapNodesMutation;
  }
});

const Rate_1 = require("../src/methods/Rate");

Object.defineProperty(exports, "ExponentialRate", {
  enumerable: true,
  get: function () {
    return Rate_1.ExponentialRate;
  }
});
Object.defineProperty(exports, "FixedRate", {
  enumerable: true,
  get: function () {
    return Rate_1.FixedRate;
  }
});
Object.defineProperty(exports, "InverseRate", {
  enumerable: true,
  get: function () {
    return Rate_1.InverseRate;
  }
});
Object.defineProperty(exports, "Rate", {
  enumerable: true,
  get: function () {
    return Rate_1.Rate;
  }
});
Object.defineProperty(exports, "StepRate", {
  enumerable: true,
  get: function () {
    return Rate_1.StepRate;
  }
});

const Selection_1 = require("../src/methods/Selection");

Object.defineProperty(exports, "FitnessProportionateSelection", {
  enumerable: true,
  get: function () {
    return Selection_1.FitnessProportionateSelection;
  }
});
Object.defineProperty(exports, "PowerSelection", {
  enumerable: true,
  get: function () {
    return Selection_1.PowerSelection;
  }
});
Object.defineProperty(exports, "Selection", {
  enumerable: true,
  get: function () {
    return Selection_1.Selection;
  }
});
Object.defineProperty(exports, "TournamentSelection", {
  enumerable: true,
  get: function () {
    return Selection_1.TournamentSelection;
  }
});

const Utils_1 = require("../src/utils/Utils");

Object.defineProperty(exports, "avg", {
  enumerable: true,
  get: function () {
    return Utils_1.avg;
  }
});
Object.defineProperty(exports, "generateGaussian", {
  enumerable: true,
  get: function () {
    return Utils_1.generateGaussian;
  }
});
Object.defineProperty(exports, "max", {
  enumerable: true,
  get: function () {
    return Utils_1.max;
  }
});
Object.defineProperty(exports, "maxValueIndex", {
  enumerable: true,
  get: function () {
    return Utils_1.maxValueIndex;
  }
});
Object.defineProperty(exports, "min", {
  enumerable: true,
  get: function () {
    return Utils_1.min;
  }
});
Object.defineProperty(exports, "minValueIndex", {
  enumerable: true,
  get: function () {
    return Utils_1.minValueIndex;
  }
});
Object.defineProperty(exports, "pickRandom", {
  enumerable: true,
  get: function () {
    return Utils_1.pickRandom;
  }
});
Object.defineProperty(exports, "randBoolean", {
  enumerable: true,
  get: function () {
    return Utils_1.randBoolean;
  }
});
Object.defineProperty(exports, "randDouble", {
  enumerable: true,
  get: function () {
    return Utils_1.randDouble;
  }
});
Object.defineProperty(exports, "randInt", {
  enumerable: true,
  get: function () {
    return Utils_1.randInt;
  }
});
Object.defineProperty(exports, "removeFromArray", {
  enumerable: true,
  get: function () {
    return Utils_1.removeFromArray;
  }
});
Object.defineProperty(exports, "shuffle", {
  enumerable: true,
  get: function () {
    return Utils_1.shuffle;
  }
});
Object.defineProperty(exports, "sum", {
  enumerable: true,
  get: function () {
    return Utils_1.sum;
  }
});
},{"../src/architecture/Architect":"../src/architecture/Architect.js","../src/architecture/Connection":"../src/architecture/Connection.js","../src/architecture/Layers/CoreLayers/ActivationLayer":"../src/architecture/Layers/CoreLayers/ActivationLayer.js","../src/architecture/Layers/CoreLayers/DenseLayer":"../src/architecture/Layers/CoreLayers/DenseLayer.js","../src/architecture/Layers/CoreLayers/DropoutLayer":"../src/architecture/Layers/CoreLayers/DropoutLayer.js","../src/architecture/Layers/CoreLayers/InputLayer":"../src/architecture/Layers/CoreLayers/InputLayer.js","../src/architecture/Layers/CoreLayers/OutputLayer":"../src/architecture/Layers/CoreLayers/OutputLayer.js","../src/architecture/Layers/Layer":"../src/architecture/Layers/Layer.js","../src/architecture/Layers/NoiseLayers/NoiseLayer":"../src/architecture/Layers/NoiseLayers/NoiseLayer.js","../src/architecture/Layers/PoolingLayers/AvgPooling1DLayer":"../src/architecture/Layers/PoolingLayers/AvgPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/GlobalAvgPooling1DLayer":"../src/architecture/Layers/PoolingLayers/GlobalAvgPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/GlobalMaxPooling1DLayer":"../src/architecture/Layers/PoolingLayers/GlobalMaxPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/GlobalMinPooling1DLayer":"../src/architecture/Layers/PoolingLayers/GlobalMinPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/MaxPooling1DLayer":"../src/architecture/Layers/PoolingLayers/MaxPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/MinPooling1DLayer":"../src/architecture/Layers/PoolingLayers/MinPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/PoolingLayer":"../src/architecture/Layers/PoolingLayers/PoolingLayer.js","../src/architecture/Layers/RecurrentLayers/GRULayer":"../src/architecture/Layers/RecurrentLayers/GRULayer.js","../src/architecture/Layers/RecurrentLayers/HopfieldLayer":"../src/architecture/Layers/RecurrentLayers/HopfieldLayer.js","../src/architecture/Layers/RecurrentLayers/LSTMLayer":"../src/architecture/Layers/RecurrentLayers/LSTMLayer.js","../src/architecture/Layers/RecurrentLayers/MemoryLayer":"../src/architecture/Layers/RecurrentLayers/MemoryLayer.js","../src/architecture/Layers/RecurrentLayers/RNNLayer":"../src/architecture/Layers/RecurrentLayers/RNNLayer.js","../src/architecture/Network":"../src/architecture/Network.js","../src/architecture/Node":"../src/architecture/Node.js","../src/architecture/Nodes/ConstantNode":"../src/architecture/Nodes/ConstantNode.js","../src/architecture/Nodes/DropoutNode":"../src/architecture/Nodes/DropoutNode.js","../src/architecture/Nodes/NoiseNode":"../src/architecture/Nodes/NoiseNode.js","../src/architecture/Nodes/PoolNode":"../src/architecture/Nodes/PoolNode.js","../src/architecture/Species":"../src/architecture/Species.js","../src/enums/ConnectionType":"../src/enums/ConnectionType.js","../src/enums/GatingType":"../src/enums/GatingType.js","../src/enums/NodeType":"../src/enums/NodeType.js","../src/interfaces/EvolveOptions":"../src/interfaces/EvolveOptions.js","../src/interfaces/TrainOptions":"../src/interfaces/TrainOptions.js","../src/methods/Loss":"../src/methods/Loss.js","../src/methods/Mutation":"../src/methods/Mutation.js","../src/methods/Rate":"../src/methods/Rate.js","../src/methods/Selection":"../src/methods/Selection.js","../src/utils/Utils":"../src/utils/Utils.js"}]},{},["index.js"], "carrot")
//# sourceMappingURL=/index.js.map