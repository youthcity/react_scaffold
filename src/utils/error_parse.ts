const code_parse = {
  'A_0': '未知错误',
  'A_1': 'Could not get configuration for Tiger',
  'A_2': 'Could not parse string into json',

  'B_0': '无效的手机格式',
  'B_1':	'验证码发送频繁,请稍后再试',
  'B_2':	'验证码发送频繁,请稍后再试',
  'B_3':	'验证码发送失败',
  'B_4':	'验证码错误',
  'B_5':	'用户已存在',
  'B_6':	'teacher_does_not_exist',
  'B_7':	'teacher_does_not_exist',
  'B_8':	'账号不存在或密码错误',
  'B_9':	'重置密码失效，请重新验证手机号',
  'B_10':	'请填写新密码',
  'B_16': '该手机号已被使用',

  'C_0': 'http_request_failed',
  'C_1': 'qq_error_received',

  'CATASTROPHIC_0':	'Tried to use reserved internal category code',
  'CATASTROPHIC_1': 'Tried to register two categories with the same category code',
  'CATASTROPHIC_2': 'Category code contains separator, this is not allowed.',
  'CATASTROPHIC_3': 'Tried to register two errors with the same key in a single category',
  'CATASTROPHIC_4': 'Tried to register two errors with the same number in a single category',

  'D_0': '课程券不足',
  'D_1': '已经过上课时间',
  'D_2': '课程卷不足',
  'D_3': '购买不可用',
  'D_4': '该时间已满，请选择其他时间',

  'E_0': '请先登录',
  'E_1': '请先登录',
  'E_2': '请先登录',
  'E_3': '请先登录',

  'F_0':	'Tried to get repository for an entity with no associated database',
};

export let error_parse = function(err_code) : string {
  return code_parse[err_code] || '未知错误';
};
