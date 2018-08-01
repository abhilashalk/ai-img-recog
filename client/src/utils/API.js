import axios from "axios";

export default {

  postImage: function(data) {
    return axios.post('/api/image/image-upload', data);
  },

  signUp: function(obj) {
    return axios.post('/api/account/signup', obj);
  },

  signIn: function(obj) {
    return axios.post('/api/account/signin', obj);
  },

  logOut: function(token) {
    return axios.get('/api/account/logout?token=' + token);
  },

  verify: function(token) {
    return axios.get('/api/account/verify?token=' + token)
  },

  getTrees: function(id) {
    return axios.get('/api/user/' + id);
  }

};
