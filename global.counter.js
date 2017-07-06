module.exports = () => {
    return {
        data: {},

        refreshData() {
            this.data = {};

            Object.keys(Game.creeps).forEach((creepName) => {
                let creep = Game.creeps[creepName];
                this.addToCount(creep);
            });

            return this;
        },

        addToCount(creep) {
            // Keep a rolling total of the number of creeps so we can create after the primary loop
            if (!this.data.hasOwnProperty(creep.memory.role)) {
                this.data[creep.memory.role] = 1;
            } else {
                this.data[creep.memory.role] += 1;
            }

        },

        getCounts() {
            return this.data;
        },

        getTypeCount(type) {
            if (this.data.hasOwnProperty(type)) {
                return this.data[type];
            } else {
                return 0;
            }
        },
    }
};


