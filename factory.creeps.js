

module.exports = () => {
    return {
        // getBalancedBodyParts(energy) {
        //     let bodyParts = [];
        //     let tmpEnergy = energy;
        //
        //     if (tmpEnergy >= 200) {
        //         while(tmpEnergy >= 51) {
        //             if (tmpEnergy >= BODYPART_COST.move) {
        //                 bodyParts.push(WORK);
        //                 tmpEnergy -= BODYPART_COST.move;
        //             }
        //
        //             if (tmpEnergy >= BODYPART_COST.carry) {
        //                 bodyParts.push(CARRY);
        //                 tmpEnergy -= BODYPART_COST.carry
        //             }
        //
        //             if (tmpEnergy >= BODYPART_COST.move) {
        //                 bodyParts.push(MOVE);
        //                 tmpEnergy -= BODYPART_COST.move;
        //             }
        //             console.log([bodyParts, tmpEnergy]);
        //         }
        //     } else {
        //         bodyParts = [WORK, WORK, MOVE, CARRY];
        //     }
        //
        //     return bodyParts;
        // },

        getAvailableEnergy() {
            return Game.spawns['spawn01'].room.energyAvailable;
        },

        workerCreep() {
            return Game.spawns['spawn01'].createCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {
                role: 'worker',
            });
        },

        harvesterCreep() {
            return Game.spawns['spawn01'].createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], null, {
                role: 'harvester',
            });
        },

        maintenanceCreep() {
            return Game.spawns['spawn01'].createCreep([WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {
                role: 'maintenance',
            });
        },

        remoteHarvesterCreep() {
            return Game.spawns['spawn01'].createCreep([WORK, CARRY, CARRY, MOVE, MOVE, MOVE], null, {
                role: 'remoteHarvester',
            });
        },

        wallUpgraderCreep() {
            return Game.spawns['spawn01'].createCreep([WORK, CARRY, MOVE], null, {
                role: 'wallUpgrader'
            });
        }
    }
};