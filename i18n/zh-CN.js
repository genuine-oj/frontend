import zhHans from 'vuetify/lib/locale/zh-Hans'

export default {
  $vuetify: zhHans,
  submit: '提交',
  confirm: '确认',
  cancel: '取消',
  save: '保存',
  pages: {
    home: '主页',
    contests: '比赛',
    problems: '题目',
    submissions: '提交'
  },
  problems: {
    title: '标题',
    acRate: 'AC 率'
  },
  problem: {
    problemList: '题目列表',
    problemDetail: '题目详情',
    problemEdit: '编辑题目',
    problemDescription: '题目描述',
    inputFormat: '输入格式',
    outputFormat: '输出格式',
    samples: '样例',
    input: '输入{id}',
    output: '输出{id}',
    hint: '提示',
    timeLimit: '时间限制',
    memoryLimit: '内存限制',
    acceptedNumber: '通过次数',
    submittedNumber: '提交次数',
    mySubmissions: '我的提交',
    codeReplacementConfirm: '当前编辑器中已有代码，继续上传将替换现有代码，是否确认上传？',
    sampleRemoveConfirm: '是否删除该样例？该操作无法撤销！',
    selectLanguage: '请选择语言',
    loadCodeFile: '加载代码文件',
    submitCode: '提交代码',
    editCode: '编辑代码',
    showProblem: '显示题目',
    judgeSettings: '评测配置'
  },
  problemEdit: {
    saveSuccess: '保存成功',
    saveFailed: '保存失败'
  },
  problemData: {
    score: '{score}分',
    updateSuccess: '保存成功'
  },
  submission: {
    problem: '题目',
    submitter: '提交者',
    status: '状态',
    score: '得分',
    used_time: '用时',
    memory: '内存',
    solution: '解答',
    submit_time: '提交时间'
  },
  judgeStatus: {
    pending: '等待中',
    judging: '正在评测',
    ce: '编译错误',
    wa: '答案错误',
    ac: '通过',
    tle: '时间超限',
    mle: '内存超限',
    re: '运行时错误',
    se: '系统错误'
  }
}
