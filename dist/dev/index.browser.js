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
var ConnectionType;

(function (ConnectionType) {
  ConnectionType[ConnectionType["NO_CONNECTION"] = 0] = "NO_CONNECTION";
  ConnectionType[ConnectionType["ALL_TO_ALL"] = 1] = "ALL_TO_ALL";
  ConnectionType[ConnectionType["ONE_TO_ONE"] = 2] = "ONE_TO_ONE";
  ConnectionType[ConnectionType["POOLING"] = 3] = "POOLING";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
},{}],"../src/enums/GatingType.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GatingType;

(function (GatingType) {
  GatingType[GatingType["INPUT"] = 0] = "INPUT";
  GatingType[GatingType["SELF"] = 1] = "SELF";
  GatingType[GatingType["OUTPUT"] = 2] = "OUTPUT";
})(GatingType = exports.GatingType || (exports.GatingType = {}));
},{}],"../src/architecture/Layers/Layer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ConnectionType_1 = require("../../enums/ConnectionType");

var GatingType_1 = require("../../enums/GatingType");

var Layer =
/** @class */
function () {
  function Layer(outputSize) {
    this.outputSize = outputSize;
    this.nodes = [];
    this.inputNodes = new Set();
    this.outputNodes = new Set();
    this.connections = [];
    this.gates = [];
  }

  Layer.connect = function (from, to, connectionType, weight) {
    if (connectionType === void 0) {
      connectionType = ConnectionType_1.ConnectionType.ALL_TO_ALL;
    }

    if (weight === void 0) {
      weight = 1;
    }

    if (connectionType === ConnectionType_1.ConnectionType.NO_CONNECTION) {
      throw new ReferenceError("Cannot connect with 'NO_CONNECTION' connection type");
    }

    var fromNodes = Array.from(from instanceof Layer ? from.outputNodes : from);
    var toNodes = Array.from(to instanceof Layer ? to.inputNodes : to);

    if (toNodes.length === 0) {
      throw new ReferenceError("Target from has no input nodes!");
    }

    if (fromNodes.length === 0) {
      throw new ReferenceError("This from has no output nodes!");
    }

    var connections = [];

    if (connectionType === ConnectionType_1.ConnectionType.ALL_TO_ALL) {
      fromNodes.forEach(function (fromNode) {
        toNodes.forEach(function (toNode) {
          connections.push(fromNode.connect(toNode, weight)); // connect every "from node" to every "to node"
        });
      });
    } else if (connectionType === ConnectionType_1.ConnectionType.ONE_TO_ONE) {
      if (fromNodes.length !== toNodes.length) {
        throw new RangeError("Can't connect one to one! Number of output nodes from are unequal number of incoming nodes from next layer!");
      }

      for (var i = 0; i < fromNodes.length; i++) {
        connections.push(fromNodes[i].connect(toNodes[i], weight)); // connect every nodes with same indices
      }
    } else if (connectionType === ConnectionType_1.ConnectionType.POOLING) {
      // connect the same amount of input nodes to every output node
      // every input node has only one connection available
      var ratio_1 = toNodes.length / fromNodes.length;
      connections.push.apply(connections, fromNodes.map(function (node, index) {
        return node.connect(toNodes[Math.floor(index * ratio_1)], weight);
      }));
    }

    return connections;
  };

  Layer.gate = function (nodes, connections, gateType) {
    var gatedConnections = [];

    switch (gateType) {
      case GatingType_1.GatingType.INPUT:
        {
          // gate incoming connections
          var toNodes = Array.from(new Set(connections.map(function (conn) {
            return conn.to;
          })));

          var _loop_1 = function _loop_1(i) {
            var node = toNodes[i];
            var gateNode = nodes[i % nodes.length];
            node.incoming.filter(function (conn) {
              return connections.includes(conn);
            }).forEach(function (conn) {
              gateNode.addGate(conn);
              gatedConnections.push(conn);
            });
          };

          for (var i = 0; i < toNodes.length; i++) {
            _loop_1(i);
          }

          break;
        }

      case GatingType_1.GatingType.SELF:
        {
          // gate self connections
          var fromNodes = Array.from(new Set(connections.map(function (conn) {
            return conn.from;
          })));

          for (var i = 0; i < fromNodes.length; i++) {
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
          var fromNodes = Array.from(new Set(connections.map(function (conn) {
            return conn.from;
          })));

          var _loop_2 = function _loop_2(i) {
            var node = fromNodes[i];
            var gateNode = nodes[i % nodes.length];
            node.outgoing.filter(function (conn) {
              return connections.includes(conn);
            }).forEach(function (conn) {
              gateNode.addGate(conn);
              gatedConnections.push(conn);
            });
          };

          for (var i = 0; i < fromNodes.length; i++) {
            _loop_2(i);
          }

          break;
        }
    }

    return gatedConnections;
  };

  Layer.prototype.getDefaultIncomingConnectionType = function () {
    return ConnectionType_1.ConnectionType.ALL_TO_ALL;
  };

  Layer.prototype.connectionTypeisAllowed = function (type) {
    return true;
  };

  return Layer;
}();

exports.Layer = Layer;
},{"../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../enums/GatingType":"../src/enums/GatingType.js"}],"../src/methods/Utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Returns an random element from the given array.
 *
 * @param arr the array to pick from
 * @returns the random picked element
 */

function pickRandom(arr) {
  if (arr.length === 0) {
    throw new RangeError("Cannot pick from an empty array");
  }

  return arr[randInt(0, arr.length)];
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
  var index = arr.indexOf(elem);

  if (index === -1) {
    return false;
  } else {
    arr.splice(index, 1);
    return true;
  }
}

exports.removeFromArray = removeFromArray;
/**
 * Checks a given value. If value is undefined return the default value.
 *
 * @param value to check
 * @param defaultValue to return if value is undefined
 * @returns value if defined otherwise defaultValue
 */

function getOrDefault(value, defaultValue) {
  return value !== null && value !== void 0 ? value : defaultValue;
}

exports.getOrDefault = getOrDefault;
/**
 * Shuffles an aray
 * @param array the array
 * @returns the shuffled array
 */

function shuffle(array) {
  var counter = array.length; // While there are elements in the array

  while (counter > 0) {
    // Pick a random index
    var index = randInt(0, counter); // Decrease counter by 1

    counter--; // And swap the last element with it

    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

exports.shuffle = shuffle;

function max(array) {
  var maxValue = -Infinity;

  for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
    var value = array_1[_i];

    if (value > maxValue) {
      maxValue = value;
    }
  }

  return maxValue;
}

exports.max = max;

function maxValueIndex(array) {
  var maxValue = array[0];
  var maxValueIndex = 0;

  for (var i = 0; i < array.length; i++) {
    if (array[i] > maxValue) {
      maxValue = array[i];
      maxValueIndex = i;
    }
  }

  return maxValueIndex;
}

exports.maxValueIndex = maxValueIndex;

function minValueIndex(array) {
  var minValue = array[0];
  var minValueIndex = 0;

  for (var i = 0; i < array.length; i++) {
    if (array[i] < minValue) {
      minValue = array[i];
      minValueIndex = i;
    }
  }

  return minValueIndex;
}

exports.minValueIndex = minValueIndex;

function min(array) {
  var minValue = Infinity;

  for (var _i = 0, array_2 = array; _i < array_2.length; _i++) {
    var value = array_2[_i];

    if (value < minValue) {
      minValue = value;
    }
  }

  return minValue;
}

exports.min = min;

function avg(array) {
  return sum(array) / array.length;
}

exports.avg = avg;

function sum(array) {
  var sum = 0;

  for (var _i = 0, array_3 = array; _i < array_3.length; _i++) {
    var value = array_3[_i];
    sum += value;
  }

  return sum;
}

exports.sum = sum;

function generateGaussian(mean, deviation) {
  if (mean === void 0) {
    mean = 0;
  }

  if (deviation === void 0) {
    deviation = 2;
  }

  var sum = 0;
  var numSamples = 10;

  for (var i = 0; i < numSamples; i++) {
    sum += Math.random();
  }

  return deviation * sum / numSamples + mean - 0.5 * deviation;
}

exports.generateGaussian = generateGaussian;
},{}],"../src/enums/NodeType.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NodeType;

(function (NodeType) {
  NodeType[NodeType["INPUT"] = 0] = "INPUT";
  NodeType[NodeType["HIDDEN"] = 1] = "HIDDEN";
  NodeType[NodeType["OUTPUT"] = 2] = "OUTPUT";
  NodeType[NodeType["POOL_NODE"] = 3] = "POOL_NODE";
})(NodeType = exports.NodeType || (exports.NodeType = {}));

var PoolNodeType;

(function (PoolNodeType) {
  PoolNodeType[PoolNodeType["MAX_POOLING"] = 0] = "MAX_POOLING";
  PoolNodeType[PoolNodeType["AVG_POOLING"] = 1] = "AVG_POOLING";
  PoolNodeType[PoolNodeType["MIN_POOLING"] = 2] = "MIN_POOLING";
})(PoolNodeType = exports.PoolNodeType || (exports.PoolNodeType = {}));

var NoiseNodeType;

(function (NoiseNodeType) {
  NoiseNodeType[NoiseNodeType["GAUSSIAN_NOISE"] = 0] = "GAUSSIAN_NOISE";
})(NoiseNodeType = exports.NoiseNodeType || (exports.NoiseNodeType = {}));
},{}],"../src/methods/Mutation.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Node_1 = require("../architecture/Node");

var Utils_1 = require("./Utils");

var NodeType_1 = require("../enums/NodeType");
/**
 *
 * Genetic algorithm mutation methods. Creates variations (mutations) in neural networks which are then selected for better performance.
 *
 * @see {@link https://en.wikipedia.org/wiki/mutation_(genetic_algorithm)|Mutation (genetic algorithms) on Wikipedia}
 * @see {@link https://en.wikipedia.org/wiki/Genetic_algorithm#Selection|Selection (genetic algorithms) on Wikipedia}
 *
 * @example <caption>Mutation methods with networks</caption>
 *
 * let myNetwork = new Network(5, 5);
 *
 * // Setting a mutation method for a network
 * myNetwork.mutate(new AddNodeMutation());
 *
 * // specifying a list of network mutation methods to use during evolution
 * myNetwork.evolve(trainingset, {
 *  mutation: [new AddNodeMutation(),new ModBiasMutation()]
 * }
 *
 * @example <caption>Using a mutation method with a neuron</caption>
 *
 * let myNode = new Node(NodeType.HIDDEN);
 *
 * myNode.mutateBias(new ModBiasMutation(-0.5,0.3));
 */


var Mutation =
/** @class */
function () {
  function Mutation() {}

  return Mutation;
}();

exports.Mutation = Mutation;
/**
 * Add node mutation.
 *
 * Adds a hidden node to the network.
 *
 * @prop {boolean} randomActivation=true If enabled, sets a random activation function on the newly created node
 *
 * @example
 *
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new AddNodeMutation());
 */

var AddNodeMutation =
/** @class */
function (_super) {
  __extends(AddNodeMutation, _super);

  function AddNodeMutation(randomActivation) {
    if (randomActivation === void 0) {
      randomActivation = true;
    }

    var _this = _super.call(this) || this;

    _this.randomActivation = randomActivation;
    return _this;
  }

  AddNodeMutation.prototype.mutate = function (network, options) {
    // check if max nodes is already reached
    if (options !== undefined && options.maxNodes !== undefined && network.nodes.length >= options.maxNodes) {
      return;
    } // create a new hidden node


    var node = new Node_1.Node(NodeType_1.NodeType.HIDDEN);

    if (this.randomActivation) {
      node.mutateActivation(); // choose random activation
    } // take a random connection


    var connection = Utils_1.pickRandom(network.connections);
    var from = connection.from;
    var to = connection.to;
    network.disconnect(from, to); // disconnect it
    // put the node in between the connection

    var minBound = Math.max(network.inputSize, 1 + network.nodes.indexOf(from));
    network.nodes.splice(minBound, 0, node);
    var newConnection1 = network.connect(from, node, 1);
    var newConnection2 = network.connect(node, to, connection.weight);

    if (connection.gateNode != null) {
      // if connection had a gate node
      // choose randomly which new connection should get this gate node
      if (Utils_1.randBoolean()) {
        network.addGate(connection.gateNode, newConnection1);
      } else {
        network.addGate(connection.gateNode, newConnection2);
      }
    }
  };

  return AddNodeMutation;
}(Mutation);

exports.AddNodeMutation = AddNodeMutation;
/**
 * Sub node mutation.
 *
 * Removes a random node from the network.
 *
 * @prop keepGates=true Ensures replacement node has gated connections if the removed node did.
 *
 * @example
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new AddNodeMutation()); // Network will have one hidden node
 * myNetwork.mutate(new SubNodeMutation()); // Network will have no hidden node
 */

var SubNodeMutation =
/** @class */
function (_super) {
  __extends(SubNodeMutation, _super);

  function SubNodeMutation(keepGates) {
    if (keepGates === void 0) {
      keepGates = true;
    }

    var _this = _super.call(this) || this;

    _this.keepGates = keepGates;
    return _this;
  }

  SubNodeMutation.prototype.mutate = function (network) {
    var possible = network.nodes.filter(function (node) {
      return node !== undefined && node.isHiddenNode();
    }); // hidden nodes

    if (possible.length > 0) {
      network.removeNode(Utils_1.pickRandom(possible)); // remove a random node from the filtered array
    }
  };

  return SubNodeMutation;
}(Mutation);

exports.SubNodeMutation = SubNodeMutation;
/**
 * Add connections mutation.
 *
 * Adds a connection to the network.
 *
 * @example
 *
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new AddNodeMutation()); // adds a hidden node
 * myNetwork.mutate(new AddConnectionMutation()); // creates a random forward pointing connection
 */

var AddConnectionMutation =
/** @class */
function (_super) {
  __extends(AddConnectionMutation, _super);

  function AddConnectionMutation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  AddConnectionMutation.prototype.mutate = function (network, options) {
    // check if max connections is already reached
    if (options !== undefined && options.maxConnections !== undefined && network.connections.length >= options.maxConnections) {
      return;
    }

    var possible = [];

    for (var i = 0; i < network.nodes.length - network.outputSize; i++) {
      var from = network.nodes[i];

      for (var j = Math.max(i + 1, network.inputSize); j < network.nodes.length; j++) {
        var to = network.nodes[j];

        if (!from.isProjectingTo(to)) {
          possible.push([from, to]);
        }
      }
    }

    if (possible.length > 0) {
      var pair = Utils_1.pickRandom(possible);
      network.connect(pair[0], pair[1]);
    }
  };

  return AddConnectionMutation;
}(Mutation);

exports.AddConnectionMutation = AddConnectionMutation;
/**
 * Sub connection mutation.
 *
 * Removes a random connection from the network.
 *
 * @example
 *
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new SubConnectionMutation());
 */

var SubConnectionMutation =
/** @class */
function (_super) {
  __extends(SubConnectionMutation, _super);

  function SubConnectionMutation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  SubConnectionMutation.prototype.mutate = function (network) {
    var possible = network.connections.filter(function (conn) {
      return conn.from.outgoing.length > 1;
    }) // do not deactivate a neuron
    .filter(function (conn) {
      return conn.to.incoming.length > 1;
    }) // do not deactivate a neuron
    .filter(function (conn) {
      return network.nodes.indexOf(conn.to) > network.nodes.indexOf(conn.from);
    }); // look for forward pointing connections

    if (possible.length > 0) {
      var randomConnection = Utils_1.pickRandom(possible); // pick a random connection from the filtered array

      network.disconnect(randomConnection.from, randomConnection.to); // remove the connection from the network
    }
  };

  return SubConnectionMutation;
}(Mutation);

exports.SubConnectionMutation = SubConnectionMutation;
/**
 * Mod weight mutation.
 *
 * Modifies the weight of a random connection.
 *
 * @prop {number} min=-1 lower bound for weight modification
 * @prop {number} max=1 higher bound for weight modification
 *
 * @example
 *
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new ModWeightMutation()); // modifies the weight of a random connection
 */

var ModWeightMutation =
/** @class */
function (_super) {
  __extends(ModWeightMutation, _super);

  function ModWeightMutation(min, max) {
    if (min === void 0) {
      min = -1;
    }

    if (max === void 0) {
      max = 1;
    }

    var _this = _super.call(this) || this;

    _this.min = min;
    _this.max = max;
    return _this;
  }

  ModWeightMutation.prototype.mutate = function (network) {
    // pick random connection and mutate it's weight
    Utils_1.pickRandom(network.connections).weight += Utils_1.randDouble(this.min, this.max);
  };

  return ModWeightMutation;
}(Mutation);

exports.ModWeightMutation = ModWeightMutation;
/**
 * Mod bias mutation.
 *
 * Modifies the bias value of a random hidden or output node
 *
 * @prop {number} min=-1 lower bound for modification of a neuron's bias
 * @prop {number} max=1 higher bound for modification of a neuron's bias
 *
 * @example
 *
 * let myNetwork = new Network(5, 5);
 *
 * let myNode = new Node();
 *
 * myNode.mutate(new ModBiasMutation());
 */

var ModBiasMutation =
/** @class */
function (_super) {
  __extends(ModBiasMutation, _super);

  function ModBiasMutation(min, max) {
    if (min === void 0) {
      min = -1;
    }

    if (max === void 0) {
      max = 1;
    }

    var _this = _super.call(this) || this;

    _this.min = min;
    _this.max = max;
    return _this;
  }

  ModBiasMutation.prototype.mutate = function (network) {
    Utils_1.pickRandom(network.nodes.filter(function (node) {
      return !node.isInputNode();
    })) // pick random hidden or output node
    .mutateBias(this); // mutate it's bias
  };

  return ModBiasMutation;
}(Mutation);

exports.ModBiasMutation = ModBiasMutation;
/**
 * Mod activation mutation.
 *
 * Modifies the activation function of a random node
 *
 * @prop {boolean} mutateOutput=false Change activation function of network output neurons. Enable this to let the network experiment with its output.
 *
 * @example <caption>Mutating the activation function of a node</caption>
 * let myNode = new Node();
 *
 * myNode.mutate(new ModActivationMutation());
 */

var ModActivationMutation =
/** @class */
function (_super) {
  __extends(ModActivationMutation, _super);

  function ModActivationMutation(mutateOutput) {
    if (mutateOutput === void 0) {
      mutateOutput = false;
    }

    var _this = _super.call(this) || this;

    _this.mutateOutput = mutateOutput;
    return _this;
  }

  ModActivationMutation.prototype.mutate = function (network, options) {
    var possible = this.mutateOutput ? network.nodes.filter(function (node) {
      return !node.isInputNode();
    }) // hidden and output nodes
    : network.nodes.filter(function (node) {
      return node.isHiddenNode();
    }); // hidden nodes

    if (possible.length > 0) {
      Utils_1.pickRandom(possible).mutateActivation(options === null || options === void 0 ? void 0 : options.allowedActivations); // mutate the activation of the node
    }
  };

  return ModActivationMutation;
}(Mutation);

exports.ModActivationMutation = ModActivationMutation;
/**
 * Add self connection.
 *
 * Adds a connection from a node to itself.
 *
 * @example
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new AddSelfConnectionMutation());
 */

var AddSelfConnectionMutation =
/** @class */
function (_super) {
  __extends(AddSelfConnectionMutation, _super);

  function AddSelfConnectionMutation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  AddSelfConnectionMutation.prototype.mutate = function (network) {
    var possible = network.nodes.filter(function (node) {
      return !node.isInputNode();
    }) // no input nodes
    .filter(function (node) {
      return node.selfConnection.weight === 0;
    }); // only nodes that doesn't have an self connection already

    if (possible.length > 0) {
      var node = Utils_1.pickRandom(possible); // pick a random node from the filtered array

      network.connect(node, node); // connection the node to itself
    }
  };

  return AddSelfConnectionMutation;
}(Mutation);

exports.AddSelfConnectionMutation = AddSelfConnectionMutation;
/**
 * Sub self connection.
 *
 * Removes a connection from a node to itself.
 *
 * @example
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new AddSelfConnectionMutation()); // add a self connection
 * myNetwork.mutate(new SubSelfConnectionMutation()); // remove a self connection
 */

var SubSelfConnectionMutation =
/** @class */
function (_super) {
  __extends(SubSelfConnectionMutation, _super);

  function SubSelfConnectionMutation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  SubSelfConnectionMutation.prototype.mutate = function (network) {
    var possible = network.connections.filter(function (conn) {
      return conn.from === conn.to;
    });

    if (possible.length > 0) {
      var randomConnection = Utils_1.pickRandom(possible);
      network.disconnect(randomConnection.from, randomConnection.to);
    }
  };

  return SubSelfConnectionMutation;
}(Mutation);

exports.SubSelfConnectionMutation = SubSelfConnectionMutation;
/**
 * Add gate mutation.
 *
 * Adds a gate to the network.
 *
 * @example
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new AddGateMutation());
 */

var AddGateMutation =
/** @class */
function (_super) {
  __extends(AddGateMutation, _super);

  function AddGateMutation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  AddGateMutation.prototype.mutate = function (network, options) {
    // check if max gates isn't reached already
    if (options !== undefined && options.maxGates !== undefined && network.gates.length >= options.maxGates) {
      return;
    } // use only connections that aren't already gated


    var possible = network.connections.filter(function (conn) {
      return conn.gateNode === null;
    });

    if (possible.length > 0) {
      var node = Utils_1.pickRandom(network.nodes.filter(function (node) {
        return !node.isInputNode();
      })); // hidden or output node

      var connection = Utils_1.pickRandom(possible); // random connection from filtered array

      network.addGate(node, connection); // use the node to gate the connection
    }
  };

  return AddGateMutation;
}(Mutation);

exports.AddGateMutation = AddGateMutation;
/**
 * Sub gate mutation.
 *
 * Removes a gate from the network.
 *
 * @example
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new AddGateMutation()); // add a gate to the network
 * myNetwork.mutate(new SubGateMutation()); // remove the gate from the network
 */

var SubGateMutation =
/** @class */
function (_super) {
  __extends(SubGateMutation, _super);

  function SubGateMutation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  SubGateMutation.prototype.mutate = function (network) {
    if (network.gates.length > 0) {
      network.removeGate(Utils_1.pickRandom(network.gates));
    }
  };

  return SubGateMutation;
}(Mutation);

exports.SubGateMutation = SubGateMutation;
/**
 * Add back connection mutation.
 *
 * Adds a backward pointing connection to the network.
 *
 * @example
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new AddBackConnectionMutation);
 */

var AddBackConnectionMutation =
/** @class */
function (_super) {
  __extends(AddBackConnectionMutation, _super);

  function AddBackConnectionMutation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  AddBackConnectionMutation.prototype.mutate = function (network) {
    var possible = [];

    for (var i = network.inputSize; i < network.nodes.length; i++) {
      var from = network.nodes[i];

      for (var j = network.inputSize; j < i; j++) {
        var to = network.nodes[j];

        if (!from.isProjectingTo(to)) {
          possible.push([from, to]);
        }
      }
    }

    if (possible.length > 0) {
      var pair = Utils_1.pickRandom(possible);
      network.connect(pair[0], pair[1]);
    }
  };

  return AddBackConnectionMutation;
}(Mutation);

exports.AddBackConnectionMutation = AddBackConnectionMutation;
/**
 * Sub back connection mutation.
 *
 * Removes a backward pointing connection to the network.
 *
 * @example
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new AddBackConnectionMutation); // add a back connection
 * myNetwork.mutate(new SubBackConnectionMutation); // remove the back connection
 */

var SubBackConnectionMutation =
/** @class */
function (_super) {
  __extends(SubBackConnectionMutation, _super);

  function SubBackConnectionMutation() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  SubBackConnectionMutation.prototype.mutate = function (network) {
    var possible = network.connections.filter(function (conn) {
      return conn.from.outgoing.length > 1;
    }).filter(function (conn) {
      return conn.to.incoming.length > 1;
    }).filter(function (conn) {
      return network.nodes.indexOf(conn.from) > network.nodes.indexOf(conn.to);
    });

    if (possible.length > 0) {
      var randomConnection = Utils_1.pickRandom(possible);
      network.disconnect(randomConnection.from, randomConnection.to);
    }
  };

  return SubBackConnectionMutation;
}(Mutation);

exports.SubBackConnectionMutation = SubBackConnectionMutation;
/**
 * Swap nodes mutation.
 *
 * Swaps the values of two randomly picked nodes.
 *
 * @prop {boolean} mutateOutput=false Swap bias and activation function of network output neurons too. Disable this to keep output of a neural network normalized.
 * @example
 * let myNetwork = new Network(5, 5);
 *
 * myNetwork.mutate(new SwapNodesMutation());
 */

var SwapNodesMutation =
/** @class */
function (_super) {
  __extends(SwapNodesMutation, _super);

  function SwapNodesMutation(mutateOutput) {
    if (mutateOutput === void 0) {
      mutateOutput = false;
    }

    var _this = _super.call(this) || this;

    _this.mutateOutput = mutateOutput;
    return _this;
  }

  SwapNodesMutation.prototype.mutate = function (network) {
    var possible = this.mutateOutput ? network.nodes.filter(function (node) {
      return node !== undefined && !node.isInputNode();
    }) // hidden or output nodes
    : network.nodes.filter(function (node) {
      return node !== undefined && node.isHiddenNode();
    }); // only hidden nodes

    if (possible.length >= 2) {
      // select two different nodes from the filtered array
      var node1_1 = Utils_1.pickRandom(possible);
      var node2 = Utils_1.pickRandom(possible.filter(function (node) {
        return node !== node1_1;
      })); // change there parameters

      var biasTemp = node1_1.bias;
      var squashTemp = node1_1.squash;
      node1_1.bias = node2.bias;
      node1_1.squash = node2.squash;
      node2.bias = biasTemp;
      node2.squash = squashTemp;
    }
  };

  return SwapNodesMutation;
}(Mutation);

exports.SwapNodesMutation = SwapNodesMutation;
/**
 * Array of all mutation methods
 *
 * @example <caption>A group of mutation methods for evolution</caption>
 * let myNetwork = new Network(5, 5);
 *
 * network.evolve(trainingset, {
 *  mutation: methods.mutation.ALL // all mutation methods
 * }
 */

var ALL_MUTATIONS = [new AddNodeMutation(), new SubNodeMutation(), new AddConnectionMutation(), new SubConnectionMutation(), new ModWeightMutation(), new ModBiasMutation(), new ModActivationMutation(), new AddGateMutation(), new SubGateMutation(), new AddSelfConnectionMutation(), new SubSelfConnectionMutation(), new AddBackConnectionMutation(), new SubBackConnectionMutation(), new SwapNodesMutation()];
exports.ALL_MUTATIONS = ALL_MUTATIONS;
/**
 * Array of all feedforwad mutation methods
 *
 * @example <caption>A group of mutation methods for evolution</caption>
 * let myNetwork = new Network(5, 5);
 *
 * network.evolve(trainingset, {
 *  mutation: methods.mutation.FEEDFORWARD_MUTATIONS // all feedforward mutation methods
 * }
 */

var FEEDFORWARD_MUTATIONS = [new AddNodeMutation(), new SubNodeMutation(), new AddConnectionMutation(), new SubConnectionMutation(), new ModWeightMutation(), new ModBiasMutation(), new ModActivationMutation(), new SwapNodesMutation()];
exports.FEEDFORWARD_MUTATIONS = FEEDFORWARD_MUTATIONS;
var NO_STRUCTURE_MUTATIONS = [new ModWeightMutation(), new ModBiasMutation(), new ModActivationMutation()];
exports.NO_STRUCTURE_MUTATIONS = NO_STRUCTURE_MUTATIONS;
var ONLY_STRUCTURE = [new AddNodeMutation(), new SubNodeMutation(), new AddConnectionMutation(), new SubConnectionMutation(), new AddGateMutation(), new SubGateMutation(), new AddSelfConnectionMutation(), new SubSelfConnectionMutation(), new AddBackConnectionMutation(), new SubBackConnectionMutation(), new SwapNodesMutation()];
exports.ONLY_STRUCTURE = ONLY_STRUCTURE;
},{"../architecture/Node":"../src/architecture/Node.js","./Utils":"../src/methods/Utils.js","../enums/NodeType":"../src/enums/NodeType.js"}],"../src/enums/ActivationType.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ActivationType;

(function (ActivationType) {
  ActivationType[ActivationType["NO_ACTIVATION"] = 0] = "NO_ACTIVATION";
  ActivationType[ActivationType["LogisticActivation"] = 1] = "LogisticActivation";
  ActivationType[ActivationType["TanhActivation"] = 2] = "TanhActivation";
  ActivationType[ActivationType["IdentityActivation"] = 3] = "IdentityActivation";
  ActivationType[ActivationType["StepActivation"] = 4] = "StepActivation";
  ActivationType[ActivationType["RELUActivation"] = 5] = "RELUActivation";
  ActivationType[ActivationType["SoftSignActivation"] = 6] = "SoftSignActivation";
  ActivationType[ActivationType["SinusoidActivation"] = 7] = "SinusoidActivation";
  ActivationType[ActivationType["GaussianActivation"] = 8] = "GaussianActivation";
  ActivationType[ActivationType["BentIdentityActivation"] = 9] = "BentIdentityActivation";
  ActivationType[ActivationType["BipolarActivation"] = 10] = "BipolarActivation";
  ActivationType[ActivationType["BipolarSigmoidActivation"] = 11] = "BipolarSigmoidActivation";
  ActivationType[ActivationType["HardTanhActivation"] = 12] = "HardTanhActivation";
  ActivationType[ActivationType["AbsoluteActivation"] = 13] = "AbsoluteActivation";
  ActivationType[ActivationType["InverseActivation"] = 14] = "InverseActivation";
  ActivationType[ActivationType["SELUActivation"] = 15] = "SELUActivation";
})(ActivationType = exports.ActivationType || (exports.ActivationType = {}));
},{}],"../src/methods/Activation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Activation functions
 *
 * Activation functions determine what activation value neurons should get. Depending on your network's environment, choosing a suitable activation function can have a positive impact on the learning ability of the network.
 *
 * @see [Activation Function on Wikipedia](https://en.wikipedia.org/wiki/Activation_function)
 * @see [Beginners Guide to Activation Functions](https://towardsdatascience.com/secret-sauce-behind-the-beauty-of-deep-learning-beginners-guide-to-activation-functions-a8e23a57d046)
 * @see [Understanding activation functions in neural networks](https://medium.com/the-theory-of-everything/understanding-activation-functions-in-neural-networks-9491262884e0)
 * @see [List of activation functions in neural networks with pros/cons](https://stats.stackexchange.com/questions/115258/comprehensive-list-of-activation-functions-in-neural-networks-with-pros-cons)
 *
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new LogisticActivation();
 */

var ActivationType_1 = require("../enums/ActivationType");

var Activation =
/** @class */
function () {
  function Activation() {
    this.type = ActivationType_1.ActivationType.NO_ACTIVATION;
  }

  Activation.getActivation = function (activationType) {
    switch (activationType) {
      case ActivationType_1.ActivationType.LogisticActivation:
        return new LogisticActivation();

      case ActivationType_1.ActivationType.TanhActivation:
        return new TanhActivation();

      case ActivationType_1.ActivationType.IdentityActivation:
        return new IdentityActivation();

      case ActivationType_1.ActivationType.StepActivation:
        return new StepActivation();

      case ActivationType_1.ActivationType.RELUActivation:
        return new RELUActivation();

      case ActivationType_1.ActivationType.SoftSignActivation:
        return new SoftSignActivation();

      case ActivationType_1.ActivationType.SinusoidActivation:
        return new LogisticActivation();

      case ActivationType_1.ActivationType.GaussianActivation:
        return new GaussianActivation();

      case ActivationType_1.ActivationType.BentIdentityActivation:
        return new BentIdentityActivation();

      case ActivationType_1.ActivationType.BipolarActivation:
        return new BipolarActivation();

      case ActivationType_1.ActivationType.BipolarSigmoidActivation:
        return new BipolarSigmoidActivation();

      case ActivationType_1.ActivationType.HardTanhActivation:
        return new HardTanhActivation();

      case ActivationType_1.ActivationType.AbsoluteActivation:
        return new AbsoluteActivation();

      case ActivationType_1.ActivationType.InverseActivation:
        return new InverseActivation();

      case ActivationType_1.ActivationType.SELUActivation:
        return new SELUActivation();
    }

    throw new ReferenceError(activationType + " is not the name of any available activations! These are all available activations: " + ALL_ACTIVATIONS);
  };

  return Activation;
}();

exports.Activation = Activation;
/**
 * [Logistic function.](https://en.wikipedia.org/wiki/Logistic_function)
 *
 * @param x Input value(s) to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new LogisticActivation();
 */

var LogisticActivation =
/** @class */
function () {
  function LogisticActivation() {
    this.type = ActivationType_1.ActivationType.LogisticActivation;
  }

  LogisticActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return 1 / (1 + Math.exp(-x));
    } else {
      return this.calc(x, false) * (1 - this.calc(x, false));
    }
  };

  return LogisticActivation;
}();

exports.LogisticActivation = LogisticActivation;
/**
 * [TanH function.](https://en.wikipedia.org/wiki/Hyperbolic_function#Hyperbolic_tangent)
 *
 * @param x Input value to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new TanhActivation();
 */

var TanhActivation =
/** @class */
function () {
  function TanhActivation() {
    this.type = ActivationType_1.ActivationType.TanhActivation;
  }

  TanhActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return Math.tanh(x);
    } else {
      return 1 - this.calc(x, false) * this.calc(x, false);
    }
  };

  return TanhActivation;
}();

exports.TanhActivation = TanhActivation;
/**
 * [Identity function.](https://en.wikipedia.org/wiki/Identity_function)
 *
 * Returns input as output, used for [memory neurons](Layer#.Memory).
 *
 * @param x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new IdentityActivation();
 */

var IdentityActivation =
/** @class */
function () {
  function IdentityActivation() {
    this.type = ActivationType_1.ActivationType.IdentityActivation;
  }

  IdentityActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return x;
    } else {
      return 1;
    }
  };

  return IdentityActivation;
}();

exports.IdentityActivation = IdentityActivation;
/**
 * [Step function.](https://en.wikipedia.org/wiki/Heaviside_step_function)
 *
 * @param x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new StepActivation();
 */

var StepActivation =
/** @class */
function () {
  function StepActivation() {
    this.type = ActivationType_1.ActivationType.StepActivation;
  }

  StepActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return x < 0 ? 0 : 1;
    } else {
      return 0;
    }
  };

  return StepActivation;
}();

exports.StepActivation = StepActivation;
/**
 * [ReLU function.]{@link https://en.wikipedia.org/wiki/Rectifier_(neural_networks)}
 *
 * @param x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new RELUActivation();
 */

var RELUActivation =
/** @class */
function () {
  function RELUActivation() {
    this.type = ActivationType_1.ActivationType.RELUActivation;
  }

  RELUActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return x <= 0 ? 0 : x;
    } else {
      return x <= 0 ? 0 : 1;
    }
  };

  return RELUActivation;
}();

exports.RELUActivation = RELUActivation;
/**
 * [SoftSign function.](https://en.wikipedia.org/wiki/Activation_function#Comparison_of_activation_functions)
 *
 * @param x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new SoftSignActivation;
 */

var SoftSignActivation =
/** @class */
function () {
  function SoftSignActivation() {
    this.type = ActivationType_1.ActivationType.SoftSignActivation;
  }

  SoftSignActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return x / (1 + Math.abs(x));
    } else {
      return x / ((1 + Math.abs(x)) * (1 + Math.abs(x)));
    }
  };

  return SoftSignActivation;
}();

exports.SoftSignActivation = SoftSignActivation;
/**
 * [Sinusoid function.](https://en.wikipedia.org/wiki/Sine_wave)
 *
 * @param x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new SinusoidActivation();
 */

var SinusoidActivation =
/** @class */
function () {
  function SinusoidActivation() {
    this.type = ActivationType_1.ActivationType.SinusoidActivation;
  }

  SinusoidActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return Math.sin(x);
    } else {
      return Math.cos(x);
    }
  };

  return SinusoidActivation;
}();

exports.SinusoidActivation = SinusoidActivation;
/**
 * [Guassian function.](https://en.wikipedia.org/wiki/Gaussian_function)
 *
 * @param x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new GaussianActivation();
 */

var GaussianActivation =
/** @class */
function () {
  function GaussianActivation() {
    this.type = ActivationType_1.ActivationType.GaussianActivation;
  }

  GaussianActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return Math.exp(-x * x);
    } else {
      return -2 * x * this.calc(x, false);
    }
  };

  return GaussianActivation;
}();

exports.GaussianActivation = GaussianActivation;
/**
 * [Bent identity function.](https://en.wikipedia.org/wiki/Activation_function#Comparison_of_activation_functions)
 *
 * @param x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new BentIdentityActivation();
 */

var BentIdentityActivation =
/** @class */
function () {
  function BentIdentityActivation() {
    this.type = ActivationType_1.ActivationType.BentIdentityActivation;
  }

  BentIdentityActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return (Math.sqrt(x * x + 1) - 1) / 2 + x;
    } else {
      return x / (2 * Math.sqrt(x * x + 1)) + 1;
    }
  };

  return BentIdentityActivation;
}();

exports.BentIdentityActivation = BentIdentityActivation;
/**
 * [Bipolar function](https://wagenaartje.github.io/neataptic/docs/methods/activation/), if x > 0 then returns 1, otherwise returns -1
 *
 * @param x Input value to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new BipolarActivation();
 */

var BipolarActivation =
/** @class */
function () {
  function BipolarActivation() {
    this.type = ActivationType_1.ActivationType.BipolarActivation;
  }

  BipolarActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return x > 0 ? 1 : -1;
    } else {
      return 0;
    }
  };

  return BipolarActivation;
}();

exports.BipolarActivation = BipolarActivation;
/**
 * [Bipolar sigmoid function.](https://wagenaartje.github.io/neataptic/docs/methods/activation/)
 *
 * @param  x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new BipolarSigmoidActivation();
 */

var BipolarSigmoidActivation =
/** @class */
function () {
  function BipolarSigmoidActivation() {
    this.type = ActivationType_1.ActivationType.BipolarSigmoidActivation;
  }

  BipolarSigmoidActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return 2 / (1 + Math.exp(-x)) - 1;
    } else {
      return 2 * Math.exp(-x) / ((1 + Math.exp(-x)) * (1 + Math.exp(-x)));
    }
  };

  return BipolarSigmoidActivation;
}();

exports.BipolarSigmoidActivation = BipolarSigmoidActivation;
/**
 * [Hard tanh function.](https://wagenaartje.github.io/neataptic/docs/methods/activation/)
 *
 * @param x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new HardTanhActivation();
 */

var HardTanhActivation =
/** @class */
function () {
  function HardTanhActivation() {
    this.type = ActivationType_1.ActivationType.HardTanhActivation;
  }

  HardTanhActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return Math.max(-1, Math.min(1, x));
    } else {
      return Math.abs(x) < 1 ? 1 : 0;
    }
  };

  return HardTanhActivation;
}();

exports.HardTanhActivation = HardTanhActivation;
/**
 * [Absolute function.](https://wagenaartje.github.io/neataptic/docs/methods/activation/)
 *
 * Avoid using this activation function on a node with a selfconnection
 *
 * @param x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new AbsoluteActivation();
 */

var AbsoluteActivation =
/** @class */
function () {
  function AbsoluteActivation() {
    this.type = ActivationType_1.ActivationType.AbsoluteActivation;
  }

  AbsoluteActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return Math.abs(x);
    } else {
      return x < 0 ? -1 : 1;
    }
  };

  return AbsoluteActivation;
}();

exports.AbsoluteActivation = AbsoluteActivation;
/**
 * [Inverse function.](https://wagenaartje.github.io/neataptic/docs/methods/activation/)
 *
 * @param x Input values to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new InverseActivation();
 */

var InverseActivation =
/** @class */
function () {
  function InverseActivation() {
    this.type = ActivationType_1.ActivationType.InverseActivation;
  }

  InverseActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    if (!derivative) {
      return 1 - x;
    } else {
      return -1;
    }
  };

  return InverseActivation;
}();

exports.InverseActivation = InverseActivation;
/**
 * [Scaled exponential linear unit.](https://towardsdatascience.com/selu-make-fnns-great-again-snn-8d61526802a9)
 *
 * Exponential linear units try to make the mean activations closer to zero which speeds up learning. It has been shown that ELUs can obtain higher classification accuracy than ReLUs. α is a hyper-parameter here and to be tuned and the constraint is α ≥ 0(zero).
 *
 * @see {@link https://arxiv.org/pdf/1706.02515.pdf|Self-Normalizing Neural Networks}
 *
 * @param x Input value to activation function
 * @param derivative Flag to select derivative function
 *
 * @example
 * let { methods, Node } = require("@liquid-carrot/carrot");
 *
 * // Changing a neuron's activation function
 * let A = new Node();
 * A.squash = new SELUActivation();
 */

var SELUActivation =
/** @class */
function () {
  function SELUActivation() {
    this.type = ActivationType_1.ActivationType.SELUActivation;
  }

  SELUActivation.prototype.calc = function (x, derivative) {
    if (derivative === void 0) {
      derivative = false;
    }

    var alpha = 1.6732632423543772848170429916717; // this is bad

    var scale = 1.0507009873554804934193349852946; // this is bad

    if (!derivative) {
      if (x > 0) {
        return x * scale;
      } else {
        return alpha * Math.exp(x) - alpha * scale;
      }
    } else {
      if (x > 0) {
        return scale;
      } else {
        return alpha * Math.exp(x) * scale;
      }
    }
  };

  return SELUActivation;
}();

exports.SELUActivation = SELUActivation;
var ALL_ACTIVATIONS = [ActivationType_1.ActivationType.LogisticActivation, ActivationType_1.ActivationType.TanhActivation, ActivationType_1.ActivationType.IdentityActivation, ActivationType_1.ActivationType.StepActivation, ActivationType_1.ActivationType.RELUActivation, ActivationType_1.ActivationType.SoftSignActivation, ActivationType_1.ActivationType.SinusoidActivation, ActivationType_1.ActivationType.GaussianActivation, ActivationType_1.ActivationType.BentIdentityActivation, ActivationType_1.ActivationType.BipolarActivation, ActivationType_1.ActivationType.BipolarSigmoidActivation, ActivationType_1.ActivationType.HardTanhActivation, ActivationType_1.ActivationType.AbsoluteActivation, ActivationType_1.ActivationType.InverseActivation, ActivationType_1.ActivationType.SELUActivation];
exports.ALL_ACTIVATIONS = ALL_ACTIVATIONS;
},{"../enums/ActivationType":"../src/enums/ActivationType.js"}],"../src/architecture/Connection.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A connection instance describes the connection between two nodes. If you're looking for connections between [Groups](Group) please see [Connection Methods](connection)
 *
 * @param from Connection origin node (neuron)
 * @param to Connection destination node (neuron)
 * @param weight=random Weight of the connection
 * @param gateNode Node which gates this connection
 *
 * @prop {Node} from Connection origin node (neuron)
 * @prop {Node} to Connection destination node (neuron)
 * @prop {number} weight=random Weight of the connection
 * @prop {number} gain=1 Used for gating, gets multiplied with weight
 * @prop {Node} gateNode=null The node gating this connection
 * @prop {number} eligibility=0
 * @prop {Node[]} xTraceNodes
 * @prop {number[]} xTraceValues
 * @prop {number[]} delta_weights
 * @prop {number} deltaWeightsPrevious=0 Tracks [momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html)
 * @prop {number} deltaWeightsTotal=0 Tracks [momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html) - _for [batch training](https://www.quora.com/What-is-the-difference-between-batch-online-and-mini-batch-training-in-neural-networks-Which-one-should-I-use-for-a-small-to-medium-sized-dataset-for-prediction-purposes)_
 *
 * @see {@link connection|Connection Methods}
 * @see {@link Node|Node}
 */

var Connection =
/** @class */
function () {
  function Connection(from, to, weight, gateNode) {
    this.from = from;
    this.to = to;
    this.weight = weight !== null && weight !== void 0 ? weight : 0;
    this.gain = 1;
    this.eligibility = 0;
    this.deltaWeightsPrevious = 0;
    this.deltaWeightsTotal = 0;
    this.xTraceNodes = [];
    this.xTraceValues = [];

    if (gateNode) {
      this.gateNode = gateNode;
      gateNode.addGate(this);
    } else {
      this.gateNode = null;
    }
  }
  /**
   * Returns an innovation ID
   *
   * @see {@link https://en.wikipedia.org/wiki/Pairing_function (Cantor pairing function)|Pairing function (Cantor pairing function)}
   *
   * @param a - A [natural number](https://en.wikipedia.org/wiki/Natural_number), which is an integer greater than or equal to zero
   * @param b - A [natural number](https://en.wikipedia.org/wiki/Natural_number), which is an integer greater than or equal to zero
   *
   * @return An Integer that uniquely represents a pair of Integers
   */


  Connection.innovationID = function (a, b) {
    return 1 / 2 * (a + b) * (a + b + 1) + b;
  };
  /**
   * Returns the connection as a JSON
   *
   * @return Connection as a JSON
   */


  Connection.prototype.toJSON = function () {
    return {
      fromIndex: this.from.index,
      toIndex: this.to.index,
      gateNodeIndex: this.gateNode === null ? null : this.gateNode.index,
      weight: this.weight
    };
  };

  return Connection;
}();

exports.Connection = Connection;
},{}],"../src/architecture/Node.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Mutation_1 = require("../methods/Mutation");

var Activation_1 = require("../methods/Activation");

var Connection_1 = require("./Connection");

var Utils_1 = require("../methods/Utils");

var NodeType_1 = require("../enums/NodeType");

var ActivationType_1 = require("../enums/ActivationType");
/**
 * Creates a new neuron/node
 *
 * Neurons are the basic unit of the neural network. They can be connected together, or used to gate connections between other neurons. A Neuron can perform basically 4 operations: form connections, gate connections, activate and [propagate](https://www.youtube.com/watch?v=Ilg3gGewQ5U).
 *
 * For more information check:
 * - [here](https://becominghuman.ai/what-is-an-artificial-neuron-8b2e421ce42e)
 * - [here](https://en.wikipedia.org/wiki/Artificial_neuron)
 * - [here](https://wagenaartje.github.io/neataptic/docs/architecture/node/)
 * - [here](https://github.com/cazala/synaptic/wiki/Neural-Networks-101)
 * - [here](https://keras.io/backend/#bias_add)
 *
 * @param type defines the type of node
 *
 * @prop {number} bias Neuron's bias [here](https://becominghuman.ai/what-is-an-artificial-neuron-8b2e421ce42e)
 * @prop {activation} squash [Activation function](https://medium.com/the-theory-of-everything/understanding-activation-functions-in-neural-networks-9491262884e0)
 * @prop {string} type
 * @prop {number} activation Output value
 * @prop {number} state
 * @prop {number} old
 * @prop {number} mask=1 Used for dropout. This is either 0 (ignored) or 1 (included) during training and is used to avoid [overfit](https://www.kdnuggets.com/2015/04/preventing-overfitting-neural-networks.html).
 * @prop {number} previousDeltaBias
 * @prop {number} totalDeltaBias
 * @prop {Array<Connection>} incoming Incoming connections to this node
 * @prop {Array<Connection>} outgoing Outgoing connections from this node
 * @prop {Array<Connection>} gated Connections this node gates
 * @prop {Connection} connections_self A self-connection
 * @prop {number} error.responsibility
 * @prop {number} error.projected
 * @prop {number} error.gated
 *
 * @example
 * let { Node } = require("@liquid-carrot/carrot");
 *
 * let node = new Node();
 */


var Node =
/** @class */
function () {
  function Node(type) {
    if (type === void 0) {
      type = NodeType_1.NodeType.HIDDEN;
    }

    this.type = type;
    this.bias = Utils_1.randDouble(-1, 1);
    this.squash = new Activation_1.LogisticActivation();
    this.activation = 0;
    this.derivative = 1;
    this.state = 0;
    this.old = 0;
    this.mask = 1;
    this.deltaBiasPrevious = 0;
    this.deltaBiasTotal = 0;
    this.incoming = [];
    this.outgoing = [];
    this.gated = [];
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
   *
   * @example <caption>From Node.toJSON()</caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let otherNode = new Node();
   * let json = otherNode.toJSON();
   * let node = Node.fromJSON(json);
   *
   * console.log(node);
   */


  Node.prototype.fromJSON = function (json) {
    var _a, _b, _c, _d;

    this.bias = (_a = json.bias) !== null && _a !== void 0 ? _a : Utils_1.randDouble(-1, 1);
    this.type = json.type;
    this.squash = Activation_1.Activation.getActivation((_b = json.squash) !== null && _b !== void 0 ? _b : ActivationType_1.ActivationType.LogisticActivation);
    this.mask = (_c = json.mask) !== null && _c !== void 0 ? _c : 1;
    this.index = (_d = json.index) !== null && _d !== void 0 ? _d : NaN;
    return this;
  };
  /**
   * Clears this node's state information - _i.e. resets node and its connections to "factory settings"_
   *
   * `node.clear()` is useful for predicting time series.
   *
   * @example
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let node = new Node();
   *
   * node.activate([1, 0]);
   * node.propagate([1]);
   *
   * console.log(node); // Node has state information (e.g. `node.derivative`)
   *
   * node.clear(); // Factory resets node
   *
   * console.log(node); // Node has no state information
   */


  Node.prototype.clear = function () {
    for (var _i = 0, _a = this.incoming; _i < _a.length; _i++) {
      var connection = _a[_i];
      connection.eligibility = 0;
      connection.xTraceNodes = [];
      connection.xTraceValues = [];
    }

    for (var _b = 0, _c = this.gated; _b < _c.length; _b++) {
      var connection = _c[_b];
      connection.gain = 0;
    }

    this.errorResponsibility = this.errorProjected = this.errorGated = 0;
    this.old = this.state = this.activation = 0;
  };
  /**
   * Mutates the node's bias
   *
   * @param method The method is needed for the min and max value of the node's bias otherwise a range of [-1,1] is chosen
   *
   * @example
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let node = new Node();
   *
   * console.log(node);
   *
   * node.mutateBias(); // Changes node's bias
   */


  Node.prototype.mutateBias = function (method) {
    if (method === void 0) {
      method = new Mutation_1.ModBiasMutation();
    }

    this.bias += Utils_1.randDouble(method.min, method.max); // add a random value in range [min,max)
  };
  /**
   * Mutates the node's activation function
   *
   * @example
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let node = new Node();
   *
   * console.log(node);
   *
   * node.mutateBias(); // Changes node's activation function
   */


  Node.prototype.mutateActivation = function (allowedActivations) {
    var _this = this;

    if (allowedActivations === void 0) {
      allowedActivations = Activation_1.ALL_ACTIVATIONS;
    } // pick a random activation from allowed activations except the current activation


    var possible = allowedActivations.filter(function (activation) {
      return activation !== _this.squash.type;
    });

    if (possible.length > 0) {
      var newActivationType = Utils_1.pickRandom(possible);
      this.squash = Activation_1.Activation.getActivation(newActivationType);
    }
  };
  /**
   * Checks if the given node(s) are have outgoing connections to this node
   *
   * @param node Checks if `node(s)` have outgoing connections into this node
   *
   * @return Returns true, if every node(s) has an outgoing connection into this node
   *
   * @example <caption>Check one <code>node</code></caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let otherNode = new Node();
   * let node = new Node();
   * otherNode.connect(node);
   *
   * console.log(node.isProjectedBy(otherNode)); // true
   *
   * @example <caption>Check many <code>nodes</code></caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let otherNodes = Array.from({ length: 5 }, () => new Node());
   * let node = new Node();
   *
   * otherNodes.forEach(otherNode => otherNode.connect(node));
   *
   * console.log(node.isProjectedBy(otherNodes)); // true
   */


  Node.prototype.isProjectedBy = function (node) {
    if (node === this) {
      // self connection
      return this.selfConnection.weight !== 0; // is projected, if weight of self connection is unequal 0
    } else {
      return this.incoming.map(function (conn) {
        return conn.from;
      }).includes(node); // check every incoming connection for node
    }
  };
  /**
   * Checks if this node has an outgoing connection(s) into the given node(s)
   *
   * @param node Checks if this node has outgoing connection(s) into `node(s)`
   *
   * @returns Returns true, if this node has an outgoing connection into every node(s)
   *
   * @example <caption>Check one <code>node</code></caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let otherNode = new Node();
   * let node = new Node();
   * node.connect(otherNode);
   *
   * console.log(node.isProjectingTo(otherNode)); // true
   *
   * @example <caption>Check many <code>nodes</code></caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let otherNodes = Array.from({ length: 5 }, () => new Node());
   * let node = new Node();
   *
   * otherNodes.forEach(otherNode => node.connect(otherNode));
   *
   * console.log(node.isProjectingTo(otherNodes)); // true
   */


  Node.prototype.isProjectingTo = function (node) {
    if (node === this) {
      // self connection
      return this.selfConnection.weight !== 0; // is projected, if weight of self connection is unequal 0
    } else {
      return this.outgoing.map(function (conn) {
        return conn.to;
      }).includes(node); // check every outgoing connection for node
    }
  };
  /**
   * This node gates (influences) the given connection
   *
   * @param connection Connection to be gated (influenced) by a neuron
   *
   * @example <caption>Gate one <code>connection</code></caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let input = new Node();
   * let output = new Node();
   * let connection = input.connect(output);
   *
   * let node = new Node();
   *
   * console.log(connection.gateNode === node); // false
   *
   * node.gate(connection); // Node now gates (manipulates) `connection`
   *
   * console.log(connection.gateNode === node); // true
   */


  Node.prototype.addGate = function (connection) {
    this.gated.push(connection);
    connection.gateNode = this;
  };
  /**
   * Stops this node from gating (manipulating) the given connection(s)
   *
   * @param  connection Connections to ungate - _i.e. remove this node from_
   *
   * @example <caption>Ungate one <code>connection</code></caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let input = new Node();
   * let output = new Node();
   * let connection = input.connect(output);
   *
   * let node = new Node();
   *
   * console.log(connection.gateNode === node); // false
   *
   * node.addGate(connection); // Node now gates (manipulates) `connection`
   *
   * console.log(connection.gateNode === node); // true
   *
   * node.removeGate(connection); // Node is removed from `connection`
   *
   * console.log(connection.gateNode === node); // false
   */


  Node.prototype.removeGate = function (connection) {
    Utils_1.removeFromArray(this.gated, connection);
    connection.gateNode = null;
    connection.gain = 1;
  };
  /**
   * Connects this node to the given node(s)
   *
   * @param target Node(s) to project connection(s) to
   * @param weight Initial connection(s) [weight](https://en.wikipedia.org/wiki/Synaptic_weight)
   * @param twoSided If `true` connect nodes to each other
   *
   * @example <caption>Connecting node (neuron) to another node (neuron)</caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let node = new Node();
   * let otherNode = new Node();
   *
   * let connection = node.connect(otherNode); // Both nodes now share a connection
   *
   * console.log(connection); // Connection { from: [Object object], to: [Object object], ...}
   *
   *
   * @example <caption>Connecting a node (neuron) to itself</caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let node = new Node();
   *
   * let connection = node.connect(node); // Node is connected to itself.
   *
   * console.log(connection); // Connection { from: [Object object], to: [Object object], ...}
   */


  Node.prototype.connect = function (target, weight, twoSided) {
    if (weight === void 0) {
      weight = 1;
    }

    if (twoSided === void 0) {
      twoSided = false;
    }

    if (target === this) {
      // self connection
      this.selfConnection.weight = weight;
      return this.selfConnection;
    } else if (this.isProjectingTo(target)) {
      throw new ReferenceError(); // already connected
    } else {
      var connection = new Connection_1.Connection(this, target, weight); // create new connection
      // add it to the arrays

      this.outgoing.push(connection);
      target.incoming.push(connection);

      if (twoSided) {
        target.connect(this); // connect in the other direction
      }

      return connection;
    }
  };
  /**
   * Disconnects this node from the given node(s)
   *
   * @param node Node(s) to remove connection(s) to
   * @param twoSided=false If `true` disconnects nodes from each other (i.e. both sides)
   *
   * @example <caption>Disconnect from one <code>node</code></caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let node = new Node();
   * let other = new Node();
   *
   * node.connect(other); // `node` now connected to `other`
   *
   * console.log(node.incoming.length); // 0
   * console.log(node.outgoing.length); // 1
   *
   * node.disconnect(other); // `node` is now disconnected from `other`
   *
   * console.log(node.incoming.length); // 0
   * console.log(node.outgoing.length); // 0
   *
   * @example <caption>Connect to one <code>node</code> - <em>two-sided</em></caption>
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let node = new Node();
   * let other = new Node();
   *
   * // `node` & `other` are now connected to each other
   * node.connect(other, true);
   *
   * console.log(node.incoming.length); // 1
   * console.log(node.outgoing.length); // 1
   *
   * // `node` & `other` are now disconnected from each other
   * node.disconnect(other, true);
   *
   * console.log(node.incoming.length); // 0
   * console.log(node.outgoing.length); // 0
   */


  Node.prototype.disconnect = function (node, twoSided) {
    if (twoSided === void 0) {
      twoSided = false;
    }

    if (node === this) {
      // self connection
      this.selfConnection.weight = 0; // set weight to 0

      return this.selfConnection;
    }

    var connections = this.outgoing.filter(function (conn) {
      return conn.to === node;
    });

    if (connections.length === 0) {
      throw new Error("No Connection found");
    }

    var connection = connections[0]; // remove it from the arrays

    Utils_1.removeFromArray(this.outgoing, connection);
    Utils_1.removeFromArray(connection.to.incoming, connection);

    if (connection.gateNode !== undefined && connection.gateNode != null) {
      connection.gateNode.removeGate(connection); // if connection is gated -> remove gate
    }

    if (twoSided) {
      node.disconnect(this); // disconnect the other direction
    }

    return connection;
  };
  /**
   * Backpropagate the error (a.k.a. learn).
   *
   * After an activation, you can teach the node what should have been the correct output (a.k.a. train). This is done by backpropagating. [Momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html) adds a fraction of the previous weight update to the current one. When the gradient keeps pointing in the same direction, this will increase the size of the steps taken towards the minimum.
   *
   * If you combine a high learning rate with a lot of momentum, you will rush past the minimum (of the error function) with huge steps. It is therefore often necessary to reduce the global learning rate µ when using a lot of momentum (m close to 1).
   *
   * @param target The target value (i.e. "the value the network SHOULD have given")
   * @param options More options for propagation
   * @param [options.rate=0.3] [Learning rate](https://towardsdatascience.com/understanding-learning-rates-and-how-it-improves-performance-in-deep-learning-d0d4059c1c10)
   * @param [options.momentum=0] [Momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html) adds a fraction of the previous weight update to the current one.
   * @param [options.update=true] When set to false weights won't update, but when set to true after being false the last propagation will include the deltaweights of the first "update:false" propagations too.
   *
   * @example
   * let { Node } = require("@liquid-carrot/carrot");
   *
   * let A = new Node();
   * let B = new Node('output');
   * A.connect(B);
   *
   * let learningRate = .3;
   * let momentum = 0;
   *
   * for(let i = 0; i < 20000; i++)
   * {
   *   // when A activates 1
   *   A.activate(1);
   *
   *   // train B to activate 0
   *   B.activate();
   *   B.propagate(learningRate, momentum, true, 0);
   * }
   *
   * // test it
   * A.activate(1);
   * B.activate(); // 0.006540565760853365
   *
   * @see [Regularization Neataptic](https://wagenaartje.github.io/neataptic/docs/methods/regularization/)
   * @see [What is backpropagation | YouTube](https://www.youtube.com/watch?v=Ilg3gGewQ5U)
   */


  Node.prototype.propagate = function (target, options) {
    if (options === void 0) {
      options = {};
    }

    options.momentum = Utils_1.getOrDefault(options.momentum, 0);
    options.rate = Utils_1.getOrDefault(options.rate, 0.3);
    options.update = Utils_1.getOrDefault(options.update, true);

    if (target !== undefined && Number.isFinite(target)) {
      this.errorResponsibility = this.errorProjected = target - this.activation;
    } else {
      this.errorProjected = 0;

      for (var _i = 0, _a = this.outgoing; _i < _a.length; _i++) {
        var connection = _a[_i];
        this.errorProjected += connection.to.errorResponsibility * connection.weight * connection.gain;
      }

      this.errorProjected *= this.derivative;
      this.errorGated = 0;

      for (var _b = 0, _c = this.gated; _b < _c.length; _b++) {
        // for all connections gated by this node
        var connection = _c[_b];
        var influence = void 0;

        if (connection.to.selfConnection.gateNode === this) {
          // self connection is gated with this node
          influence = connection.to.old + connection.weight * connection.from.activation;
        } else {
          influence = connection.weight * connection.from.activation;
        }

        this.errorGated += connection.to.errorResponsibility * influence;
      }

      this.errorGated *= this.derivative;
      this.errorResponsibility = this.errorProjected + this.errorGated;
    }

    for (var _d = 0, _e = this.incoming; _d < _e.length; _d++) {
      var connection = _e[_d]; // calculate gradient

      var gradient = this.errorProjected * connection.eligibility;

      for (var j = 0; j < connection.xTraceNodes.length; j++) {
        var node = connection.xTraceNodes[j];
        gradient += node.errorResponsibility * connection.xTraceValues[j];
      }

      connection.deltaWeightsTotal += options.rate * gradient * this.mask;

      if (options.update) {
        connection.deltaWeightsTotal += options.momentum * connection.deltaWeightsPrevious;
        connection.weight += connection.deltaWeightsTotal;
        connection.deltaWeightsPrevious = connection.deltaWeightsTotal;
        connection.deltaWeightsTotal = 0;
      }
    }

    this.deltaBiasTotal += options.rate * this.errorResponsibility;

    if (options.update) {
      this.deltaBiasTotal += options.momentum * this.deltaBiasPrevious;
      this.bias += this.deltaBiasTotal;
      this.deltaBiasPrevious = this.deltaBiasTotal;
      this.deltaBiasTotal = 0;
    }
  };
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
   *
   * @example
   * let { Node } = require("@liquid-carrot/carrot");
   *
   * let A = new Node();
   * let B = new Node();
   *
   * A.connect(B);
   * A.activate(0.5); // 0.5
   * B.activate(); // 0.3244554645
   */


  Node.prototype.activate = function (input, trace) {
    var _this = this;

    if (trace === void 0) {
      trace = true;
    }

    if (input !== undefined) {
      return this.activation = input;
    } else if (this.isInputNode()) {
      throw new ReferenceError("There is no input given to an input node!");
    }

    if (trace) {
      this.old = this.state;
      this.state = this.selfConnection.gain * this.selfConnection.weight * this.state + this.bias;
      this.incoming.forEach(function (conn) {
        _this.state += conn.from.activation * conn.weight * conn.gain;
      });
      this.activation = this.squash.calc(this.state, false) * this.mask;
      this.derivative = this.squash.calc(this.state, true); // store traces

      var nodes_1 = [];
      var influences_1 = []; // Adjust 'gain' (to gated connections) & Build traces

      this.gated.forEach(function (connection) {
        connection.gain = _this.activation; // Build traces

        var index = nodes_1.indexOf(connection.to);

        if (index > -1) {
          // Node & influence exist
          influences_1[index] += connection.weight * connection.from.activation;
        } else {
          // Add node & corresponding influence
          nodes_1.push(connection.to);

          if (connection.to.selfConnection.gateNode === _this) {
            influences_1.push(connection.weight * connection.from.activation + connection.to.old);
          } else {
            influences_1.push(connection.weight * connection.from.activation);
          }
        }
      }); // Forwarding 'xTrace' (to incoming connections)

      for (var _i = 0, _a = this.incoming; _i < _a.length; _i++) {
        var connection = _a[_i];
        connection.eligibility = this.selfConnection.gain * this.selfConnection.weight * connection.eligibility + connection.from.activation * connection.gain;

        for (var i = 0; i < nodes_1.length; i++) {
          var node = nodes_1[i];
          var influence = influences_1[i];
          var index = connection.xTraceNodes.indexOf(node);

          if (index > -1) {
            connection.xTraceValues[index] = node.selfConnection.gain * node.selfConnection.weight * connection.xTraceValues[index] + this.derivative * connection.eligibility * influence;
          } else {
            connection.xTraceNodes.push(node);
            connection.xTraceValues.push(this.derivative * connection.eligibility * influence);
          }
        }
      }

      return this.activation;
    } else {
      if (this.isInputNode()) return this.activation = 0;
      this.state = this.selfConnection.gain * this.selfConnection.weight * this.state + this.bias;

      for (var _b = 0, _c = this.incoming; _b < _c.length; _b++) {
        var connection = _c[_b];
        this.state += connection.from.activation * connection.weight * connection.gain;
      }

      this.activation = this.squash.calc(this.state, false); // Adjust gain

      for (var _d = 0, _e = this.gated; _d < _e.length; _d++) {
        var connection = _e[_d];
        connection.gain = this.activation;
      }

      return this.activation;
    }
  };
  /**
   * Converts the node to a json object that can later be converted back
   *
   * @returns A node representing json object
   *
   * @example
   * const { Node } = require("@liquid-carrot/carrot");
   *
   * let node = new Node();
   *
   * console.log(node.toJSON());
   */


  Node.prototype.toJSON = function () {
    return {
      bias: this.bias,
      type: this.type,
      squash: this.squash.type,
      mask: this.mask,
      index: this.index
    };
  };

  Node.prototype.isInputNode = function () {
    return this.type === NodeType_1.NodeType.INPUT;
  };

  Node.prototype.isHiddenNode = function () {
    return this.type === NodeType_1.NodeType.HIDDEN;
  };

  Node.prototype.isOutputNode = function () {
    return this.type === NodeType_1.NodeType.OUTPUT;
  };

  Node.prototype.setBias = function (bias) {
    this.bias = bias;
    return this;
  };

  Node.prototype.setSquash = function (activationType) {
    this.squash = Activation_1.Activation.getActivation(activationType);
    return this;
  };

  return Node;
}();

exports.Node = Node;
},{"../methods/Mutation":"../src/methods/Mutation.js","../methods/Activation":"../src/methods/Activation.js","./Connection":"../src/architecture/Connection.js","../methods/Utils":"../src/methods/Utils.js","../enums/NodeType":"../src/enums/NodeType.js","../enums/ActivationType":"../src/enums/ActivationType.js"}],"../src/architecture/Layers/CoreLayers/DenseLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer_1 = require("../Layer");

var Node_1 = require("../../Node");

var ActivationType_1 = require("../../../enums/ActivationType");

var NodeType_1 = require("../../../enums/NodeType");

var DenseLayer =
/** @class */
function (_super) {
  __extends(DenseLayer, _super);

  function DenseLayer(outputSize, options) {
    var _a;

    if (options === void 0) {
      options = {};
    }

    var _b;

    var _this = _super.call(this, outputSize) || this;

    var activation = (_b = options.activationType) !== null && _b !== void 0 ? _b : ActivationType_1.ActivationType.LogisticActivation;

    for (var i = 0; i < outputSize; i++) {
      _this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setSquash(activation));
    }

    _this.outputNodes = _this.inputNodes;

    (_a = _this.nodes).push.apply(_a, Array.from(_this.inputNodes));

    return _this;
  }

  return DenseLayer;
}(Layer_1.Layer);

exports.DenseLayer = DenseLayer;
},{"../Layer":"../src/architecture/Layers/Layer.js","../../Node":"../src/architecture/Node.js","../../../enums/ActivationType":"../src/enums/ActivationType.js","../../../enums/NodeType":"../src/enums/NodeType.js"}],"../src/architecture/Nodes/ConstantNode.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Node_1 = require("../Node");

var NodeType_1 = require("../../enums/NodeType");

var Activation_1 = require("../../methods/Activation");

var ActivationType_1 = require("../../enums/ActivationType");

var ConstantNode =
/** @class */
function (_super) {
  __extends(ConstantNode, _super);

  function ConstantNode() {
    var _this = _super.call(this, NodeType_1.NodeType.HIDDEN) || this;

    _this.bias = 1;
    return _this;
  }

  ConstantNode.prototype.fromJSON = function (json) {
    var _a, _b;

    this.index = (_a = json.index) !== null && _a !== void 0 ? _a : -1;
    this.squash = Activation_1.Activation.getActivation((_b = json.squash) !== null && _b !== void 0 ? _b : ActivationType_1.ActivationType.IdentityActivation);
    return this;
  };

  ConstantNode.prototype.toJSON = function () {
    return {
      index: this.index,
      squash: this.squash.type
    };
  };

  ConstantNode.prototype.mutateBias = function () {
    throw new ReferenceError("Cannot mutate a pool node!");
  };

  ConstantNode.prototype.mutateActivation = function () {
    throw new ReferenceError("Cannot mutate a pool node!");
  };

  ConstantNode.prototype.addGate = function () {
    throw new ReferenceError("A pool node can't gate a connection!");
  };

  ConstantNode.prototype.removeGate = function () {
    throw new ReferenceError("A pool node can't gate a connection!");
  };

  ConstantNode.prototype.setBias = function () {
    throw new ReferenceError("Cannot set the bias of a pool node!");
  };

  return ConstantNode;
}(Node_1.Node);

exports.ConstantNode = ConstantNode;
},{"../Node":"../src/architecture/Node.js","../../enums/NodeType":"../src/enums/NodeType.js","../../methods/Activation":"../src/methods/Activation.js","../../enums/ActivationType":"../src/enums/ActivationType.js"}],"../src/architecture/Nodes/DropoutNode.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ConstantNode_1 = require("./ConstantNode");

var Utils_1 = require("../../methods/Utils");

var DropoutNode =
/** @class */
function (_super) {
  __extends(DropoutNode, _super);

  function DropoutNode(probability) {
    var _this = _super.call(this) || this;

    _this.probability = probability;
    _this.droppedOut = false;
    return _this;
  }

  DropoutNode.prototype.activate = function () {
    var _this = this;

    if (this.incoming.length !== 1) {
      throw new RangeError("Dropout node should have exactly one incoming connection!");
    }

    var incomingConnection = this.incoming[0]; // https://stats.stackexchange.com/a/219240

    if (Utils_1.randDouble(0, 1) < this.probability) {
      // DROPOUT
      this.droppedOut = true;
      this.state = 0;
    } else {
      this.droppedOut = false;
      this.state = incomingConnection.from.activation * incomingConnection.weight * incomingConnection.gain;
      this.state *= 1 / (1 - this.probability);
    }

    this.activation = this.squash.calc(this.state, false) * this.mask; // Adjust gain

    this.gated.forEach(function (conn) {
      return conn.gain = _this.activation;
    });
    return this.activation;
  };

  DropoutNode.prototype.propagate = function (target, options) {
    if (options === void 0) {
      options = {};
    }

    options.momentum = Utils_1.getOrDefault(options.momentum, 0);
    options.rate = Utils_1.getOrDefault(options.rate, 0.3);
    options.update = Utils_1.getOrDefault(options.update, true);
    var connectionsStates = this.outgoing.map(function (conn) {
      return conn.to.errorResponsibility * conn.weight * conn.gain;
    });
    this.errorResponsibility = this.errorProjected = Utils_1.sum(connectionsStates) / (1 - this.probability);

    if (this.incoming.length !== 1) {
      throw new RangeError("Dropout node should have exactly one incoming connection!");
    }

    var incomingConnection = this.incoming[0]; // calculate gradient

    if (!this.droppedOut) {
      var gradient = this.errorProjected * incomingConnection.eligibility;

      for (var i = 0; i < incomingConnection.xTraceNodes.length; i++) {
        gradient += incomingConnection.xTraceNodes[i].errorResponsibility * incomingConnection.xTraceValues[i];
      }

      if (options.update) {
        incomingConnection.deltaWeightsTotal += options.rate * gradient * this.mask + options.momentum * incomingConnection.deltaWeightsPrevious;
        incomingConnection.weight += incomingConnection.deltaWeightsTotal;
        incomingConnection.deltaWeightsPrevious = incomingConnection.deltaWeightsTotal;
        incomingConnection.deltaWeightsTotal = 0;
      }
    }
  };

  DropoutNode.prototype.fromJSON = function (json) {
    _super.prototype.fromJSON.call(this, json);

    this.probability = json.probability;
    return this;
  };

  DropoutNode.prototype.toJSON = function () {
    return Object.assign(_super.prototype.toJSON.call(this), {
      probability: this.probability
    });
  };

  return DropoutNode;
}(ConstantNode_1.ConstantNode);

exports.DropoutNode = DropoutNode;
},{"./ConstantNode":"../src/architecture/Nodes/ConstantNode.js","../../methods/Utils":"../src/methods/Utils.js"}],"../src/architecture/Layers/CoreLayers/DropoutLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer_1 = require("../Layer");

var ActivationType_1 = require("../../../enums/ActivationType");

var DropoutNode_1 = require("../../Nodes/DropoutNode");

var ConnectionType_1 = require("../../../enums/ConnectionType");

var DropoutLayer =
/** @class */
function (_super) {
  __extends(DropoutLayer, _super);

  function DropoutLayer(outputSize, options) {
    var _a;

    if (options === void 0) {
      options = {};
    }

    var _b, _c;

    var _this = _super.call(this, outputSize) || this;

    var activation = (_b = options.activationType) !== null && _b !== void 0 ? _b : ActivationType_1.ActivationType.IdentityActivation;
    var probability = (_c = options.probability) !== null && _c !== void 0 ? _c : 0.1;

    for (var i = 0; i < outputSize; i++) {
      _this.inputNodes.add(new DropoutNode_1.DropoutNode(probability).setSquash(activation));
    }

    _this.outputNodes = _this.inputNodes;

    (_a = _this.nodes).push.apply(_a, Array.from(_this.inputNodes));

    return _this;
  }

  DropoutLayer.prototype.getDefaultIncomingConnectionType = function () {
    return ConnectionType_1.ConnectionType.ONE_TO_ONE;
  };

  DropoutLayer.prototype.connectionTypeisAllowed = function (type) {
    return type === ConnectionType_1.ConnectionType.ONE_TO_ONE;
  };

  return DropoutLayer;
}(Layer_1.Layer);

exports.DropoutLayer = DropoutLayer;
},{"../Layer":"../src/architecture/Layers/Layer.js","../../../enums/ActivationType":"../src/enums/ActivationType.js","../../Nodes/DropoutNode":"../src/architecture/Nodes/DropoutNode.js","../../../enums/ConnectionType":"../src/enums/ConnectionType.js"}],"../src/architecture/Nodes/NoiseNode.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Utils_1 = require("../../methods/Utils");

var ConstantNode_1 = require("./ConstantNode");

var NodeType_1 = require("../../enums/NodeType");

var NoiseNode =
/** @class */
function (_super) {
  __extends(NoiseNode, _super);

  function NoiseNode(options) {
    if (options === void 0) {
      options = {};
    }

    var _this = _super.call(this) || this;

    _this.noiseType = Utils_1.getOrDefault(options.noiseType, NodeType_1.NoiseNodeType.GAUSSIAN_NOISE);
    _this.options = options;
    return _this;
  }

  NoiseNode.prototype.activate = function () {
    var _a, _b, _c, _d;

    this.old = this.state;
    var incomingStates = this.incoming.map(function (conn) {
      return conn.from.activation * conn.weight * conn.gain;
    });

    switch (this.noiseType) {}

    switch (this.noiseType) {
      case NodeType_1.NoiseNodeType.GAUSSIAN_NOISE:
        this.state = Utils_1.avg(incomingStates) + Utils_1.generateGaussian((_b = (_a = this.options.gaussian) === null || _a === void 0 ? void 0 : _a.mean) !== null && _b !== void 0 ? _b : 0, (_d = (_c = this.options.gaussian) === null || _c === void 0 ? void 0 : _c.deviation) !== null && _d !== void 0 ? _d : 2);
        break;

      default:
        throw new ReferenceError("Cannot activate this noise type!");
    }

    this.activation = this.squash.calc(this.state, false) * this.mask;
    this.derivative = this.squash.calc(this.state, true);
    return this.activation;
  };

  NoiseNode.prototype.propagate = function (target, options) {
    if (options === void 0) {
      options = {};
    }

    options.momentum = Utils_1.getOrDefault(options.momentum, 0);
    options.rate = Utils_1.getOrDefault(options.rate, 0.3);
    options.update = Utils_1.getOrDefault(options.update, true);
    var connectionsStates = this.outgoing.map(function (conn) {
      return conn.to.errorResponsibility * conn.weight * conn.gain;
    });
    this.errorResponsibility = this.errorProjected = Utils_1.sum(connectionsStates) * this.derivative;

    for (var _i = 0, _a = this.incoming; _i < _a.length; _i++) {
      var connection = _a[_i]; // calculate gradient

      var gradient = this.errorProjected * connection.eligibility;

      for (var i = 0; i < connection.xTraceNodes.length; i++) {
        gradient += connection.xTraceNodes[i].errorResponsibility * connection.xTraceValues[i];
      }

      connection.deltaWeightsTotal += options.rate * gradient * this.mask;

      if (options.update) {
        connection.deltaWeightsTotal += options.momentum * connection.deltaWeightsPrevious;
        connection.weight += connection.deltaWeightsTotal;
        connection.deltaWeightsPrevious = connection.deltaWeightsTotal;
        connection.deltaWeightsTotal = 0;
      }
    }
  };

  return NoiseNode;
}(ConstantNode_1.ConstantNode);

exports.NoiseNode = NoiseNode;
},{"../../methods/Utils":"../src/methods/Utils.js","./ConstantNode":"../src/architecture/Nodes/ConstantNode.js","../../enums/NodeType":"../src/enums/NodeType.js"}],"../src/architecture/Layers/NoiseLayers/NoiseLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer_1 = require("../Layer");

var ActivationType_1 = require("../../../enums/ActivationType");

var ConnectionType_1 = require("../../../enums/ConnectionType");

var NoiseNode_1 = require("../../Nodes/NoiseNode");

var NodeType_1 = require("../../../enums/NodeType");

var NoiseLayer =
/** @class */
function (_super) {
  __extends(NoiseLayer, _super);

  function NoiseLayer(outputSize, options) {
    var _a;

    if (options === void 0) {
      options = {};
    }

    var _b;

    var _this = _super.call(this, outputSize) || this;

    var activation = (_b = options.activationType) !== null && _b !== void 0 ? _b : ActivationType_1.ActivationType.IdentityActivation;

    for (var i = 0; i < outputSize; i++) {
      _this.inputNodes.add(new NoiseNode_1.NoiseNode({
        noiseType: NodeType_1.NoiseNodeType.GAUSSIAN_NOISE,
        gaussian: options
      }).setSquash(activation));
    }

    _this.outputNodes = _this.inputNodes;

    (_a = _this.nodes).push.apply(_a, Array.from(_this.inputNodes));

    return _this;
  }

  NoiseLayer.prototype.getDefaultIncomingConnectionType = function () {
    return ConnectionType_1.ConnectionType.ONE_TO_ONE;
  };

  NoiseLayer.prototype.connectionTypeisAllowed = function (type) {
    return type === ConnectionType_1.ConnectionType.ONE_TO_ONE;
  };

  return NoiseLayer;
}(Layer_1.Layer);

exports.NoiseLayer = NoiseLayer;
},{"../Layer":"../src/architecture/Layers/Layer.js","../../../enums/ActivationType":"../src/enums/ActivationType.js","../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../Nodes/NoiseNode":"../src/architecture/Nodes/NoiseNode.js","../../../enums/NodeType":"../src/enums/NodeType.js"}],"../src/architecture/Layers/CoreLayers/OutputLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer_1 = require("../Layer");

var Node_1 = require("../../Node");

var NodeType_1 = require("../../../enums/NodeType");

var ActivationType_1 = require("../../../enums/ActivationType");

var OutputLayer =
/** @class */
function (_super) {
  __extends(OutputLayer, _super);

  function OutputLayer(outputSize, options) {
    var _a;

    if (options === void 0) {
      options = {};
    }

    var _b;

    var _this = _super.call(this, outputSize) || this;

    var activation = (_b = options.activationType) !== null && _b !== void 0 ? _b : ActivationType_1.ActivationType.IdentityActivation;

    for (var i = 0; i < outputSize; i++) {
      _this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.OUTPUT).setSquash(activation));
    }

    (_a = _this.nodes).push.apply(_a, Array.from(_this.inputNodes));

    return _this;
  }

  OutputLayer.prototype.connect = function () {
    throw new ReferenceError("Could not connect an OutputLayer!");
  };

  return OutputLayer;
}(Layer_1.Layer);

exports.OutputLayer = OutputLayer;
},{"../Layer":"../src/architecture/Layers/Layer.js","../../Node":"../src/architecture/Node.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../../enums/ActivationType":"../src/enums/ActivationType.js"}],"../src/architecture/Layers/CoreLayers/InputLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer_1 = require("../Layer");

var Node_1 = require("../../Node");

var NodeType_1 = require("../../../enums/NodeType");

var ConnectionType_1 = require("../../../enums/ConnectionType");

var NoiseLayer_1 = require("../NoiseLayers/NoiseLayer");

var InputLayer =
/** @class */
function (_super) {
  __extends(InputLayer, _super);

  function InputLayer(outputSize, options) {
    var _a;

    if (options === void 0) {
      options = {};
    }

    var _b;

    var _this = _super.call(this, outputSize) || this;

    for (var i = 0; i < outputSize; i++) {
      var node = new Node_1.Node(NodeType_1.NodeType.INPUT);

      _this.nodes.push(node);
    }

    if (options.noise) {
      var noiseLayer = new NoiseLayer_1.NoiseLayer((_b = options.noise) !== null && _b !== void 0 ? _b : NodeType_1.NoiseNodeType.GAUSSIAN_NOISE);
      noiseLayer.outputNodes.forEach(function (node) {
        return _this.outputNodes.add(node);
      });

      (_a = _this.connections).push.apply(_a, Layer_1.Layer.connect(_this.nodes, noiseLayer, noiseLayer.getDefaultIncomingConnectionType()));
    } else {
      _this.nodes.forEach(function (node) {
        return _this.outputNodes.add(node);
      });
    }

    return _this;
  }

  InputLayer.prototype.getDefaultIncomingConnectionType = function () {
    return ConnectionType_1.ConnectionType.NO_CONNECTION;
  };

  InputLayer.prototype.connectionTypeisAllowed = function (type) {
    return type === ConnectionType_1.ConnectionType.NO_CONNECTION;
  };

  return InputLayer;
}(Layer_1.Layer);

exports.InputLayer = InputLayer;
},{"../Layer":"../src/architecture/Layers/Layer.js","../../Node":"../src/architecture/Node.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../NoiseLayers/NoiseLayer":"../src/architecture/Layers/NoiseLayers/NoiseLayer.js"}],"../src/architecture/Nodes/PoolNode.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var NodeType_1 = require("../../enums/NodeType");

var Utils_1 = require("../../methods/Utils");

var ConstantNode_1 = require("./ConstantNode");

var PoolNode =
/** @class */
function (_super) {
  __extends(PoolNode, _super);

  function PoolNode(poolingType) {
    if (poolingType === void 0) {
      poolingType = NodeType_1.PoolNodeType.MAX_POOLING;
    }

    var _this = _super.call(this) || this;

    _this.poolingType = poolingType;
    _this.receivingIndex = -1;
    return _this;
  }

  PoolNode.prototype.fromJSON = function (json) {
    _super.prototype.fromJSON.call(this, json);

    this.poolingType = json.poolType;
    return this;
  };

  PoolNode.prototype.activate = function () {
    var _this = this;

    var incomingStates = this.incoming.map(function (conn) {
      return conn.from.activation * conn.weight * conn.gain;
    });

    if (this.poolingType === NodeType_1.PoolNodeType.MAX_POOLING) {
      this.receivingIndex = Utils_1.maxValueIndex(incomingStates);
      this.state = incomingStates[this.receivingIndex];
    } else if (this.poolingType === NodeType_1.PoolNodeType.AVG_POOLING) {
      this.state = Utils_1.avg(incomingStates);
    } else if (this.poolingType === NodeType_1.PoolNodeType.MIN_POOLING) {
      this.receivingIndex = Utils_1.minValueIndex(incomingStates);
      this.state = incomingStates[this.receivingIndex];
    } else {
      throw new ReferenceError("No valid pooling type! Type: " + this.poolingType);
    }

    this.activation = this.squash.calc(this.state, false) * this.mask;

    if (this.poolingType === NodeType_1.PoolNodeType.AVG_POOLING) {
      this.derivative = this.squash.calc(this.state, true);
    } // Adjust gain


    this.gated.forEach(function (conn) {
      return conn.gain = _this.activation;
    });
    return this.activation;
  };

  PoolNode.prototype.propagate = function (target, options) {
    if (options === void 0) {
      options = {};
    }

    options.momentum = Utils_1.getOrDefault(options.momentum, 0);
    options.rate = Utils_1.getOrDefault(options.rate, 0.3);
    options.update = Utils_1.getOrDefault(options.update, true);
    var connectionsStates = this.outgoing.map(function (conn) {
      return conn.to.errorResponsibility * conn.weight * conn.gain;
    });
    this.errorResponsibility = this.errorProjected = Utils_1.sum(connectionsStates) * this.derivative;

    if (this.poolingType === NodeType_1.PoolNodeType.AVG_POOLING) {
      for (var _i = 0, _a = this.incoming; _i < _a.length; _i++) {
        var connection = _a[_i]; // calculate gradient

        var gradient = this.errorProjected * connection.eligibility;

        for (var i = 0; i < connection.xTraceNodes.length; i++) {
          gradient += connection.xTraceNodes[i].errorResponsibility * connection.xTraceValues[i];
        }

        connection.deltaWeightsTotal += options.rate * gradient * this.mask;

        if (options.update) {
          connection.deltaWeightsTotal += options.momentum * connection.deltaWeightsPrevious;
          connection.weight += connection.deltaWeightsTotal;
          connection.deltaWeightsPrevious = connection.deltaWeightsTotal;
          connection.deltaWeightsTotal = 0;
        }
      }
    } else {
      // TODO: don't think that this is correct
      // Passing only the connections that were used for getting the min or max
      for (var i = 0; i < this.incoming.length; i++) {
        this.incoming[i].weight = this.receivingIndex === i ? 1 : 0;
        this.incoming[i].gain = this.receivingIndex === i ? 1 : 0;
      }
    }
  };

  PoolNode.prototype.toJSON = function () {
    return Object.assign(_super.prototype.toJSON.call(this), {
      poolType: this.poolingType
    });
  };

  return PoolNode;
}(ConstantNode_1.ConstantNode);

exports.PoolNode = PoolNode;
},{"../../enums/NodeType":"../src/enums/NodeType.js","../../methods/Utils":"../src/methods/Utils.js","./ConstantNode":"../src/architecture/Nodes/ConstantNode.js"}],"../src/architecture/Layers/PoolingLayers/PoolingLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer_1 = require("../Layer");

var ConnectionType_1 = require("../../../enums/ConnectionType");

var PoolingLayer =
/** @class */
function (_super) {
  __extends(PoolingLayer, _super);

  function PoolingLayer(outputSize) {
    return _super.call(this, outputSize) || this;
  }

  PoolingLayer.prototype.getDefaultIncomingConnectionType = function () {
    return ConnectionType_1.ConnectionType.POOLING;
  };

  return PoolingLayer;
}(Layer_1.Layer);

exports.PoolingLayer = PoolingLayer;
},{"../Layer":"../src/architecture/Layers/Layer.js","../../../enums/ConnectionType":"../src/enums/ConnectionType.js"}],"../src/architecture/Layers/PoolingLayers/AvgPooling1DLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var PoolNode_1 = require("../../Nodes/PoolNode");

var NodeType_1 = require("../../../enums/NodeType");

var PoolingLayer_1 = require("./PoolingLayer");

var ActivationType_1 = require("../../../enums/ActivationType");

var AvgPooling1DLayer =
/** @class */
function (_super) {
  __extends(AvgPooling1DLayer, _super);

  function AvgPooling1DLayer(outputSize, options) {
    var _a;

    if (options === void 0) {
      options = {};
    }

    var _b;

    var _this = _super.call(this, outputSize) || this;

    var activationType = (_b = options.activationType) !== null && _b !== void 0 ? _b : ActivationType_1.ActivationType.IdentityActivation;

    for (var i = 0; i < outputSize; i++) {
      _this.inputNodes.add(new PoolNode_1.PoolNode(NodeType_1.PoolNodeType.AVG_POOLING).setSquash(activationType));
    }

    _this.outputNodes = _this.inputNodes;

    (_a = _this.nodes).push.apply(_a, Array.from(_this.inputNodes));

    return _this;
  }

  return AvgPooling1DLayer;
}(PoolingLayer_1.PoolingLayer);

exports.AvgPooling1DLayer = AvgPooling1DLayer;
},{"../../Nodes/PoolNode":"../src/architecture/Nodes/PoolNode.js","../../../enums/NodeType":"../src/enums/NodeType.js","./PoolingLayer":"../src/architecture/Layers/PoolingLayers/PoolingLayer.js","../../../enums/ActivationType":"../src/enums/ActivationType.js"}],"../src/architecture/Layers/PoolingLayers/MinPooling1DLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var PoolNode_1 = require("../../Nodes/PoolNode");

var NodeType_1 = require("../../../enums/NodeType");

var PoolingLayer_1 = require("./PoolingLayer");

var ActivationType_1 = require("../../../enums/ActivationType");

var MinPooling1DLayer =
/** @class */
function (_super) {
  __extends(MinPooling1DLayer, _super);

  function MinPooling1DLayer(outputSize, options) {
    var _a;

    if (options === void 0) {
      options = {};
    }

    var _b;

    var _this = _super.call(this, outputSize) || this;

    var activationType = (_b = options.activationType) !== null && _b !== void 0 ? _b : ActivationType_1.ActivationType.IdentityActivation;

    for (var i = 0; i < outputSize; i++) {
      _this.inputNodes.add(new PoolNode_1.PoolNode(NodeType_1.PoolNodeType.MIN_POOLING).setSquash(activationType));
    }

    _this.outputNodes = _this.inputNodes;

    (_a = _this.nodes).push.apply(_a, Array.from(_this.inputNodes));

    return _this;
  }

  return MinPooling1DLayer;
}(PoolingLayer_1.PoolingLayer);

exports.MinPooling1DLayer = MinPooling1DLayer;
},{"../../Nodes/PoolNode":"../src/architecture/Nodes/PoolNode.js","../../../enums/NodeType":"../src/enums/NodeType.js","./PoolingLayer":"../src/architecture/Layers/PoolingLayers/PoolingLayer.js","../../../enums/ActivationType":"../src/enums/ActivationType.js"}],"../src/architecture/Layers/PoolingLayers/MaxPooling1DLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var PoolNode_1 = require("../../Nodes/PoolNode");

var NodeType_1 = require("../../../enums/NodeType");

var PoolingLayer_1 = require("./PoolingLayer");

var ActivationType_1 = require("../../../enums/ActivationType");

var MaxPooling1DLayer =
/** @class */
function (_super) {
  __extends(MaxPooling1DLayer, _super);

  function MaxPooling1DLayer(outputSize, options) {
    var _a;

    if (options === void 0) {
      options = {};
    }

    var _b;

    var _this = _super.call(this, outputSize) || this;

    var activationType = (_b = options.activationType) !== null && _b !== void 0 ? _b : ActivationType_1.ActivationType.IdentityActivation;

    for (var i = 0; i < outputSize; i++) {
      _this.inputNodes.add(new PoolNode_1.PoolNode(NodeType_1.PoolNodeType.MAX_POOLING).setSquash(activationType));
    }

    _this.outputNodes = _this.inputNodes;

    (_a = _this.nodes).push.apply(_a, Array.from(_this.inputNodes));

    return _this;
  }

  return MaxPooling1DLayer;
}(PoolingLayer_1.PoolingLayer);

exports.MaxPooling1DLayer = MaxPooling1DLayer;
},{"../../Nodes/PoolNode":"../src/architecture/Nodes/PoolNode.js","../../../enums/NodeType":"../src/enums/NodeType.js","./PoolingLayer":"../src/architecture/Layers/PoolingLayers/PoolingLayer.js","../../../enums/ActivationType":"../src/enums/ActivationType.js"}],"../src/architecture/Layers/PoolingLayers/GlobalAvgPooling1DLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AvgPooling1DLayer_1 = require("./AvgPooling1DLayer");

var GlobalAvgPooling1DLayer =
/** @class */
function (_super) {
  __extends(GlobalAvgPooling1DLayer, _super);

  function GlobalAvgPooling1DLayer(outputSize, options) {
    if (options === void 0) {
      options = {};
    }

    return _super.call(this, 1, options) || this;
  }

  return GlobalAvgPooling1DLayer;
}(AvgPooling1DLayer_1.AvgPooling1DLayer);

exports.GlobalAvgPooling1DLayer = GlobalAvgPooling1DLayer;
},{"./AvgPooling1DLayer":"../src/architecture/Layers/PoolingLayers/AvgPooling1DLayer.js"}],"../src/architecture/Layers/PoolingLayers/GlobalMaxPooling1DLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var MaxPooling1DLayer_1 = require("./MaxPooling1DLayer");

var GlobalMaxPooling1DLayer =
/** @class */
function (_super) {
  __extends(GlobalMaxPooling1DLayer, _super);

  function GlobalMaxPooling1DLayer(outputSize, options) {
    if (options === void 0) {
      options = {};
    }

    return _super.call(this, 1, options) || this;
  }

  return GlobalMaxPooling1DLayer;
}(MaxPooling1DLayer_1.MaxPooling1DLayer);

exports.GlobalMaxPooling1DLayer = GlobalMaxPooling1DLayer;
},{"./MaxPooling1DLayer":"../src/architecture/Layers/PoolingLayers/MaxPooling1DLayer.js"}],"../src/architecture/Layers/PoolingLayers/GlobalMinPooling1DLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var MinPooling1DLayer_1 = require("./MinPooling1DLayer");

var GlobalMinPooling1DLayer =
/** @class */
function (_super) {
  __extends(GlobalMinPooling1DLayer, _super);

  function GlobalMinPooling1DLayer(outputSize, options) {
    if (options === void 0) {
      options = {};
    }

    return _super.call(this, 1, options) || this;
  }

  return GlobalMinPooling1DLayer;
}(MinPooling1DLayer_1.MinPooling1DLayer);

exports.GlobalMinPooling1DLayer = GlobalMinPooling1DLayer;
},{"./MinPooling1DLayer":"../src/architecture/Layers/PoolingLayers/MinPooling1DLayer.js"}],"../src/architecture/Layers/RecurrentLayers/GRULayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer_1 = require("../Layer");

var Activation_1 = require("../../../methods/Activation");

var Node_1 = require("../../Node");

var ActivationType_1 = require("../../../enums/ActivationType");

var NodeType_1 = require("../../../enums/NodeType");

var ConnectionType_1 = require("../../../enums/ConnectionType");

var GatingType_1 = require("../../../enums/GatingType");

var GRULayer =
/** @class */
function (_super) {
  __extends(GRULayer, _super);

  function GRULayer(outputSize, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;

    if (options === void 0) {
      options = {};
    }

    var _w;

    var _this = _super.call(this, outputSize) || this;

    var updateGate = [];
    var inverseUpdateGate = [];
    var resetGate = [];
    var memoryCell = [];
    var previousOutput = [];

    for (var i = 0; i < outputSize; i++) {
      _this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));

      updateGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(1));
      inverseUpdateGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(0).setSquash(ActivationType_1.ActivationType.LogisticActivation));
      resetGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(0));
      memoryCell.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setSquash(ActivationType_1.ActivationType.TanhActivation));
      previousOutput.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(0).setSquash(ActivationType_1.ActivationType.LogisticActivation));

      _this.outputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
    }

    (_a = _this.connections).push.apply(_a, Layer_1.Layer.connect(_this.inputNodes, updateGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    (_b = _this.connections).push.apply(_b, Layer_1.Layer.connect(_this.inputNodes, resetGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    (_c = _this.connections).push.apply(_c, Layer_1.Layer.connect(_this.inputNodes, memoryCell, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    (_d = _this.connections).push.apply(_d, Layer_1.Layer.connect(previousOutput, updateGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    (_e = _this.connections).push.apply(_e, Layer_1.Layer.connect(updateGate, inverseUpdateGate, ConnectionType_1.ConnectionType.ONE_TO_ONE, 1));

    (_f = _this.connections).push.apply(_f, Layer_1.Layer.connect(previousOutput, resetGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    var reset = Layer_1.Layer.connect(previousOutput, memoryCell, ConnectionType_1.ConnectionType.ALL_TO_ALL);

    (_g = _this.connections).push.apply(_g, reset);

    (_h = _this.gates).push.apply(_h, Layer_1.Layer.gate(resetGate, reset, GatingType_1.GatingType.OUTPUT));

    var update = Layer_1.Layer.connect(previousOutput, _this.outputNodes, ConnectionType_1.ConnectionType.ALL_TO_ALL);
    var inverseUpdate = Layer_1.Layer.connect(memoryCell, _this.outputNodes, ConnectionType_1.ConnectionType.ALL_TO_ALL);

    (_j = _this.connections).push.apply(_j, update);

    (_k = _this.connections).push.apply(_k, inverseUpdate);

    (_l = _this.gates).push.apply(_l, Layer_1.Layer.gate(updateGate, update, GatingType_1.GatingType.OUTPUT));

    (_m = _this.gates).push.apply(_m, Layer_1.Layer.gate(inverseUpdateGate, inverseUpdate, GatingType_1.GatingType.OUTPUT));

    (_o = _this.connections).push.apply(_o, Layer_1.Layer.connect(_this.outputNodes, previousOutput, ConnectionType_1.ConnectionType.ONE_TO_ONE, 1));

    (_p = _this.nodes).push.apply(_p, Array.from(_this.inputNodes));

    (_q = _this.nodes).push.apply(_q, updateGate);

    (_r = _this.nodes).push.apply(_r, inverseUpdateGate);

    (_s = _this.nodes).push.apply(_s, resetGate);

    (_t = _this.nodes).push.apply(_t, memoryCell);

    (_u = _this.nodes).push.apply(_u, Array.from(_this.outputNodes));

    (_v = _this.nodes).push.apply(_v, previousOutput);

    var activation = Activation_1.Activation.getActivation((_w = options.activationType) !== null && _w !== void 0 ? _w : ActivationType_1.ActivationType.LogisticActivation);

    _this.outputNodes.forEach(function (node) {
      return node.squash = activation;
    });

    return _this;
  }

  return GRULayer;
}(Layer_1.Layer);

exports.GRULayer = GRULayer;
},{"../Layer":"../src/architecture/Layers/Layer.js","../../../methods/Activation":"../src/methods/Activation.js","../../Node":"../src/architecture/Node.js","../../../enums/ActivationType":"../src/enums/ActivationType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/GatingType":"../src/enums/GatingType.js"}],"../src/architecture/Layers/RecurrentLayers/LSTMLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer_1 = require("../Layer");

var ActivationType_1 = require("../../../enums/ActivationType");

var Node_1 = require("../../Node");

var NodeType_1 = require("../../../enums/NodeType");

var ConnectionType_1 = require("../../../enums/ConnectionType");

var GatingType_1 = require("../../../enums/GatingType");

var Activation_1 = require("../../../methods/Activation");

var LSTMLayer =
/** @class */
function (_super) {
  __extends(LSTMLayer, _super);

  function LSTMLayer(outputSize, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;

    if (options === void 0) {
      options = {};
    }

    var _u;

    var _this = _super.call(this, outputSize) || this;

    var inputGate = [];
    var forgetGate = [];
    var memoryCell = [];
    var outputGate = [];

    for (var i = 0; i < outputSize; i++) {
      _this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));

      inputGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(1));
      forgetGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(1).setSquash(ActivationType_1.ActivationType.LogisticActivation));
      memoryCell.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
      outputGate.push(new Node_1.Node(NodeType_1.NodeType.HIDDEN).setBias(1));

      _this.outputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
    }

    (_a = _this.connections).push.apply(_a, Layer_1.Layer.connect(memoryCell, inputGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    (_b = _this.connections).push.apply(_b, Layer_1.Layer.connect(memoryCell, forgetGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    (_c = _this.connections).push.apply(_c, Layer_1.Layer.connect(memoryCell, outputGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    var forgetGateConnections = Layer_1.Layer.connect(memoryCell, memoryCell, ConnectionType_1.ConnectionType.ONE_TO_ONE);
    var outputGateConnections = Layer_1.Layer.connect(memoryCell, _this.outputNodes, ConnectionType_1.ConnectionType.ALL_TO_ALL);

    (_d = _this.connections).push.apply(_d, forgetGateConnections);

    (_e = _this.connections).push.apply(_e, outputGateConnections);

    (_f = _this.connections).push.apply(_f, Layer_1.Layer.connect(_this.inputNodes, memoryCell, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    (_g = _this.connections).push.apply(_g, Layer_1.Layer.connect(_this.inputNodes, outputGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    (_h = _this.connections).push.apply(_h, Layer_1.Layer.connect(_this.inputNodes, forgetGate, ConnectionType_1.ConnectionType.ALL_TO_ALL));

    var inputGateConnections = Layer_1.Layer.connect(_this.inputNodes, inputGate, ConnectionType_1.ConnectionType.ALL_TO_ALL);

    (_j = _this.connections).push.apply(_j, inputGateConnections);

    (_k = _this.gates).push.apply(_k, Layer_1.Layer.gate(forgetGate, forgetGateConnections, GatingType_1.GatingType.SELF));

    (_l = _this.gates).push.apply(_l, Layer_1.Layer.gate(outputGate, outputGateConnections, GatingType_1.GatingType.OUTPUT));

    (_m = _this.gates).push.apply(_m, Layer_1.Layer.gate(inputGate, inputGateConnections, GatingType_1.GatingType.INPUT));

    (_o = _this.nodes).push.apply(_o, Array.from(_this.inputNodes));

    (_p = _this.nodes).push.apply(_p, inputGate);

    (_q = _this.nodes).push.apply(_q, forgetGate);

    (_r = _this.nodes).push.apply(_r, memoryCell);

    (_s = _this.nodes).push.apply(_s, outputGate);

    (_t = _this.nodes).push.apply(_t, Array.from(_this.outputNodes));

    var activation = Activation_1.Activation.getActivation((_u = options.activationType) !== null && _u !== void 0 ? _u : ActivationType_1.ActivationType.TanhActivation);

    _this.outputNodes.forEach(function (node) {
      return node.squash = activation;
    });

    return _this;
  }

  return LSTMLayer;
}(Layer_1.Layer);

exports.LSTMLayer = LSTMLayer;
},{"../Layer":"../src/architecture/Layers/Layer.js","../../../enums/ActivationType":"../src/enums/ActivationType.js","../../Node":"../src/architecture/Node.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../../enums/ConnectionType":"../src/enums/ConnectionType.js","../../../enums/GatingType":"../src/enums/GatingType.js","../../../methods/Activation":"../src/methods/Activation.js"}],"../src/architecture/Layers/RecurrentLayers/MemoryLayer.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer_1 = require("../Layer");

var Activation_1 = require("../../../methods/Activation");

var Node_1 = require("../../Node");

var ActivationType_1 = require("../../../enums/ActivationType");

var NodeType_1 = require("../../../enums/NodeType");

var ConnectionType_1 = require("../../../enums/ConnectionType");

var MemoryLayer =
/** @class */
function (_super) {
  __extends(MemoryLayer, _super);

  function MemoryLayer(outputSize, options) {
    var _a, _b, _c;

    if (options === void 0) {
      options = {};
    }

    var _d, _e;

    var _this = _super.call(this, outputSize) || this;

    for (var i = 0; i < outputSize; i++) {
      _this.inputNodes.add(new Node_1.Node(NodeType_1.NodeType.HIDDEN));
    }

    var prevNodes = Array.from(_this.inputNodes);
    var nodes = [];

    for (var i = 0; i < ((_d = options.memorySize) !== null && _d !== void 0 ? _d : 1); i++) {
      var block = [];

      for (var j = 0; j < outputSize; j++) {
        var node = new Node_1.Node(NodeType_1.NodeType.HIDDEN);
        node.squash = new Activation_1.IdentityActivation();
        node.bias = 0;
        block.push(node);
      }

      (_a = _this.connections).push.apply(_a, Layer_1.Layer.connect(prevNodes, block, ConnectionType_1.ConnectionType.ONE_TO_ONE));

      nodes.push.apply(nodes, block);
      prevNodes = block;
    }

    (_b = _this.nodes).push.apply(_b, Array.from(_this.inputNodes));

    (_c = _this.nodes).push.apply(_c, nodes.reverse());

    prevNodes.forEach(function (node) {
      return _this.outputNodes.add(node);
    });
    var activation = Activation_1.Activation.getActivation((_e = options.activationType) !== null && _e !== void 0 ? _e : ActivationType_1.ActivationType.LogisticActivation);

    _this.outputNodes.forEach(function (node) {
      return node.squash = activation;
    });

    return _this;
  }

  return MemoryLayer;
}(Layer_1.Layer);

exports.MemoryLayer = MemoryLayer;
},{"../Layer":"../src/architecture/Layers/Layer.js","../../../methods/Activation":"../src/methods/Activation.js","../../Node":"../src/architecture/Node.js","../../../enums/ActivationType":"../src/enums/ActivationType.js","../../../enums/NodeType":"../src/enums/NodeType.js","../../../enums/ConnectionType":"../src/enums/ConnectionType.js"}],"../src/methods/Loss.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Loss functions play an important role in neural networks. They give neural networks an indication of 'how wrong' they are; a.k.a. how far they are from the desired outputs. Also in fitness functions, loss functions play an important role.
 *
 * @see [Loss Function on Wikipedia](https://en.wikipedia.org/wiki/Loss_function)
 */

var Loss =
/** @class */
function () {
  function Loss() {}

  return Loss;
}();

exports.Loss = Loss;
/**
 * Cross entropy error
 *
 * @see {@link http://bit.ly/2p5W29A | Cross-entropy Error Function}
 * @param targets Ideal value
 * @param outputs Actual values
 *
 * @return [Cross entropy error](https://ml-cheatsheet.readthedocs.io/en/latest/loss_functions.html)
 *
 * @example
 * let myNetwork = new Network(5, 5);
 * myNetwork.train(trainingData, { loss: new CrossEntropyLoss() });
 */

var CrossEntropyLoss =
/** @class */
function (_super) {
  __extends(CrossEntropyLoss, _super);

  function CrossEntropyLoss() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  CrossEntropyLoss.prototype.calc = function (targets, outputs) {
    var error = 0;
    outputs.forEach(function (value, index) {
      error -= targets[index] * Math.log(Math.max(value, 1e-15)) + (1 - targets[index]) * Math.log(1 - Math.max(value, 1e-15));
    });
    return error / outputs.length;
  };

  return CrossEntropyLoss;
}(Loss);

exports.CrossEntropyLoss = CrossEntropyLoss;
/**
 * Mean Squared Error
 *
 * @param targets Ideal value
 * @param outputs Actual values
 *
 * @return [Mean squared error](https://medium.freecodecamp.org/machine-learning-mean-squared-error-regression-line-c7dde9a26b93)
 *
 * @example
 * let myNetwork = new Network(5, 5);
 * myNetwork.train(trainingData, { loss: new MSELoss() });
 */

var MSELoss =
/** @class */
function (_super) {
  __extends(MSELoss, _super);

  function MSELoss() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MSELoss.prototype.calc = function (targets, outputs) {
    var error = 0;
    outputs.forEach(function (value, index) {
      error += Math.pow(targets[index] - value, 2);
    });
    return error / outputs.length;
  };

  return MSELoss;
}(Loss);

exports.MSELoss = MSELoss;
/**
 * Binary Error
 *
 * @param targets Ideal value
 * @param outputs Actual values
 *
 * @return misses The amount of times targets value was missed
 *
 * @example
 * let myNetwork = new Network(5, 5);
 * myNetwork.train(trainingData, {
 *   log: 1,
 *   iterations: 500,
 *   error: 0.03,
 *   rate: 0.05,
 *   loss: new BinaryLoss()
 * });
 */

var BinaryLoss =
/** @class */
function (_super) {
  __extends(BinaryLoss, _super);

  function BinaryLoss() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  BinaryLoss.prototype.calc = function (targets, outputs) {
    var error = 0;
    outputs.forEach(function (value, index) {
      error += Math.round(targets[index] * 2) !== Math.round(value * 2) ? 1 : 0;
    });
    return error / outputs.length;
  };

  return BinaryLoss;
}(Loss);

exports.BinaryLoss = BinaryLoss;
/**
 * Mean Absolute Error
 *
 * @param targets Ideal value
 * @param outputs Actual values
 *
 * @return [Mean absolute error](https://en.wikipedia.org/wiki/Mean_absolute_error)
 *
 * @example
 * let myNetwork = new Network(5, 5);
 * myNetwork.train(trainingData, {
 *   log: 1,
 *   iterations: 500,
 *   error: 0.03,
 *   rate: 0.05,
 *   loss: new MAELoss()
 * });
 */

var MAELoss =
/** @class */
function (_super) {
  __extends(MAELoss, _super);

  function MAELoss() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MAELoss.prototype.calc = function (targets, outputs) {
    var error = 0;
    outputs.forEach(function (value, index) {
      error += Math.abs(targets[index] - value);
    });
    return error / outputs.length;
  };

  return MAELoss;
}(Loss);

exports.MAELoss = MAELoss;
/**
 * Mean Absolute Percentage Error
 *
 * @param targets Ideal value
 * @param outputs Actual values
 *
 * @return [Mean absolute percentage error](https://en.wikipedia.org/wiki/Mean_absolute_percentage_error)
 *
 * @example
 * let myNetwork = new Network(5, 5);
 * myNetwork.train(trainingData, {
 *   log: 1,
 *   iterations: 500,
 *   error: 0.03,
 *   rate: 0.05,
 *   loss: new MAPELoss()
 * });
 */

var MAPELoss =
/** @class */
function (_super) {
  __extends(MAPELoss, _super);

  function MAPELoss() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MAPELoss.prototype.calc = function (targets, outputs) {
    var error = 0;
    outputs.forEach(function (value, index) {
      error += Math.abs((value - targets[index]) / Math.max(targets[index], 1e-15));
    });
    return error / outputs.length;
  };

  return MAPELoss;
}(Loss);

exports.MAPELoss = MAPELoss;
/**
 * Weighted Absolute Percentage Error (WAPE)
 *
 * @param targets Ideal value
 * @param outputs Actual values
 *
 * @return - [Weighted absolute percentage error](https://help.sap.com/doc/saphelp_nw70/7.0.31/en-US/76/487053bbe77c1ee10000000a174cb4/content.htm?no_cache=true)
 *
 * @example
 * let myNetwork = new Network(5, 5);
 * myNetwork.train(trainingData, {
 *   loss: new WAPELoss()
 * });
 */

var WAPELoss =
/** @class */
function (_super) {
  __extends(WAPELoss, _super);

  function WAPELoss() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  WAPELoss.prototype.calc = function (targets, outputs) {
    var error = 0;
    var sum = 0;

    for (var i = 0; i < outputs.length; i++) {
      error += Math.abs(targets[i] - outputs[i]);
      sum += targets[i];
    }

    return error / sum;
  };

  return WAPELoss;
}(Loss);

exports.WAPELoss = WAPELoss;
/**
 * Mean Squared Logarithmic Error
 *
 * @param targets Ideal value
 * @param outputs Actual values
 *
 * @return - [Mean squared logarithmic error](https://peltarion.com/knowledge-center/documentation/modeling-view/build-an-ai-model/loss-functions/mean-squared-logarithmic-error)
 *
 * @example
 * let myNetwork = new Network(5, 5);
 * myNetwork.train(trainingData, {
 *   log: 1,
 *   iterations: 500,
 *   error: 0.03,
 *   rate: 0.05,
 *   loss: new MSLELoss()
 * });
 */

var MSLELoss =
/** @class */
function (_super) {
  __extends(MSLELoss, _super);

  function MSLELoss() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MSLELoss.prototype.calc = function (targets, outputs) {
    var error = 0;
    outputs.forEach(function (value, index) {
      error += Math.log(Math.max(targets[index], 1e-15)) - Math.log(Math.max(value, 1e-15));
    });
    return error / outputs.length;
  };

  return MSLELoss;
}(Loss);

exports.MSLELoss = MSLELoss;
/**
 * Hinge loss, for classifiers
 *
 * @param targets Ideal value
 * @param outputs Actual values
 *
 * @return - [Hinge loss](https://towardsdatascience.com/support-vector-machines-intuitive-understanding-part-1-3fb049df4ba1)
 *
 * @example
 * let myNetwork = new Network(5, 5);
 * myNetwork.train(trainingData, {
 *   log: 1,
 *   iterations: 500,
 *   error: 0.03,
 *   rate: 0.05,
 *   loss: new HINGELoss()
 * });
 */

var HINGELoss =
/** @class */
function (_super) {
  __extends(HINGELoss, _super);

  function HINGELoss() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  HINGELoss.prototype.calc = function (targets, outputs) {
    var error = 0;
    outputs.forEach(function (value, index) {
      error += Math.max(0, 1 - value * targets[index]);
    });
    return error / outputs.length;
  };

  return HINGELoss;
}(Loss);

exports.HINGELoss = HINGELoss;
var ALL_LOSSES = [new CrossEntropyLoss(), new MSELoss(), new BinaryLoss(), new MAELoss(), new MAPELoss(), new WAPELoss(), new MSLELoss(), new HINGELoss()];
exports.ALL_LOSSES = ALL_LOSSES;
},{}],"../src/methods/Rate.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Built-in learning rate policies, which allow for a dynamic learning rate during neural network training.
 *
 * @see [Learning rates and how-to improve performance](https://towardsdatascience.com/understanding-learning-rates-and-how-it-improves-performance-in-deep-learning-d0d4059c1c10)
 * @see [Learning rate policy](https://stackoverflow.com/questions/30033096/what-is-lr-policy-in-caffe/30045244)
 *
 * @example
 * let network = new Network(5, 5);
 *
 * // OPTION #1: FixedRate
 * network.train(dataset, { ratePolicy: new FixedRate() });
 *
 * // OPTION #2: StepRate
 * network.train(dataset, { ratePolicy: new StepRate() });
 *
 * // OPTION #3: ExponentialRate
 * network.train(dataset, { ratePolicy: new ExponentialRate() });
 *
 * // OPTION #4: InverseRate
 * network.train(dataset, { ratePolicy: new InverseRate() });
 */

var Rate =
/** @class */
function () {
  /**
   * Constructs a rate policy
   * @param baseRate the rate at first iteration
   */
  function Rate(baseRate) {
    this.baseRate = baseRate;
  }

  return Rate;
}();

exports.Rate = Rate;
/**
 * Fixed Learning Rate
 *
 * Default rate policy. Using this will make learning rate static (no change). Useful as a way to update a previous rate policy.
 *
 * @example
 * let network = new Network(10, 1);
 *
 * network.train(dataset, { ratePolicy: new FixedRate(0.3) });
 */

var FixedRate =
/** @class */
function (_super) {
  __extends(FixedRate, _super);

  function FixedRate() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  /**
   * Calculates the current training rate.
   *
   * @param iteration count
   * @returns the current training rate
   */


  FixedRate.prototype.calc = function (iteration) {
    return this.baseRate;
  };

  return FixedRate;
}(Rate);

exports.FixedRate = FixedRate;
/**
 * Step Learning Rate
 *
 * The learning rate will decrease (i.e. 'step down') every `stepSize` iterations.
 *
 * @example
 * let network = new Network(10, 1);
 *
 * network.train(dataset, { ratePolicy: new StepRate(0.3) });
 */

var StepRate =
/** @class */
function (_super) {
  __extends(StepRate, _super);
  /**
   * Constructs a step rate policy.
   *
   * @param baseRate the rate at first iteration
   * @param gamma=0.9 Learning rate retention per step; - _0 < `gamma` < 1_ - _large `gamma` CAN cause networks to never converge, low `gamma` CAN cause networks to converge too quickly_
   * @param stepSize=100 Learning rate is updated every `step_size` iterations
   */


  function StepRate(baseRate, gamma, stepSize) {
    if (gamma === void 0) {
      gamma = 0.9;
    }

    if (stepSize === void 0) {
      stepSize = 100;
    }

    var _this = _super.call(this, baseRate) || this;

    _this.gamma = gamma;
    _this.stepSize = stepSize;
    return _this;
  }
  /**
   * Calculates the current training rate.
   *
   * @param iteration count
   * @returns the current training rate
   */


  StepRate.prototype.calc = function (iteration) {
    return this.baseRate * Math.pow(this.gamma, Math.floor(iteration / this.stepSize));
  };

  return StepRate;
}(Rate);

exports.StepRate = StepRate;
/**
 * Exponential Learning Rate
 *
 * The learning rate will exponentially decrease.
 *
 * The rate at `iteration` is calculated as: `rate = base_rate * Math.pow(gamma, iteration)`
 *
 * @example
 * let network = new Network(10, 1);
 *
 * network.train(dataset, { ratePolicy: new ExponentialRate(0.3) });
 */

var ExponentialRate =
/** @class */
function (_super) {
  __extends(ExponentialRate, _super);
  /**
   * Constructs a step rate policy.
   *
   * @param baseRate the rate at first iteration
   * @param gamma=0.9 Learning rate retention per step; - _0 < `gamma` < 1_ - _large `gamma` CAN cause networks to never converge, low `gamma` CAN cause networks to converge too quickly_
   */


  function ExponentialRate(baseRate, gamma) {
    if (gamma === void 0) {
      gamma = 0.999;
    }

    var _this = _super.call(this, baseRate) || this;

    _this.gamma = gamma;
    return _this;
  }
  /**
   * Calculates the current training rate.
   *
   * @param iteration count
   * @returns the current training rate
   */


  ExponentialRate.prototype.calc = function (iteration) {
    return this.baseRate * Math.pow(this.gamma, iteration);
  };

  return ExponentialRate;
}(Rate);

exports.ExponentialRate = ExponentialRate;
/**
 * Inverse Exponential Learning Rate
 *
 * The learning rate will exponentially decrease.
 *
 * The rate at `iteration` is calculated as: `rate = baseRate * Math.pow(1 + gamma * iteration, -power)`
 *
 * @example
 * let network = new Network(10, 1);
 *
 * network.train(dataset, { ratePolicy: new InverseRate(0.3) });
 */

var InverseRate =
/** @class */
function (_super) {
  __extends(InverseRate, _super);
  /**
   * Constructs a step rate policy.
   *
   * @param baseRate the rate at first iteration
   * @param [gamma=0.001] Learning rate decay per iteration; - _0 < `gamma` < 1_ - _large `gamma` CAN cause networks to converge too quickly and stop learning, low `gamma` CAN cause networks to converge to learn VERY slowly_
   * @param power=2 Decay rate per iteration - _0 < `power`_ - _large `power` CAN cause networks to stop learning quickly, low `power` CAN cause networks to learn VERY slowly_
   */


  function InverseRate(baseRate, gamma, power) {
    if (gamma === void 0) {
      gamma = 0.001;
    }

    if (power === void 0) {
      power = 2;
    }

    var _this = _super.call(this, baseRate) || this;

    _this.gamma = gamma;
    _this.power = power;
    return _this;
  }
  /**
   * Calculates the current training rate.
   *
   * @param iteration count
   * @returns the current training rate
   */


  InverseRate.prototype.calc = function (iteration) {
    return this.baseRate * Math.pow(1 + this.gamma * iteration, -this.power);
  };

  return InverseRate;
}(Rate);

exports.InverseRate = InverseRate;
},{}],"../src/methods/Selection.js":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Utils_1 = require("./Utils");
/**
 * Genetic Algorithm Selection Methods (Genetic Operator)
 *
 * @see [Genetic Algorithm - Selection]{@link https://en.wikipedia.org/wiki/Selection_(genetic_algorithm)}
 *
 * @example
 * let myNetwork = new Network(1,1);
 * let myTrainingSet = [{ input:[0], output:[1]}, { input:[1], output:[0]}];
 *
 * myNetwork.evolve(myTrainingSet, {
 *  generations: 10,
 *  selection: new PowerSelection() // eg.
 * });
 */


var Selection =
/** @class */
function () {
  function Selection() {}

  return Selection;
}();

exports.Selection = Selection;
/**
 * Fitness proportionate selection
 *
 * [Fitness Proportionate / Roulette Wheel Selection on Wikipedia](https://en.wikipedia.org/wiki/Fitness_proportionate_selection)
 *
 * @example
 * let myNetwork = new Network(1,1);
 * let myTrainingSet = [{ input:[0], output:[1]}, { input:[1], output:[0]}];
 *
 * myNetwork.evolve(myTrainingSet, {
 *  iterations: 10,
 *  selection: new FitnessProportionateSelection() // eg.
 * });
 */

var FitnessProportionateSelection =
/** @class */
function (_super) {
  __extends(FitnessProportionateSelection, _super);

  function FitnessProportionateSelection() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  FitnessProportionateSelection.prototype.select = function (population) {
    var _a, _b, _c;

    var totalFitness = 0;
    var minimalFitness = 0;

    for (var _i = 0, population_1 = population; _i < population_1.length; _i++) {
      var genome = population_1[_i];
      minimalFitness = Math.min((_a = genome.score) !== null && _a !== void 0 ? _a : minimalFitness, minimalFitness);
      totalFitness += (_b = genome.score) !== null && _b !== void 0 ? _b : 0;
    }

    minimalFitness = Math.abs(minimalFitness);
    totalFitness += minimalFitness * population.length;
    var random = Utils_1.randDouble(0, totalFitness);
    var value = 0;

    for (var _d = 0, population_2 = population; _d < population_2.length; _d++) {
      var genome = population_2[_d];
      value += ((_c = genome.score) !== null && _c !== void 0 ? _c : 0) + minimalFitness;

      if (random < value) {
        return genome;
      }
    }

    return Utils_1.pickRandom(population);
  };

  return FitnessProportionateSelection;
}(Selection);

exports.FitnessProportionateSelection = FitnessProportionateSelection;
/**
 * Power selection
 *
 * A random decimal value between 0 and 1 will be generated (e.g. 0.5) then this value will get an exponential value (power, default is 4). So 0.5**4 = 0.0625. This is converted into an index for the array of the current population, sorted from fittest to worst.
 *
 * @example
 * let myNetwork = new Network(1,1);
 * let myTrainingSet = [{ input:[0], output:[1]}, { input:[1], output:[0]}];
 *
 * myNetwork.evolve(myTrainingSet, {
 *  iterations: 10,
 *  selection: new PowerSelection() // eg.
 * });
 */

var PowerSelection =
/** @class */
function (_super) {
  __extends(PowerSelection, _super);

  function PowerSelection(power) {
    if (power === void 0) {
      power = 4;
    }

    var _this = _super.call(this) || this;

    _this.power = power;
    return _this;
  }

  PowerSelection.prototype.select = function (population) {
    return population[Math.floor(Math.pow(Math.random(), this.power) * population.length)];
  };

  return PowerSelection;
}(Selection);

exports.PowerSelection = PowerSelection;
/**
 * Tournament selection
 *
 * [Tournament Selection on Wikipedia](https://en.wikipedia.org/wiki/Tournament_selection)
 *
 * @example
 * let myNetwork = new Network(1,1);
 * let myTrainingSet = [{ input:[0], output:[1]}, { input:[1], output:[0]}];
 *
 * myNetwork.evolve(myTrainingSet, {
 *  iterations: 10,
 *  selection: new TournamentSelection() // eg.
 * });
 */

var TournamentSelection =
/** @class */
function (_super) {
  __extends(TournamentSelection, _super);
  /**
   * Constructs a tournament selection.
   * @param size the size of a tournament
   * @param probability Selects the best individual (when probability = 1).
   */


  function TournamentSelection(size, probability) {
    if (size === void 0) {
      size = 5;
    }

    if (probability === void 0) {
      probability = 0.5;
    }

    var _this = _super.call(this) || this;

    _this.size = size;
    _this.probability = probability;
    return _this;
  }

  TournamentSelection.prototype.select = function (population) {
    if (this.size > population.length) {
      throw new Error("Your tournament size should be lower than the population size, please change methods.selection.TOURNAMENT.size");
    } // Create a tournament


    var individuals = [];

    for (var i = 0; i < this.size; i++) {
      individuals.push(Utils_1.pickRandom(population));
    } // Sort the tournament individuals by score


    individuals.sort(function (a, b) {
      return b.score === undefined || a.score === undefined ? 0 : b.score - a.score;
    }); // Select an individual

    for (var i = 0; i < this.size; i++) {
      if (Math.random() < this.probability || i === this.size - 1) {
        return individuals[i];
      }
    }

    return Utils_1.pickRandom(population);
  };

  return TournamentSelection;
}(Selection);

exports.TournamentSelection = TournamentSelection;
},{"./Utils":"../src/methods/Utils.js"}],"../src/NEAT.js":[function(require,module,exports) {
"use strict";

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

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Network_1 = require("./architecture/Network");

var Utils_1 = require("./methods/Utils");

var Selection_1 = require("./methods/Selection");

var Mutation_1 = require("./methods/Mutation");

var Activation_1 = require("./methods/Activation");
/**
 * Runs the NEAT algorithm on group of neural networks.
 *
 * @constructs Neat
 *
 * @private
 *
 * @param {Array<{input:number[],output:number[]}>} [dataset] A set of input values and ideal output values to evaluate a genome's fitness with. Must be included to use `NEAT.evaluate` without passing a dataset
 * @param {EvolveOptions} options - Configuration options
 * @param {number} input - The input size of `template` networks.
 * @param {number} output - The output size of `template` networks.
 * @param {boolean} [options.equal=false] When true [crossover](Network.crossOver) parent genomes are assumed to be equally fit and offspring are built with a random amount of neurons within the range of parents' number of neurons. Set to false to select the "fittest" parent as the neuron amount template.
 * @param {number} [options.clear=false] Clear the context of the population's nodes, basically reverting them to 'new' neurons. Useful for predicting timeseries with LSTM's.
 * @param {number} [options.populationSize=50] Population size of each generation.
 * @param {number} [options.growth=0.0001] Set the penalty for large networks. Penalty calculation: penalty = (genome.nodes.length + genome.connectoins.length + genome.gates.length) * growth; This penalty will get added on top of the error. Your growth should be a very small number.
 * @param {Loss} [options.loss=new MSELoss()]  Specify the cost function for the evolution, this tells a genome in the population how well it's performing. Default: methods.new MSELoss() (recommended).
 * @param {number} [options.amount=1] Set the amount of times to test the trainingset on a genome each generation. Useful for timeseries. Do not use for regular feedfoward problems.
 * @param {number} [options.elitism=1] Elitism of every evolution loop. [Elitism in genetic algortihtms.](https://www.researchgate.net/post/What_is_meant_by_the_term_Elitism_in_the_Genetic_Algorithm)
 * @param {number} [options.provenance=0] Number of genomes inserted the original network template (Network(input,output)) per evolution.
 * @param {number} [options.mutationRate=0.4] Sets the mutation rate. If set to 0.3, 30% of the new population will be mutated. Default is 0.4.
 * @param {number} [options.mutationAmount=1] If mutation occurs (randomNumber < mutationRate), sets amount of times a mutation method will be applied to the network.
 * @param {boolean} [options.fitnessPopulation=false] Flag to return the fitness of a population of genomes. Set this to false to evaluate each genome inidividually.
 * @param {((dataset: { input: number[]; output: number[] }[], population: Network[]) => Promise<void>)} [options.fitness] - A fitness function to evaluate the networks. Takes a `dataset` and a `genome` i.e. a [network](Network) or a `population` i.e. an array of networks and sets the genome `.score` property
 * @param {string} [options.selection=FITNESS_PROPORTIONATE] [Selection method](selection) for evolution (e.g. Selection.FITNESS_PROPORTIONATE).
 * @param {Array} [options.crossover] Sets allowed crossover methods for evolution.
 * @param {Network} [options.network=false] Network to start evolution from
 * @param {number} [options.maxNodes=Infinity] Maximum nodes for a potential network
 * @param {number} [options.maxConnections=Infinity] Maximum connections for a potential network
 * @param {number} [options.maxGates=Infinity] Maximum gates for a potential network
 * @param {Mutation[]} [options.mutation] Sets allowed [mutation methods](mutation) for evolution, a random mutation method will be chosen from the array when mutation occurs. Optional, but default methods are non-recurrent
 *
 * @prop {number} generation A count of the generations
 * @prop {Network[]} population The current population for the neat instance. Accessible through `neat.population`
 *
 * @example
 * let { Neat } = require("@liquid-carrot/carrot");
 *
 * let neat = new Neat(dataset, {
 *   elitism: 10,
 *   clear: true,
 *   populationSize: 1000
 * });
 */


var NEAT =
/** @class */
function () {
  function NEAT(dataset, options) {
    if (options === void 0) {
      options = {};
    }

    if (dataset.length === 0) {
      throw new ReferenceError("No dataset given !");
    }

    this.dataset = dataset;
    this.generation = Utils_1.getOrDefault(options.generation, 0);
    this.input = dataset[0].input.length;
    this.output = dataset[0].output.length;
    this.equal = Utils_1.getOrDefault(options.equal, true);
    this.clear = Utils_1.getOrDefault(options.clear, false);
    this.populationSize = Utils_1.getOrDefault(options.populationSize, 50);
    this.elitism = Utils_1.getOrDefault(options.elitism, 2);
    this.provenance = Utils_1.getOrDefault(options.provenance, 0);
    this.mutationRate = Utils_1.getOrDefault(options.mutationRate, 0.6);
    this.mutationAmount = Utils_1.getOrDefault(options.mutationAmount, 5);
    if (!options.fitnessFunction) throw new ReferenceError("No fitness function given");
    this.fitnessFunction = options.fitnessFunction;
    this.selection = Utils_1.getOrDefault(options.selection, new Selection_1.FitnessProportionateSelection());
    this.mutations = Utils_1.getOrDefault(options.mutations, Mutation_1.FEEDFORWARD_MUTATIONS);
    this.activations = Utils_1.getOrDefault(options.activations, Activation_1.ALL_ACTIVATIONS);
    this.template = Utils_1.getOrDefault(options.template, new Network_1.Network(this.input, this.output));
    this.maxNodes = Utils_1.getOrDefault(options.maxNodes, Infinity);
    this.maxConnections = Utils_1.getOrDefault(options.maxConnections, Infinity);
    this.maxGates = Utils_1.getOrDefault(options.maxGates, Infinity);
    this.population = [];
    this.createInitialPopulation();
  }

  NEAT.prototype.filterGenome = function (population, template, pickGenome, adjustGenome) {
    var filtered = __spreadArrays(population); // avoid mutations


    if (adjustGenome) {
      filtered.filter(function (genome) {
        return pickGenome(genome);
      }).forEach(function (genome, index) {
        return filtered[index] = adjustGenome(filtered[index]);
      });
    } else {
      filtered.filter(function (genome) {
        return pickGenome(genome);
      }).forEach(function (genome, index) {
        return filtered[index] = template.copy();
      });
    }

    return filtered;
  };

  NEAT.prototype.mutateRandom = function (genome, possible) {
    if (possible === void 0) {
      possible = Mutation_1.ALL_MUTATIONS;
    }

    var maxNodes = this.maxNodes;
    var maxConnections = this.maxConnections;
    var maxGates = this.maxGates;
    possible = possible.filter(function (method) {
      return method.constructor.name !== Mutation_1.AddNodeMutation.constructor.name || genome.nodes.length < maxNodes || method.constructor.name !== Mutation_1.AddConnectionMutation.constructor.name || genome.connections.length < maxConnections || method.constructor.name !== Mutation_1.AddGateMutation.constructor.name || genome.gates.length < maxGates;
    });
    genome.mutate(Utils_1.pickRandom(possible), {
      allowedActivations: this.activations
    });
  };
  /**
   * Evaluates, selects, breeds and mutates population
   *
   * @param {function} [pickGenome] A custom selection function to pick out unwanted genomes. Accepts a network as a parameter and returns true for selection.
   * @param {function} [adjustGenome=self.template] Accepts a network, modifies it, and returns it. Used to modify unwanted genomes returned by `pickGenome` and reincorporate them into the population. If left unset, unwanted genomes will be replaced with the template Network. Will only run when pickGenome is defined.
   *
   * @returns {Network} Fittest network
   *
   * @example
   * let neat = new Neat(dataset, {
   *  elitism: 10,
   *  clear: true,
   *  populationSize: 1000
   * });
   *
   * let filter = function(genome) {
   *  // Remove genomes with more than 100 nodes
   *  return genome.nodes.length > 100 ? true : false
   * }
   *
   * let adjust = function(genome) {
   *  // clear the nodes
   *  return genome.clear()
   * }
   *
   * neat.evolve(evolveSet, filter, adjust).then(function(fittest) {
   *  console.log(fittest)
   * })
   */


  NEAT.prototype.evolve = function (pickGenome, adjustGenome) {
    return __awaiter(this, void 0, void 0, function () {
      var elitists, i, newPopulation, i, fittest;

      var _a;

      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            // Check if evolve is possible
            if (this.elitism + this.provenance > this.populationSize) {
              throw new Error("Can`t evolve! Elitism + provenance exceeds population size!");
            }

            if (!(this.population[this.population.length - 1].score === undefined)) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.evaluate(this.dataset)];

          case 1:
            _b.sent();

            _b.label = 2;

          case 2:
            if (pickGenome) {
              this.population = this.filterGenome(this.population, this.template, pickGenome, adjustGenome);
            } // Sort in order of fitness (fittest first)


            this.sort();
            elitists = [];

            for (i = 0; i < this.elitism; i++) {
              elitists.push(this.population[i]);
            }

            newPopulation = Array(this.provenance).fill(this.template.copy()); // Breed the next individuals

            for (i = 0; i < this.populationSize - this.elitism - this.provenance; i++) {
              newPopulation.push(this.getOffspring());
            } // Replace the old population with the new population


            this.population = newPopulation; // Mutate the new population

            this.mutate(); // Add the elitists

            (_a = this.population).push.apply(_a, elitists); // evaluate the population


            return [4
            /*yield*/
            , this.evaluate(this.dataset)];

          case 3:
            // evaluate the population
            _b.sent(); // Check & adjust genomes as needed


            if (pickGenome) {
              this.population = this.filterGenome(this.population, this.template, pickGenome, adjustGenome);
            } // Sort in order of fitness (fittest first)


            this.sort();
            fittest = this.population[0].copy();
            fittest.score = this.population[0].score; // Reset the scores

            this.population.forEach(function (genome) {
              return genome.score = undefined;
            });
            this.generation++;
            return [2
            /*return*/
            , fittest];
        }
      });
    });
  };
  /**
   * Selects two genomes from the population with `getParent()`, and returns the offspring from those parents. NOTE: Population MUST be sorted
   *
   * @returns {Network} Child network
   */


  NEAT.prototype.getOffspring = function () {
    this.sort();
    var parent1 = this.selection.select(this.population);
    var parent2 = this.selection.select(this.population);

    if (parent1 === null || parent2 === null) {
      throw new ReferenceError("Should not be null!");
    }

    return Network_1.Network.crossOver(parent1, parent2, this.equal);
  };
  /**
   * Mutates the given (or current) population
   *
   * @param {Mutation} [method] A mutation method to mutate the population with. When not specified will pick a random mutation from the set allowed mutations.
   */


  NEAT.prototype.mutate = function (method) {
    var _this = this;

    if (method) {
      // Elitist genomes should not be included
      this.population.filter(function () {
        return Math.random() <= _this.mutationRate;
      }).forEach(function (genome) {
        for (var i = 0; i < _this.mutationAmount; i++) {
          genome.mutate(method);
        }
      });
    } else {
      // Elitist genomes should not be included
      this.population.filter(function () {
        return Math.random() <= _this.mutationRate;
      }).forEach(function (genome) {
        for (var i = 0; i < _this.mutationAmount; i++) {
          _this.mutateRandom(genome, _this.mutations);
        }
      });
    }
  };
  /**
   * Evaluates the current population, basically sets their `.score` property
   *
   * @return {Network} Fittest Network
   */


  NEAT.prototype.evaluate = function (dataset) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.clear) {
              this.population.forEach(function (genome) {
                return genome.clear();
              });
            }

            return [4
            /*yield*/
            , this.fitnessFunction(dataset, this.population)];

          case 1:
            _a.sent(); // Sort the population in order of fitness


            this.sort();
            return [2
            /*return*/
            , this.population[0]];
        }
      });
    });
  };
  /**
   * Sorts the population by score
   */


  NEAT.prototype.sort = function () {
    this.population.sort(function (a, b) {
      return a.score === undefined || b.score === undefined ? 0 : b.score - a.score;
    });
  };
  /**
   * Returns the fittest genome of the current population
   *
   * @returns {Network} Current population's fittest genome
   */


  NEAT.prototype.getFittest = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(this.population[this.population.length - 1].score === undefined)) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.evaluate(this.dataset)];

          case 1:
            _a.sent();

            _a.label = 2;

          case 2:
            this.sort();
            return [2
            /*return*/
            , this.population[0]];
        }
      });
    });
  };
  /**
   * Returns the average fitness of the current population
   *
   * @returns {number} Average fitness of the current population
   */


  NEAT.prototype.getAverage = function () {
    return __awaiter(this, void 0, void 0, function () {
      var score;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!(this.population[this.population.length - 1].score === undefined)) return [3
            /*break*/
            , 2];
            return [4
            /*yield*/
            , this.evaluate(this.dataset)];

          case 1:
            _a.sent();

            _a.label = 2;

          case 2:
            score = 0;
            this.population.map(function (genome) {
              return genome.score;
            }).forEach(function (val) {
              return score += val !== null && val !== void 0 ? val : 0;
            });
            return [2
            /*return*/
            , score / this.population.length];
        }
      });
    });
  };
  /**
   * Create the initial pool of genomes
   */


  NEAT.prototype.createInitialPopulation = function () {
    for (var i = 0; i < this.populationSize; i++) {
      this.population.push(this.template.copy());
    }
  };

  return NEAT;
}();

exports.NEAT = NEAT;
},{"./architecture/Network":"../src/architecture/Network.js","./methods/Utils":"../src/methods/Utils.js","./methods/Selection":"../src/methods/Selection.js","./methods/Mutation":"../src/methods/Mutation.js","./methods/Activation":"../src/methods/Activation.js"}],"../../node_modules/threads/dist-esm/serializers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendSerializer = extendSerializer;
exports.DefaultSerializer = void 0;

function extendSerializer(extend, implementation) {
  const fallbackDeserializer = extend.deserialize.bind(extend);
  const fallbackSerializer = extend.serialize.bind(extend);
  return {
    deserialize(message) {
      return implementation.deserialize(message, fallbackDeserializer);
    },

    serialize(input) {
      return implementation.serialize(input, fallbackSerializer);
    }

  };
}

const DefaultErrorSerializer = {
  deserialize(message) {
    return Object.assign(Error(message.message), {
      name: message.name,
      stack: message.stack
    });
  },

  serialize(error) {
    return {
      __error_marker: "$$error",
      message: error.message,
      name: error.name,
      stack: error.stack
    };
  }

};

const isSerializedError = thing => thing && typeof thing === "object" && "__error_marker" in thing && thing.__error_marker === "$$error";

const DefaultSerializer = {
  deserialize(message) {
    if (isSerializedError(message)) {
      return DefaultErrorSerializer.deserialize(message);
    } else {
      return message;
    }
  },

  serialize(input) {
    if (input instanceof Error) {
      return DefaultErrorSerializer.serialize(input);
    } else {
      return input;
    }
  }

};
exports.DefaultSerializer = DefaultSerializer;
},{}],"../../node_modules/threads/dist-esm/common.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSerializer = registerSerializer;
exports.deserialize = deserialize;
exports.serialize = serialize;

var _serializers = require("./serializers");

let registeredSerializer = _serializers.DefaultSerializer;

function registerSerializer(serializer) {
  registeredSerializer = (0, _serializers.extendSerializer)(registeredSerializer, serializer);
}

function deserialize(message) {
  return registeredSerializer.deserialize(message);
}

function serialize(input) {
  return registeredSerializer.serialize(input);
}
},{"./serializers":"../../node_modules/threads/dist-esm/serializers.js"}],"../../node_modules/threads/dist-esm/master/get-bundle-url.browser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseURL = getBaseURL;
exports.getBundleURL = getBundleURLCached;
// Source: <https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/builtins/bundle-url.js>
let bundleURL;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    const matches = ("" + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return "/";
}

function getBaseURL(url) {
  return ("" + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
},{}],"../../node_modules/threads/dist-esm/master/implementation.browser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectWorkerImplementation = selectWorkerImplementation;
exports.defaultPoolSize = void 0;

var _getBundleUrl = require("./get-bundle-url.browser");

// tslint:disable max-classes-per-file
const defaultPoolSize = typeof navigator !== "undefined" && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
exports.defaultPoolSize = defaultPoolSize;

const isAbsoluteURL = value => /^(file|https?:)?\/\//i.test(value);

function createSourceBlobURL(code) {
  const blob = new Blob([code], {
    type: "application/javascript"
  });
  return URL.createObjectURL(blob);
}

function selectWorkerImplementation() {
  if (typeof Worker === "undefined") {
    // Might happen on Safari, for instance
    // The idea is to only fail if the constructor is actually used
    return class NoWebWorker {
      constructor() {
        throw Error("No web worker implementation available. You might have tried to spawn a worker within a worker in a browser that doesn't support workers in workers.");
      }

    };
  }

  return class WebWorker extends Worker {
    constructor(url, options) {
      if (typeof url === "string" && options && options._baseURL) {
        url = new URL(url, options._baseURL);
      } else if (typeof url === "string" && !isAbsoluteURL(url) && (0, _getBundleUrl.getBundleURL)().match(/^file:\/\//i)) {
        url = new URL(url, (0, _getBundleUrl.getBundleURL)().replace(/\/[^\/]+$/, "/"));
        url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`);
      }

      if (typeof url === "string" && isAbsoluteURL(url)) {
        // Create source code blob loading JS file via `importScripts()`
        // to circumvent worker CORS restrictions
        url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`);
      }

      super(url, options);
    }

  };
}
},{"./get-bundle-url.browser":"../../node_modules/threads/dist-esm/master/get-bundle-url.browser.js"}],"../../node_modules/ms/index.js":[function(require,module,exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],"../../node_modules/debug/src/common.js":[function(require,module,exports) {

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":"../../node_modules/ms/index.js"}],"../../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../../node_modules/debug/src/browser.js":[function(require,module,exports) {
var process = require("process");
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
/**
 * Colors.
 */

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */
// eslint-disable-next-line complexity

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
    return true;
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  const c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  let index = 0;
  let lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, match => {
    if (match === '%%') {
      return;
    }

    index++;

    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });
  args.splice(lastC, 0, c);
}
/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */


function log(...args) {
  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return typeof console === 'object' && console.log && console.log(...args);
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */


function save(namespaces) {
  try {
    if (namespaces) {
      exports.storage.setItem('debug', namespaces);
    } else {
      exports.storage.removeItem('debug');
    }
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */


function load() {
  let r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = undefined;
  }

  return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */


function localstorage() {
  try {
    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
    // The Browser also has localStorage in the global context.
    return localStorage;
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = require('./common')(exports);
const {
  formatters
} = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};
},{"./common":"../../node_modules/debug/src/common.js","process":"../../node_modules/process/browser.js"}],"../../node_modules/observable-fns/dist.esm/_scheduler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AsyncSerialScheduler = void 0;

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
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
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

class AsyncSerialScheduler {
  constructor(observer) {
    this._baseObserver = observer;
    this._pendingPromises = new Set();
  }

  complete() {
    Promise.all(this._pendingPromises).then(() => this._baseObserver.complete()).catch(error => this._baseObserver.error(error));
  }

  error(error) {
    this._baseObserver.error(error);
  }

  schedule(task) {
    const prevPromisesCompletion = Promise.all(this._pendingPromises);
    const values = [];

    const next = value => values.push(value);

    const promise = Promise.resolve().then(() => __awaiter(this, void 0, void 0, function* () {
      yield prevPromisesCompletion;
      yield task(next);

      this._pendingPromises.delete(promise);

      for (const value of values) {
        this._baseObserver.next(value);
      }
    })).catch(error => {
      this._pendingPromises.delete(promise);

      this._baseObserver.error(error);
    });

    this._pendingPromises.add(promise);
  }

}

exports.AsyncSerialScheduler = AsyncSerialScheduler;
},{}],"../../node_modules/observable-fns/dist.esm/_symbols.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerObservableSymbol = registerObservableSymbol;
exports.getSymbol = exports.hasSymbol = exports.hasSymbols = void 0;

const hasSymbols = () => typeof Symbol === "function";

exports.hasSymbols = hasSymbols;

const hasSymbol = name => hasSymbols() && Boolean(Symbol[name]);

exports.hasSymbol = hasSymbol;

const getSymbol = name => hasSymbol(name) ? Symbol[name] : "@@" + name;

exports.getSymbol = getSymbol;

function registerObservableSymbol() {
  if (hasSymbols() && !hasSymbol("observable")) {
    Symbol.observable = Symbol("observable");
  }
}

if (!hasSymbol("asyncIterator")) {
  Symbol.asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");
}
},{}],"../../node_modules/observable-fns/dist.esm/observable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Observable = exports.SubscriptionObserver = exports.Subscription = void 0;

var _symbols = require("./_symbols");

/**
 * Based on <https://raw.githubusercontent.com/zenparsing/zen-observable/master/src/Observable.js>
 * At commit: f63849a8c60af5d514efc8e9d6138d8273c49ad6
 */
/// <reference path="../types/symbols.d.ts" />
const SymbolIterator = (0, _symbols.getSymbol)("iterator");
const SymbolObservable = (0, _symbols.getSymbol)("observable");
const SymbolSpecies = (0, _symbols.getSymbol)("species"); // === Abstract Operations ===

function getMethod(obj, key) {
  const value = obj[key];

  if (value == null) {
    return undefined;
  }

  if (typeof value !== "function") {
    throw new TypeError(value + " is not a function");
  }

  return value;
}

function getSpecies(obj) {
  let ctor = obj.constructor;

  if (ctor !== undefined) {
    ctor = ctor[SymbolSpecies];

    if (ctor === null) {
      ctor = undefined;
    }
  }

  return ctor !== undefined ? ctor : Observable;
}

function isObservable(x) {
  return x instanceof Observable; // SPEC: Brand check
}

function hostReportError(error) {
  if (hostReportError.log) {
    hostReportError.log(error);
  } else {
    setTimeout(() => {
      throw error;
    }, 0);
  }
}

function enqueue(fn) {
  Promise.resolve().then(() => {
    try {
      fn();
    } catch (e) {
      hostReportError(e);
    }
  });
}

function cleanupSubscription(subscription) {
  const cleanup = subscription._cleanup;

  if (cleanup === undefined) {
    return;
  }

  subscription._cleanup = undefined;

  if (!cleanup) {
    return;
  }

  try {
    if (typeof cleanup === "function") {
      cleanup();
    } else {
      const unsubscribe = getMethod(cleanup, "unsubscribe");

      if (unsubscribe) {
        unsubscribe.call(cleanup);
      }
    }
  } catch (e) {
    hostReportError(e);
  }
}

function closeSubscription(subscription) {
  subscription._observer = undefined;
  subscription._queue = undefined;
  subscription._state = "closed";
}

function flushSubscription(subscription) {
  const queue = subscription._queue;

  if (!queue) {
    return;
  }

  subscription._queue = undefined;
  subscription._state = "ready";

  for (const item of queue) {
    notifySubscription(subscription, item.type, item.value);

    if (subscription._state === "closed") {
      break;
    }
  }
}

function notifySubscription(subscription, type, value) {
  subscription._state = "running";
  const observer = subscription._observer;

  try {
    const m = observer ? getMethod(observer, type) : undefined;

    switch (type) {
      case "next":
        if (m) m.call(observer, value);
        break;

      case "error":
        closeSubscription(subscription);
        if (m) m.call(observer, value);else throw value;
        break;

      case "complete":
        closeSubscription(subscription);
        if (m) m.call(observer);
        break;
    }
  } catch (e) {
    hostReportError(e);
  }

  if (subscription._state === "closed") {
    cleanupSubscription(subscription);
  } else if (subscription._state === "running") {
    subscription._state = "ready";
  }
}

function onNotify(subscription, type, value) {
  if (subscription._state === "closed") {
    return;
  }

  if (subscription._state === "buffering") {
    subscription._queue = subscription._queue || [];

    subscription._queue.push({
      type,
      value
    });

    return;
  }

  if (subscription._state !== "ready") {
    subscription._state = "buffering";
    subscription._queue = [{
      type,
      value
    }];
    enqueue(() => flushSubscription(subscription));
    return;
  }

  notifySubscription(subscription, type, value);
}

class Subscription {
  constructor(observer, subscriber) {
    // ASSERT: observer is an object
    // ASSERT: subscriber is callable
    this._cleanup = undefined;
    this._observer = observer;
    this._queue = undefined;
    this._state = "initializing";
    const subscriptionObserver = new SubscriptionObserver(this);

    try {
      this._cleanup = subscriber.call(undefined, subscriptionObserver);
    } catch (e) {
      subscriptionObserver.error(e);
    }

    if (this._state === "initializing") {
      this._state = "ready";
    }
  }

  get closed() {
    return this._state === "closed";
  }

  unsubscribe() {
    if (this._state !== "closed") {
      closeSubscription(this);
      cleanupSubscription(this);
    }
  }

}

exports.Subscription = Subscription;

class SubscriptionObserver {
  constructor(subscription) {
    this._subscription = subscription;
  }

  get closed() {
    return this._subscription._state === "closed";
  }

  next(value) {
    onNotify(this._subscription, "next", value);
  }

  error(value) {
    onNotify(this._subscription, "error", value);
  }

  complete() {
    onNotify(this._subscription, "complete");
  }

}
/**
 * The basic Observable class. This primitive is used to wrap asynchronous
 * data streams in a common standardized data type that is interoperable
 * between libraries and can be composed to represent more complex processes.
 */


exports.SubscriptionObserver = SubscriptionObserver;

class Observable {
  constructor(subscriber) {
    if (!(this instanceof Observable)) {
      throw new TypeError("Observable cannot be called as a function");
    }

    if (typeof subscriber !== "function") {
      throw new TypeError("Observable initializer must be a function");
    }

    this._subscriber = subscriber;
  }

  subscribe(nextOrObserver, onError, onComplete) {
    if (typeof nextOrObserver !== "object" || nextOrObserver === null) {
      nextOrObserver = {
        next: nextOrObserver,
        error: onError,
        complete: onComplete
      };
    }

    return new Subscription(nextOrObserver, this._subscriber);
  }

  pipe(first, ...mappers) {
    // tslint:disable-next-line no-this-assignment
    let intermediate = this;

    for (const mapper of [first, ...mappers]) {
      intermediate = mapper(intermediate);
    }

    return intermediate;
  }

  tap(nextOrObserver, onError, onComplete) {
    const tapObserver = typeof nextOrObserver !== "object" || nextOrObserver === null ? {
      next: nextOrObserver,
      error: onError,
      complete: onComplete
    } : nextOrObserver;
    return new Observable(observer => {
      return this.subscribe({
        next(value) {
          tapObserver.next && tapObserver.next(value);
          observer.next(value);
        },

        error(error) {
          tapObserver.error && tapObserver.error(error);
          observer.error(error);
        },

        complete() {
          tapObserver.complete && tapObserver.complete();
          observer.complete();
        },

        start(subscription) {
          tapObserver.start && tapObserver.start(subscription);
        }

      });
    });
  }

  forEach(fn) {
    return new Promise((resolve, reject) => {
      if (typeof fn !== "function") {
        reject(new TypeError(fn + " is not a function"));
        return;
      }

      function done() {
        subscription.unsubscribe();
        resolve();
      }

      const subscription = this.subscribe({
        next(value) {
          try {
            fn(value, done);
          } catch (e) {
            reject(e);
            subscription.unsubscribe();
          }
        },

        error: reject,
        complete: resolve
      });
    });
  }

  map(fn) {
    if (typeof fn !== "function") {
      throw new TypeError(fn + " is not a function");
    }

    const C = getSpecies(this);
    return new C(observer => this.subscribe({
      next(value) {
        let propagatedValue = value;

        try {
          propagatedValue = fn(value);
        } catch (e) {
          return observer.error(e);
        }

        observer.next(propagatedValue);
      },

      error(e) {
        observer.error(e);
      },

      complete() {
        observer.complete();
      }

    }));
  }

  filter(fn) {
    if (typeof fn !== "function") {
      throw new TypeError(fn + " is not a function");
    }

    const C = getSpecies(this);
    return new C(observer => this.subscribe({
      next(value) {
        try {
          if (!fn(value)) return;
        } catch (e) {
          return observer.error(e);
        }

        observer.next(value);
      },

      error(e) {
        observer.error(e);
      },

      complete() {
        observer.complete();
      }

    }));
  }

  reduce(fn, seed) {
    if (typeof fn !== "function") {
      throw new TypeError(fn + " is not a function");
    }

    const C = getSpecies(this);
    const hasSeed = arguments.length > 1;
    let hasValue = false;
    let acc = seed;
    return new C(observer => this.subscribe({
      next(value) {
        const first = !hasValue;
        hasValue = true;

        if (!first || hasSeed) {
          try {
            acc = fn(acc, value);
          } catch (e) {
            return observer.error(e);
          }
        } else {
          acc = value;
        }
      },

      error(e) {
        observer.error(e);
      },

      complete() {
        if (!hasValue && !hasSeed) {
          return observer.error(new TypeError("Cannot reduce an empty sequence"));
        }

        observer.next(acc);
        observer.complete();
      }

    }));
  }

  concat(...sources) {
    const C = getSpecies(this);
    return new C(observer => {
      let subscription;
      let index = 0;

      function startNext(next) {
        subscription = next.subscribe({
          next(v) {
            observer.next(v);
          },

          error(e) {
            observer.error(e);
          },

          complete() {
            if (index === sources.length) {
              subscription = undefined;
              observer.complete();
            } else {
              startNext(C.from(sources[index++]));
            }
          }

        });
      }

      startNext(this);
      return () => {
        if (subscription) {
          subscription.unsubscribe();
          subscription = undefined;
        }
      };
    });
  }

  flatMap(fn) {
    if (typeof fn !== "function") {
      throw new TypeError(fn + " is not a function");
    }

    const C = getSpecies(this);
    return new C(observer => {
      const subscriptions = [];
      const outer = this.subscribe({
        next(value) {
          let normalizedValue;

          if (fn) {
            try {
              normalizedValue = fn(value);
            } catch (e) {
              return observer.error(e);
            }
          } else {
            normalizedValue = value;
          }

          const inner = C.from(normalizedValue).subscribe({
            next(innerValue) {
              observer.next(innerValue);
            },

            error(e) {
              observer.error(e);
            },

            complete() {
              const i = subscriptions.indexOf(inner);
              if (i >= 0) subscriptions.splice(i, 1);
              completeIfDone();
            }

          });
          subscriptions.push(inner);
        },

        error(e) {
          observer.error(e);
        },

        complete() {
          completeIfDone();
        }

      });

      function completeIfDone() {
        if (outer.closed && subscriptions.length === 0) {
          observer.complete();
        }
      }

      return () => {
        subscriptions.forEach(s => s.unsubscribe());
        outer.unsubscribe();
      };
    });
  }

  [SymbolObservable]() {
    return this;
  }

  static from(x) {
    const C = typeof this === "function" ? this : Observable;

    if (x == null) {
      throw new TypeError(x + " is not an object");
    }

    const observableMethod = getMethod(x, SymbolObservable);

    if (observableMethod) {
      const observable = observableMethod.call(x);

      if (Object(observable) !== observable) {
        throw new TypeError(observable + " is not an object");
      }

      if (isObservable(observable) && observable.constructor === C) {
        return observable;
      }

      return new C(observer => observable.subscribe(observer));
    }

    if ((0, _symbols.hasSymbol)("iterator")) {
      const iteratorMethod = getMethod(x, SymbolIterator);

      if (iteratorMethod) {
        return new C(observer => {
          enqueue(() => {
            if (observer.closed) return;

            for (const item of iteratorMethod.call(x)) {
              observer.next(item);
              if (observer.closed) return;
            }

            observer.complete();
          });
        });
      }
    }

    if (Array.isArray(x)) {
      return new C(observer => {
        enqueue(() => {
          if (observer.closed) return;

          for (const item of x) {
            observer.next(item);
            if (observer.closed) return;
          }

          observer.complete();
        });
      });
    }

    throw new TypeError(x + " is not observable");
  }

  static of(...items) {
    const C = typeof this === "function" ? this : Observable;
    return new C(observer => {
      enqueue(() => {
        if (observer.closed) return;

        for (const item of items) {
          observer.next(item);
          if (observer.closed) return;
        }

        observer.complete();
      });
    });
  }

  static get [SymbolSpecies]() {
    return this;
  }

}

exports.Observable = Observable;

if ((0, _symbols.hasSymbols)()) {
  Object.defineProperty(Observable, Symbol("extensions"), {
    value: {
      symbol: SymbolObservable,
      hostReportError
    },
    configurable: true
  });
}

var _default = Observable;
exports.default = _default;
},{"./_symbols":"../../node_modules/observable-fns/dist.esm/_symbols.js"}],"../../node_modules/observable-fns/dist.esm/unsubscribe.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Unsubscribe from a subscription returned by something that looks like an observable,
 * but is not necessarily our observable implementation.
 */
function unsubscribe(subscription) {
  if (typeof subscription === "function") {
    subscription();
  } else if (subscription && typeof subscription.unsubscribe === "function") {
    subscription.unsubscribe();
  }
}

var _default = unsubscribe;
exports.default = _default;
},{}],"../../node_modules/observable-fns/dist.esm/filter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scheduler = require("./_scheduler");

var _observable = _interopRequireDefault(require("./observable"));

var _unsubscribe = _interopRequireDefault(require("./unsubscribe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
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
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

/**
 * Filters the values emitted by another observable.
 * To be applied to an input observable using `pipe()`.
 */
function filter(test) {
  return observable => {
    return new _observable.default(observer => {
      const scheduler = new _scheduler.AsyncSerialScheduler(observer);
      const subscription = observable.subscribe({
        complete() {
          scheduler.complete();
        },

        error(error) {
          scheduler.error(error);
        },

        next(input) {
          scheduler.schedule(next => __awaiter(this, void 0, void 0, function* () {
            if (yield test(input)) {
              next(input);
            }
          }));
        }

      });
      return () => (0, _unsubscribe.default)(subscription);
    });
  };
}

var _default = filter;
exports.default = _default;
},{"./_scheduler":"../../node_modules/observable-fns/dist.esm/_scheduler.js","./observable":"../../node_modules/observable-fns/dist.esm/observable.js","./unsubscribe":"../../node_modules/observable-fns/dist.esm/unsubscribe.js"}],"../../node_modules/observable-fns/dist.esm/_util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAsyncIterator = isAsyncIterator;
exports.isIterator = isIterator;

var _symbols = require("./_symbols");

/// <reference lib="es2018" />
function isAsyncIterator(thing) {
  return thing && (0, _symbols.hasSymbol)("asyncIterator") && thing[Symbol.asyncIterator];
}

function isIterator(thing) {
  return thing && (0, _symbols.hasSymbol)("iterator") && thing[Symbol.iterator];
}
},{"./_symbols":"../../node_modules/observable-fns/dist.esm/_symbols.js"}],"../../node_modules/observable-fns/dist.esm/flatMap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scheduler = require("./_scheduler");

var _util = require("./_util");

var _observable = _interopRequireDefault(require("./observable"));

var _unsubscribe = _interopRequireDefault(require("./unsubscribe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
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
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __asyncValues = void 0 && (void 0).__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};

/**
 * Maps the values emitted by another observable. In contrast to `map()`
 * the `mapper` function returns an array of values that will be emitted
 * separately.
 * Use `flatMap()` to map input values to zero, one or multiple output
 * values. To be applied to an input observable using `pipe()`.
 */
function flatMap(mapper) {
  return observable => {
    return new _observable.default(observer => {
      const scheduler = new _scheduler.AsyncSerialScheduler(observer);
      const subscription = observable.subscribe({
        complete() {
          scheduler.complete();
        },

        error(error) {
          scheduler.error(error);
        },

        next(input) {
          scheduler.schedule(next => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;

            const mapped = yield mapper(input);

            if ((0, _util.isIterator)(mapped) || (0, _util.isAsyncIterator)(mapped)) {
              try {
                for (var mapped_1 = __asyncValues(mapped), mapped_1_1; mapped_1_1 = yield mapped_1.next(), !mapped_1_1.done;) {
                  const element = mapped_1_1.value;
                  next(element);
                }
              } catch (e_1_1) {
                e_1 = {
                  error: e_1_1
                };
              } finally {
                try {
                  if (mapped_1_1 && !mapped_1_1.done && (_a = mapped_1.return)) yield _a.call(mapped_1);
                } finally {
                  if (e_1) throw e_1.error;
                }
              }
            } else {
              mapped.map(output => next(output));
            }
          }));
        }

      });
      return () => (0, _unsubscribe.default)(subscription);
    });
  };
}

var _default = flatMap;
exports.default = _default;
},{"./_scheduler":"../../node_modules/observable-fns/dist.esm/_scheduler.js","./_util":"../../node_modules/observable-fns/dist.esm/_util.js","./observable":"../../node_modules/observable-fns/dist.esm/observable.js","./unsubscribe":"../../node_modules/observable-fns/dist.esm/unsubscribe.js"}],"../../node_modules/observable-fns/dist.esm/interval.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = interval;

var _observable = require("./observable");

/**
 * Creates an observable that yields a new value every `period` milliseconds.
 * The first value emitted is 0, then 1, 2, etc. The first value is not emitted
 * immediately, but after the first interval.
 */
function interval(period) {
  return new _observable.Observable(observer => {
    let counter = 0;
    const handle = setInterval(() => {
      observer.next(counter++);
    }, period);
    return () => clearInterval(handle);
  });
}
},{"./observable":"../../node_modules/observable-fns/dist.esm/observable.js"}],"../../node_modules/observable-fns/dist.esm/map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scheduler = require("./_scheduler");

var _observable = _interopRequireDefault(require("./observable"));

var _unsubscribe = _interopRequireDefault(require("./unsubscribe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
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
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

/**
 * Maps the values emitted by another observable to different values.
 * To be applied to an input observable using `pipe()`.
 */
function map(mapper) {
  return observable => {
    return new _observable.default(observer => {
      const scheduler = new _scheduler.AsyncSerialScheduler(observer);
      const subscription = observable.subscribe({
        complete() {
          scheduler.complete();
        },

        error(error) {
          scheduler.error(error);
        },

        next(input) {
          scheduler.schedule(next => __awaiter(this, void 0, void 0, function* () {
            const mapped = yield mapper(input);
            next(mapped);
          }));
        }

      });
      return () => (0, _unsubscribe.default)(subscription);
    });
  };
}

var _default = map;
exports.default = _default;
},{"./_scheduler":"../../node_modules/observable-fns/dist.esm/_scheduler.js","./observable":"../../node_modules/observable-fns/dist.esm/observable.js","./unsubscribe":"../../node_modules/observable-fns/dist.esm/unsubscribe.js"}],"../../node_modules/observable-fns/dist.esm/merge.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _observable = require("./observable");

var _unsubscribe = _interopRequireDefault(require("./unsubscribe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function merge(...observables) {
  if (observables.length === 0) {
    return _observable.Observable.from([]);
  }

  return new _observable.Observable(observer => {
    let completed = 0;
    const subscriptions = observables.map(input => {
      return input.subscribe({
        error(error) {
          observer.error(error);
          unsubscribeAll();
        },

        next(value) {
          observer.next(value);
        },

        complete() {
          if (++completed === observables.length) {
            observer.complete();
            unsubscribeAll();
          }
        }

      });
    });

    const unsubscribeAll = () => {
      subscriptions.forEach(subscription => (0, _unsubscribe.default)(subscription));
    };

    return unsubscribeAll;
  });
}

var _default = merge;
exports.default = _default;
},{"./observable":"../../node_modules/observable-fns/dist.esm/observable.js","./unsubscribe":"../../node_modules/observable-fns/dist.esm/unsubscribe.js"}],"../../node_modules/observable-fns/dist.esm/subject.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _observable = _interopRequireDefault(require("./observable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: This observer iteration approach looks inelegant and expensive
// Idea: Come up with super class for Subscription that contains the
//       notify*, ... methods and use it here

/**
 * A subject is a "hot" observable (see `multicast`) that has its observer
 * methods (`.next(value)`, `.error(error)`, `.complete()`) exposed.
 *
 * Be careful, though! With great power comes great responsibility. Only use
 * the `Subject` when you really need to trigger updates "from the outside" and
 * try to keep the code that can access it to a minimum. Return
 * `Observable.from(mySubject)` to not allow other code to mutate.
 */
class MulticastSubject extends _observable.default {
  constructor() {
    super(observer => {
      this._observers.add(observer);

      return () => this._observers.delete(observer);
    });
    this._observers = new Set();
  }

  next(value) {
    for (const observer of this._observers) {
      observer.next(value);
    }
  }

  error(error) {
    for (const observer of this._observers) {
      observer.error(error);
    }
  }

  complete() {
    for (const observer of this._observers) {
      observer.complete();
    }
  }

}

var _default = MulticastSubject;
exports.default = _default;
},{"./observable":"../../node_modules/observable-fns/dist.esm/observable.js"}],"../../node_modules/observable-fns/dist.esm/multicast.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _observable = _interopRequireDefault(require("./observable"));

var _subject = _interopRequireDefault(require("./subject"));

var _unsubscribe = _interopRequireDefault(require("./unsubscribe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Subject already creates additional observables "under the hood",
//       now we introduce even more. A true native MulticastObservable
//       would be preferable.

/**
 * Takes a "cold" observable and returns a wrapping "hot" observable that
 * proxies the input observable's values and errors.
 *
 * An observable is called "cold" when its initialization function is run
 * for each new subscriber. This is how observable-fns's `Observable`
 * implementation works.
 *
 * A hot observable is an observable where new subscribers subscribe to
 * the upcoming values of an already-initialiazed observable.
 *
 * The multicast observable will lazily subscribe to the source observable
 * once it has its first own subscriber and will unsubscribe from the
 * source observable when its last own subscriber unsubscribed.
 */
function multicast(coldObservable) {
  const subject = new _subject.default();
  let sourceSubscription;
  let subscriberCount = 0;
  return new _observable.default(observer => {
    // Init source subscription lazily
    if (!sourceSubscription) {
      sourceSubscription = coldObservable.subscribe(subject);
    } // Pipe all events from `subject` into this observable


    const subscription = subject.subscribe(observer);
    subscriberCount++;
    return () => {
      subscriberCount--;
      subscription.unsubscribe(); // Close source subscription once last subscriber has unsubscribed

      if (subscriberCount === 0) {
        (0, _unsubscribe.default)(sourceSubscription);
        sourceSubscription = undefined;
      }
    };
  });
}

var _default = multicast;
exports.default = _default;
},{"./observable":"../../node_modules/observable-fns/dist.esm/observable.js","./subject":"../../node_modules/observable-fns/dist.esm/subject.js","./unsubscribe":"../../node_modules/observable-fns/dist.esm/unsubscribe.js"}],"../../node_modules/observable-fns/dist.esm/scan.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scheduler = require("./_scheduler");

var _observable = _interopRequireDefault(require("./observable"));

var _unsubscribe = _interopRequireDefault(require("./unsubscribe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
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
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

function scan(accumulator, seed) {
  return observable => {
    return new _observable.default(observer => {
      let accumulated;
      let index = 0;
      const scheduler = new _scheduler.AsyncSerialScheduler(observer);
      const subscription = observable.subscribe({
        complete() {
          scheduler.complete();
        },

        error(error) {
          scheduler.error(error);
        },

        next(value) {
          scheduler.schedule(next => __awaiter(this, void 0, void 0, function* () {
            const prevAcc = index === 0 ? typeof seed === "undefined" ? value : seed : accumulated;
            accumulated = yield accumulator(prevAcc, value, index++);
            next(accumulated);
          }));
        }

      });
      return () => (0, _unsubscribe.default)(subscription);
    });
  };
}

var _default = scan;
exports.default = _default;
},{"./_scheduler":"../../node_modules/observable-fns/dist.esm/_scheduler.js","./observable":"../../node_modules/observable-fns/dist.esm/observable.js","./unsubscribe":"../../node_modules/observable-fns/dist.esm/unsubscribe.js"}],"../../node_modules/observable-fns/dist.esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "filter", {
  enumerable: true,
  get: function () {
    return _filter.default;
  }
});
Object.defineProperty(exports, "flatMap", {
  enumerable: true,
  get: function () {
    return _flatMap.default;
  }
});
Object.defineProperty(exports, "interval", {
  enumerable: true,
  get: function () {
    return _interval.default;
  }
});
Object.defineProperty(exports, "map", {
  enumerable: true,
  get: function () {
    return _map.default;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function () {
    return _merge.default;
  }
});
Object.defineProperty(exports, "multicast", {
  enumerable: true,
  get: function () {
    return _multicast.default;
  }
});
Object.defineProperty(exports, "Observable", {
  enumerable: true,
  get: function () {
    return _observable.default;
  }
});
Object.defineProperty(exports, "scan", {
  enumerable: true,
  get: function () {
    return _scan.default;
  }
});
Object.defineProperty(exports, "Subject", {
  enumerable: true,
  get: function () {
    return _subject.default;
  }
});
Object.defineProperty(exports, "unsubscribe", {
  enumerable: true,
  get: function () {
    return _unsubscribe.default;
  }
});

var _filter = _interopRequireDefault(require("./filter"));

var _flatMap = _interopRequireDefault(require("./flatMap"));

var _interval = _interopRequireDefault(require("./interval"));

var _map = _interopRequireDefault(require("./map"));

var _merge = _interopRequireDefault(require("./merge"));

var _multicast = _interopRequireDefault(require("./multicast"));

var _observable = _interopRequireDefault(require("./observable"));

var _scan = _interopRequireDefault(require("./scan"));

var _subject = _interopRequireDefault(require("./subject"));

var _unsubscribe = _interopRequireDefault(require("./unsubscribe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./filter":"../../node_modules/observable-fns/dist.esm/filter.js","./flatMap":"../../node_modules/observable-fns/dist.esm/flatMap.js","./interval":"../../node_modules/observable-fns/dist.esm/interval.js","./map":"../../node_modules/observable-fns/dist.esm/map.js","./merge":"../../node_modules/observable-fns/dist.esm/merge.js","./multicast":"../../node_modules/observable-fns/dist.esm/multicast.js","./observable":"../../node_modules/observable-fns/dist.esm/observable.js","./scan":"../../node_modules/observable-fns/dist.esm/scan.js","./subject":"../../node_modules/observable-fns/dist.esm/subject.js","./unsubscribe":"../../node_modules/observable-fns/dist.esm/unsubscribe.js"}],"../../node_modules/threads/dist-esm/ponyfills.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allSettled = allSettled;

// Based on <https://github.com/es-shims/Promise.allSettled/blob/master/implementation.js>
function allSettled(values) {
  return Promise.all(values.map(item => {
    const onFulfill = value => {
      return {
        status: 'fulfilled',
        value
      };
    };

    const onReject = reason => {
      return {
        status: 'rejected',
        reason
      };
    };

    const itemPromise = Promise.resolve(item);

    try {
      return itemPromise.then(onFulfill, onReject);
    } catch (error) {
      return Promise.reject(error);
    }
  }));
}
},{}],"../../node_modules/threads/dist-esm/master/pool-types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolEventType = void 0;

/** Pool event type. Specifies the type of each `PoolEvent`. */
var PoolEventType;
exports.PoolEventType = PoolEventType;

(function (PoolEventType) {
  PoolEventType["initialized"] = "initialized";
  PoolEventType["taskCanceled"] = "taskCanceled";
  PoolEventType["taskCompleted"] = "taskCompleted";
  PoolEventType["taskFailed"] = "taskFailed";
  PoolEventType["taskQueued"] = "taskQueued";
  PoolEventType["taskQueueDrained"] = "taskQueueDrained";
  PoolEventType["taskStart"] = "taskStart";
  PoolEventType["terminated"] = "terminated";
})(PoolEventType || (exports.PoolEventType = PoolEventType = {}));
},{}],"../../node_modules/threads/dist-esm/symbols.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$worker = exports.$transferable = exports.$terminate = exports.$events = exports.$errors = void 0;
const $errors = Symbol("thread.errors");
exports.$errors = $errors;
const $events = Symbol("thread.events");
exports.$events = $events;
const $terminate = Symbol("thread.terminate");
exports.$terminate = $terminate;
const $transferable = Symbol("thread.transferable");
exports.$transferable = $transferable;
const $worker = Symbol("thread.worker");
exports.$worker = $worker;
},{}],"../../node_modules/threads/dist-esm/master/thread.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Thread = void 0;

var _symbols = require("../symbols");

function fail(message) {
  throw Error(message);
}
/** Thread utility functions. Use them to manage or inspect a `spawn()`-ed thread. */


const Thread = {
  /** Return an observable that can be used to subscribe to all errors happening in the thread. */
  errors(thread) {
    return thread[_symbols.$errors] || fail("Error observable not found. Make sure to pass a thread instance as returned by the spawn() promise.");
  },

  /** Return an observable that can be used to subscribe to internal events happening in the thread. Useful for debugging. */
  events(thread) {
    return thread[_symbols.$events] || fail("Events observable not found. Make sure to pass a thread instance as returned by the spawn() promise.");
  },

  /** Terminate a thread. Remember to terminate every thread when you are done using it. */
  terminate(thread) {
    return thread[_symbols.$terminate]();
  }

};
exports.Thread = Thread;
},{"../symbols":"../../node_modules/threads/dist-esm/symbols.js"}],"../../node_modules/threads/dist-esm/master/pool.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PoolEventType", {
  enumerable: true,
  get: function () {
    return _poolTypes.PoolEventType;
  }
});
Object.defineProperty(exports, "Thread", {
  enumerable: true,
  get: function () {
    return _thread.Thread;
  }
});
exports.Pool = void 0;

var _debug = _interopRequireDefault(require("debug"));

var _observableFns = require("observable-fns");

var _ponyfills = require("../ponyfills");

var _implementation = require("./implementation");

var _poolTypes = require("./pool-types");

var _thread = require("./thread");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
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

let nextPoolID = 1;

function createArray(size) {
  const array = [];

  for (let index = 0; index < size; index++) {
    array.push(index);
  }

  return array;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function flatMap(array, mapper) {
  return array.reduce((flattened, element) => [...flattened, ...mapper(element)], []);
}

function slugify(text) {
  return text.replace(/\W/g, " ").trim().replace(/\s+/g, "-");
}

function spawnWorkers(spawnWorker, count) {
  return createArray(count).map(() => ({
    init: spawnWorker(),
    runningTasks: []
  }));
}

class WorkerPool {
  constructor(spawnWorker, optionsOrSize) {
    this.eventSubject = new _observableFns.Subject();
    this.initErrors = [];
    this.isClosing = false;
    this.nextTaskID = 1;
    this.taskQueue = [];
    const options = typeof optionsOrSize === "number" ? {
      size: optionsOrSize
    } : optionsOrSize || {};
    const {
      size = _implementation.defaultPoolSize
    } = options;
    this.debug = (0, _debug.default)(`threads:pool:${slugify(options.name || String(nextPoolID++))}`);
    this.options = options;
    this.workers = spawnWorkers(spawnWorker, size);
    this.eventObservable = (0, _observableFns.multicast)(_observableFns.Observable.from(this.eventSubject));
    Promise.all(this.workers.map(worker => worker.init)).then(() => this.eventSubject.next({
      type: _poolTypes.PoolEventType.initialized,
      size: this.workers.length
    }), error => {
      this.debug("Error while initializing pool worker:", error);
      this.eventSubject.error(error);
      this.initErrors.push(error);
    });
  }

  findIdlingWorker() {
    const {
      concurrency = 1
    } = this.options;
    return this.workers.find(worker => worker.runningTasks.length < concurrency);
  }

  runPoolTask(worker, task) {
    return __awaiter(this, void 0, void 0, function* () {
      const workerID = this.workers.indexOf(worker) + 1;
      this.debug(`Running task #${task.id} on worker #${workerID}...`);
      this.eventSubject.next({
        type: _poolTypes.PoolEventType.taskStart,
        taskID: task.id,
        workerID
      });

      try {
        const returnValue = yield task.run((yield worker.init));
        this.debug(`Task #${task.id} completed successfully`);
        this.eventSubject.next({
          type: _poolTypes.PoolEventType.taskCompleted,
          returnValue,
          taskID: task.id,
          workerID
        });
      } catch (error) {
        this.debug(`Task #${task.id} failed`);
        this.eventSubject.next({
          type: _poolTypes.PoolEventType.taskFailed,
          taskID: task.id,
          error,
          workerID
        });
      }
    });
  }

  run(worker, task) {
    return __awaiter(this, void 0, void 0, function* () {
      const runPromise = (() => __awaiter(this, void 0, void 0, function* () {
        const removeTaskFromWorkersRunningTasks = () => {
          worker.runningTasks = worker.runningTasks.filter(someRunPromise => someRunPromise !== runPromise);
        }; // Defer task execution by one tick to give handlers time to subscribe


        yield delay(0);

        try {
          yield this.runPoolTask(worker, task);
        } finally {
          removeTaskFromWorkersRunningTasks();

          if (!this.isClosing) {
            this.scheduleWork();
          }
        }
      }))();

      worker.runningTasks.push(runPromise);
    });
  }

  scheduleWork() {
    this.debug(`Attempt de-queueing a task in order to run it...`);
    const availableWorker = this.findIdlingWorker();
    if (!availableWorker) return;
    const nextTask = this.taskQueue.shift();

    if (!nextTask) {
      this.debug(`Task queue is empty`);
      this.eventSubject.next({
        type: _poolTypes.PoolEventType.taskQueueDrained
      });
      return;
    }

    this.run(availableWorker, nextTask);
  }

  taskCompletion(taskID) {
    return new Promise((resolve, reject) => {
      const eventSubscription = this.events().subscribe(event => {
        if (event.type === _poolTypes.PoolEventType.taskCompleted && event.taskID === taskID) {
          eventSubscription.unsubscribe();
          resolve(event.returnValue);
        } else if (event.type === _poolTypes.PoolEventType.taskFailed && event.taskID === taskID) {
          eventSubscription.unsubscribe();
          reject(event.error);
        } else if (event.type === _poolTypes.PoolEventType.terminated) {
          eventSubscription.unsubscribe();
          reject(Error("Pool has been terminated before task was run."));
        }
      });
    });
  }

  settled(allowResolvingImmediately = false) {
    return __awaiter(this, void 0, void 0, function* () {
      const getCurrentlyRunningTasks = () => flatMap(this.workers, worker => worker.runningTasks);

      const taskFailures = [];
      const failureSubscription = this.eventObservable.subscribe(event => {
        if (event.type === _poolTypes.PoolEventType.taskFailed) {
          taskFailures.push(event.error);
        }
      });

      if (this.initErrors.length > 0) {
        return Promise.reject(this.initErrors[0]);
      }

      if (allowResolvingImmediately && this.taskQueue.length === 0) {
        yield (0, _ponyfills.allSettled)(getCurrentlyRunningTasks());
        return taskFailures;
      }

      yield new Promise((resolve, reject) => {
        const subscription = this.eventObservable.subscribe({
          next(event) {
            if (event.type === _poolTypes.PoolEventType.taskQueueDrained) {
              subscription.unsubscribe();
              resolve();
            }
          },

          error: reject // make a pool-wide error reject the completed() result promise

        });
      });
      yield (0, _ponyfills.allSettled)(getCurrentlyRunningTasks());
      failureSubscription.unsubscribe();
      return taskFailures;
    });
  }

  completed(allowResolvingImmediately = false) {
    return __awaiter(this, void 0, void 0, function* () {
      const settlementPromise = this.settled(allowResolvingImmediately);
      const earlyExitPromise = new Promise((resolve, reject) => {
        const subscription = this.eventObservable.subscribe({
          next(event) {
            if (event.type === _poolTypes.PoolEventType.taskQueueDrained) {
              subscription.unsubscribe();
              resolve(settlementPromise);
            } else if (event.type === _poolTypes.PoolEventType.taskFailed) {
              subscription.unsubscribe();
              reject(event.error);
            }
          },

          error: reject // make a pool-wide error reject the completed() result promise

        });
      });
      const errors = yield Promise.race([settlementPromise, earlyExitPromise]);

      if (errors.length > 0) {
        throw errors[0];
      }
    });
  }

  events() {
    return this.eventObservable;
  }

  queue(taskFunction) {
    const {
      maxQueuedJobs = Infinity
    } = this.options;

    if (this.isClosing) {
      throw Error(`Cannot schedule pool tasks after terminate() has been called.`);
    }

    if (this.initErrors.length > 0) {
      throw this.initErrors[0];
    }

    const taskCompleted = () => this.taskCompletion(task.id);

    let taskCompletionDotThen;
    const task = {
      id: this.nextTaskID++,
      run: taskFunction,
      cancel: () => {
        if (this.taskQueue.indexOf(task) === -1) return;
        this.taskQueue = this.taskQueue.filter(someTask => someTask !== task);
        this.eventSubject.next({
          type: _poolTypes.PoolEventType.taskCanceled,
          taskID: task.id
        });
      },

      get then() {
        if (!taskCompletionDotThen) {
          const promise = taskCompleted();
          taskCompletionDotThen = promise.then.bind(promise);
        }

        return taskCompletionDotThen;
      }

    };

    if (this.taskQueue.length >= maxQueuedJobs) {
      throw Error("Maximum number of pool tasks queued. Refusing to queue another one.\n" + "This usually happens for one of two reasons: We are either at peak " + "workload right now or some tasks just won't finish, thus blocking the pool.");
    }

    this.debug(`Queueing task #${task.id}...`);
    this.taskQueue.push(task);
    this.eventSubject.next({
      type: _poolTypes.PoolEventType.taskQueued,
      taskID: task.id
    });
    this.scheduleWork();
    return task;
  }

  terminate(force) {
    return __awaiter(this, void 0, void 0, function* () {
      this.isClosing = true;

      if (!force) {
        yield this.completed(true);
      }

      this.eventSubject.next({
        type: _poolTypes.PoolEventType.terminated,
        remainingQueue: [...this.taskQueue]
      });
      this.eventSubject.complete();
      yield Promise.all(this.workers.map(worker => __awaiter(this, void 0, void 0, function* () {
        return _thread.Thread.terminate((yield worker.init));
      })));
    });
  }

}

WorkerPool.EventType = _poolTypes.PoolEventType;
/**
 * Thread pool constructor. Creates a new pool and spawns its worker threads.
 */

function PoolConstructor(spawnWorker, optionsOrSize) {
  // The function exists only so we don't need to use `new` to create a pool (we still can, though).
  // If the Pool is a class or not is an implementation detail that should not concern the user.
  return new WorkerPool(spawnWorker, optionsOrSize);
}

PoolConstructor.EventType = _poolTypes.PoolEventType;
/**
 * Thread pool constructor. Creates a new pool and spawns its worker threads.
 */

const Pool = PoolConstructor;
exports.Pool = Pool;
},{"debug":"../../node_modules/debug/src/browser.js","observable-fns":"../../node_modules/observable-fns/dist.esm/index.js","../ponyfills":"../../node_modules/threads/dist-esm/ponyfills.js","./implementation":"../../node_modules/threads/dist-esm/master/implementation.browser.js","./pool-types":"../../node_modules/threads/dist-esm/master/pool-types.js","./thread":"../../node_modules/threads/dist-esm/master/thread.js"}],"../../node_modules/threads/dist-esm/promise.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPromiseWithResolver = createPromiseWithResolver;

const doNothing = () => undefined;
/**
 * Creates a new promise and exposes its resolver function.
 * Use with care!
 */


function createPromiseWithResolver() {
  let alreadyResolved = false;
  let resolvedTo;
  let resolver = doNothing;
  const promise = new Promise(resolve => {
    if (alreadyResolved) {
      resolve(resolvedTo);
    } else {
      resolver = resolve;
    }
  });

  const exposedResolver = value => {
    alreadyResolved = true;
    resolvedTo = value;
    resolver();
  };

  return [promise, exposedResolver];
}
},{}],"../../node_modules/threads/dist-esm/types/master.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerEventType = void 0;

var _symbols = require("../symbols");

/// <reference lib="dom" />

/** Event as emitted by worker thread. Subscribe to using `Thread.events(thread)`. */
var WorkerEventType;
exports.WorkerEventType = WorkerEventType;

(function (WorkerEventType) {
  WorkerEventType["internalError"] = "internalError";
  WorkerEventType["message"] = "message";
  WorkerEventType["termination"] = "termination";
})(WorkerEventType || (exports.WorkerEventType = WorkerEventType = {}));
},{"../symbols":"../../node_modules/threads/dist-esm/symbols.js"}],"../../node_modules/threads/dist-esm/observable-promise.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservablePromise = void 0;

var _observableFns = require("observable-fns");

const doNothing = () => undefined;

const returnInput = input => input;

const runDeferred = fn => Promise.resolve().then(fn);

function fail(error) {
  throw error;
}

function isThenable(thing) {
  return thing && typeof thing.then === "function";
}
/**
 * Creates a hybrid, combining the APIs of an Observable and a Promise.
 *
 * It is used to proxy async process states when we are initially not sure
 * if that async process will yield values once (-> Promise) or multiple
 * times (-> Observable).
 *
 * Note that the observable promise inherits some of the observable's characteristics:
 * The `init` function will be called *once for every time anyone subscribes to it*.
 *
 * If this is undesired, derive a hot observable from it using `makeHot()` and
 * subscribe to that.
 */


class ObservablePromise extends _observableFns.Observable {
  constructor(init) {
    super(originalObserver => {
      // tslint:disable-next-line no-this-assignment
      const self = this;
      const observer = Object.assign(Object.assign({}, originalObserver), {
        complete() {
          originalObserver.complete();
          self.onCompletion();
        },

        error(error) {
          originalObserver.error(error);
          self.onError(error);
        },

        next(value) {
          originalObserver.next(value);
          self.onNext(value);
        }

      });

      try {
        this.initHasRun = true;
        return init(observer);
      } catch (error) {
        observer.error(error);
      }
    });
    this.initHasRun = false;
    this.fulfillmentCallbacks = [];
    this.rejectionCallbacks = [];
    this.firstValueSet = false;
    this.state = "pending";
  }

  onNext(value) {
    if (!this.firstValueSet) {
      this.firstValue = value;
      this.firstValueSet = true;
    }
  }

  onError(error) {
    this.state = "rejected";
    this.rejection = error;

    for (const onRejected of this.rejectionCallbacks) {
      // Promisifying the call to turn errors into unhandled promise rejections
      // instead of them failing sync and cancelling the iteration
      runDeferred(() => onRejected(error));
    }
  }

  onCompletion() {
    this.state = "fulfilled";

    for (const onFulfilled of this.fulfillmentCallbacks) {
      // Promisifying the call to turn errors into unhandled promise rejections
      // instead of them failing sync and cancelling the iteration
      runDeferred(() => onFulfilled(this.firstValue));
    }
  }

  then(onFulfilledRaw, onRejectedRaw) {
    const onFulfilled = onFulfilledRaw || returnInput;
    const onRejected = onRejectedRaw || fail;
    let onRejectedCalled = false;
    return new Promise((resolve, reject) => {
      const rejectionCallback = error => {
        if (onRejectedCalled) return;
        onRejectedCalled = true;

        try {
          resolve(onRejected(error));
        } catch (anotherError) {
          reject(anotherError);
        }
      };

      const fulfillmentCallback = value => {
        try {
          resolve(onFulfilled(value));
        } catch (error) {
          rejectionCallback(error);
        }
      };

      if (!this.initHasRun) {
        this.subscribe({
          error: rejectionCallback
        });
      }

      if (this.state === "fulfilled") {
        return resolve(onFulfilled(this.firstValue));
      }

      if (this.state === "rejected") {
        onRejectedCalled = true;
        return resolve(onRejected(this.rejection));
      }

      this.fulfillmentCallbacks.push(fulfillmentCallback);
      this.rejectionCallbacks.push(rejectionCallback);
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onCompleted) {
    const handler = onCompleted || doNothing;
    return this.then(value => {
      handler();
      return value;
    }, () => handler());
  }

  static from(thing) {
    if (isThenable(thing)) {
      return new ObservablePromise(observer => {
        const onFulfilled = value => {
          observer.next(value);
          observer.complete();
        };

        const onRejected = error => {
          observer.error(error);
        };

        thing.then(onFulfilled, onRejected);
      });
    } else {
      return super.from(thing);
    }
  }

}

exports.ObservablePromise = ObservablePromise;
},{"observable-fns":"../../node_modules/observable-fns/dist.esm/index.js"}],"../../node_modules/threads/dist-esm/transferable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTransferDescriptor = isTransferDescriptor;
exports.Transfer = Transfer;

var _symbols = require("./symbols");

function isTransferable(thing) {
  if (!thing || typeof thing !== "object") return false; // Don't check too thoroughly, since the list of transferable things in JS might grow over time

  return true;
}

function isTransferDescriptor(thing) {
  return thing && typeof thing === "object" && thing[_symbols.$transferable];
}

function Transfer(payload, transferables) {
  if (!transferables) {
    if (!isTransferable(payload)) throw Error();
    transferables = [payload];
  }

  return {
    [_symbols.$transferable]: true,
    send: payload,
    transferables
  };
}
},{"./symbols":"../../node_modules/threads/dist-esm/symbols.js"}],"../../node_modules/threads/dist-esm/types/messages.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WorkerMessageType = exports.MasterMessageType = void 0;
/////////////////////////////
// Messages sent by master:
var MasterMessageType;
exports.MasterMessageType = MasterMessageType;

(function (MasterMessageType) {
  MasterMessageType["run"] = "run";
})(MasterMessageType || (exports.MasterMessageType = MasterMessageType = {})); ////////////////////////////
// Messages sent by worker:


var WorkerMessageType;
exports.WorkerMessageType = WorkerMessageType;

(function (WorkerMessageType) {
  WorkerMessageType["error"] = "error";
  WorkerMessageType["init"] = "init";
  WorkerMessageType["result"] = "result";
  WorkerMessageType["running"] = "running";
  WorkerMessageType["uncaughtError"] = "uncaughtError";
})(WorkerMessageType || (exports.WorkerMessageType = WorkerMessageType = {}));
},{}],"../../node_modules/threads/dist-esm/master/invocation-proxy.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProxyFunction = createProxyFunction;
exports.createProxyModule = createProxyModule;

var _debug = _interopRequireDefault(require("debug"));

var _observableFns = require("observable-fns");

var _common = require("../common");

var _observablePromise = require("../observable-promise");

var _transferable = require("../transferable");

var _messages = require("../types/messages");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * This source file contains the code for proxying calls in the master thread to calls in the workers
 * by `.postMessage()`-ing.
 *
 * Keep in mind that this code can make or break the program's performance! Need to optimize more…
 */
const debugMessages = (0, _debug.default)("threads:master:messages");
let nextJobUID = 1;

const dedupe = array => Array.from(new Set(array));

const isJobErrorMessage = data => data && data.type === _messages.WorkerMessageType.error;

const isJobResultMessage = data => data && data.type === _messages.WorkerMessageType.result;

const isJobStartMessage = data => data && data.type === _messages.WorkerMessageType.running;

function createObservableForJob(worker, jobUID) {
  return new _observableFns.Observable(observer => {
    let asyncType;

    const messageHandler = event => {
      debugMessages("Message from worker:", event.data);
      if (!event.data || event.data.uid !== jobUID) return;

      if (isJobStartMessage(event.data)) {
        asyncType = event.data.resultType;
      } else if (isJobResultMessage(event.data)) {
        if (asyncType === "promise") {
          if (typeof event.data.payload !== "undefined") {
            observer.next((0, _common.deserialize)(event.data.payload));
          }

          observer.complete();
          worker.removeEventListener("message", messageHandler);
        } else {
          if (event.data.payload) {
            observer.next((0, _common.deserialize)(event.data.payload));
          }

          if (event.data.complete) {
            observer.complete();
            worker.removeEventListener("message", messageHandler);
          }
        }
      } else if (isJobErrorMessage(event.data)) {
        const error = (0, _common.deserialize)(event.data.error);

        if (asyncType === "promise" || !asyncType) {
          observer.error(error);
        } else {
          observer.error(error);
        }

        worker.removeEventListener("message", messageHandler);
      }
    };

    worker.addEventListener("message", messageHandler);
    return () => worker.removeEventListener("message", messageHandler);
  });
}

function prepareArguments(rawArgs) {
  if (rawArgs.length === 0) {
    // Exit early if possible
    return {
      args: [],
      transferables: []
    };
  }

  const args = [];
  const transferables = [];

  for (const arg of rawArgs) {
    if ((0, _transferable.isTransferDescriptor)(arg)) {
      args.push((0, _common.serialize)(arg.send));
      transferables.push(...arg.transferables);
    } else {
      args.push((0, _common.serialize)(arg));
    }
  }

  return {
    args,
    transferables: transferables.length === 0 ? transferables : dedupe(transferables)
  };
}

function createProxyFunction(worker, method) {
  return (...rawArgs) => {
    const uid = nextJobUID++;
    const {
      args,
      transferables
    } = prepareArguments(rawArgs);
    const runMessage = {
      type: _messages.MasterMessageType.run,
      uid,
      method,
      args
    };
    debugMessages("Sending command to run function to worker:", runMessage);

    try {
      worker.postMessage(runMessage, transferables);
    } catch (error) {
      return _observablePromise.ObservablePromise.from(Promise.reject(error));
    }

    return _observablePromise.ObservablePromise.from((0, _observableFns.multicast)(createObservableForJob(worker, uid)));
  };
}

function createProxyModule(worker, methodNames) {
  const proxy = {};

  for (const methodName of methodNames) {
    proxy[methodName] = createProxyFunction(worker, methodName);
  }

  return proxy;
}
},{"debug":"../../node_modules/debug/src/browser.js","observable-fns":"../../node_modules/observable-fns/dist.esm/index.js","../common":"../../node_modules/threads/dist-esm/common.js","../observable-promise":"../../node_modules/threads/dist-esm/observable-promise.js","../transferable":"../../node_modules/threads/dist-esm/transferable.js","../types/messages":"../../node_modules/threads/dist-esm/types/messages.js"}],"../../node_modules/threads/dist-esm/master/spawn.js":[function(require,module,exports) {
var process = require("process");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spawn = spawn;

var _debug = _interopRequireDefault(require("debug"));

var _observableFns = require("observable-fns");

var _common = require("../common");

var _promise = require("../promise");

var _symbols = require("../symbols");

var _master = require("../types/master");

var _invocationProxy = require("./invocation-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
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

const debugMessages = (0, _debug.default)("threads:master:messages");
const debugSpawn = (0, _debug.default)("threads:master:spawn");
const debugThreadUtils = (0, _debug.default)("threads:master:thread-utils");

const isInitMessage = data => data && data.type === "init";

const isUncaughtErrorMessage = data => data && data.type === "uncaughtError";

const initMessageTimeout = typeof process !== "undefined" && undefined ? Number.parseInt(undefined, 10) : 10000;

function withTimeout(promise, timeoutInMs, errorMessage) {
  return __awaiter(this, void 0, void 0, function* () {
    let timeoutHandle;
    const timeout = new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(() => reject(Error(errorMessage)), timeoutInMs);
    });
    const result = yield Promise.race([promise, timeout]);
    clearTimeout(timeoutHandle);
    return result;
  });
}

function receiveInitMessage(worker) {
  return new Promise((resolve, reject) => {
    const messageHandler = event => {
      debugMessages("Message from worker before finishing initialization:", event.data);

      if (isInitMessage(event.data)) {
        worker.removeEventListener("message", messageHandler);
        resolve(event.data);
      } else if (isUncaughtErrorMessage(event.data)) {
        worker.removeEventListener("message", messageHandler);
        reject((0, _common.deserialize)(event.data.error));
      }
    };

    worker.addEventListener("message", messageHandler);
  });
}

function createEventObservable(worker, workerTermination) {
  return new _observableFns.Observable(observer => {
    const messageHandler = messageEvent => {
      const workerEvent = {
        type: _master.WorkerEventType.message,
        data: messageEvent.data
      };
      observer.next(workerEvent);
    };

    const rejectionHandler = errorEvent => {
      debugThreadUtils("Unhandled promise rejection event in thread:", errorEvent);
      const workerEvent = {
        type: _master.WorkerEventType.internalError,
        error: Error(errorEvent.reason)
      };
      observer.next(workerEvent);
    };

    worker.addEventListener("message", messageHandler);
    worker.addEventListener("unhandledrejection", rejectionHandler);
    workerTermination.then(() => {
      const terminationEvent = {
        type: _master.WorkerEventType.termination
      };
      worker.removeEventListener("message", messageHandler);
      worker.removeEventListener("unhandledrejection", rejectionHandler);
      observer.next(terminationEvent);
      observer.complete();
    });
  });
}

function createTerminator(worker) {
  const [termination, resolver] = (0, _promise.createPromiseWithResolver)();

  const terminate = () => __awaiter(this, void 0, void 0, function* () {
    debugThreadUtils("Terminating worker"); // Newer versions of worker_threads workers return a promise

    yield worker.terminate();
    resolver();
  });

  return {
    terminate,
    termination
  };
}

function setPrivateThreadProps(raw, worker, workerEvents, terminate) {
  const workerErrors = workerEvents.filter(event => event.type === _master.WorkerEventType.internalError).map(errorEvent => errorEvent.error); // tslint:disable-next-line prefer-object-spread

  return Object.assign(raw, {
    [_symbols.$errors]: workerErrors,
    [_symbols.$events]: workerEvents,
    [_symbols.$terminate]: terminate,
    [_symbols.$worker]: worker
  });
}
/**
 * Spawn a new thread. Takes a fresh worker instance, wraps it in a thin
 * abstraction layer to provide the transparent API and verifies that
 * the worker has initialized successfully.
 *
 * @param worker Instance of `Worker`. Either a web worker, `worker_threads` worker or `tiny-worker` worker.
 * @param [options]
 * @param [options.timeout] Init message timeout. Default: 10000 or set by environment variable.
 */


function spawn(worker, options) {
  return __awaiter(this, void 0, void 0, function* () {
    debugSpawn("Initializing new thread");
    const initMessage = yield withTimeout(receiveInitMessage(worker), options && options.timeout ? options.timeout : initMessageTimeout, `Timeout: Did not receive an init message from worker after ${initMessageTimeout}ms. Make sure the worker calls expose().`);
    const exposed = initMessage.exposed;
    const {
      termination,
      terminate
    } = createTerminator(worker);
    const events = createEventObservable(worker, termination);

    if (exposed.type === "function") {
      const proxy = (0, _invocationProxy.createProxyFunction)(worker);
      return setPrivateThreadProps(proxy, worker, events, terminate);
    } else if (exposed.type === "module") {
      const proxy = (0, _invocationProxy.createProxyModule)(worker, exposed.methods);
      return setPrivateThreadProps(proxy, worker, events, terminate);
    } else {
      const type = exposed.type;
      throw Error(`Worker init message states unexpected type of expose(): ${type}`);
    }
  });
}
},{"debug":"../../node_modules/debug/src/browser.js","observable-fns":"../../node_modules/observable-fns/dist.esm/index.js","../common":"../../node_modules/threads/dist-esm/common.js","../promise":"../../node_modules/threads/dist-esm/promise.js","../symbols":"../../node_modules/threads/dist-esm/symbols.js","../types/master":"../../node_modules/threads/dist-esm/types/master.js","./invocation-proxy":"../../node_modules/threads/dist-esm/master/invocation-proxy.js","process":"../../node_modules/process/browser.js"}],"../../node_modules/threads/dist-esm/master/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Pool", {
  enumerable: true,
  get: function () {
    return _pool.Pool;
  }
});
Object.defineProperty(exports, "spawn", {
  enumerable: true,
  get: function () {
    return _spawn.spawn;
  }
});
Object.defineProperty(exports, "Thread", {
  enumerable: true,
  get: function () {
    return _thread.Thread;
  }
});
exports.Worker = void 0;

var _implementation = require("./implementation");

var _pool = require("./pool");

var _spawn = require("./spawn");

var _thread = require("./thread");

/** Worker implementation. Either web worker or a node.js Worker class. */
const Worker = (0, _implementation.selectWorkerImplementation)();
exports.Worker = Worker;
},{"./implementation":"../../node_modules/threads/dist-esm/master/implementation.browser.js","./pool":"../../node_modules/threads/dist-esm/master/pool.js","./spawn":"../../node_modules/threads/dist-esm/master/spawn.js","./thread":"../../node_modules/threads/dist-esm/master/thread.js"}],"../../node_modules/symbol-observable/es/ponyfill.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = symbolObservablePonyfill;

function symbolObservablePonyfill(root) {
  var result;
  var Symbol = root.Symbol;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      result = Symbol.observable;
    } else {
      result = Symbol('observable');
      Symbol.observable = result;
    }
  } else {
    result = '@@observable';
  }

  return result;
}

;
},{}],"../../node_modules/symbol-observable/es/index.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ponyfill = _interopRequireDefault(require("./ponyfill.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global window */
var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill.default)(root);
var _default = result;
exports.default = _default;
},{"./ponyfill.js":"../../node_modules/symbol-observable/es/ponyfill.js"}],"../../node_modules/is-observable/index.js":[function(require,module,exports) {
'use strict';

const symbolObservable = require('symbol-observable').default;

module.exports = value => Boolean(value && value[symbolObservable] && value === value[symbolObservable]());
},{"symbol-observable":"../../node_modules/symbol-observable/es/index.js"}],"../../node_modules/threads/dist-esm/worker/implementation.browser.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/// <reference lib="dom" />
// tslint:disable no-shadowed-variable
const isWorkerRuntime = function isWorkerRuntime() {
  return typeof self !== "undefined" && self.postMessage ? true : false;
};

const postMessageToMaster = function postMessageToMaster(data, transferList) {
  self.postMessage(data, transferList);
};

const subscribeToMasterMessages = function subscribeToMasterMessages(onMessage) {
  const messageHandler = messageEvent => {
    onMessage(messageEvent.data);
  };

  const unsubscribe = () => {
    self.removeEventListener("message", messageHandler);
  };

  self.addEventListener("message", messageHandler);
  return unsubscribe;
};

var _default = {
  isWorkerRuntime,
  postMessageToMaster,
  subscribeToMasterMessages
};
exports.default = _default;
},{}],"../../node_modules/threads/dist-esm/worker/index.js":[function(require,module,exports) {
var process = require("process");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expose = expose;
Object.defineProperty(exports, "registerSerializer", {
  enumerable: true,
  get: function () {
    return _common.registerSerializer;
  }
});
Object.defineProperty(exports, "Transfer", {
  enumerable: true,
  get: function () {
    return _transferable.Transfer;
  }
});

var _isObservable = _interopRequireDefault(require("is-observable"));

var _common = require("../common");

var _transferable = require("../transferable");

var _messages = require("../types/messages");

var _implementation = _interopRequireDefault(require("./implementation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
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

let exposeCalled = false;

const isMasterJobRunMessage = thing => thing && thing.type === _messages.MasterMessageType.run;
/**
 * There are issues with `is-observable` not recognizing zen-observable's instances.
 * We are using `observable-fns`, but it's based on zen-observable, too.
 */


const isObservable = thing => (0, _isObservable.default)(thing) || isZenObservable(thing);

function isZenObservable(thing) {
  return thing && typeof thing === "object" && typeof thing.subscribe === "function";
}

function deconstructTransfer(thing) {
  return (0, _transferable.isTransferDescriptor)(thing) ? {
    payload: thing.send,
    transferables: thing.transferables
  } : {
    payload: thing,
    transferables: undefined
  };
}

function postFunctionInitMessage() {
  const initMessage = {
    type: _messages.WorkerMessageType.init,
    exposed: {
      type: "function"
    }
  };

  _implementation.default.postMessageToMaster(initMessage);
}

function postModuleInitMessage(methodNames) {
  const initMessage = {
    type: _messages.WorkerMessageType.init,
    exposed: {
      type: "module",
      methods: methodNames
    }
  };

  _implementation.default.postMessageToMaster(initMessage);
}

function postJobErrorMessage(uid, rawError) {
  const {
    payload: error,
    transferables
  } = deconstructTransfer(rawError);
  const errorMessage = {
    type: _messages.WorkerMessageType.error,
    uid,
    error: (0, _common.serialize)(error)
  };

  _implementation.default.postMessageToMaster(errorMessage, transferables);
}

function postJobResultMessage(uid, completed, resultValue) {
  const {
    payload,
    transferables
  } = deconstructTransfer(resultValue);
  const resultMessage = {
    type: _messages.WorkerMessageType.result,
    uid,
    complete: completed ? true : undefined,
    payload
  };

  _implementation.default.postMessageToMaster(resultMessage, transferables);
}

function postJobStartMessage(uid, resultType) {
  const startMessage = {
    type: _messages.WorkerMessageType.running,
    uid,
    resultType
  };

  _implementation.default.postMessageToMaster(startMessage);
}

function postUncaughtErrorMessage(error) {
  try {
    const errorMessage = {
      type: _messages.WorkerMessageType.uncaughtError,
      error: (0, _common.serialize)(error)
    };

    _implementation.default.postMessageToMaster(errorMessage);
  } catch (subError) {
    // tslint:disable-next-line no-console
    console.error("Not reporting uncaught error back to master thread as it occured while " + "reporting an uncaught error already. Latest error:", subError);
  }
}

function runFunction(jobUID, fn, args) {
  return __awaiter(this, void 0, void 0, function* () {
    let syncResult;

    try {
      syncResult = fn(...args);
    } catch (error) {
      return postJobErrorMessage(jobUID, error);
    }

    const resultType = isObservable(syncResult) ? "observable" : "promise";
    postJobStartMessage(jobUID, resultType);

    if (isObservable(syncResult)) {
      syncResult.subscribe(value => postJobResultMessage(jobUID, false, (0, _common.serialize)(value)), error => postJobErrorMessage(jobUID, (0, _common.serialize)(error)), () => postJobResultMessage(jobUID, true));
    } else {
      try {
        const result = yield syncResult;
        postJobResultMessage(jobUID, true, (0, _common.serialize)(result));
      } catch (error) {
        postJobErrorMessage(jobUID, (0, _common.serialize)(error));
      }
    }
  });
}
/**
 * Expose a function or a module (an object whose values are functions)
 * to the main thread. Must be called exactly once in every worker thread
 * to signal its API to the main thread.
 *
 * @param exposed Function or object whose values are functions
 */


function expose(exposed) {
  if (!_implementation.default.isWorkerRuntime()) {
    throw Error("expose() called in the master thread.");
  }

  if (exposeCalled) {
    throw Error("expose() called more than once. This is not possible. Pass an object to expose() if you want to expose multiple functions.");
  }

  exposeCalled = true;

  if (typeof exposed === "function") {
    _implementation.default.subscribeToMasterMessages(messageData => {
      if (isMasterJobRunMessage(messageData) && !messageData.method) {
        runFunction(messageData.uid, exposed, messageData.args.map(_common.deserialize));
      }
    });

    postFunctionInitMessage();
  } else if (typeof exposed === "object" && exposed) {
    _implementation.default.subscribeToMasterMessages(messageData => {
      if (isMasterJobRunMessage(messageData) && messageData.method) {
        runFunction(messageData.uid, exposed[messageData.method], messageData.args.map(_common.deserialize));
      }
    });

    const methodNames = Object.keys(exposed).filter(key => typeof exposed[key] === "function");
    postModuleInitMessage(methodNames);
  } else {
    throw Error(`Invalid argument passed to expose(). Expected a function or an object, got: ${exposed}`);
  }
}

if (typeof self !== "undefined" && typeof self.addEventListener === "function" && _implementation.default.isWorkerRuntime()) {
  self.addEventListener("error", event => {
    // Post with some delay, so the master had some time to subscribe to messages
    setTimeout(() => postUncaughtErrorMessage(event.error || event), 250);
  });
  self.addEventListener("unhandledrejection", event => {
    const error = event.reason;

    if (error && typeof error.message === "string") {
      // Post with some delay, so the master had some time to subscribe to messages
      setTimeout(() => postUncaughtErrorMessage(error), 250);
    }
  });
}

if (typeof process !== "undefined" && typeof process.on === "function" && _implementation.default.isWorkerRuntime()) {
  process.on("uncaughtException", error => {
    // Post with some delay, so the master had some time to subscribe to messages
    setTimeout(() => postUncaughtErrorMessage(error), 250);
  });
  process.on("unhandledRejection", error => {
    if (error && typeof error.message === "string") {
      // Post with some delay, so the master had some time to subscribe to messages
      setTimeout(() => postUncaughtErrorMessage(error), 250);
    }
  });
}
},{"is-observable":"../../node_modules/is-observable/index.js","../common":"../../node_modules/threads/dist-esm/common.js","../transferable":"../../node_modules/threads/dist-esm/transferable.js","../types/messages":"../../node_modules/threads/dist-esm/types/messages.js","./implementation":"../../node_modules/threads/dist-esm/worker/implementation.browser.js","process":"../../node_modules/process/browser.js"}],"../../node_modules/threads/dist-esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  registerSerializer: true,
  expose: true,
  DefaultSerializer: true,
  Transfer: true
};
Object.defineProperty(exports, "registerSerializer", {
  enumerable: true,
  get: function () {
    return _common.registerSerializer;
  }
});
Object.defineProperty(exports, "expose", {
  enumerable: true,
  get: function () {
    return _index2.expose;
  }
});
Object.defineProperty(exports, "DefaultSerializer", {
  enumerable: true,
  get: function () {
    return _serializers.DefaultSerializer;
  }
});
Object.defineProperty(exports, "Transfer", {
  enumerable: true,
  get: function () {
    return _transferable.Transfer;
  }
});

var _common = require("./common");

var _index = require("./master/index");

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _index[key];
    }
  });
});

var _index2 = require("./worker/index");

var _serializers = require("./serializers");

var _transferable = require("./transferable");
},{"./common":"../../node_modules/threads/dist-esm/common.js","./master/index":"../../node_modules/threads/dist-esm/master/index.js","./worker/index":"../../node_modules/threads/dist-esm/worker/index.js","./serializers":"../../node_modules/threads/dist-esm/serializers.js","./transferable":"../../node_modules/threads/dist-esm/transferable.js"}],"../../node_modules/threads/dist/master/get-bundle-url.browser.js":[function(require,module,exports) {
"use strict";
// Source: <https://github.com/parcel-bundler/parcel/blob/master/packages/core/parcel-bundler/src/builtins/bundle-url.js>
Object.defineProperty(exports, "__esModule", { value: true });
let bundleURL;
function getBundleURLCached() {
    if (!bundleURL) {
        bundleURL = getBundleURL();
    }
    return bundleURL;
}
exports.getBundleURL = getBundleURLCached;
function getBundleURL() {
    // Attempt to find the URL of the current script and use that as the base URL
    try {
        throw new Error;
    }
    catch (err) {
        const matches = ("" + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
        if (matches) {
            return getBaseURL(matches[0]);
        }
    }
    return "/";
}
function getBaseURL(url) {
    return ("" + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
exports.getBaseURL = getBaseURL;

},{}],"../../node_modules/threads/dist/master/implementation.browser.js":[function(require,module,exports) {
"use strict";
// tslint:disable max-classes-per-file
Object.defineProperty(exports, "__esModule", { value: true });
const get_bundle_url_browser_1 = require("./get-bundle-url.browser");
exports.defaultPoolSize = typeof navigator !== "undefined" && navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency
    : 4;
const isAbsoluteURL = (value) => /^(file|https?:)?\/\//i.test(value);
function createSourceBlobURL(code) {
    const blob = new Blob([code], { type: "application/javascript" });
    return URL.createObjectURL(blob);
}
function selectWorkerImplementation() {
    if (typeof Worker === "undefined") {
        // Might happen on Safari, for instance
        // The idea is to only fail if the constructor is actually used
        return class NoWebWorker {
            constructor() {
                throw Error("No web worker implementation available. You might have tried to spawn a worker within a worker in a browser that doesn't support workers in workers.");
            }
        };
    }
    return class WebWorker extends Worker {
        constructor(url, options) {
            if (typeof url === "string" && options && options._baseURL) {
                url = new URL(url, options._baseURL);
            }
            else if (typeof url === "string" && !isAbsoluteURL(url) && get_bundle_url_browser_1.getBundleURL().match(/^file:\/\//i)) {
                url = new URL(url, get_bundle_url_browser_1.getBundleURL().replace(/\/[^\/]+$/, "/"));
                url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`);
            }
            if (typeof url === "string" && isAbsoluteURL(url)) {
                // Create source code blob loading JS file via `importScripts()`
                // to circumvent worker CORS restrictions
                url = createSourceBlobURL(`importScripts(${JSON.stringify(url)});`);
            }
            super(url, options);
        }
    };
}
exports.selectWorkerImplementation = selectWorkerImplementation;

},{"./get-bundle-url.browser":"../../node_modules/threads/dist/master/get-bundle-url.browser.js"}],"../../node_modules/threads/dist/ponyfills.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Based on <https://github.com/es-shims/Promise.allSettled/blob/master/implementation.js>
function allSettled(values) {
    return Promise.all(values.map(item => {
        const onFulfill = (value) => {
            return { status: 'fulfilled', value };
        };
        const onReject = (reason) => {
            return { status: 'rejected', reason };
        };
        const itemPromise = Promise.resolve(item);
        try {
            return itemPromise.then(onFulfill, onReject);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }));
}
exports.allSettled = allSettled;

},{}],"../../node_modules/threads/dist/master/pool-types.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Pool event type. Specifies the type of each `PoolEvent`. */
var PoolEventType;
(function (PoolEventType) {
    PoolEventType["initialized"] = "initialized";
    PoolEventType["taskCanceled"] = "taskCanceled";
    PoolEventType["taskCompleted"] = "taskCompleted";
    PoolEventType["taskFailed"] = "taskFailed";
    PoolEventType["taskQueued"] = "taskQueued";
    PoolEventType["taskQueueDrained"] = "taskQueueDrained";
    PoolEventType["taskStart"] = "taskStart";
    PoolEventType["terminated"] = "terminated";
})(PoolEventType = exports.PoolEventType || (exports.PoolEventType = {}));

},{}],"../../node_modules/threads/dist/symbols.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$errors = Symbol("thread.errors");
exports.$events = Symbol("thread.events");
exports.$terminate = Symbol("thread.terminate");
exports.$transferable = Symbol("thread.transferable");
exports.$worker = Symbol("thread.worker");

},{}],"../../node_modules/threads/dist/master/thread.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbols_1 = require("../symbols");
function fail(message) {
    throw Error(message);
}
/** Thread utility functions. Use them to manage or inspect a `spawn()`-ed thread. */
exports.Thread = {
    /** Return an observable that can be used to subscribe to all errors happening in the thread. */
    errors(thread) {
        return thread[symbols_1.$errors] || fail("Error observable not found. Make sure to pass a thread instance as returned by the spawn() promise.");
    },
    /** Return an observable that can be used to subscribe to internal events happening in the thread. Useful for debugging. */
    events(thread) {
        return thread[symbols_1.$events] || fail("Events observable not found. Make sure to pass a thread instance as returned by the spawn() promise.");
    },
    /** Terminate a thread. Remember to terminate every thread when you are done using it. */
    terminate(thread) {
        return thread[symbols_1.$terminate]();
    }
};

},{"../symbols":"../../node_modules/threads/dist/symbols.js"}],"../../node_modules/threads/dist/master/pool.js":[function(require,module,exports) {
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const observable_fns_1 = require("observable-fns");
const ponyfills_1 = require("../ponyfills");
const implementation_1 = require("./implementation");
const pool_types_1 = require("./pool-types");
exports.PoolEventType = pool_types_1.PoolEventType;
const thread_1 = require("./thread");
exports.Thread = thread_1.Thread;
let nextPoolID = 1;
function createArray(size) {
    const array = [];
    for (let index = 0; index < size; index++) {
        array.push(index);
    }
    return array;
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function flatMap(array, mapper) {
    return array.reduce((flattened, element) => [...flattened, ...mapper(element)], []);
}
function slugify(text) {
    return text.replace(/\W/g, " ").trim().replace(/\s+/g, "-");
}
function spawnWorkers(spawnWorker, count) {
    return createArray(count).map(() => ({
        init: spawnWorker(),
        runningTasks: []
    }));
}
class WorkerPool {
    constructor(spawnWorker, optionsOrSize) {
        this.eventSubject = new observable_fns_1.Subject();
        this.initErrors = [];
        this.isClosing = false;
        this.nextTaskID = 1;
        this.taskQueue = [];
        const options = typeof optionsOrSize === "number"
            ? { size: optionsOrSize }
            : optionsOrSize || {};
        const { size = implementation_1.defaultPoolSize } = options;
        this.debug = debug_1.default(`threads:pool:${slugify(options.name || String(nextPoolID++))}`);
        this.options = options;
        this.workers = spawnWorkers(spawnWorker, size);
        this.eventObservable = observable_fns_1.multicast(observable_fns_1.Observable.from(this.eventSubject));
        Promise.all(this.workers.map(worker => worker.init)).then(() => this.eventSubject.next({
            type: pool_types_1.PoolEventType.initialized,
            size: this.workers.length
        }), error => {
            this.debug("Error while initializing pool worker:", error);
            this.eventSubject.error(error);
            this.initErrors.push(error);
        });
    }
    findIdlingWorker() {
        const { concurrency = 1 } = this.options;
        return this.workers.find(worker => worker.runningTasks.length < concurrency);
    }
    runPoolTask(worker, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const workerID = this.workers.indexOf(worker) + 1;
            this.debug(`Running task #${task.id} on worker #${workerID}...`);
            this.eventSubject.next({
                type: pool_types_1.PoolEventType.taskStart,
                taskID: task.id,
                workerID
            });
            try {
                const returnValue = yield task.run(yield worker.init);
                this.debug(`Task #${task.id} completed successfully`);
                this.eventSubject.next({
                    type: pool_types_1.PoolEventType.taskCompleted,
                    returnValue,
                    taskID: task.id,
                    workerID
                });
            }
            catch (error) {
                this.debug(`Task #${task.id} failed`);
                this.eventSubject.next({
                    type: pool_types_1.PoolEventType.taskFailed,
                    taskID: task.id,
                    error,
                    workerID
                });
            }
        });
    }
    run(worker, task) {
        return __awaiter(this, void 0, void 0, function* () {
            const runPromise = (() => __awaiter(this, void 0, void 0, function* () {
                const removeTaskFromWorkersRunningTasks = () => {
                    worker.runningTasks = worker.runningTasks.filter(someRunPromise => someRunPromise !== runPromise);
                };
                // Defer task execution by one tick to give handlers time to subscribe
                yield delay(0);
                try {
                    yield this.runPoolTask(worker, task);
                }
                finally {
                    removeTaskFromWorkersRunningTasks();
                    if (!this.isClosing) {
                        this.scheduleWork();
                    }
                }
            }))();
            worker.runningTasks.push(runPromise);
        });
    }
    scheduleWork() {
        this.debug(`Attempt de-queueing a task in order to run it...`);
        const availableWorker = this.findIdlingWorker();
        if (!availableWorker)
            return;
        const nextTask = this.taskQueue.shift();
        if (!nextTask) {
            this.debug(`Task queue is empty`);
            this.eventSubject.next({ type: pool_types_1.PoolEventType.taskQueueDrained });
            return;
        }
        this.run(availableWorker, nextTask);
    }
    taskCompletion(taskID) {
        return new Promise((resolve, reject) => {
            const eventSubscription = this.events().subscribe(event => {
                if (event.type === pool_types_1.PoolEventType.taskCompleted && event.taskID === taskID) {
                    eventSubscription.unsubscribe();
                    resolve(event.returnValue);
                }
                else if (event.type === pool_types_1.PoolEventType.taskFailed && event.taskID === taskID) {
                    eventSubscription.unsubscribe();
                    reject(event.error);
                }
                else if (event.type === pool_types_1.PoolEventType.terminated) {
                    eventSubscription.unsubscribe();
                    reject(Error("Pool has been terminated before task was run."));
                }
            });
        });
    }
    settled(allowResolvingImmediately = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const getCurrentlyRunningTasks = () => flatMap(this.workers, worker => worker.runningTasks);
            const taskFailures = [];
            const failureSubscription = this.eventObservable.subscribe(event => {
                if (event.type === pool_types_1.PoolEventType.taskFailed) {
                    taskFailures.push(event.error);
                }
            });
            if (this.initErrors.length > 0) {
                return Promise.reject(this.initErrors[0]);
            }
            if (allowResolvingImmediately && this.taskQueue.length === 0) {
                yield ponyfills_1.allSettled(getCurrentlyRunningTasks());
                return taskFailures;
            }
            yield new Promise((resolve, reject) => {
                const subscription = this.eventObservable.subscribe({
                    next(event) {
                        if (event.type === pool_types_1.PoolEventType.taskQueueDrained) {
                            subscription.unsubscribe();
                            resolve();
                        }
                    },
                    error: reject // make a pool-wide error reject the completed() result promise
                });
            });
            yield ponyfills_1.allSettled(getCurrentlyRunningTasks());
            failureSubscription.unsubscribe();
            return taskFailures;
        });
    }
    completed(allowResolvingImmediately = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const settlementPromise = this.settled(allowResolvingImmediately);
            const earlyExitPromise = new Promise((resolve, reject) => {
                const subscription = this.eventObservable.subscribe({
                    next(event) {
                        if (event.type === pool_types_1.PoolEventType.taskQueueDrained) {
                            subscription.unsubscribe();
                            resolve(settlementPromise);
                        }
                        else if (event.type === pool_types_1.PoolEventType.taskFailed) {
                            subscription.unsubscribe();
                            reject(event.error);
                        }
                    },
                    error: reject // make a pool-wide error reject the completed() result promise
                });
            });
            const errors = yield Promise.race([
                settlementPromise,
                earlyExitPromise
            ]);
            if (errors.length > 0) {
                throw errors[0];
            }
        });
    }
    events() {
        return this.eventObservable;
    }
    queue(taskFunction) {
        const { maxQueuedJobs = Infinity } = this.options;
        if (this.isClosing) {
            throw Error(`Cannot schedule pool tasks after terminate() has been called.`);
        }
        if (this.initErrors.length > 0) {
            throw this.initErrors[0];
        }
        const taskCompleted = () => this.taskCompletion(task.id);
        let taskCompletionDotThen;
        const task = {
            id: this.nextTaskID++,
            run: taskFunction,
            cancel: () => {
                if (this.taskQueue.indexOf(task) === -1)
                    return;
                this.taskQueue = this.taskQueue.filter(someTask => someTask !== task);
                this.eventSubject.next({
                    type: pool_types_1.PoolEventType.taskCanceled,
                    taskID: task.id
                });
            },
            get then() {
                if (!taskCompletionDotThen) {
                    const promise = taskCompleted();
                    taskCompletionDotThen = promise.then.bind(promise);
                }
                return taskCompletionDotThen;
            }
        };
        if (this.taskQueue.length >= maxQueuedJobs) {
            throw Error("Maximum number of pool tasks queued. Refusing to queue another one.\n" +
                "This usually happens for one of two reasons: We are either at peak " +
                "workload right now or some tasks just won't finish, thus blocking the pool.");
        }
        this.debug(`Queueing task #${task.id}...`);
        this.taskQueue.push(task);
        this.eventSubject.next({
            type: pool_types_1.PoolEventType.taskQueued,
            taskID: task.id
        });
        this.scheduleWork();
        return task;
    }
    terminate(force) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isClosing = true;
            if (!force) {
                yield this.completed(true);
            }
            this.eventSubject.next({
                type: pool_types_1.PoolEventType.terminated,
                remainingQueue: [...this.taskQueue]
            });
            this.eventSubject.complete();
            yield Promise.all(this.workers.map((worker) => __awaiter(this, void 0, void 0, function* () { return thread_1.Thread.terminate(yield worker.init); })));
        });
    }
}
WorkerPool.EventType = pool_types_1.PoolEventType;
/**
 * Thread pool constructor. Creates a new pool and spawns its worker threads.
 */
function PoolConstructor(spawnWorker, optionsOrSize) {
    // The function exists only so we don't need to use `new` to create a pool (we still can, though).
    // If the Pool is a class or not is an implementation detail that should not concern the user.
    return new WorkerPool(spawnWorker, optionsOrSize);
}
PoolConstructor.EventType = pool_types_1.PoolEventType;
/**
 * Thread pool constructor. Creates a new pool and spawns its worker threads.
 */
exports.Pool = PoolConstructor;

},{"debug":"../../node_modules/debug/src/browser.js","observable-fns":"../../node_modules/observable-fns/dist.esm/index.js","../ponyfills":"../../node_modules/threads/dist/ponyfills.js","./implementation":"../../node_modules/threads/dist/master/implementation.browser.js","./pool-types":"../../node_modules/threads/dist/master/pool-types.js","./thread":"../../node_modules/threads/dist/master/thread.js"}],"../../node_modules/threads/dist/serializers.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extendSerializer(extend, implementation) {
    const fallbackDeserializer = extend.deserialize.bind(extend);
    const fallbackSerializer = extend.serialize.bind(extend);
    return {
        deserialize(message) {
            return implementation.deserialize(message, fallbackDeserializer);
        },
        serialize(input) {
            return implementation.serialize(input, fallbackSerializer);
        }
    };
}
exports.extendSerializer = extendSerializer;
const DefaultErrorSerializer = {
    deserialize(message) {
        return Object.assign(Error(message.message), {
            name: message.name,
            stack: message.stack
        });
    },
    serialize(error) {
        return {
            __error_marker: "$$error",
            message: error.message,
            name: error.name,
            stack: error.stack
        };
    }
};
const isSerializedError = (thing) => thing && typeof thing === "object" && "__error_marker" in thing && thing.__error_marker === "$$error";
exports.DefaultSerializer = {
    deserialize(message) {
        if (isSerializedError(message)) {
            return DefaultErrorSerializer.deserialize(message);
        }
        else {
            return message;
        }
    },
    serialize(input) {
        if (input instanceof Error) {
            return DefaultErrorSerializer.serialize(input);
        }
        else {
            return input;
        }
    }
};

},{}],"../../node_modules/threads/dist/common.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serializers_1 = require("./serializers");
let registeredSerializer = serializers_1.DefaultSerializer;
function registerSerializer(serializer) {
    registeredSerializer = serializers_1.extendSerializer(registeredSerializer, serializer);
}
exports.registerSerializer = registerSerializer;
function deserialize(message) {
    return registeredSerializer.deserialize(message);
}
exports.deserialize = deserialize;
function serialize(input) {
    return registeredSerializer.serialize(input);
}
exports.serialize = serialize;

},{"./serializers":"../../node_modules/threads/dist/serializers.js"}],"../../node_modules/threads/dist/promise.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const doNothing = () => undefined;
/**
 * Creates a new promise and exposes its resolver function.
 * Use with care!
 */
function createPromiseWithResolver() {
    let alreadyResolved = false;
    let resolvedTo;
    let resolver = doNothing;
    const promise = new Promise(resolve => {
        if (alreadyResolved) {
            resolve(resolvedTo);
        }
        else {
            resolver = resolve;
        }
    });
    const exposedResolver = (value) => {
        alreadyResolved = true;
        resolvedTo = value;
        resolver();
    };
    return [promise, exposedResolver];
}
exports.createPromiseWithResolver = createPromiseWithResolver;

},{}],"../../node_modules/threads/dist/types/master.js":[function(require,module,exports) {
"use strict";
/// <reference lib="dom" />
Object.defineProperty(exports, "__esModule", { value: true });
const symbols_1 = require("../symbols");
/** Event as emitted by worker thread. Subscribe to using `Thread.events(thread)`. */
var WorkerEventType;
(function (WorkerEventType) {
    WorkerEventType["internalError"] = "internalError";
    WorkerEventType["message"] = "message";
    WorkerEventType["termination"] = "termination";
})(WorkerEventType = exports.WorkerEventType || (exports.WorkerEventType = {}));

},{"../symbols":"../../node_modules/threads/dist/symbols.js"}],"../../node_modules/threads/dist/observable-promise.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observable_fns_1 = require("observable-fns");
const doNothing = () => undefined;
const returnInput = (input) => input;
const runDeferred = (fn) => Promise.resolve().then(fn);
function fail(error) {
    throw error;
}
function isThenable(thing) {
    return thing && typeof thing.then === "function";
}
/**
 * Creates a hybrid, combining the APIs of an Observable and a Promise.
 *
 * It is used to proxy async process states when we are initially not sure
 * if that async process will yield values once (-> Promise) or multiple
 * times (-> Observable).
 *
 * Note that the observable promise inherits some of the observable's characteristics:
 * The `init` function will be called *once for every time anyone subscribes to it*.
 *
 * If this is undesired, derive a hot observable from it using `makeHot()` and
 * subscribe to that.
 */
class ObservablePromise extends observable_fns_1.Observable {
    constructor(init) {
        super(originalObserver => {
            // tslint:disable-next-line no-this-assignment
            const self = this;
            const observer = Object.assign(Object.assign({}, originalObserver), { complete() {
                    originalObserver.complete();
                    self.onCompletion();
                },
                error(error) {
                    originalObserver.error(error);
                    self.onError(error);
                },
                next(value) {
                    originalObserver.next(value);
                    self.onNext(value);
                } });
            try {
                this.initHasRun = true;
                return init(observer);
            }
            catch (error) {
                observer.error(error);
            }
        });
        this.initHasRun = false;
        this.fulfillmentCallbacks = [];
        this.rejectionCallbacks = [];
        this.firstValueSet = false;
        this.state = "pending";
    }
    onNext(value) {
        if (!this.firstValueSet) {
            this.firstValue = value;
            this.firstValueSet = true;
        }
    }
    onError(error) {
        this.state = "rejected";
        this.rejection = error;
        for (const onRejected of this.rejectionCallbacks) {
            // Promisifying the call to turn errors into unhandled promise rejections
            // instead of them failing sync and cancelling the iteration
            runDeferred(() => onRejected(error));
        }
    }
    onCompletion() {
        this.state = "fulfilled";
        for (const onFulfilled of this.fulfillmentCallbacks) {
            // Promisifying the call to turn errors into unhandled promise rejections
            // instead of them failing sync and cancelling the iteration
            runDeferred(() => onFulfilled(this.firstValue));
        }
    }
    then(onFulfilledRaw, onRejectedRaw) {
        const onFulfilled = onFulfilledRaw || returnInput;
        const onRejected = onRejectedRaw || fail;
        let onRejectedCalled = false;
        return new Promise((resolve, reject) => {
            const rejectionCallback = (error) => {
                if (onRejectedCalled)
                    return;
                onRejectedCalled = true;
                try {
                    resolve(onRejected(error));
                }
                catch (anotherError) {
                    reject(anotherError);
                }
            };
            const fulfillmentCallback = (value) => {
                try {
                    resolve(onFulfilled(value));
                }
                catch (error) {
                    rejectionCallback(error);
                }
            };
            if (!this.initHasRun) {
                this.subscribe({ error: rejectionCallback });
            }
            if (this.state === "fulfilled") {
                return resolve(onFulfilled(this.firstValue));
            }
            if (this.state === "rejected") {
                onRejectedCalled = true;
                return resolve(onRejected(this.rejection));
            }
            this.fulfillmentCallbacks.push(fulfillmentCallback);
            this.rejectionCallbacks.push(rejectionCallback);
        });
    }
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
    finally(onCompleted) {
        const handler = onCompleted || doNothing;
        return this.then((value) => {
            handler();
            return value;
        }, () => handler());
    }
    static from(thing) {
        if (isThenable(thing)) {
            return new ObservablePromise(observer => {
                const onFulfilled = (value) => {
                    observer.next(value);
                    observer.complete();
                };
                const onRejected = (error) => {
                    observer.error(error);
                };
                thing.then(onFulfilled, onRejected);
            });
        }
        else {
            return super.from(thing);
        }
    }
}
exports.ObservablePromise = ObservablePromise;

},{"observable-fns":"../../node_modules/observable-fns/dist.esm/index.js"}],"../../node_modules/threads/dist/transferable.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbols_1 = require("./symbols");
function isTransferable(thing) {
    if (!thing || typeof thing !== "object")
        return false;
    // Don't check too thoroughly, since the list of transferable things in JS might grow over time
    return true;
}
function isTransferDescriptor(thing) {
    return thing && typeof thing === "object" && thing[symbols_1.$transferable];
}
exports.isTransferDescriptor = isTransferDescriptor;
function Transfer(payload, transferables) {
    if (!transferables) {
        if (!isTransferable(payload))
            throw Error();
        transferables = [payload];
    }
    return {
        [symbols_1.$transferable]: true,
        send: payload,
        transferables
    };
}
exports.Transfer = Transfer;

},{"./symbols":"../../node_modules/threads/dist/symbols.js"}],"../../node_modules/threads/dist/types/messages.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/////////////////////////////
// Messages sent by master:
var MasterMessageType;
(function (MasterMessageType) {
    MasterMessageType["run"] = "run";
})(MasterMessageType = exports.MasterMessageType || (exports.MasterMessageType = {}));
////////////////////////////
// Messages sent by worker:
var WorkerMessageType;
(function (WorkerMessageType) {
    WorkerMessageType["error"] = "error";
    WorkerMessageType["init"] = "init";
    WorkerMessageType["result"] = "result";
    WorkerMessageType["running"] = "running";
    WorkerMessageType["uncaughtError"] = "uncaughtError";
})(WorkerMessageType = exports.WorkerMessageType || (exports.WorkerMessageType = {}));

},{}],"../../node_modules/threads/dist/master/invocation-proxy.js":[function(require,module,exports) {
"use strict";
/*
 * This source file contains the code for proxying calls in the master thread to calls in the workers
 * by `.postMessage()`-ing.
 *
 * Keep in mind that this code can make or break the program's performance! Need to optimize more…
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const observable_fns_1 = require("observable-fns");
const common_1 = require("../common");
const observable_promise_1 = require("../observable-promise");
const transferable_1 = require("../transferable");
const messages_1 = require("../types/messages");
const debugMessages = debug_1.default("threads:master:messages");
let nextJobUID = 1;
const dedupe = (array) => Array.from(new Set(array));
const isJobErrorMessage = (data) => data && data.type === messages_1.WorkerMessageType.error;
const isJobResultMessage = (data) => data && data.type === messages_1.WorkerMessageType.result;
const isJobStartMessage = (data) => data && data.type === messages_1.WorkerMessageType.running;
function createObservableForJob(worker, jobUID) {
    return new observable_fns_1.Observable(observer => {
        let asyncType;
        const messageHandler = ((event) => {
            debugMessages("Message from worker:", event.data);
            if (!event.data || event.data.uid !== jobUID)
                return;
            if (isJobStartMessage(event.data)) {
                asyncType = event.data.resultType;
            }
            else if (isJobResultMessage(event.data)) {
                if (asyncType === "promise") {
                    if (typeof event.data.payload !== "undefined") {
                        observer.next(common_1.deserialize(event.data.payload));
                    }
                    observer.complete();
                    worker.removeEventListener("message", messageHandler);
                }
                else {
                    if (event.data.payload) {
                        observer.next(common_1.deserialize(event.data.payload));
                    }
                    if (event.data.complete) {
                        observer.complete();
                        worker.removeEventListener("message", messageHandler);
                    }
                }
            }
            else if (isJobErrorMessage(event.data)) {
                const error = common_1.deserialize(event.data.error);
                if (asyncType === "promise" || !asyncType) {
                    observer.error(error);
                }
                else {
                    observer.error(error);
                }
                worker.removeEventListener("message", messageHandler);
            }
        });
        worker.addEventListener("message", messageHandler);
        return () => worker.removeEventListener("message", messageHandler);
    });
}
function prepareArguments(rawArgs) {
    if (rawArgs.length === 0) {
        // Exit early if possible
        return {
            args: [],
            transferables: []
        };
    }
    const args = [];
    const transferables = [];
    for (const arg of rawArgs) {
        if (transferable_1.isTransferDescriptor(arg)) {
            args.push(common_1.serialize(arg.send));
            transferables.push(...arg.transferables);
        }
        else {
            args.push(common_1.serialize(arg));
        }
    }
    return {
        args,
        transferables: transferables.length === 0 ? transferables : dedupe(transferables)
    };
}
function createProxyFunction(worker, method) {
    return ((...rawArgs) => {
        const uid = nextJobUID++;
        const { args, transferables } = prepareArguments(rawArgs);
        const runMessage = {
            type: messages_1.MasterMessageType.run,
            uid,
            method,
            args
        };
        debugMessages("Sending command to run function to worker:", runMessage);
        try {
            worker.postMessage(runMessage, transferables);
        }
        catch (error) {
            return observable_promise_1.ObservablePromise.from(Promise.reject(error));
        }
        return observable_promise_1.ObservablePromise.from(observable_fns_1.multicast(createObservableForJob(worker, uid)));
    });
}
exports.createProxyFunction = createProxyFunction;
function createProxyModule(worker, methodNames) {
    const proxy = {};
    for (const methodName of methodNames) {
        proxy[methodName] = createProxyFunction(worker, methodName);
    }
    return proxy;
}
exports.createProxyModule = createProxyModule;

},{"debug":"../../node_modules/debug/src/browser.js","observable-fns":"../../node_modules/observable-fns/dist.esm/index.js","../common":"../../node_modules/threads/dist/common.js","../observable-promise":"../../node_modules/threads/dist/observable-promise.js","../transferable":"../../node_modules/threads/dist/transferable.js","../types/messages":"../../node_modules/threads/dist/types/messages.js"}],"../../node_modules/threads/dist/master/spawn.js":[function(require,module,exports) {
var process = require("process");
"use strict";

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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const debug_1 = __importDefault(require("debug"));

const observable_fns_1 = require("observable-fns");

const common_1 = require("../common");

const promise_1 = require("../promise");

const symbols_1 = require("../symbols");

const master_1 = require("../types/master");

const invocation_proxy_1 = require("./invocation-proxy");

const debugMessages = debug_1.default("threads:master:messages");
const debugSpawn = debug_1.default("threads:master:spawn");
const debugThreadUtils = debug_1.default("threads:master:thread-utils");

const isInitMessage = data => data && data.type === "init";

const isUncaughtErrorMessage = data => data && data.type === "uncaughtError";

const initMessageTimeout = typeof process !== "undefined" && undefined ? Number.parseInt(undefined, 10) : 10000;

function withTimeout(promise, timeoutInMs, errorMessage) {
  return __awaiter(this, void 0, void 0, function* () {
    let timeoutHandle;
    const timeout = new Promise((resolve, reject) => {
      timeoutHandle = setTimeout(() => reject(Error(errorMessage)), timeoutInMs);
    });
    const result = yield Promise.race([promise, timeout]);
    clearTimeout(timeoutHandle);
    return result;
  });
}

function receiveInitMessage(worker) {
  return new Promise((resolve, reject) => {
    const messageHandler = event => {
      debugMessages("Message from worker before finishing initialization:", event.data);

      if (isInitMessage(event.data)) {
        worker.removeEventListener("message", messageHandler);
        resolve(event.data);
      } else if (isUncaughtErrorMessage(event.data)) {
        worker.removeEventListener("message", messageHandler);
        reject(common_1.deserialize(event.data.error));
      }
    };

    worker.addEventListener("message", messageHandler);
  });
}

function createEventObservable(worker, workerTermination) {
  return new observable_fns_1.Observable(observer => {
    const messageHandler = messageEvent => {
      const workerEvent = {
        type: master_1.WorkerEventType.message,
        data: messageEvent.data
      };
      observer.next(workerEvent);
    };

    const rejectionHandler = errorEvent => {
      debugThreadUtils("Unhandled promise rejection event in thread:", errorEvent);
      const workerEvent = {
        type: master_1.WorkerEventType.internalError,
        error: Error(errorEvent.reason)
      };
      observer.next(workerEvent);
    };

    worker.addEventListener("message", messageHandler);
    worker.addEventListener("unhandledrejection", rejectionHandler);
    workerTermination.then(() => {
      const terminationEvent = {
        type: master_1.WorkerEventType.termination
      };
      worker.removeEventListener("message", messageHandler);
      worker.removeEventListener("unhandledrejection", rejectionHandler);
      observer.next(terminationEvent);
      observer.complete();
    });
  });
}

function createTerminator(worker) {
  const [termination, resolver] = promise_1.createPromiseWithResolver();

  const terminate = () => __awaiter(this, void 0, void 0, function* () {
    debugThreadUtils("Terminating worker"); // Newer versions of worker_threads workers return a promise

    yield worker.terminate();
    resolver();
  });

  return {
    terminate,
    termination
  };
}

function setPrivateThreadProps(raw, worker, workerEvents, terminate) {
  const workerErrors = workerEvents.filter(event => event.type === master_1.WorkerEventType.internalError).map(errorEvent => errorEvent.error); // tslint:disable-next-line prefer-object-spread

  return Object.assign(raw, {
    [symbols_1.$errors]: workerErrors,
    [symbols_1.$events]: workerEvents,
    [symbols_1.$terminate]: terminate,
    [symbols_1.$worker]: worker
  });
}
/**
 * Spawn a new thread. Takes a fresh worker instance, wraps it in a thin
 * abstraction layer to provide the transparent API and verifies that
 * the worker has initialized successfully.
 *
 * @param worker Instance of `Worker`. Either a web worker, `worker_threads` worker or `tiny-worker` worker.
 * @param [options]
 * @param [options.timeout] Init message timeout. Default: 10000 or set by environment variable.
 */


function spawn(worker, options) {
  return __awaiter(this, void 0, void 0, function* () {
    debugSpawn("Initializing new thread");
    const initMessage = yield withTimeout(receiveInitMessage(worker), options && options.timeout ? options.timeout : initMessageTimeout, `Timeout: Did not receive an init message from worker after ${initMessageTimeout}ms. Make sure the worker calls expose().`);
    const exposed = initMessage.exposed;
    const {
      termination,
      terminate
    } = createTerminator(worker);
    const events = createEventObservable(worker, termination);

    if (exposed.type === "function") {
      const proxy = invocation_proxy_1.createProxyFunction(worker);
      return setPrivateThreadProps(proxy, worker, events, terminate);
    } else if (exposed.type === "module") {
      const proxy = invocation_proxy_1.createProxyModule(worker, exposed.methods);
      return setPrivateThreadProps(proxy, worker, events, terminate);
    } else {
      const type = exposed.type;
      throw Error(`Worker init message states unexpected type of expose(): ${type}`);
    }
  });
}

exports.spawn = spawn;
},{"debug":"../../node_modules/debug/src/browser.js","observable-fns":"../../node_modules/observable-fns/dist.esm/index.js","../common":"../../node_modules/threads/dist/common.js","../promise":"../../node_modules/threads/dist/promise.js","../symbols":"../../node_modules/threads/dist/symbols.js","../types/master":"../../node_modules/threads/dist/types/master.js","./invocation-proxy":"../../node_modules/threads/dist/master/invocation-proxy.js","process":"../../node_modules/process/browser.js"}],"../../node_modules/threads/dist/master/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const implementation_1 = require("./implementation");
var pool_1 = require("./pool");
exports.Pool = pool_1.Pool;
var spawn_1 = require("./spawn");
exports.spawn = spawn_1.spawn;
var thread_1 = require("./thread");
exports.Thread = thread_1.Thread;
/** Worker implementation. Either web worker or a node.js Worker class. */
exports.Worker = implementation_1.selectWorkerImplementation();

},{"./implementation":"../../node_modules/threads/dist/master/implementation.browser.js","./pool":"../../node_modules/threads/dist/master/pool.js","./spawn":"../../node_modules/threads/dist/master/spawn.js","./thread":"../../node_modules/threads/dist/master/thread.js"}],"../../node_modules/threads/dist/master/register.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
if (typeof global !== "undefined") {
    global.Worker = index_1.Worker;
}
else if (typeof window !== "undefined") {
    window.Worker = index_1.Worker;
}

},{"./index":"../../node_modules/threads/dist/master/index.js"}],"../../node_modules/threads/register.js":[function(require,module,exports) {
require("./dist/master/register")

},{"./dist/master/register":"../../node_modules/threads/dist/master/register.js"}],"../src/architecture/Network.js":[function(require,module,exports) {
"use strict";

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

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Connection_1 = require("./Connection");

var Utils_1 = require("../methods/Utils");

var Mutation_1 = require("../methods/Mutation");

var Loss_1 = require("../methods/Loss");

var Rate_1 = require("../methods/Rate");

var NEAT_1 = require("../NEAT");

var threads_1 = require("threads");

require("threads/register");

var NodeType_1 = require("../enums/NodeType");

var Node_1 = require("./Node");
/**
 * Create a neural network
 *
 * Networks are easy to create, all you need to specify is an `input` and an `output` size.
 *
 * @constructs Network
 *
 * @param {number} inputSize Size of input layer AKA neurons in input layer
 * @param {number} outputSize Size of output layer AKA neurons in output layer
 *
 * @prop {number} inputSize Size of input layer AKA neurons in input layer
 * @prop {number} outputSize Size of output layer AKA neurons in output layer
 * @prop {Array<Node>} nodes Nodes currently within the network
 * @prop {Array<Node>} gates Gates within the network
 * @prop {Array<Connection>} connections Connections within the network
 *
 * @example
 * let { Network } = require("@liquid-carrot/carrot");
 *
 * // Network with 2 input neurons and 1 output neuron
 * let myNetwork = new Network(2, 1);
 */


var Network =
/** @class */
function () {
  function Network(inputSize, outputSize) {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.nodes = [];
    this.connections = [];
    this.gates = [];
    this.score = undefined; // Create input and output nodes

    for (var i = 0; i < inputSize; i++) {
      this.nodes.push(new Node_1.Node(NodeType_1.NodeType.INPUT));
    }

    for (var i = 0; i < outputSize; i++) {
      this.nodes.push(new Node_1.Node(NodeType_1.NodeType.OUTPUT));
    } // Connect input and output nodes


    for (var i = 0; i < this.inputSize; i++) {
      for (var j = this.inputSize; j < this.outputSize + this.inputSize; j++) {
        // https://stats.stackexchange.com/a/248040/147931
        var weight = (Math.random() - 0.5) * this.inputSize * Math.sqrt(2 / this.inputSize);
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
   *
   * @example
   * let { Network } = require("@liquid-carrot/carrot");
   *
   * let exported = myNetwork.toJSON();
   * let imported = Network.fromJSON(exported) // imported will be a new instance of Network that is an exact clone of myNetwork
   */


  Network.fromJSON = function (json) {
    var network = new Network(json.inputSize, json.outputSize);
    network.nodes = [];
    network.connections = [];
    json.nodes.map(function (nodeJSON) {
      return new Node_1.Node().fromJSON(nodeJSON);
    }).forEach(function (node) {
      return network.nodes[node.index] = node;
    });
    json.connections.forEach(function (jsonConnection) {
      var connection = network.connect(network.nodes[jsonConnection.fromIndex], network.nodes[jsonConnection.toIndex], jsonConnection.weight);

      if (jsonConnection.gateNodeIndex != null) {
        network.addGate(network.nodes[jsonConnection.gateNodeIndex], connection);
      }
    });
    return network;
  };
  /**
   * Create an offspring from two parent networks.
   *
   * Networks are not required to have the same size, however input and output size should be the same!
   *
   * @todo Add custom [crossover](crossover) method customization
   *
   * @param {Network} network1 First parent network
   * @param {Network} network2 Second parent network
   * @param {boolean} [equal] Flag to indicate equally fit Networks
   *
   * @returns {Network} New network created from mixing parent networks
   */


  Network.crossOver = function (network1, network2, equal) {
    var _a, _b;

    if (network1.inputSize !== network2.inputSize || network1.outputSize !== network2.outputSize) {
      throw new Error("Networks don`t have the same input/output size!");
    } // Initialise offspring


    var offspring = new Network(network1.inputSize, network1.outputSize);
    offspring.connections = []; // clear

    offspring.nodes = []; // clear
    // Save scores and create a copy

    var score1 = (_a = network1.score) !== null && _a !== void 0 ? _a : 0;
    var score2 = (_b = network2.score) !== null && _b !== void 0 ? _b : 0; // Determine offspring node size

    var offspringSize;

    if (equal || score1 === score2) {
      var max = Math.max(network1.nodes.length, network2.nodes.length);
      var min = Math.min(network1.nodes.length, network2.nodes.length);
      offspringSize = Utils_1.randInt(min, max + 1); // [min,max]
    } else if (score1 > score2) {
      offspringSize = network1.nodes.length;
    } else {
      offspringSize = network2.nodes.length;
    }

    var inputSize = network1.inputSize;
    var outputSize = network1.outputSize; // set node indices

    for (var i = 0; i < network1.nodes.length; i++) {
      network1.nodes[i].index = i;
    } // set node indices


    for (var i = 0; i < network2.nodes.length; i++) {
      network2.nodes[i].index = i;
    } // Assign nodes from parents to offspring


    for (var i = 0; i < offspringSize; i++) {
      var chosenNode = void 0;
      var chosenNodeType = null; // decide what type of node is needed first check for input and output nodes and fill up with hidden nodes

      if (i < inputSize) {
        // pick input node
        chosenNodeType = NodeType_1.NodeType.INPUT;
        var sourceNetwork = Utils_1.randBoolean() ? network1 : network2;
        var inputNumber = -1;
        var j = -1;

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
        var sourceNetwork = Utils_1.randBoolean() ? network1 : network2;
        var outputNumber = -1;
        var j = -1;

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
        var sourceNetwork = void 0;

        if (i >= network1.nodes.length) {
          sourceNetwork = network2;
        } else if (i >= network2.nodes.length) {
          sourceNetwork = network1;
        } else {
          sourceNetwork = Utils_1.randBoolean() ? network1 : network2;
        }

        chosenNode = Utils_1.pickRandom(sourceNetwork.nodes);
      }

      var newNode = new Node_1.Node(chosenNodeType);
      newNode.bias = chosenNode.bias;
      newNode.squash = chosenNode.squash;
      offspring.nodes.push(newNode);
    } // Create arrays of connection genes


    var n1connections = [];
    var n2connections = []; // Add the connections of network 1

    network1.connections.forEach(function (connection) {
      n1connections[Connection_1.Connection.innovationID(connection.from.index, connection.to.index)] = connection.toJSON();
    }); // Add the connections of network 2

    network2.connections.forEach(function (connection) {
      n2connections[Connection_1.Connection.innovationID(connection.from.index, connection.to.index)] = connection.toJSON();
    }); // Split common conn genes from disjoint or excess conn genes

    var connections = [];
    var keys1 = Object.keys(n1connections);
    var keys2 = Object.keys(n2connections);

    for (var i = keys1.length - 1; i >= 0; i--) {
      if (n2connections[parseInt(keys1[i])] !== undefined) {
        connections.push(Utils_1.randBoolean() ? n1connections[parseInt(keys1[i])] : n2connections[parseInt(keys1[i])]);
        n2connections[parseInt(keys1[i])] = undefined;
      } else if (score1 >= score2 || equal) {
        connections.push(n1connections[parseInt(keys1[i])]);
      }
    } // Excess/disjoint gene


    if (score2 >= score1 || equal) {
      keys2.map(function (key) {
        return parseInt(key);
      }) // convert to numbers
      .map(function (key) {
        return n2connections[key];
      }) // get the connection
      .filter(function (conn) {
        return conn !== undefined;
      }) // filter out undefined connections
      .forEach(function (conn) {
        return connections.push(conn);
      }); // add the filtered connections
    } // Add common conn genes uniformly


    connections.forEach(function (connectionJSON) {
      if (connectionJSON !== undefined && connectionJSON.toIndex < offspringSize && connectionJSON.fromIndex < offspringSize) {
        var from = offspring.nodes[connectionJSON.fromIndex];
        var to = offspring.nodes[connectionJSON.toIndex];
        var connection = offspring.connect(from, to, connectionJSON.weight);

        if (connectionJSON.gateNodeIndex !== null && connectionJSON.gateNodeIndex < offspringSize) {
          offspring.addGate(offspring.nodes[connectionJSON.gateNodeIndex], connection);
        }
      }
    });
    return offspring;
  };
  /**
   * Returns a copy of Network.
   *
   * @returns {Network} Returns an identical network
   */


  Network.prototype.copy = function () {
    return Network.fromJSON(this.toJSON());
  };
  /**
   * Connects a Node to another Node or Group in the network
   *
   * @param {Node} from The source Node
   * @param {Node} to The destination Node or Group
   * @param {number} [weight=0] An initial weight for the connections to be formed
   *
   * @returns {Connection[]} An array of the formed connections
   *
   * @example
   * myNetwork.connect(myNetwork.nodes[4], myNetwork.nodes[5]); // connects network node 4 to network node 5
   */


  Network.prototype.connect = function (from, to, weight) {
    if (weight === void 0) {
      weight = 0;
    }

    var connection = from.connect(to, weight); // run node-level connect

    this.connections.push(connection); // add it to the array

    return connection;
  };
  /**
   * Activates the network
   *
   * It will activate all the nodes in activation order and produce an output.
   *
   * @function activate
   * @memberof Network
   *
   * @param {number[]} [input] Input values to activate nodes with
   * @param options
   * @param {number} [options.dropoutRate=0] The dropout rate. [dropout](https://medium.com/@amarbudhiraja/https-medium-com-amarbudhiraja-learning-less-to-learn-better-dropout-in-deep-machine-learning-74334da4bfc5)
   * @param {boolean} [options.trace=true] Controls whether traces are created when activation happens (a trace is meta information left behind for different uses, e.g. backpropagation).
   * @returns {number[]} Squashed output values
   *
   * @example
   * let { Network } = require("@liquid-carrot/carrot");
   *
   * // Create a network
   * let myNetwork = new Network(3, 2);
   *
   * myNetwork.activate([0.8, 1, 0.21]); // gives: [0.49, 0.51]
   */


  Network.prototype.activate = function (input, options) {
    if (options === void 0) {
      options = {};
    }

    if (input.length !== this.inputSize) {
      throw new RangeError("Input size of dataset is different to network input size!");
    } // get default value if no value is given


    options.dropoutRate = Utils_1.getOrDefault(options.dropoutRate, 0);
    options.trace = Utils_1.getOrDefault(options.trace, true);
    this.nodes.filter(function (node) {
      return node.isInputNode();
    }) // only input nodes
    .forEach(function (node, index) {
      return node.activate(input[index], options.trace);
    }); // activate them with the input

    this.nodes.filter(function (node) {
      return node.isHiddenNode();
    }) // only hidden nodes
    .forEach(function (node) {
      if (options.dropoutRate) {
        node.mask = Math.random() >= options.dropoutRate ? 1 : 0;
      }

      node.activate(undefined, options.trace); // activate them
    });
    return this.nodes.filter(function (node) {
      return node.isOutputNode();
    }) // only output nodes
    .map(function (node) {
      return node.activate(undefined, options.trace);
    }); // map them to there activation value will give the network's output
  };
  /**
   * Backpropagate the network
   *
   * This function allows you to teach the network. If you want to do more complex training, use the `network.train()` function.
   *
   * @function propagate
   * @memberof Network
   *
   * @param {number[]} target Ideal values of the previous activate. Will use the difference to improve the weights
   * @param options More option for propagation
   * @param {number} options.momentum=0 [Momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html). Adds a fraction of the previous weight update to the current one.
   * @param {boolean} options.update=false When set to false weights won't update, but when set to true after being false the last propagation will include the deltaweights of the first "update:false" propagations too.
   * @param {number} options.rate=0.3 Sets the [learning rate](https://towardsdatascience.com/understanding-learning-rates-and-how-it-improves-performance-in-deep-learning-d0d4059c1c10) of the backpropagation process
   *
   * @example
   * let { Network } = require("@liquid-carrot/carrot");
   *
   * let myNetwork = new Network(1,1);
   *
   * // This trains the network to function as a NOT gate
   * for(let nodeIndex: number= 0; i < 1000; i++){
   *  network.activate([0]);
   *  network.propagate(0.2, 0, true, [1]);
   *  network.activate([1]);
   *  network.propagate(0.3, 0, true, [0]);
   * }
   */


  Network.prototype.propagate = function (target, options) {
    if (options === void 0) {
      options = {};
    } // get default value if value isn't given


    options.rate = Utils_1.getOrDefault(options.rate, 0.3);
    options.momentum = Utils_1.getOrDefault(options.momentum, 0);
    options.update = Utils_1.getOrDefault(options.update, false);

    if (target.length !== this.outputSize) {
      throw new Error("Output target length should match network output length");
    } // Backpropagation: output -> hidden -> input
    // propagate through the output nodes


    this.nodes.filter(function (node) {
      return node.isOutputNode();
    }) // only output nodes
    .forEach(function (node, index) {
      return node.propagate(target[index], options);
    }); // propagate
    // propagate backwards through the hidden nodes

    for (var i = this.nodes.length - 1; i >= 0; i--) {
      if (this.nodes[i].isHiddenNode()) {
        // only hidden nodes
        this.nodes[i].propagate(undefined, options);
      }
    } // propagate through the input nodes


    this.nodes.filter(function (node) {
      return node.isInputNode();
    }) // only input nodes
    .forEach(function (node) {
      return node.propagate(undefined, options);
    }); // propagate
  };
  /**
   * Clear the context of the network
   *
   * @function clear
   * @memberof Network
   */


  Network.prototype.clear = function () {
    this.nodes.forEach(function (node) {
      return node.clear();
    });
  };
  /**
   * Removes the connection of the `from` node to the `to` node
   *
   * @function disconnect
   * @memberof Network
   *
   * @param {Node} from Source node
   * @param {Node} to Destination node
   *
   * @example
   * myNetwork.disconnect(myNetwork.nodes[4], myNetwork.nodes[5]);
   * // now node 4 does not have an effect on the output of node 5 anymore
   */


  Network.prototype.disconnect = function (from, to) {
    var _this = this; // remove the connection network-level


    this.connections.filter(function (conn) {
      return conn.from === from;
    }) // check for incoming node
    .filter(function (conn) {
      return conn.to === to;
    }) // check for outgoing node
    .forEach(function (conn) {
      if (conn.gateNode !== null) {
        _this.removeGate(conn); // remove possible gate

      }

      Utils_1.removeFromArray(_this.connections, conn); // remove connection from array
    }); // disconnect node-level

    return from.disconnect(to);
  };
  /**
   * Makes a network node gate a connection
   *
   * @function gate
   * @memberof Network
   *
   * @todo Add ability to gate several network connections at once
   *
   * @param {Node} node Gating node
   * @param {Connection} connection Connection to gate with node
   *
   * @example
   * let { Network } = require("@liquid-carrot/carrot");
   *
   * myNetwork.gate(myNetwork.nodes[1], myNetwork.connections[5])
   * // now: connection 5's weight is multiplied with node 1's activaton
   */


  Network.prototype.addGate = function (node, connection) {
    if (this.nodes.indexOf(node) === -1) {
      throw new ReferenceError("This node is not part of the network!");
    } else if (connection.gateNode != null) {
      return;
    }

    node.addGate(connection);
    this.gates.push(connection);
  };
  /**
   * Remove the gate of a connection.
   *
   * @function ungate
   * @memberof Network
   *
   * @param {Connection} connection Connection to remove gate from
   */


  Network.prototype.removeGate = function (connection) {
    if (!this.gates.includes(connection)) {
      throw new Error("This connection is not gated!");
    }

    Utils_1.removeFromArray(this.gates, connection);

    if (connection.gateNode != null) {
      connection.gateNode.removeGate(connection);
    }
  };
  /**
   * Removes a node from a network, all its connections will be redirected. If it gates a connection, the gate will be removed.
   *
   * @function remove
   * @memberof Network
   *
   * @param {Node} node Node to remove from the network
   * @param keepGates
   */


  Network.prototype.removeNode = function (node, keepGates) {
    var _this = this;

    if (keepGates === void 0) {
      keepGates = new Mutation_1.SubNodeMutation().keepGates;
    }

    if (!this.nodes.includes(node)) {
      throw new ReferenceError("This node does not exist in the network!");
    }

    this.disconnect(node, node); // remove self connection

    var inputs = []; // keep track

    var gates = []; // keep track

    var outputs = []; // keep track

    var connections = []; // keep track
    // read all inputs from node and keep track of the nodes that gate the incoming connection

    for (var i = node.incoming.length - 1; i >= 0; i--) {
      var connection = node.incoming[i];

      if (keepGates && connection.gateNode !== null && connection.gateNode !== node) {
        gates.push(connection.gateNode);
      }

      inputs.push(connection.from);
      this.disconnect(connection.from, node);
    } // read all outputs from node and keep track of the nodes that gate the outgoing connection


    for (var i = node.outgoing.length - 1; i >= 0; i--) {
      var connection = node.outgoing[i];

      if (keepGates && connection.gateNode !== null && connection.gateNode !== node) {
        gates.push(connection.gateNode);
      }

      outputs.push(connection.to);
      this.disconnect(node, connection.to);
    } // add all connections the node has


    inputs.forEach(function (input) {
      outputs.forEach(function (output) {
        if (!input.isProjectingTo(output)) {
          connections.push(_this.connect(input, output));
        }
      });
    }); // as long as there are gates and connections

    while (gates.length > 0 && connections.length > 0) {
      var gate = gates.shift(); // take a gate node and remove it from the array

      if (gate === undefined) {
        continue;
      }

      var connection = Utils_1.pickRandom(connections); // take a random connection

      this.addGate(gate, connection); // gate the connection with the gate node

      Utils_1.removeFromArray(connections, connection); // remove the connection from the array
    } // remove every gate the node has


    for (var i = node.gated.length - 1; i >= 0; i--) {
      this.removeGate(node.gated[i]);
    }

    Utils_1.removeFromArray(this.nodes, node); // remove the node from the nodes array
  };
  /**
   * Mutates the network with the given method.
   *
   * @function mutate
   * @memberof Network
   *
   * @param {Mutation} method [Mutation method](mutation)
   * @param {object} options
   * @param {number} [options.maxNodes] Maximum amount of [Nodes](node) a network can grow to
   * @param {number} [options.maxConnections] Maximum amount of [Connections](connection) a network can grow to
   * @param {number} [options.maxGates] Maximum amount of Gates a network can grow to
   *
   * @example
   * let { Network } = require("@liquid-carrot/carrot");
   *
   * myNetwork = myNetwork.mutate(new AddNodeMutation()) // returns a mutated network with an added gate
   */


  Network.prototype.mutate = function (method, options) {
    method.mutate(this, options);
  };
  /**
   * Selects a random mutation method and returns a mutated copy of the network. Warning! Mutates network directly.
   *
   * @function mutateRandom
   *
   * @memberof Network
   *
   * @param {Mutation[]} [allowedMethods=methods.mutation.ALL] An array of [Mutation methods](mutation) to automatically pick from
   * @param {object} options
   * @param {number} [options.maxNodes] Maximum amount of [Nodes](node) a network can grow to
   * @param {number} [options.maxConnections] Maximum amount of [Connections](connection) a network can grow to
   * @param {number} [options.maxGates] Maximum amount of Gates a network can grow to
   */


  Network.prototype.mutateRandom = function (allowedMethods, options) {
    if (allowedMethods === void 0) {
      allowedMethods = Mutation_1.ALL_MUTATIONS;
    }

    if (options === void 0) {
      options = {};
    }

    if (allowedMethods.length === 0) {
      return;
    } // mutate the network with a random allowed mutation


    this.mutate(Utils_1.pickRandom(allowedMethods), options);
  };
  /**
   * Train the given data to this network
   *
   * @function train
   * @memberof Network
   *
   * @param {Array<{input:number[],output:number[]}>} dataset A data of input values and ideal output values to train the network with
   * @param {TrainOptions} options Options used to train network
   * @param {options.loss} [options.loss=new MSELoss()] The [options.loss function](https://en.wikipedia.org/wiki/Loss_function) used to determine network error
   * @param {rate} [options.ratePolicy=new FixedRate(options.rate)] A [learning rate policy](https://towardsdatascience.com/understanding-learning-rates-and-how-it-improves-performance-in-deep-learning-d0d4059c1c10), i.e. how to change the learning rate during training to get better network performance
   * @param {number} [options.rate=0.3] Sets the [learning rate](https://towardsdatascience.com/understanding-learning-rates-and-how-it-improves-performance-in-deep-learning-d0d4059c1c10) of the backpropagation process
   * @param {number} [options.iterations=1000] Sets amount of training cycles the process will maximally run, even when the target error has not been reached.
   * @param {number} [options.error] The target error to train for, once the network falls below this error, the process is stopped. Lower error rates require more training cycles.
   * @param {number} [options.dropout=0] [Dropout rate](https://medium.com/@amarbudhiraja/https-medium-com-amarbudhiraja-learning-less-to-learn-better-options.dropout-in-deep-machine-learning-74334da4bfc5) likelihood for any given neuron to be ignored during network training. Must be between zero and one, numbers closer to one will result in more neurons ignored.
   * @param {number} [options.momentum=0] [Momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html). Adds a fraction of the previous weight update to the current one.
   * @param {number} [options.batchSize=1] Sets the (mini-) batch size of your training. Default: 1 [(online training)](https://www.quora.com/What-is-the-difference-between-batch-online-and-mini-batch-training-in-neural-networks-Which-one-should-I-use-for-a-small-to-medium-sized-dataset-for-prediction-purposes)
   * @param {number} [options.crossValidate.testSize] Sets the amount of test cases that should be assigned to cross validation. If data to 0.4, 40% of the given data will be used for cross validation.
   * @param {number} [options.crossValidate.testError] Sets the target error of the validation data.
   * @param {boolean} [options.clear=false] If set to true, will clear the network after every activation. This is useful for training LSTM's, more importantly for timeseries prediction.
   * @param {boolean} [options.shuffle=false] When set to true, will shuffle the training data every iterationNumber. Good option to use if the network is performing worse in [cross validation](https://artint.info/html/ArtInt_189.html) than in the real training data.
   * @param {number|boolean} [options.log=false] If set to n, outputs training status every n iterations. Setting `log` to 1 will log the status every iteration_number
   * @param {number} [options.schedule.iterations] You can schedule tasks to happen every n iterations. Paired with `options.schedule.function`
   * @param {schedule} [options.schedule.function] A function to run every n iterations as data by `options.schedule.iterations`. Passed as an object with a "function" property that contains the function to run.
   *
   * @returns {{error:{number},iterations:{number},time:{number}}} A summary object of the network's performance
   *
   * @example <caption>Training with Defaults</caption>
   * let { Network } = require("@liquid-carrot/carrot");
   *
   * let network = new Network(2, 1);
   *
   * // Train the XOR gate
   * network.train([{ input: [0,0], output: [0] },
   *                { input: [0,1], output: [1] },
   *                { input: [1,0], output: [1] },
   *                { input: [1,1], output: [0] }]);
   *
   * network.activate([0,1]); // 0.9824...
   *
   * @example <caption>Training with Options</caption>
   * let { Network } = require("@liquid-carrot/carrot");
   *
   * let network = new Network(2, 1);
   *
   * let trainingSet = [
   *    { input: [0,0], output: [0] },
   *    { input: [0,1], output: [1] },
   *    { input: [1,0], output: [1] },
   *    { input: [1,1], output: [0] }
   * ];
   *
   * // Train the XNOR gate
   * network.train(trainingSet, {
   *    log: 1,
   *    iterations: 1000,
   *    error: 0.0001,
   *    rate: 0.2
   * });
   *
   * @example <caption>Cross Validation Example</caption>
   * let { Network } = require("@liquid-carrot/carrot");
   *
   * let network = new Network(2,1);
   *
   * let trainingSet = [ // PS: don't use cross validation for small sets, this is just an example
   *  { input: [0,0], output: [1] },
   *  { input: [0,1], output: [0] },
   *  { input: [1,0], output: [0] },
   *  { input: [1,1], output: [1] }
   * ];
   *
   * // Train the XNOR gate
   * network.train(trainingSet, {
   *  crossValidate:
   *    {
   *      testSize: 0.4,
   *      testError: 0.02
   *    }
   * });
   *
   */


  Network.prototype.train = function (dataset, options) {
    if (options === void 0) {
      options = {};
    }

    var _a;

    if (dataset[0].input.length !== this.inputSize || dataset[0].output.length !== this.outputSize) {
      throw new Error("Dataset input/output size should be same as network input/output size!");
    } // Use the default values, if no value is given


    options.iterations = Utils_1.getOrDefault(options.iterations, -1);
    options.error = Utils_1.getOrDefault(options.error, -1);
    options.loss = Utils_1.getOrDefault(options.loss, new Loss_1.MSELoss());
    options.dropout = Utils_1.getOrDefault(options.dropout, 0);
    options.momentum = Utils_1.getOrDefault(options.momentum, 0);
    options.batchSize = Math.min(dataset.length, Utils_1.getOrDefault(options.batchSize, dataset.length));
    var baseRate = Utils_1.getOrDefault(options.rate, 0.3);
    options.ratePolicy = Utils_1.getOrDefault(options.ratePolicy, new Rate_1.FixedRate(baseRate));
    options.log = Utils_1.getOrDefault(options.log, NaN);
    var start = Date.now();

    if (options.iterations <= 0 && options.error <= 0) {
      throw new Error("At least one of the following options must be specified: error, iterations");
    } // Split into trainingSet and testSet if cross validation is enabled


    var trainingSetSize;
    var trainingSet;
    var testSet;

    if (options.crossValidateTestSize && options.crossValidateTestSize > 0) {
      trainingSetSize = Math.ceil((1 - options.crossValidateTestSize) * dataset.length);
      trainingSet = dataset.slice(0, trainingSetSize);
      testSet = dataset.slice(trainingSetSize);
    } else {
      trainingSet = dataset;
      testSet = [];
    }

    var currentTrainingRate;
    var iterationCount = 0;
    var error = 1; // train until the target error is reached or the target iterations are reached

    while (error > options.error && (options.iterations <= 0 || iterationCount < options.iterations)) {
      iterationCount++; // update the rate according to the rate policy

      currentTrainingRate = options.ratePolicy.calc(iterationCount); // train a single epoch

      var trainError = this.trainEpoch(trainingSet, options.batchSize, currentTrainingRate, options.momentum, options.loss, options.dropout);

      if (options.clear) {
        this.clear();
      } // Run test with the testSet, if cross validation is enabled


      if (options.crossValidateTestSize) {
        error = this.test(testSet, options.loss);

        if (options.clear) {
          this.clear();
        }
      } else {
        error = trainError;
      }

      if ((_a = options.shuffle) !== null && _a !== void 0 ? _a : false) {
        Utils_1.shuffle(dataset);
      }

      if (options.log > 0 && iterationCount % options.log === 0) {
        console.log("iteration number", iterationCount, "error", error, "training rate", currentTrainingRate);
      }

      if (options.schedule && iterationCount % options.schedule.iterations === 0) {
        options.schedule.function(error, iterationCount);
      }
    }

    if (options.clear) {
      this.clear();
    }

    return {
      error: error,
      iterations: iterationCount,
      time: Date.now() - start
    };
  };
  /**
   * Performs one training epoch and returns the error - this is a private function used in `self.train`
   *
   * @todo Add `@param` tag descriptions
   * @todo Add `@returns` tag description
   *
   * @private
   *
   * @param {Array<{input:number[], output: number[]}>} dataset
   * @param {number} batchSize
   * @param {number} trainingRate
   * @param {number} momentum
   * @param {loss} loss
   * @param {number} dropoutRate=0.5 The dropout rate to use when training
   *
   * @returns {number}
   */


  Network.prototype.trainEpoch = function (dataset, batchSize, trainingRate, momentum, loss, dropoutRate) {
    if (dropoutRate === void 0) {
      dropoutRate = 0.5;
    }

    var errorSum = 0;

    for (var i = 0; i < dataset.length; i++) {
      var input = dataset[i].input;
      var correctOutput = dataset[i].output;
      var update = (i + 1) % batchSize === 0 || i + 1 === dataset.length;
      var output = this.activate(input, {
        dropoutRate: dropoutRate
      });
      this.propagate(correctOutput, {
        rate: trainingRate,
        momentum: momentum,
        update: update
      });
      errorSum += loss.calc(correctOutput, output);
    }

    return errorSum / dataset.length;
  };
  /**
   * Tests a set and returns the error and elapsed time
   *
   * @function test
   * @memberof Network
   *
   * @param {Array<{input:number[],output:number[]}>} dataset A set of input values and ideal output values to test the network against
   * @param {Loss} [loss=new MSELoss()] The [loss function](https://en.wikipedia.org/wiki/Loss_function) used to determine network error
   *
   * @returns {number} A summary object of the network's performance
   *
   */


  Network.prototype.test = function (dataset, loss) {
    if (loss === void 0) {
      loss = new Loss_1.MSELoss();
    }

    var error = 0;

    for (var _i = 0, dataset_1 = dataset; _i < dataset_1.length; _i++) {
      var entry = dataset_1[_i];
      var input = entry.input;
      var target = entry.output;
      var output = this.activate(input, {
        trace: false
      });
      error += loss.calc(target, output);
    }

    return error / dataset.length;
  };
  /**
   * Convert the network to a json object
   *
   * @function toJSON
   * @memberof Network
   *
   * @returns {NetworkJSON} The network represented as a json object
   *
   * @example
   * let { Network } = require("@liquid-carrot/carrot");
   *
   * let exported = myNetwork.toJSON();
   * let imported = Network.fromJSON(exported) // imported will be a new instance of Network that is an exact clone of myNetwork
   */


  Network.prototype.toJSON = function () {
    var json = {
      nodes: [],
      connections: [],
      inputSize: this.inputSize,
      outputSize: this.outputSize
    }; // set node indices

    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].index = i;
    } // convert all nodes to json and add the to the json object


    this.nodes.forEach(function (node) {
      json.nodes.push(node.toJSON());

      if (node.selfConnection.weight !== 0) {
        // if there is a self connection
        // add it to the json object
        json.connections.push(node.selfConnection.toJSON());
      }
    });
    this.connections.map(function (conn) {
      return conn.toJSON();
    }) // convert all connections to json
    .forEach(function (connJSON) {
      return json.connections.push(connJSON);
    }); // and add them to the json object

    return json;
  };
  /**
   * Evolves the network to reach a lower error on a dataset using the [NEAT algorithm](http://nn.cs.utexas.edu/downloads/papers/stanley.ec02.pdf)
   *
   * If both `iterations` and `error` options are unset, evolve will default to `iterations` as an end condition.
   *
   * @function evolve
   * @memberof Network
   *
   * @param {Array<{input:number[],output:number[]}>} dataset A set of input values and ideal output values to train the network with
   * @param {object} [options] Configuration options
   * @param {number} [options.iterations=1000] Set the maximum amount of iterations/generations for the algorithm to run.
   * @param {number} [options.error=0.05] Set the target error. The algorithm will stop once this target error has been reached.
   * @param {number} [options.growth=0.0001] Set the penalty for large networks. Penalty calculation: penalty = (genome.nodes.length + genome.connectoins.length + genome.gates.length) * growth; This penalty will get added on top of the error. Your growth should be a very small number.
   * @param {loss} [options.loss=loss.MSE]  Specify the loss function for the evolution, this tells a genome in the population how well it's performing. Default: methods.loss.MSE (recommended).
   * @param {number} [options.amount=1] Set the amount of times to test the trainingset on a genome each generation. Useful for timeseries. Do not use for regular feedfoward problems.
   * @param {number} [options.threads] Specify the amount of threads to use. Default value is the amount of cores in your CPU.
   * @param {Network} [options.network]
   * @param {number|boolean} [options.log=false] If set to n, outputs training status every n iterations. Setting `log` to 1 will log the status every iteration
   * @param {number} [options.schedule.iterations] You can schedule tasks to happen every n iterations. Paired with `options.schedule.function`
   * @param {schedule} [options.schedule.function] A function to run every n iterations as set by `options.schedule.iterations`. Passed as an object with a "function" property that contains the function to run.
   * @param {boolean} [options.clear=false] If set to true, will clear the network after every activation. This is useful for evolving recurrent networks, more importantly for timeseries prediction.
   * @param {boolean} [options.equal=true] If set to true when [Network.crossOver](Network.crossOver) runs it will assume both genomes are equally fit.
   * @param {number} [options.populationSize=50] Population size of each generation.
   * @param {number} [options.elitism=1] Elitism of every evolution loop. [Elitism in genetic algorithms.](https://www.researchgate.net/post/What_is_meant_by_the_term_Elitism_in_the_Genetic_Algorithm)
   * @param {number} [options.provenance=0] Number of genomes inserted into the original network template (Network(input,output)) per evolution.
   * @param {number} [options.mutationRate=0.4] Sets the mutation rate. If set to 0.3, 30% of the new population will be mutated.
   * @param {number} [options.mutationAmount=1] If mutation occurs (randomNumber < mutationRate), sets amount of times a mutation method will be applied to the network.
   * @param {boolean} [options.fitnessPopulation=true] Flag to return the fitness of a population of genomes. false => evaluate each genome individually. true => evaluate entire population. Adjust fitness function accordingly
   * @param {Function} [options.fitness] - A fitness function to evaluate the networks. Takes a `genome`, i.e. a [network](Network), and a `dataset` and sets the genome's score property
   * @param {string} [options.selection=new FitnessProportionateSelection()] [Selection method](selection) for evolution (e.g. methods.Selection.FITNESS_PROPORTIONATE).
   * @param {Array} [options.crossover] Sets allowed crossover methods for evolution.
   * @param {Array} [options.mutation] Sets allowed [mutation methods](mutation) for evolution, a random mutation method will be chosen from the array when mutation occurs. Optional, but default methods are non-recurrent.
   * @param {number} [options.maxNodes=Infinity] Maximum nodes for a potential network
   * @param {number} [options.maxConnections=Infinity] Maximum connections for a potential network
   * @param {number} [options.maxGates=Infinity] Maximum gates for a potential network
   * @param {function} [options.mutationSelection=random] Custom mutation selection function if given
   * @param {boolean} [options.efficientMutation=false] Test & reduce [mutation methods](mutation) to avoid failed mutation attempts
   *
   * @returns {{error:{number},iterations:{number},time:{number}}} A summary object of the network's performance. <br /> Properties include: `error` - error of the best genome, `iterations` - generations used to evolve networks, `time` - clock time elapsed while evolving
   *
   * @example
   * let { Network, methods } = require("@liquid-carrot/carrot");
   *
   * async function execute () {
   *    var network = new Network(2,1);
   *
   *    // XOR dataset
   *    var trainingSet = [
   *        { input: [0,0], output: [0] },
   *        { input: [0,1], output: [1] },
   *        { input: [1,0], output: [1] },
   *        { input: [1,1], output: [0] }
   *    ];
   *
   *    await network.evolve(trainingSet, {
   *        mutation: methods.mutation.FFW,
   *        equal: true,
   *        error: 0.05,
   *        elitism: 5,
   *        mutationRate: 0.5
   *    });
   *
   *    // another option
   *    // await network.evolve(trainingSet, {
   *    //     mutation: methods.mutation.FFW,
   *    //     equal: true,
   *    //     error: 0.05,
   *    //     elitism: 5,
   *    //     mutationRate: 0.5,
   *    //     loss: (targets, outputs) => {
   *    //       const error = outputs.reduce(function(total, value, index) {
   *    //         return total += Math.pow(targets[index] - outputs[index], 2);
   *    //       }, 0);
   *    //
   *    //       return error / outputs.length;
   *    //     }
   *    // });
   *
   *
   *    network.activate([0,0]); // 0.2413
   *    network.activate([0,1]); // 1.0000
   *    network.activate([1,0]); // 0.7663
   *    network.activate([1,1]); // -0.008
   * }
   *
   * execute();
   */


  Network.prototype.evolve = function (dataset, options) {
    if (options === void 0) {
      options = {};
    }

    var _a, _b, _c, _d;

    return __awaiter(this, void 0, void 0, function () {
      var targetError, start, serializedDataSet, workerPool, neat, error, bestFitness, bestGenome, fittest, fitness;
      return __generator(this, function (_e) {
        switch (_e.label) {
          case 0:
            if (dataset[0].input.length !== this.inputSize || dataset[0].output.length !== this.outputSize) {
              throw new Error("Dataset input/output size should be same as network input/output size!");
            }

            targetError = 0;

            if (typeof options.iterations === "undefined" && typeof options.error === "undefined") {
              options.iterations = 1000;
              targetError = 0.05;
            } else if (options.iterations) {
              targetError = -1; // run until iterations
            } else if (options.error) {
              targetError = options.error;
              options.iterations = 0; // run until error
            } // set options to default if necessary


            options.growth = Utils_1.getOrDefault(options.growth, 0.0001);
            options.loss = Utils_1.getOrDefault(options.loss, new Loss_1.MSELoss());
            options.amount = Utils_1.getOrDefault(options.amount, 1);
            options.maxNodes = Utils_1.getOrDefault(options.maxNodes, Infinity);
            options.maxConnections = Utils_1.getOrDefault(options.maxConnections, Infinity);
            options.maxGates = Utils_1.getOrDefault(options.maxGates, Infinity);
            options.threads = Utils_1.getOrDefault(options.threads, 4);
            start = Date.now();
            serializedDataSet = JSON.stringify(dataset);

            if (!options.fitnessFunction) {
              // if no fitness function is given
              // create default one
              // init a pool of workers
              workerPool = threads_1.Pool(function () {
                return threads_1.spawn(new threads_1.Worker("../multithreading/Worker"));
              }, options.threads);

              options.fitnessFunction = function (dataset, population) {
                return __awaiter(this, void 0, void 0, function () {
                  var _loop_1, _i, population_1, genome;

                  var _this = this;

                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        _loop_1 = function _loop_1(genome) {
                          // add a task to the workerPool's queue
                          // TODO: should not ignore this
                          // @ts-ignore
                          workerPool.queue(function (test) {
                            return __awaiter(_this, void 0, void 0, function () {
                              var _a;

                              var _b, _c;

                              return __generator(this, function (_d) {
                                switch (_d.label) {
                                  case 0:
                                    if (genome === undefined) {
                                      return [2
                                      /*return*/
                                      ];
                                    } // test the genome


                                    _a = genome;
                                    return [4
                                    /*yield*/
                                    , test(serializedDataSet, JSON.stringify(genome.toJSON()), Loss_1.ALL_LOSSES.indexOf((_b = options.loss) !== null && _b !== void 0 ? _b : new Loss_1.MSELoss()))];

                                  case 1:
                                    // test the genome
                                    _a.score = -_d.sent();

                                    if (genome.score === undefined) {
                                      genome.score = -Infinity;
                                      return [2
                                      /*return*/
                                      ];
                                    } // subtract growth value


                                    genome.score -= ((_c = options.growth) !== null && _c !== void 0 ? _c : 0.0001) * (genome.nodes.length - genome.inputSize - genome.outputSize + genome.connections.length + genome.gates.length);
                                    return [2
                                    /*return*/
                                    ];
                                }
                              });
                            });
                          });
                        };

                        for (_i = 0, population_1 = population; _i < population_1.length; _i++) {
                          genome = population_1[_i];

                          _loop_1(genome);
                        }

                        return [4
                        /*yield*/
                        , workerPool.settled()];

                      case 1:
                        _a.sent(); // wait until every task is done


                        return [2
                        /*return*/
                        ];
                    }
                  });
                });
              };
            }

            options.template = this; // set this network as template for first generation

            neat = new NEAT_1.NEAT(dataset, options);
            error = -Infinity;
            bestFitness = -Infinity;
            _e.label = 1;

          case 1:
            if (!(error < -targetError && (options.iterations === 0 || neat.generation < ((_a = options.iterations) !== null && _a !== void 0 ? _a : 0)))) return [3
            /*break*/
            , 3];
            return [4
            /*yield*/
            , neat.evolve()];

          case 2:
            fittest = _e.sent();
            fitness = (_b = fittest.score) !== null && _b !== void 0 ? _b : -Infinity; // add the growth value back to get the real error

            error = fitness + options.growth * (fittest.nodes.length - fittest.inputSize - fittest.outputSize + fittest.connections.length + fittest.gates.length);

            if (fitness > bestFitness) {
              bestFitness = fitness;
              bestGenome = fittest;
            }

            if (((_c = options.log) !== null && _c !== void 0 ? _c : 0) > 0 && neat.generation % ((_d = options.log) !== null && _d !== void 0 ? _d : 0) === 0) {
              console.log("iteration", neat.generation, "fitness", fitness, "error", -error);
            }

            if (options.schedule && neat.generation % options.schedule.iterations === 0) {
              options.schedule.function(fitness, -error, neat.generation);
            }

            return [3
            /*break*/
            , 1];

          case 3:
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
              workerPool.terminate(); // stop all processes
            }

            return [2
            /*return*/
            , {
              error: -error,
              iterations: neat.generation,
              time: Date.now() - start
            }];
        }
      });
    });
  };

  return Network;
}();

exports.Network = Network;
},{"./Connection":"../src/architecture/Connection.js","../methods/Utils":"../src/methods/Utils.js","../methods/Mutation":"../src/methods/Mutation.js","../methods/Loss":"../src/methods/Loss.js","../methods/Rate":"../src/methods/Rate.js","../NEAT":"../src/NEAT.js","threads":"../../node_modules/threads/dist-esm/index.js","threads/register":"../../node_modules/threads/register.js","../enums/NodeType":"../src/enums/NodeType.js","./Node":"../src/architecture/Node.js"}],"../src/architecture/Architect.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer_1 = require("./Layers/Layer");

var InputLayer_1 = require("./Layers/CoreLayers/InputLayer");

var Network_1 = require("./Network");

var OutputLayer_1 = require("./Layers/CoreLayers/OutputLayer");

var Architect =
/** @class */
function () {
  function Architect() {
    this.layers = [];
  }

  Architect.prototype.addLayer = function (layer, incomingConnectionType) {
    var connectionType = incomingConnectionType !== null && incomingConnectionType !== void 0 ? incomingConnectionType : layer.getDefaultIncomingConnectionType();

    if (!layer.connectionTypeisAllowed(connectionType)) {
      throw new ReferenceError("Connection type " + connectionType + " is not allowed at layer " + layer.constructor.name);
    }

    this.layers.push({
      layer: layer,
      incomingConnectionType: connectionType
    });
    return this; // function as builder class
  };

  Architect.prototype.buildModel = function () {
    var _a, _b, _c, _d, _e;

    if (!(this.layers[0].layer instanceof InputLayer_1.InputLayer)) {
      throw new ReferenceError("First layer has to be a InputLayer! Currently is: " + this.layers[0].layer.constructor.name);
    }

    if (!(this.layers[this.layers.length - 1].layer instanceof OutputLayer_1.OutputLayer)) {
      throw new ReferenceError("Last layer has to be a OutputLayer! Currently is: " + this.layers[this.layers.length - 1].layer.constructor.name);
    }

    var inputSize = this.layers[0].layer.nodes.length;
    var outputSize = this.layers[this.layers.length - 1].layer.nodes.length;
    var network = new Network_1.Network(inputSize, outputSize);
    network.nodes = [];
    network.connections = [];

    for (var i = 0; i < this.layers.length - 1; i++) {
      (_a = network.connections).push.apply(_a, Layer_1.Layer.connect(this.layers[i].layer, this.layers[i + 1].layer, this.layers[i + 1].incomingConnectionType));

      (_b = network.nodes).push.apply(_b, this.layers[i].layer.nodes);

      (_c = network.connections).push.apply(_c, this.layers[i].layer.connections);

      (_d = network.gates).push.apply(_d, this.layers[i].layer.gates);
    }

    (_e = network.nodes).push.apply(_e, this.layers[this.layers.length - 1].layer.nodes);

    return network;
  };

  return Architect;
}();

exports.Architect = Architect;
},{"./Layers/Layer":"../src/architecture/Layers/Layer.js","./Layers/CoreLayers/InputLayer":"../src/architecture/Layers/CoreLayers/InputLayer.js","./Network":"../src/architecture/Network.js","./Layers/CoreLayers/OutputLayer":"../src/architecture/Layers/CoreLayers/OutputLayer.js"}],"index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DenseLayer_1 = require("../src/architecture/Layers/CoreLayers/DenseLayer");

exports.DenseLayer = DenseLayer_1.DenseLayer;

var Node_1 = require("../src/architecture/Node");

exports.Node = Node_1.Node;

var DropoutLayer_1 = require("../src/architecture/Layers/CoreLayers/DropoutLayer");

exports.DropoutLayer = DropoutLayer_1.DropoutLayer;

var NoiseLayer_1 = require("../src/architecture/Layers/NoiseLayers/NoiseLayer");

exports.NoiseLayer = NoiseLayer_1.NoiseLayer;

var OutputLayer_1 = require("../src/architecture/Layers/CoreLayers/OutputLayer");

exports.OutputLayer = OutputLayer_1.OutputLayer;

var InputLayer_1 = require("../src/architecture/Layers/CoreLayers/InputLayer");

exports.InputLayer = InputLayer_1.InputLayer;

var AvgPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/AvgPooling1DLayer");

exports.AvgPooling1DLayer = AvgPooling1DLayer_1.AvgPooling1DLayer;

var MinPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/MinPooling1DLayer");

exports.MinPooling1DLayer = MinPooling1DLayer_1.MinPooling1DLayer;

var MaxPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/MaxPooling1DLayer");

exports.MaxPooling1DLayer = MaxPooling1DLayer_1.MaxPooling1DLayer;

var GlobalAvgPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/GlobalAvgPooling1DLayer");

exports.GlobalAvgPooling1DLayer = GlobalAvgPooling1DLayer_1.GlobalAvgPooling1DLayer;

var GlobalMaxPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/GlobalMaxPooling1DLayer");

exports.GlobalMaxPooling1DLayer = GlobalMaxPooling1DLayer_1.GlobalMaxPooling1DLayer;

var GlobalMinPooling1DLayer_1 = require("../src/architecture/Layers/PoolingLayers/GlobalMinPooling1DLayer");

exports.GlobalMinPooling1DLayer = GlobalMinPooling1DLayer_1.GlobalMinPooling1DLayer;

var PoolingLayer_1 = require("../src/architecture/Layers/PoolingLayers/PoolingLayer");

exports.PoolingLayer = PoolingLayer_1.PoolingLayer;

var GRULayer_1 = require("../src/architecture/Layers/RecurrentLayers/GRULayer");

exports.GRULayer = GRULayer_1.GRULayer;

var LSTMLayer_1 = require("../src/architecture/Layers/RecurrentLayers/LSTMLayer");

exports.LSTMLayer = LSTMLayer_1.LSTMLayer;

var MemoryLayer_1 = require("../src/architecture/Layers/RecurrentLayers/MemoryLayer");

exports.MemoryLayer = MemoryLayer_1.MemoryLayer;

var Layer_1 = require("../src/architecture/Layers/Layer");

exports.Layer = Layer_1.Layer;

var ConstantNode_1 = require("../src/architecture/Nodes/ConstantNode");

exports.ConstantNode = ConstantNode_1.ConstantNode;

var DropoutNode_1 = require("../src/architecture/Nodes/DropoutNode");

exports.DropoutNode = DropoutNode_1.DropoutNode;

var NoiseNode_1 = require("../src/architecture/Nodes/NoiseNode");

exports.NoiseNode = NoiseNode_1.NoiseNode;

var PoolNode_1 = require("../src/architecture/Nodes/PoolNode");

exports.PoolNode = PoolNode_1.PoolNode;

var Architect_1 = require("../src/architecture/Architect");

exports.Architect = Architect_1.Architect;

var Connection_1 = require("../src/architecture/Connection");

exports.Connection = Connection_1.Connection;

var Network_1 = require("../src/architecture/Network");

exports.Network = Network_1.Network;

var ActivationType_1 = require("../src/enums/ActivationType");

exports.ActivationType = ActivationType_1.ActivationType;

var ConnectionType_1 = require("../src/enums/ConnectionType");

exports.ConnectionType = ConnectionType_1.ConnectionType;

var GatingType_1 = require("../src/enums/GatingType");

exports.GatingType = GatingType_1.GatingType;

var NodeType_1 = require("../src/enums/NodeType");

exports.NodeType = NodeType_1.NodeType;
exports.NoiseNodeType = NodeType_1.NoiseNodeType;
exports.PoolNodeType = NodeType_1.PoolNodeType;

var Activation_1 = require("../src/methods/Activation");

exports.AbsoluteActivation = Activation_1.AbsoluteActivation;
exports.Activation = Activation_1.Activation;
exports.ALL_ACTIVATIONS = Activation_1.ALL_ACTIVATIONS;
exports.BentIdentityActivation = Activation_1.BentIdentityActivation;
exports.BipolarActivation = Activation_1.BipolarActivation;
exports.BipolarSigmoidActivation = Activation_1.BipolarSigmoidActivation;
exports.GaussianActivation = Activation_1.GaussianActivation;
exports.HardTanhActivation = Activation_1.HardTanhActivation;
exports.IdentityActivation = Activation_1.IdentityActivation;
exports.InverseActivation = Activation_1.InverseActivation;
exports.LogisticActivation = Activation_1.LogisticActivation;
exports.RELUActivation = Activation_1.RELUActivation;
exports.SELUActivation = Activation_1.SELUActivation;
exports.SinusoidActivation = Activation_1.SinusoidActivation;
exports.SoftSignActivation = Activation_1.SoftSignActivation;
exports.StepActivation = Activation_1.StepActivation;
exports.TanhActivation = Activation_1.TanhActivation;

var Loss_1 = require("../src/methods/Loss");

exports.ALL_LOSSES = Loss_1.ALL_LOSSES;
exports.BinaryLoss = Loss_1.BinaryLoss;
exports.CrossEntropyLoss = Loss_1.CrossEntropyLoss;
exports.HINGELoss = Loss_1.HINGELoss;
exports.Loss = Loss_1.Loss;
exports.MAELoss = Loss_1.MAELoss;
exports.MAPELoss = Loss_1.MAPELoss;
exports.MSELoss = Loss_1.MSELoss;
exports.MSLELoss = Loss_1.MSLELoss;
exports.WAPELoss = Loss_1.WAPELoss;

var Mutation_1 = require("../src/methods/Mutation");

exports.AddBackConnectionMutation = Mutation_1.AddBackConnectionMutation;
exports.AddConnectionMutation = Mutation_1.AddConnectionMutation;
exports.AddGateMutation = Mutation_1.AddGateMutation;
exports.AddNodeMutation = Mutation_1.AddNodeMutation;
exports.AddSelfConnectionMutation = Mutation_1.AddSelfConnectionMutation;
exports.ALL_MUTATIONS = Mutation_1.ALL_MUTATIONS;
exports.FEEDFORWARD_MUTATIONS = Mutation_1.FEEDFORWARD_MUTATIONS;
exports.ModActivationMutation = Mutation_1.ModActivationMutation;
exports.ModBiasMutation = Mutation_1.ModBiasMutation;
exports.ModWeightMutation = Mutation_1.ModWeightMutation;
exports.Mutation = Mutation_1.Mutation;
exports.NO_STRUCTURE_MUTATIONS = Mutation_1.NO_STRUCTURE_MUTATIONS;
exports.ONLY_STRUCTURE = Mutation_1.ONLY_STRUCTURE;
exports.SubBackConnectionMutation = Mutation_1.SubBackConnectionMutation;
exports.SubConnectionMutation = Mutation_1.SubConnectionMutation;
exports.SubGateMutation = Mutation_1.SubGateMutation;
exports.SubNodeMutation = Mutation_1.SubNodeMutation;
exports.SubSelfConnectionMutation = Mutation_1.SubSelfConnectionMutation;
exports.SwapNodesMutation = Mutation_1.SwapNodesMutation;

var Rate_1 = require("../src/methods/Rate");

exports.ExponentialRate = Rate_1.ExponentialRate;
exports.FixedRate = Rate_1.FixedRate;
exports.InverseRate = Rate_1.InverseRate;
exports.Rate = Rate_1.Rate;
exports.StepRate = Rate_1.StepRate;

var Selection_1 = require("../src/methods/Selection");

exports.FitnessProportionateSelection = Selection_1.FitnessProportionateSelection;
exports.PowerSelection = Selection_1.PowerSelection;
exports.Selection = Selection_1.Selection;
exports.TournamentSelection = Selection_1.TournamentSelection;

var Utils_1 = require("../src/methods/Utils");

exports.avg = Utils_1.avg;
exports.generateGaussian = Utils_1.generateGaussian;
exports.getOrDefault = Utils_1.getOrDefault;
exports.max = Utils_1.max;
exports.maxValueIndex = Utils_1.maxValueIndex;
exports.min = Utils_1.min;
exports.minValueIndex = Utils_1.minValueIndex;
exports.pickRandom = Utils_1.pickRandom;
exports.randBoolean = Utils_1.randBoolean;
exports.randDouble = Utils_1.randDouble;
exports.randInt = Utils_1.randInt;
exports.removeFromArray = Utils_1.removeFromArray;
exports.shuffle = Utils_1.shuffle;
exports.sum = Utils_1.sum;
},{"../src/architecture/Layers/CoreLayers/DenseLayer":"../src/architecture/Layers/CoreLayers/DenseLayer.js","../src/architecture/Node":"../src/architecture/Node.js","../src/architecture/Layers/CoreLayers/DropoutLayer":"../src/architecture/Layers/CoreLayers/DropoutLayer.js","../src/architecture/Layers/NoiseLayers/NoiseLayer":"../src/architecture/Layers/NoiseLayers/NoiseLayer.js","../src/architecture/Layers/CoreLayers/OutputLayer":"../src/architecture/Layers/CoreLayers/OutputLayer.js","../src/architecture/Layers/CoreLayers/InputLayer":"../src/architecture/Layers/CoreLayers/InputLayer.js","../src/architecture/Layers/PoolingLayers/AvgPooling1DLayer":"../src/architecture/Layers/PoolingLayers/AvgPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/MinPooling1DLayer":"../src/architecture/Layers/PoolingLayers/MinPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/MaxPooling1DLayer":"../src/architecture/Layers/PoolingLayers/MaxPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/GlobalAvgPooling1DLayer":"../src/architecture/Layers/PoolingLayers/GlobalAvgPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/GlobalMaxPooling1DLayer":"../src/architecture/Layers/PoolingLayers/GlobalMaxPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/GlobalMinPooling1DLayer":"../src/architecture/Layers/PoolingLayers/GlobalMinPooling1DLayer.js","../src/architecture/Layers/PoolingLayers/PoolingLayer":"../src/architecture/Layers/PoolingLayers/PoolingLayer.js","../src/architecture/Layers/RecurrentLayers/GRULayer":"../src/architecture/Layers/RecurrentLayers/GRULayer.js","../src/architecture/Layers/RecurrentLayers/LSTMLayer":"../src/architecture/Layers/RecurrentLayers/LSTMLayer.js","../src/architecture/Layers/RecurrentLayers/MemoryLayer":"../src/architecture/Layers/RecurrentLayers/MemoryLayer.js","../src/architecture/Layers/Layer":"../src/architecture/Layers/Layer.js","../src/architecture/Nodes/ConstantNode":"../src/architecture/Nodes/ConstantNode.js","../src/architecture/Nodes/DropoutNode":"../src/architecture/Nodes/DropoutNode.js","../src/architecture/Nodes/NoiseNode":"../src/architecture/Nodes/NoiseNode.js","../src/architecture/Nodes/PoolNode":"../src/architecture/Nodes/PoolNode.js","../src/architecture/Architect":"../src/architecture/Architect.js","../src/architecture/Connection":"../src/architecture/Connection.js","../src/architecture/Network":"../src/architecture/Network.js","../src/enums/ActivationType":"../src/enums/ActivationType.js","../src/enums/ConnectionType":"../src/enums/ConnectionType.js","../src/enums/GatingType":"../src/enums/GatingType.js","../src/enums/NodeType":"../src/enums/NodeType.js","../src/methods/Activation":"../src/methods/Activation.js","../src/methods/Loss":"../src/methods/Loss.js","../src/methods/Mutation":"../src/methods/Mutation.js","../src/methods/Rate":"../src/methods/Rate.js","../src/methods/Selection":"../src/methods/Selection.js","../src/methods/Utils":"../src/methods/Utils.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65396" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], "carrot")
//# sourceMappingURL=/index.browser.js.map