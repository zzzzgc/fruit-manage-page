/**
 * Created by Administrator on 2017/5/9.
 */
//import {getGames} from './utils'
//import {split, splitGame} from './const'

export let gamesMixin = { // 用法 在页面中 import {gamesMixin} from '../../common/mixins.js'
  data: function () {
    return {
      allGamesStr: ''
    }
  },
  created: function () {
    this.getGames()
  },
  methods: {
    getGames: function () { // 获取所有游戏
      // this.gameList = JSON.parse(sessionStorage.getItem('games')) // 从sessionStorage取出字符串
      // let gameList = sessionStorage.getItem('games') // 从sessionStorage取出字符串
      if (sessionStorage.getItem('games') !== null) {
        this.allGamesStr = sessionStorage.getItem('games')
        return
      }
      this.$http.post('/manage/common/getGames', {}).then((response) => {
        if (sessionStorage.getItem('games') !== null) {
          this.allGamesStr = sessionStorage.getItem('games')
          return
        }
        let gamesList = response.data || []
        let gameStr = ''
        for (let i in gamesList) {
          let game = gamesList[i].gameId + splitGame + gamesList[i].gameName
          gameStr = gameStr + (game + split)
        }
        sessionStorage.setItem('games', gameStr) // 因为在sessionStorage中只能放字符串
        this.allGamesStr = gameStr
      })
    },
    remoteMethod: function (query) { // 从游戏库中匹配用户输入的游戏
      let games = []
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          getGames(this.allGamesStr, (id, name) => {
            if (name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              games.push({gameId: id, gameName: name})
            }
            if (games.length > 100) {
              return false
            }
          })
          this.games = games
          this.loading = false
        }, 200)
      } else {
        this.games = []
      }
    }
  }
}
export var gamesByGameIdMixin = {
  methods: {
    getGamesByGameId: function (gameId) {
      // let gameStr = sessionStorage.getItem('games')
      this.games = []
      if (gameId === null) {
        return
      }
      getGames(this.allGamesStr, (id, name) => {
        if (gameId instanceof Array) {
          let gameIds = gameId
          for (let gameId of gameIds) {
            if (gameId === id) {
              this.games.push({gameId: id, gameName: name})
            }
          }
          if (this.games.length === gameIds.length) {
            return false
          }
        } else {
          if (id === gameId) {
            this.games.push({gameId: id, gameName: name})
            return false
          }
        }
      })
    }
  }
}

