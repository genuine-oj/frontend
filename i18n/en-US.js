import en from 'vuetify/lib/locale/en'

export default {
  $vuetify: en,
  submit: 'Submit',
  confirm: 'Confirm',
  cancel: 'Cancel',
  save: 'Save',
  pages: {
    home: 'Home',
    contests: 'Contests',
    problems: 'Problems',
    submissions: 'Submissions'
  },
  problems: {
    title: 'Title',
    acRate: 'AC Rate'
  },
  problem: {
    problemList: 'Problem List',
    problemDetail: 'Problem Detail',
    problemEdit: 'Edit',
    problemDescription: 'Problem Description',
    inputFormat: 'Input Format',
    outputFormat: 'Output Format',
    samples: 'Samples',
    input: 'Input {id}',
    output: 'Output {id}',
    hint: 'Hint',
    timeLimit: 'Time Limit',
    memoryLimit: 'Memory Limit',
    acceptedNumber: 'Accepted Number',
    submittedNumber: 'Submitted Number',
    mySubmissions: 'My Submissions',
    codeReplacementConfirm: 'The code editor isn\'t empty, ' +
      'uploading code file will replace current codes, ' +
      'do you confirm to proceed?',
    sampleRemoveConfirm: 'Are you to remove this sample, ' +
      'this operation is irreverable',
    selectLanguage: 'Select Language',
    loadCodeFile: 'Load From File',
    submitCode: 'Submit',
    editCode: 'Edit Code',
    showProblem: 'Show Problem',
    judgeSettings: 'Settings'
  },
  problemEdit: {
    saveSuccess: 'Saved',
    saveFailed: 'Save Failed'
  },
  problemData: {
    score: 'Score: {score}',
    updateSuccess: 'Update Success'
  },
  submission: {
    problem: 'Problem',
    submitter: 'Submitter',
    status: 'Status',
    score: 'Score',
    used_time: 'Time',
    memory: 'Memory',
    solution: 'Solution',
    submit_time: 'Submit Time'
  },
  judgeStatus: {
    pending: 'Pending',
    judging: 'Judging',
    ce: 'Compile Error',
    wa: 'Wrong Answer',
    ac: 'Accepted',
    tle: 'Time Limit Exceeded',
    mle: 'Memory Limit Exceeded',
    re: 'Runtime Error',
    se: 'System Error'
  }
}
