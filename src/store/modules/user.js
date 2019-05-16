const user = {
    state: {
        roles: [],
        perms: [],
    },

    mutations: {
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },

        SET_PERMS: (state, perms) => {
            state.perms = perms
        },
    },

    actions: {
        // 存储角色
        setRoles({commit}, roleList) {
            commit('SET_ROLES', roleList)
        },

        // 存储权限
        setPerms({commit}, permList) {
            commit('SET_PERMS', permList)
        }
    }
};

export default user;