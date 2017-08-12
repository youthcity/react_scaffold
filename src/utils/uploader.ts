import { config } from 'src/utils/config';
import axios from 'axios';
const QINIU_UPLOAD = 'https://up.qbox.me';
const TOKEN_URL = config().api.host + '/api/v2/cdn/upload/token/1?from=static';
import * as PubSub from 'pubsub-js';

export let uploader = (file:File, cb:Function) => {
  if (!/(image\/png)|(image\/jp(e?)g)|(image\/gif)/.test(file.type)) {
    PubSub.publish('show_tips', 'upload_img_file_is_invalid_tips');
    return;
  }
  if (file.size > 5242880) {
    PubSub.publish('show_tips', 'upload_img_file_is_oversize_tips');
    return;
  }
  axios.get(TOKEN_URL).then((response) => {
    const data = new FormData();
    const key = response.data.data.fileKey;
    const host = response.data.data.url;
    data.append('token', response.data.data[0].token);
    data.append('file', file);
    axios.post(QINIU_UPLOAD, data, {
      headers: {'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*'},
      withCredentials: false,
    }).then((res) => {
      if (res.status == 200) {
        !!cb && cb({
          fileurl: response.data.data[0].bucketUrl + '/' + res.data.hash,
        });
      }
    });
  });
};
