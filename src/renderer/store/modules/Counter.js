const state = {
  main: 0,
  playted: {
    play: false,
    url: '',
  },
  pragram: {
    input: "",
    filter: "",
    type: "",
    page: 1,
    size:15
  },
  playlist:[]
};

const mutations = {
  update(state, pragram) {
    state.pragram = pragram;
  },
  updatelist(state, list) {
    state.playlist = list;
  },
  playstatus(state,pragram){
    state.playted.url = pragram.url
    state.playted.play = pragram.play;
  }
};

const actions = {
  // addupadte({commit}){
  //   commit("update", pragram);
  // }
}

export default {
  state,
  mutations,
  actions
}
