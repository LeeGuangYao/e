const zh = {
  common: {
    confirm: "确认",
    cancel: "取消",
    save: "保存",
    delete: "删除",
    edit: "编辑",
    search: "搜索",
    reset: "重置",
    loading: "加载中...",
    noData: "暂无数据",
    success: "操作成功",
    failed: "操作失败",
    required: "此项为必填",
  },
  login: {
    title: "登录",
    username: "用户名",
    password: "密码",
    submit: "登录",
    usernamePlaceholder: "请输入用户名",
    passwordPlaceholder: "请输入密码",
    usernameRequired: "请输入用户名",
    passwordRequired: "请输入密码",
    loginSuccess: "登录成功",
    loginFailed: "用户名或密码错误",
  },
  user: {
    profile: "个人中心",
    logout: "退出登录",
    changePassword: "修改密码",
  },
}

export default zh

export type LocaleMessages = typeof zh
