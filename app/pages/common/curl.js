const md5 = require("md5");
import { ElMessage } from "element-plus";

/**
 * 前端封装 curl 方法
 * @params options 请求参数
 */
const curl = ({
  url, // 请求地址
  method = "post", // 请求方法
  headers = {}, // 请求头
  query = {}, // url query
  data = {}, // post body
  responseType = "json", // response data type
  timeout = 60000, // timeout
  errorMessage = "网络异常",
}) => {
  // 接口签名处理（让接口变动态）
  const signKey = "askjdnl58k6uhzv55s32n2f132aej";
  const st = Date.now();

  const dtoHeaders = {
    ...headers,
    s_t: st,
    s_sign: md5(`${signKey}_${st}`),
  };

  if (url.indexOf("/api/proj/") > -1 && window.projKey) {
    dtoHeaders.proj_key = window.projKey;
  }

  // 构造请求参数（把参数转换为 axios 参数）
  const ajaxStting = {
    url,
    method,
    params: query,
    data,
    responseType,
    timeout,
    headers: dtoHeaders,
  };

  return axios
    .request(ajaxStting)
    .then((response) => {
      const resData = response.data || {};

      // 后端API返回格式
      const { success } = resData;

      // 失败
      if (!success) {
        const { message, code } = resData;

        if (code === 442) {
          ElMessage.error("请求参数异常");
        } else if (code === 445) {
          ElMessage.error("请求不合法");
        } else  if (code === 446) {
          ElMessage.error("功能代码有误！缺少projKey");
        } else if (code === 50000) {
          ElMessage.error(message);
        }

        console.error(message);

        return Promise.resolve({ success, code, message });
      }

      // 成功
      const { metadata, data } = resData;
      return Promise.resolve({ success, data, metadata });
    })
    .catch((error) => {
      const message = error?.message || "网络异常";

      if (message.match(/timeout/)) {
        return Promise.resolve({
          message: "Request timeout",
          code: 504,
        });
      }

      ElMessage.error(errorMessage);
      return Promise.resolve(error);
    });
};

export default curl;
