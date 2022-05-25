import Vue from 'vue'
import md5 from 'crypto-js/md5'

const avatar = {
  get(email) {
    const hash = md5(email.trim().toLowerCase())
    return `https://cravatar.cn/avatar/${hash}`
  }
}

const judgeStatus = {
  PENDING: -4,
  JUDGING: -3,
  COMPILE_ERROR: -2,
  WRONG_ANSWER: -1,
  ACCEPTED: 0,
  TIME_LIMIT_EXCEEDED: 1,
  MEMORY_LIMIT_EXCEEDED: 2,
  RUNTIME_ERROR: 3,
  SYSTEM_ERROR: 4
}


const judgeStatusDisplay = {
  PENDING: 'judgeStatus.pending',
  JUDGING: 'judgeStatus.judging',
  COMPILE_ERROR: 'judgeStatus.ce',
  WRONG_ANSWER: 'judgeStatus.wa',
  ACCEPTED: 'judgeStatus.ac',
  TIME_LIMIT_EXCEEDED: 'judgeStatus.tle',
  MEMORY_LIMIT_EXCEEDED: 'judgeStatus.mle',
  RUNTIME_ERROR: 'judgeStatus.re',
  SYSTEM_ERROR: 'judgeStatus.se'
}

const languages = {
  C: 'c',
  CPP: 'cpp'
}


const languagesDisplay = {
  C: 'C',
  CPP: 'C++'
}

const initDisplay = (obj, objDisplay) => {
  const displays = {}
  for (const key in obj) {
    displays[obj[key]] = objDisplay[key]
  }
  obj.getDisplay = value => displays[value]
}

initDisplay(judgeStatus, judgeStatusDisplay)
initDisplay(languages, languagesDisplay)

const parseSize = value => { // Parse bytes to readable format
  let size
  if (value < 0.1 * 1024)
    size = value.toFixed(2) + ' B'
  else if (value < 0.1 * 1024 * 1024)
    size = (value / 1024).toFixed(2) + ' KB'
  else if (value < 0.1 * 1024 * 1024 * 1024)
    size = (value / (1024 * 1024)).toFixed(2) + ' MB'
  else
    size = (value / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  const sizeStr = size + ''
  const index = sizeStr.indexOf('.')
  const dou = sizeStr.substr(index + 1, 2)
  if (dou === '00') return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  return size
}

const utils = {
  misc: {
    avatar,
    parseSize
  },
  codeJudge: {
    judgeStatus,
    languages
  }
}

Vue.prototype.$utils = utils
