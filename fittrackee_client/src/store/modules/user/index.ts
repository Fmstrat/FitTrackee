import { Module } from 'vuex'

import { IRootState } from '@/store/modules/root/interfaces'
import { actions } from '@/store/modules/user/actions'
import { getters } from '@/store/modules/user/getters'
import { IUserState } from '@/store/modules/user/interfaces'
import { mutations } from '@/store/modules/user/mutations'
import { userState } from '@/store/modules/user/state.ts'

const user: Module<IUserState, IRootState> = {
  state: userState,
  actions,
  getters,
  mutations,
}

export default user
