"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Species = void 0;
var TimSort = __importStar(require("timsort"));
var NEAT_1 = require("../NEAT");
var Utils_1 = require("../utils/Utils");
var Network_1 = require("./Network");
/**
 * A class holding a species
 */
var Species = /** @class */ (function () {
    function Species(representative) {
        this.representative = representative;
        this.representative.species = this;
        this.members = new Set();
        this.members.add(representative);
        this.score = 0;
    }
    /**
     * Puts a network to the species, after checking the distance
     * @param network
     */
    Species.prototype.put = function (network) {
        if (network.distance(this.representative) < NEAT_1.NEAT.SPECIES_DISTANCE_THRESHOLD) {
            this.forcePut(network);
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Puts a network to the species without checking the distance
     * @param network
     */
    Species.prototype.forcePut = function (network) {
        if (network === undefined) {
            return;
        }
        this.members.add(network);
        network.species = this;
    };
    /**
     * Calculate the score of this species
     */
    Species.prototype.evaluateScore = function () {
        var sum = 0;
        this.members.forEach(function (network) { var _a; return sum += (_a = network.score) !== null && _a !== void 0 ? _a : 0; });
        this.score = sum / this.members.size;
    };
    /**
     * Reset this object
     */
    Species.prototype.reset = function () {
        this.representative = Utils_1.pickRandom(this.members);
        this.members.forEach(function (genome) { return genome.species = null; });
        this.members.clear();
        this.members.add(this.representative);
        this.representative.species = this;
        this.score = 0;
    };
    /**
     * Kill a specific percentage of networks
     * @param percentage
     */
    Species.prototype.kill = function (percentage) {
        var arr = Array.from(this.members);
        TimSort.sort(arr, function (a, b) {
            return a.score === undefined || b.score === undefined ? 0 : a.score - b.score;
        });
        var amount = Math.floor(percentage * this.members.size);
        for (var i = 0; i < amount; i++) {
            this.members.delete(arr[i]);
            arr[i].species = null;
        }
    };
    /**
     * Create offspring
     */
    Species.prototype.breed = function () {
        return Network_1.Network.crossOver(Utils_1.pickRandom(this.members), Utils_1.pickRandom(this.members));
    };
    /**
     * The size of this species
     */
    Species.prototype.size = function () {
        return this.members.size;
    };
    /**
     * Returns the best genome from this species
     */
    Species.prototype.getBest = function () {
        var networks = Array.from(this.members);
        return networks[Utils_1.maxValueIndex(networks.map(function (genome) { var _a; return (_a = genome.score) !== null && _a !== void 0 ? _a : -Infinity; }))];
    };
    return Species;
}());
exports.Species = Species;
